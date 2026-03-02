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
            const { data: newSession, error: sErr } = await supabase
                .from('game_sessions')
                .insert({
                    user_id: userId,
                    game_slug: 'sugar_vdb',
                    is_bonus_active: false,
                    fs_left: 0,
                    fs_max: 0,
                    fs_total_win: 0
                })
                .select()
                .single();

            if (sErr) throw sErr;
            session = newSession;
        }

        const isFreeSpin = session.is_bonus_active && session.fs_left > 0;

        // Se for um giro normal, a Pragmatic zera os multiplicadores da tela
        // Se is_bonus_active (Free Spins) for true, manteríamos os multiplicadores acumulando (Trail)
        let initialMultipliers: Record<number, number> = {};

        if (bet > 0 && !isFreeSpin) {
            // Giro normal (Base Game) zera a mesa (Limpa do banco antes do start)
            await supabase.from('game_multipliers').delete().eq('session_id', session.id);
        } else {
            // Se for Free Spin ou um Tumble em andamento, carrega o estado persistente
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

        // 2. BUSCA CONFIGURAÇÕES DO JOGO (RTP etc)
        let { data: gameConfig } = await supabase
            .from('game_configs')
            .select('rtp_level, payer_mode')
            .eq('game_slug', 'sugar_vdb')
            .single();

        // Fallback de segurança se admin ainda não configurou
        if (!gameConfig) {
            gameConfig = { rtp_level: 50, payer_mode: false };
        }

        // 3. GERA O GIRO E TUMBLES (Com Pesos RTP Reais)
        const spinData = playSpin(bet, initialMultipliers, gameConfig);
        const winAmount = spinData.totalWin;

        // 4. ATUALIZA SALDO (Só desconta se não for Free Spin)
        let newBalance = currentBalance;
        if (bet > 0 && !isFreeSpin) {
            newBalance = currentBalance - bet + winAmount;
            await supabase.from('profiles').update({ [balanceField]: newBalance }).eq('id', userId);
        } else if (isFreeSpin) {
            // Se for Free Spin, apenas soma o ganho
            newBalance = currentBalance + winAmount;
            await supabase.from('profiles').update({ [balanceField]: newBalance }).eq('id', userId);

            // Atualiza contagem de Free Spins
            const newFsLeft = session.fs_left - 1;
            const newFsTotalWin = (session.fs_total_win || 0) + winAmount;

            await supabase.from('game_sessions').update({
                fs_left: newFsLeft,
                fs_total_win: newFsTotalWin,
                is_bonus_active: newFsLeft > 0
            }).eq('id', session.id);
        }

        // Se ganhou Free Spins agora (Trigger)
        if (spinData.freeSpinsAwarded > 0) {
            await supabase.from('game_sessions').update({
                is_bonus_active: true,
                fs_left: (session.fs_left || 0) + spinData.freeSpinsAwarded,
                fs_max: (session.fs_max || 0) + spinData.freeSpinsAwarded,
                fs_total_win: session.fs_total_win || 0
            }).eq('id', session.id);
        }

        // 5. ATUALIZA TRAIL (Multipliers no Banco)
        if (Object.keys(spinData.finalMultipliers).length > 0) {
            const upserts = Object.entries(spinData.finalMultipliers).map(([idx, val]) => ({
                session_id: session.id,
                position_index: parseInt(idx),
                multiplier_value: val
            }));
            await supabase.from('game_multipliers').upsert(upserts, { onConflict: 'session_id, position_index' });
        }

        // 6. REGISTRA NO HISTÓRICO
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
            s_mark: s_mark,
            freeSpinsAwarded: spinData.freeSpinsAwarded,
            fs_left: isFreeSpin ? session.fs_left - 1 : (spinData.freeSpinsAwarded || 0),
            is_bonus: spinData.freeSpinsAwarded > 0 || isFreeSpin
        });

    } catch (error: any) {
        console.error('Slot Engine Error:', error);
        return NextResponse.json({ error: 'Erro de transação.' }, { status: 500 });
    }
}
