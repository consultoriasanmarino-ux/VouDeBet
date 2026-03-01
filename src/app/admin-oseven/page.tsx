'use client';

import React, { useState, useEffect } from 'react';
import { useBalance } from '@/context/BalanceContext';
import {
    Users,
    TrendingUp,
    Wallet,
    ShieldCheck,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    Activity,
    Lock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
    const { profile, user, isLoading } = useBalance();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDeposits: 0,
        totalWithdraws: 0,
        activeBets: 0
    });
    const [usersList, setUsersList] = useState<any[]>([]);

    useEffect(() => {
        if (!isLoading && (!user || !profile?.is_admin)) {
            // Se não for admin, redireciona (aqui vamos proteger a rota)
            // router.push('/'); 
        }
        fetchAdminData();
    }, [user, profile, isLoading]);

    const fetchAdminData = async () => {
        // Mocking Data for now as per user request to see function
        setStats({
            totalUsers: 1248,
            totalDeposits: 45200.00,
            totalWithdraws: 12150.00,
            activeBets: 84
        });

        setUsersList([
            { id: 1, username: 'player_neon', full_name: 'Ricardo Silva', balance: 1540.00, total_deposited: 3000.00, status: 'active' },
            { id: 2, username: 'osevenboy', full_name: 'Admin Master', balance: 0.00, total_deposited: 0.00, status: 'admin' },
            { id: 3, username: 'bet_queen', full_name: 'Mariana Santos', balance: 45.50, total_deposited: 500.00, status: 'active' },
        ]);
    };

    if (isLoading) return <div className="p-10 text-white font-black italic">CARREGANDO SISTEMA CENTRAL...</div>;

    return (
        <div className="flex flex-col gap-10 p-4 md:p-8 animate-in fade-in duration-700">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#ff0044] flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,0,68,0.5)] border-4 border-[#0d121b]">
                        <Lock size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
                            Painel de Controle <span className="text-[#ff0044]">VouDeBet</span>
                        </h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1 italic">Bem-vindo de volta, Master osevenboy</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all italic">Relatórios Exportar</button>
                    <button className="px-6 py-3 bg-[#ff0044] text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg italic">Configurações Base</button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Clientes', value: stats.totalUsers, icon: <Users />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Total Depósitos', value: `R$ ${stats.totalDeposits.toLocaleString()}`, icon: <ArrowDownLeft />, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Total Saques', value: `R$ ${stats.totalWithdraws.toLocaleString()}`, icon: <ArrowUpRight />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                    { label: 'Lucro GGR', value: `R$ ${(stats.totalDeposits - stats.totalWithdraws).toLocaleString()}`, icon: <Activity />, color: 'text-[#ff0044]', bg: 'bg-[#ff0044]/10' },
                ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-[#1a242d] border border-white/5 shadow-xl transition-all hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} border border-current/20`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-black italic text-white tracking-tighter">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-[#0d121b] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-[#ff0044] rounded-full" />
                        <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">Gestão de Usuários</h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="PROCURAR USER..."
                                className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-xs font-bold text-white outline-none focus:border-[#ff004455] transition-all min-w-[280px]"
                            />
                        </div>
                        <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02]">
                            <tr className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                                <th className="px-8 py-6">ID</th>
                                <th className="px-8 py-6">Usuário / Nome</th>
                                <th className="px-8 py-6">Saldo Atual</th>
                                <th className="px-8 py-6">Depósitos Totais</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {usersList.map((client, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6 text-xs text-gray-600 font-black">#00{client.id}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white italic group-hover:text-[#ff0044] transition-colors">{client.username}</span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{client.full_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-white italic tracking-tight">R$ {client.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-green-500 italic">
                                        R$ {client.total_deposited.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase ${client.status === 'admin' ? 'bg-[#ff004411] text-[#ff0044] border border-[#ff004433]' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-[#ff004455] transition-all">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
