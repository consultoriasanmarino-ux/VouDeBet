'use client';

import React, { useState } from 'react';
import { ShoppingCart, Bell, Wallet, UserCircle, LogOut } from 'lucide-react';
import { useBalance } from '@/context/BalanceContext';

const Header = () => {
    const { balanceReal, balanceDemo, currentType, setBalanceType } = useBalance();
    const [showProfile, setShowProfile] = useState(false);

    return (
        <header className="fixed top-0 right-0 h-16 w-full flex items-center justify-between px-6 bg-[#0f1923] border-b border-[#1a242d] z-40 transition-all duration-300">
            <div className="flex-1 max-w-xl mx-auto md:mx-0 ml-20 md:ml-64 bg-[#1a242d] h-10 px-4 rounded-full flex items-center gap-2 border border-[#2d3a46]">
                <span className="text-gray-400 text-sm">Pesquisar jogos...</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 bg-[#1a242d] p-1 rounded-full border border-[#2d3a46] shadow-lg">
                    <div className="relative flex items-center gap-2 px-3 py-1.5 min-w-[140px] justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">
                                {currentType === 'real' ? 'Saldo Real' : 'Saldo Demo'}
                            </span>
                            <span className="text-white font-bold leading-none">
                                R$ {currentType === 'real' ? balanceReal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : balanceDemo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <button
                            onClick={() => setBalanceType(currentType === 'real' ? 'demo' : 'real')}
                            className="ml-4 w-8 h-4 bg-gray-600/30 rounded-full relative transition-colors duration-300 hover:bg-gray-500/50"
                        >
                            <div
                                className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300 transform ${currentType === 'real' ? 'left-0.5 bg-[#f12c4c]' : 'left-4.5 bg-yellow-500'}`}
                            />
                        </button>
                    </div>
                </div>

                <button className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#f12c4c] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 transform active:scale-95 hover:bg-[#e02a46] hover:shadow-[0_0_20px_0_rgba(241,44,76,0.5)]">
                    <Wallet size={16} />
                    Depositar
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="p-2 transition-colors hover:bg-[#1a242d] rounded-lg text-gray-400"
                    >
                        <UserCircle size={24} />
                    </button>

                    {showProfile && (
                        <div className="absolute top-12 right-0 w-56 bg-[#1a242d] border border-[#2d3a46] rounded-xl shadow-2xl p-2 z-[60]">
                            <div className="p-3 border-b border-[#2d3a46] mb-2">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Usuário</p>
                                <p className="text-sm text-white font-medium">player_042</p>
                            </div>
                            <button className="flex items-center gap-3 w-full p-2.5 text-sm text-gray-300 hover:bg-[#2d3a46] rounded-lg transition-colors">
                                <UserCircle size={18} /> Perfil
                            </button>
                            <button className="flex items-center gap-3 w-full p-2.5 text-sm text-[#f12c4c] hover:bg-red-500/10 rounded-lg transition-colors">
                                <LogOut size={18} /> Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
