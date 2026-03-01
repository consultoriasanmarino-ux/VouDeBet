import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { userId, couponCode } = await req.json();

        if (!userId || !couponCode) {
            return NextResponse.json({ error: 'Usuário ou Cupom inválido' }, { status: 400 });
        }

        const userCode = couponCode.trim().toUpperCase();

        // 1. Busca se o cupom existe e está ativo
        const { data: cupom, error: errorCupom } = await supabase
            .from('cupons')
            .select('*')
            .eq('codigo', userCode)
            .eq('is_active', true)
            .single();

        if (errorCupom || !cupom) {
            return NextResponse.json({ error: 'Cupom inválido ou expirado.' }, { status: 404 });
        }

        // 2. Verifica se o usuário já usou este cupom
        const { data: usage, error: usageError } = await supabase
            .from('user_cupons')
            .select('*')
            .eq('user_id', userId)
            .eq('cupom_id', cupom.id)
            .single();

        if (usage) {
            return NextResponse.json({ error: 'Você já utilizou este cupom antes.' }, { status: 400 });
        }

        // 3. Resgata o cupom: Inserir log e adicionar saldo
        const { error: insertUsageError } = await supabase
            .from('user_cupons')
            .insert([{ user_id: userId, cupom_id: cupom.id }]);

        if (insertUsageError) {
            console.error('Erro ao registrar uso do cupom:', insertUsageError);
            return NextResponse.json({ error: 'Erro ao resgatar o cupom.' }, { status: 500 });
        }

        // Pega o saldo atual
        const { data: profile } = await supabase
            .from('profiles')
            .select('balance_real')
            .eq('id', userId)
            .single();

        const currentBalance = profile?.balance_real || 0;
        const newBalance = Number(currentBalance) + Number(cupom.valor_saldo);

        // Atualiza o saldo real
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ balance_real: newBalance })
            .eq('id', userId);

        if (updateError) {
            console.error('Erro ao adicionar saldo:', updateError);
            return NextResponse.json({ error: 'Erro ao adicionar saldo na carteira.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, valor: cupom.valor_saldo, new_balance: newBalance });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Erro interno no servidor' }, { status: 500 });
    }
}
