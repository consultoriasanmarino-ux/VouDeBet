import { supabase } from '../lib/supabase';
import { Bet } from '../types/database';

export const betService = {
    async placeBet(bet: Omit<Bet, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('bets')
            .insert(bet)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getUserBets(userId: string, limit = 10) {
        const { data, error } = await supabase
            .from('bets')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    subscribeToLiveBets(onNewBet: (bet: any) => void) {
        return supabase
            .channel('live-bets')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'bets' },
                (payload) => onNewBet(payload.new)
            )
            .subscribe();
    }
};
