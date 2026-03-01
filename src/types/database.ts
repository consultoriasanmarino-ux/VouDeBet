export type Profile = {
    id: string;
    username: string | null;
    full_name: string | null;
    cpf: string | null;
    balance_real: number;
    balance_demo: number;
    is_admin: boolean;
    updated_at: string;
};

export type Transaction = {
    id: string;
    user_id: string;
    amount: number;
    type: 'deposit' | 'withdraw';
    status: 'pending' | 'completed' | 'cancelled';
    pix_key: string | null;
    created_at: string;
};

export type Bet = {
    id: string;
    user_id: string;
    game_name: string;
    bet_amount: number;
    multiplier_win: number | null;
    payout_amount: number | null;
    status: 'win' | 'loss' | 'pending';
    is_demo: boolean;
    created_at: string;
};
