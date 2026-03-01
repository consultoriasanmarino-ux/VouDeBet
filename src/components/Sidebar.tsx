'use client';

import React, { useState } from 'react';
import {
    Dices,
    Gamepad2,
    LayoutDashboard,
    History,
    Settings,
    Menu,
    ChevronLeft,
    Search,
    Zap,
    Spade,
    PlayCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Início', active: true },
        { icon: <Dices size={20} />, label: 'Jogos Originais' },
        { icon: <Gamepad2 size={20} />, label: 'Slots' },
        { icon: <PlayCircle size={20} />, label: 'Cassino ao Vivo' },
        { icon: <Spade size={20} />, label: 'Esportes' },
    ];

    const personalItems = [
        { icon: <History size={20} />, label: 'Histórico' },
        { icon: <Zap size={20} />, label: 'Desafios' },
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen transition-all duration-300 ease-in-out border-r border-[#1a242d] bg-[#0f1923] p-4 z-50",
                isOpen ? "w-64" : "w-20"
            )}
        >
            <div className="flex items-center justify-between mb-8 px-2">
                {isOpen && (
                    <h1 className="text-2xl font-bold tracking-tighter" style={{ color: '#f12c4c' }}>
                        VouDeBet
                    </h1>
                )}
                <button
                    onClick={onToggle}
                    className="p-2 transition-colors hover:bg-[#1a242d] rounded-lg text-gray-400"
                >
                    {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="space-y-6">
                <div>
                    <ul className="space-y-2">
                        {menuItems.map((item, idx) => (
                            <li key={idx}>
                                <a
                                    href="#"
                                    className={cn(
                                        "flex items-center gap-4 p-3 rounded-lg transition-all duration-200",
                                        item.active
                                            ? "bg-[#1a242d] text-white"
                                            : "text-gray-400 hover:bg-[#1a242d] hover:text-white"
                                    )}
                                >
                                    <span className={cn(item.active ? "text-[#f12c4c]" : "")}>
                                        {item.icon}
                                    </span>
                                    {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pt-6 border-t border-[#1a242d]">
                    <ul className="space-y-2">
                        {personalItems.map((item, idx) => (
                            <li key={idx}>
                                <a
                                    href="#"
                                    className="flex items-center gap-4 p-3 rounded-lg text-gray-400 transition-all duration-200 hover:bg-[#1a242d] hover:text-white"
                                >
                                    <span>{item.icon}</span>
                                    {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {isOpen && (
                <div className="absolute bottom-8 left-4 right-4 p-4 rounded-xl bg-[#1a242d] border border-[#2d3a46]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                        <span className="text-xs text-gray-400">1,248 Online</span>
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        Suporte 24/7
                    </p>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
