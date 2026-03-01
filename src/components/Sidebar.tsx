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
    PlayCircle,
    User,
    Trophy
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Logo from './Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Lobby', active: pathname === '/', href: '/' },
        { icon: <Zap size={20} />, label: 'Originais', active: false, href: '/' },
        { icon: <Gamepad2 size={20} />, label: 'Slots', active: false, href: '/' },
        { icon: <PlayCircle size={20} />, label: 'Cassino', active: false, href: '/' },
        { icon: <Trophy size={20} />, label: 'VIP Club', active: false, href: '/' },
    ];

    const personalItems = [
        { icon: <User size={20} />, label: 'Meu Perfil', active: pathname === '/profile', href: '/profile' },
        { icon: <History size={20} />, label: 'Histórico', active: false, href: '/profile' },
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen transition-all duration-500 ease-in-out border-r border-white/5 bg-[#05070a] p-4 z-50 shadow-2xl",
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
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 group",
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
                                    {isOpen && <span className="text-[10px] font-black tracking-[0.1em] uppercase italic">{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pt-8 border-t border-white/5">
                    <ul className="space-y-2">
                        {personalItems.map((item, idx) => (
                            <li key={idx}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 group",
                                        item.active
                                            ? "bg-white/5 text-white border border-white/5 shadow-[inset_0_0_20px_rgba(255,0,68,0.05)]"
                                            : "text-gray-500 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <span className={cn(
                                        "group-hover:scale-110 transition-transform",
                                        item.active ? "text-[#ff0044]" : ""
                                    )}>{item.icon}</span>
                                    {isOpen && <span className="text-[10px] font-black tracking-[0.1em] uppercase italic">{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {isOpen && (
                <div className="absolute bottom-8 left-4 right-4 p-6 rounded-[2rem] bg-gradient-to-br from-[#ff004411] to-transparent border border-[#ff004422] overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
                            <span className="text-[10px] text-gray-300 font-black italic uppercase tracking-widest">SISTEMA ONLINE</span>
                        </div>
                        <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black">
                            VOUDEBET V2.4
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
