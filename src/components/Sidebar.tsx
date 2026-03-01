'use client';

import React, { useState } from 'react';
import {
    Dices,
    Gamepad2,
    LayoutDashboard,
    History,
    Menu,
    ChevronLeft,
    Zap,
    Spade,
    PlayCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Logo from './Logo';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Lobby', active: true },
        { icon: <Dices size={20} />, label: 'Originais' },
        { icon: <Gamepad2 size={20} />, label: 'Slots' },
        { icon: <PlayCircle size={20} />, label: 'Ao Vivo' },
        { icon: <Spade size={20} />, label: 'Esportes' },
    ];

    const personalItems = [
        { icon: <History size={20} />, label: 'Histórico' },
        { icon: <Zap size={20} />, label: 'Missões' },
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen transition-all duration-500 ease-in-out border-r border-white/5 bg-[#05070a] p-4 z-50",
                isOpen ? "w-72" : "w-20"
            )}
        >
            <div className="flex items-center justify-between mb-10 px-2 h-12">
                {isOpen ? (
                    <Logo />
                ) : (
                    <div className="flex justify-center w-full">
                        <Logo className="w-8 h-8" />
                    </div>
                )}
                {isOpen && (
                    <button
                        onClick={onToggle}
                        className="p-2 transition-colors hover:bg-white/5 rounded-lg text-gray-500"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}
            </div>

            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="flex justify-center w-full p-2 mb-8 transition-colors hover:bg-white/5 rounded-lg text-gray-500"
                >
                    <Menu size={20} />
                </button>
            )}

            <nav className="space-y-8">
                <div>
                    <ul className="space-y-2">
                        {menuItems.map((item, idx) => (
                            <li key={idx}>
                                <a
                                    href="#"
                                    className={cn(
                                        "flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group",
                                        item.active
                                            ? "bg-white/5 text-white shadow-[inset_0_0_20px_rgba(255,0,68,0.05)] border border-white/5"
                                            : "text-gray-500 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <span className={cn(
                                        "transition-all duration-300 group-hover:scale-110",
                                        item.active ? "text-[#ff0044] drop-shadow-[0_0_8px_rgba(255,0,68,0.5)]" : ""
                                    )}>
                                        {item.icon}
                                    </span>
                                    {isOpen && <span className="text-sm font-bold tracking-tight uppercase">{item.label}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pt-8 border-t border-white/5">
                    <ul className="space-y-2">
                        {personalItems.map((item, idx) => (
                            <li key={idx}>
                                <a
                                    href="#"
                                    className="flex items-center gap-4 p-3 rounded-xl text-gray-500 transition-all duration-300 hover:bg-white/5 hover:text-white group"
                                >
                                    <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                                    {isOpen && <span className="text-sm font-bold tracking-tight uppercase">{item.label}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {isOpen && (
                <div className="absolute bottom-8 left-4 right-4 p-5 rounded-2xl bg-white/5 border border-white/5 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff004411] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
                            <span className="text-xs text-gray-300 font-bold">2,483 ONLINE</span>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">
                            SISTEMA SEGURO
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
