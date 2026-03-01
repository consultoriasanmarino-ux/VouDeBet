'use client';

import React, { useState } from 'react';
import { useBalance } from '@/context/BalanceContext';
import { User, ShieldCheck, History, Wallet, CreditCard, ChevronRight, Trophy, Activity } from 'lucide-react';

const ProfilePage = () => {
    const { profile, user } = useBalance();
    const [activeTab, setActiveTab] = useState<'info' | 'bets' | 'finance'>('info');

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
            <ShieldCheck size={64} className="text-gray-700" />
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">ACESSO RESTRITO</h2>
            <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Faça login para ver seu perfil</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-10 animate-in fade-in duration-700">
            {/* Header Profile Info */}
            <div className="relative p-10 rounded-[3rem] bg-[#1a242d] border border-white/5 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#ff0044] to-purple-600 opacity-20 blur-3xl" />

                <div className="relative flex flex-col md:flex-row items-center gap-10">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-[#ff0044] flex items-center justify-center text-white text-5xl font-black shadow-[0_0_40px_rgba(255,0,68,0.4)] border-4 border-[#0d121b] uppercase">
                        {profile?.username?.[0] || 'U'}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">{profile?.username || 'USUÁRIO ELITE'}</h2>
                            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black rounded-lg border border-yellow-500/20 tracking-widest uppercase">Nível 1</span>
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-lg border border-blue-500/20 tracking-widest uppercase">Verificado</span>
                        </div>
                        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                            <User size={14} /> {profile?.full_name || 'NOME NÃO CONFIGURADO'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-8 max-w-sm mx-auto md:mx-0">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Saldo Real</p>
                                <p className="text-white font-black text-xl italic tracking-tight">R$ {profile?.balance_real.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Saldo Demo</p>
                                <p className="text-white/60 font-black text-xl italic tracking-tight">R$ {profile?.balance_demo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 w-fit">
                {[
                    { id: 'info', label: 'DADOS PESSOAIS', icon: <User size={16} /> },
                    { id: 'bets', label: 'HISTÓRICO DE JOGOS', icon: <History size={16} /> },
                    { id: 'finance', label: 'TRANSAÇÕES', icon: <Wallet size={16} /> }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#ff0044] text-white shadow-[0_0_15px_rgba(255,0,68,0.3)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-[#0d121b] rounded-[2.5rem] border border-white/5 p-10 min-h-[400px]">
                {activeTab === 'info' && (
                    <div className="grid md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-6">
                            <h4 className="text-xl font-black text-white italic tracking-tight uppercase">Configurações de Conta</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2">DATA DE NASCIMENTO (VERIFICAÇÃO)</label>
                                    <input readOnly value="01/01/1995" className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 text-gray-400 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2">CPF (VINCULADO AO PIX)</label>
                                    <input readOnly placeholder="***.***.***-**" value={profile?.cpf || ''} className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-6 text-white font-bold placeholder:text-gray-700" />
                                </div>
                                <button className="w-full py-4 bg-[#ff004411] text-[#ff0044] border border-[#ff004433] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ff004422] transition-all">EDITAR PERFIL</button>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                            <h4 className="flex items-center gap-3 text-lg font-black text-white italic uppercase tracking-tight mb-6">
                                <Trophy className="text-yellow-500" size={20} /> Experiência {"&"} Recompensas
                            </h4>
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                        <span>Progresso Bronze</span>
                                        <span>75/100 XP</span>
                                    </div>
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-gradient-to-r from-[#ff0044] to-red-600 rounded-full shadow-[0_0_10px_#ff0044]" style={{ width: '75%' }} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-tight">CASHBACK ATIVO</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">3.5% DE RETORNO SEMANAL</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'bets' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-6 animate-in fade-in duration-500">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-700 border border-white/5">
                            <History size={32} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-black text-white italic uppercase tracking-tight">SEM APOSTAS RECENTES</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Comece a jogar para construir seu histórico</p>
                        </div>
                        <button className="px-10 py-4 bg-[#ff0044] text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-lg italic transition-all active:scale-95">IR PARA O LOBBY</button>
                    </div>
                )}

                {activeTab === 'finance' && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <h4 className="text-xl font-black text-white italic tracking-tight uppercase">Histórico de Transações</h4>
                        <div className="flex flex-col gap-4">
                            {[
                                { id: '#4251', type: 'Depósito PIX', amount: 200.00, status: 'COMPLETO', date: 'Hoje, 14:20' },
                                { id: '#4210', type: 'Saque PIX', amount: -500.00, status: 'PENDENTE', date: 'Ontem, 09:12' }
                            ].map((tx, idx) => (
                                <div key={idx} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.amount > 0 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'} border`}>
                                            {tx.amount > 0 ? <CreditCard size={20} /> : <Wallet size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white tracking-tight uppercase italic">{tx.type}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-black italic tracking-tight ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                                            {tx.amount > 0 ? '+' : ''} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className={`text-[9px] font-black tracking-widest mt-1 ${tx.status === 'COMPLETO' ? 'text-gray-500' : 'text-yellow-500 cursor-help underline underline-offset-4'}`}>{tx.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
