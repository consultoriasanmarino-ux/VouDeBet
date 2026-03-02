import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        // 1. Busca sessão do Sugar
        const { data: session } = await supabase
            .from('game_sessions')
            .select('*')
            .eq('user_id', userId)
            .eq('game_slug', 'sugar_vdb')
            .single();

        if (session) {
            // 2. Limpa os multiplicadores (Spots) - Padrão Pragmatic após bônus ou giro pago
            await supabase.from('game_multipliers').delete().eq('session_id', session.id);

            // 3. Reseta flag de bônus na sessão
            await supabase.from('game_sessions').update({
                is_bonus_active: false,
                fs_left: 0,
                fs_total_win: 0
            }).eq('id', session.id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao resetar sessão' }, { status: 500 });
    }
}
