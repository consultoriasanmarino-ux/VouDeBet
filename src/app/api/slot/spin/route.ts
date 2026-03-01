import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { playSpin } from '@/lib/slotEngine';

export async function POST(req: Request) {
    try {
        const { bet, userId, type } = await req.json();

        if (!userId || bet < 0) {
            return NextResponse.json({ error: 'Aposta ou Usuário inválido' }, { status: 400 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (!profile) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

        const balanceField = type === 'real' ? 'balance_real' : 'balance_demo';
        const currentBalance = profile[balanceField];

        // Se aposta maior que zero, é giro pago
        if (bet > 0 && currentBalance < bet) {
            return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 });
        }

        // 1. GERENCIAMENTO DE SESSÃO
        let { data: session } = await supabase
            .from('game_sessions')
            .select('*')
            .eq('user_id', userId)
            .eq('game_slug', 'sugar_vdb')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (!session) {
            const { data: newSession } = await supabase
                .from('game_sessions')
                .insert({ user_id: userId, game_slug: 'sugar_vdb' })
                .select()
                .single();
            session = newSession;
        }

        // Se for um giro normal, a Pragmatic zera os multiplicadores da tela
        // Se is_bonus_active (Free Spins) fosse true, manteríamos.
        let initialMultipliers: Record<number, number> = {};

        if (bet > 0 && !session?.is_bonus_active) {
            // Giro normal (Base Game) zera a mesa (Limpa do banco)
            await supabase.from('game_multipliers').delete().eq('session_id', session.id);
        } else {
            // Se fosse free spin, ele carregaria o estado 
            const { data: dbMultipliers } = await supabase
                .from('game_multipliers')
                .select('position_index, multiplier_value')
                .eq('session_id', session.id);

            if (dbMultipliers) {
                dbMultipliers.forEach(m => {
                    initialMultipliers[m.position_index] = m.multiplier_value;
                });
            }
        }

        // 2. GERA O GIRO E TUMBLES
        const spinData = playSpin(bet, initialMultipliers);
        const winAmount = spinData.totalWin;

        // 3. ATUALIZA SALDO
        let newBalance = currentBalance;
        if (bet > 0) {
            newBalance = currentBalance - bet + winAmount;
            await supabase.from('profiles').update({ [balanceField]: newBalance }).eq('id', userId);
        }

        // 4. ATUALIZA TRAIL (Multipliers no Banco)
        if (Object.keys(spinData.finalMultipliers).length > 0) {
            const upserts = Object.entries(spinData.finalMultipliers).map(([idx, val]) => ({
                session_id: session.id,
                position_index: parseInt(idx),
                multiplier_value: val
            }));
            await supabase.from('game_multipliers').upsert(upserts, { onConflict: 'session_id, position_index' });
        }

        // 5. REGISTRA NO HISTÓRICO
        // Representar matriz inicial + vitórias em string para auditoria ("s_mark")
        const sMarkParts = Object.entries(spinData.finalMultipliers).map(([k, v]) => `${k}:${v}`);
        const s_mark = sMarkParts.length > 0 ? `tmb~${sMarkParts.join(',')}` : '';

        await supabase.from('game_history').insert({
            user_id: userId,
            bet_amount: bet,
            win_amount: winAmount,
            action_type: 'spin',
            matrix_result: s_mark // Salvando trail para auditoria
        });

        // 6. RESPONSE PRAGMATIC STYLE
        return NextResponse.json({
            success: true,
            balance: newBalance,
            win: winAmount,
            steps: spinData.steps,
            finalMultipliers: spinData.finalMultipliers,
            s_mark: s_mark // Devolvendo trail
        });

    } catch (error: any) {
        console.error('Slot Engine Error:', error);
        return NextResponse.json({ error: 'Erro de transação.' }, { status: 500 });
    }
}
