'use client';

import React, { useState } from 'react';
import { ShoppingCart, Bell, Wallet, UserCircle, LogOut, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { useBalance } from '@/context/BalanceContext';
import AuthModal from './AuthModal';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import { supabase } from '@/lib/supabase';

const Header = () => {
    const { profile, currentType, setBalanceType, user, isLoading } = useBalance();
    const [showProfile, setShowProfile] = useState(false);
    const [authModal, setAuthModal] = useState<{ open: boolean, mode: 'login' | 'register' }>({ open: false, mode: 'login' });
    const [depositOpen, setDepositOpen] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setShowProfile(false);
    };

    return (
        <header className="fixed top-0 right-0 h-20 w-full flex items-center justify-between px-8 bg-[#05070a]/80 backdrop-blur-xl border-b border-white/5 z-40 transition-all duration-300">
            <div className="flex-1 max-w-xl hidden md:flex ml-[300px]">
                <div className="w-full bg-white/5 h-11 px-5 rounded-xl flex items-center gap-3 border border-white/5 focus-within:border-[#ff004455] transition-all">
                    <span className="text-gray-500 text-sm font-medium">Pesquisar jogos ou provedores...</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {!user ? (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAuthModal({ open: true, mode: 'login' })}
                            className="px-6 py-2.5 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => setAuthModal({ open: true, mode: 'register' })}
                            className="px-8 py-3 bg-[#ff0044] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(255,0,68,0.3)] hover:scale-105 active:scale-95 transition-all italic"
                        >
                            Cadastrar
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                            <div className="flex flex-col px-4 py-1">
                                <span className="text-[9px] text-gray-500 uppercase font-black tracking-[0.15em] leading-none mb-1">
                                    {currentType === 'real' ? 'Banca Real' : 'Banca Demo'}
                                </span>
                                <span className="text-white font-black text-sm tabular-nums">
                                    R$ {(currentType === 'real' ? profile?.balance_real : profile?.balance_demo)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                                </span>
                            </div>
                            <button
                                onClick={() => setBalanceType(currentType === 'real' ? 'demo' : 'real')}
                                className="mr-2 p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
                            >
                                <ChevronDown size={16} />
                            </button>
                            <button
                                onClick={() => setDepositOpen(true)}
                                className="h-10 px-4 bg-[#ff0044] text-white font-black text-xs uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(255,0,68,0.4)] hover:shadow-[0_0_25px_rgba(255,0,68,0.6)] transition-all active:scale-95 italic"
                            >
                                Depositar
                            </button>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowProfile(!showProfile)}
                                className="flex items-center gap-2 p-1.5 pr-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff0044] to-[#ff004455] flex items-center justify-center text-white font-bold shadow-lg uppercase">
                                    {profile?.username?.[0] || 'U'}
                                </div>
                                <div className="hidden sm:flex flex-col items-start">
                                    <span className="text-xs text-white font-bold">{profile?.username || 'Usuário'}</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Nível 1</span>
                                </div>
                            </button>

                            {showProfile && (
                                <div className="absolute top-14 right-0 w-64 bg-[#0d121b] border border-white/10 rounded-2xl shadow-2xl p-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-4 border-b border-white/5 mb-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Conta</p>
                                            <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] font-black rounded uppercase">
                                                {profile?.is_admin ? 'Admin' : 'Membro'}
                                            </span>
                                        </div>
                                        <p className="text-lg text-white font-black italic truncate">{profile?.full_name || 'VOU DE PLAYER'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <button className="flex items-center gap-3 w-full p-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                                            <UserCircle size={18} /> Perfil
                                        </button>
                                        <button
                                            onClick={() => { setWithdrawOpen(true); setShowProfile(false); }}
                                            className="flex items-center gap-3 w-full p-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                                        >
                                            <Wallet size={18} /> Sacar
                                        </button>
                                        <div className="h-px bg-white/5 my-2" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full p-3 text-sm text-[#ff0044] hover:bg-[#ff004411] rounded-xl transition-all font-bold"
                                        >
                                            <LogOut size={18} /> Encerrar Sessão
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <AuthModal
                isOpen={authModal.open}
                onClose={() => setAuthModal({ ...authModal, open: false })}
                initialMode={authModal.mode}
            />
            <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
            <WithdrawModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
        </header>
    );
};

export default Header;
