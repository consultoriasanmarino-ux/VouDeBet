'use client';

import React, { useEffect, useState } from 'react';
import { betService } from '@/services/betService';
import { Bet } from '@/types/database';
import { TrendingUp, User } from 'lucide-react';

const LiveBetFeed = () => {
    const [bets, setBets] = useState<any[]>([]);

    useEffect(() => {
        // Initial mock data
        setBets([
            { username: 'player_52', game: 'Crash', amount: 50.00, multiplier: 2.15, payout: 107.50, status: 'win' },
            { username: 'cyber_king', game: 'Double', amount: 10.00, multiplier: 2.00, payout: 20.00, status: 'win' },
            { username: 'bet_master', game: 'Mines', amount: 100.00, multiplier: null, payout: null, status: 'loss' },
        ]);

        const subscription = betService.subscribeToLiveBets((newBet) => {
            setBets(prev => [newBet, ...prev].slice(0, 10));
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="w-full bg-[#0d121b] border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#ff0044] animate-pulse shadow-[0_0_8px_#ff0044]" />
                    <h3 className="text-sm font-black italic uppercase tracking-[0.2em] text-white">Apostas em tempo real</h3>
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{bets.length} ATIVAS</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/5">
                        <tr className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                            <th className="px-6 py-4">Usuário</th>
                            <th className="px-6 py-4">Jogo</th>
                            <th className="px-6 py-4">Valor</th>
                            <th className="px-6 py-4">Mult</th>
                            <th className="px-6 py-4 text-right">Pagamento</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {bets.map((bet, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors group animate-in slide-in-from-left-4 duration-500">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                                            <User size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-white uppercase tracking-tight group-hover:text-[#ff0044] transition-colors">
                                            {bet.username || 'Anônimo'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-gray-400 font-bold">{bet.game || bet.game_name}</span>
                                </td>
                                <td className="px-6 py-4 text-xs font-bold text-gray-300">
                                    R$ {bet.amount || bet.bet_amount}
                                </td>
                                <td className="px-6 py-4">
                                    {bet.multiplier ? (
                                        <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-black text-[#ff0044] italic">
                                            {bet.multiplier.toFixed(2)}x
                                        </span>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {bet.status === 'win' ? (
                                        <span className="text-xs font-bold text-green-500">
                                            R$ {(bet.payout || bet.payout_amount).toFixed(2)}
                                        </span>
                                    ) : (
                                        <span className="text-xs font-bold text-gray-600 italic">PENDENTE</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LiveBetFeed;
