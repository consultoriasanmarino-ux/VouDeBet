import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { playSpin } from '@/lib/slotEngine';

export async function POST(req: Request) {
    try {
        const { bet, userId, type } = await req.json();

        // Verificação Básica
        if (!userId || !bet || bet <= 0) {
            return NextResponse.json({ error: 'Aposta inválida' }, { status: 400 });
        }

        // Buscar Saldo do Usuário
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const balanceField = type === 'real' ? 'balance_real' : 'balance_demo';
        const currentBalance = profile[balanceField];

        // Tem Saldo suficente?
        if (currentBalance < bet) {
            return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 });
        }

        // 🎲 GERA O RESULTADO DO MOTOR MATEMÁTICO 7x7 (Totalmente no BE)
        const spinData = playSpin(bet);
        const winAmount = spinData.totalWin;

        // Atualiza o Saldo no Supabase (Aposta deduzida e Prêmio Saciado)
        const newBalance = currentBalance - bet + winAmount;

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ [balanceField]: newBalance })
            .eq('id', userId);

        if (updateError) {
            console.error('Falha ao atualizar saldo:', updateError);
            return NextResponse.json({ error: 'Erro de transação. Tente novamente.' }, { status: 500 });
        }

        // Devolve o "Filme" do giro pronto para a UI tocar
        return NextResponse.json({
            success: true,
            balance: newBalance,
            win: winAmount,
            steps: spinData.steps,
            finalMultipliers: spinData.finalMultipliers
        });

    } catch (error: any) {
        console.error('Slot Engine Error:', error);
        return NextResponse.json({ error: 'Erro interno no servidor de jogos.' }, { status: 500 });
    }
}
