'use client';

import React, { useState } from 'react';
import {
    Dices,
    Gamepad2,
    LayoutDashboard,
    History,
    Menu,
    ChevronLeft,
    Sparkles,
    Zap,
    Spade,
    PlayCircle,
    User,
    ShieldCheck,
    ChevronDown,
    ChevronUp,
    Flame,
    Star,
    Trophy,
    Activity,
    LogOut,
    Lock
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Logo from './Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBalance } from '@/context/BalanceContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Sidebar = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
    const pathname = usePathname();
    const { profile, isAdmin } = useBalance();
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({ originals: true, casino: false });

    const toggleMenu = (key: string) => {
        setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const navItems = [
        {
            section: 'ORIGINAIS',
            icon: <Flame size={16} />,
            key: 'originals',
            items: [
                { icon: <Zap size={18} />, label: 'Crash', href: '/', active: pathname === '/' },
                { icon: <History size={18} />, label: 'Double', href: '/', active: false },
                { icon: <Activity size={18} />, label: 'Mines', href: '/', active: false },
                { icon: <Dices size={18} />, label: 'Dice', href: '/', active: false },
            ]
        },
        {
            section: 'CASSINO',
            icon: <Gamepad2 size={16} />,
            key: 'casino',
            items: [
                { icon: <PlayCircle size={18} />, label: 'Ao Vivo', href: '/', active: false },
                { icon: <Sparkles size={18} />, label: 'Slots', href: '/', active: false },
                { icon: <Trophy size={18} />, label: 'Game Shows', href: '/', active: false },
            ]
        }
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen transition-all duration-500 ease-in-out border-r border-white/5 bg-[#05070a] z-50 flex flex-col",
                isOpen ? "w-64" : "w-20"
            )}
        >
            {/* Sidebar Branding */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
                {isOpen ? <Logo className="w-8 h-8" /> : <div className="mx-auto"><Logo className="w-8 h-8" /></div>}
                {isOpen && (
                    <button onClick={onToggle} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                )}
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-3 space-y-8">
                {/* Home Link */}
                <Link
                    href="/"
                    className={cn(
                        "flex items-center gap-4 p-3.5 rounded-xl transition-all group",
                        pathname === '/' && !isAdmin ? "bg-white/5 text-white" : "text-gray-500 hover:text-white hover:bg-white/5"
                    )}
                >
                    <LayoutDashboard size={20} className={cn(pathname === '/' && !isAdmin ? "text-[#ff0044]" : "")} />
                    {isOpen && <span className="text-[11px] font-black uppercase tracking-widest italic">Início</span>}
                </Link>

                {/* Dynamic Sections */}
                {navItems.map((section) => (
                    <div key={section.key} className="space-y-1">
                        {isOpen && (
                            <button
                                onClick={() => toggleMenu(section.key)}
                                className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] italic hover:text-gray-400 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    {section.icon} {section.section}
                                </div>
                                {openMenus[section.key] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                        )}

                        {(openMenus[section.key] || !isOpen) && (
                            <div className="space-y-1">
                                {section.items.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-4 p-3.5 rounded-xl transition-all group",
                                            item.active ? "bg-white/5 text-white shadow-[inset_0_0_20px_rgba(255,0,68,0.05)]" : "text-gray-500 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <div className={cn("transition-transform group-hover:scale-110", item.active ? "text-[#ff0044] drop-shadow-[0_0_8px_rgba(255,0,68,0.5)]" : "")}>
                                            {item.icon}
                                        </div>
                                        {isOpen && <span className="text-[11px] font-bold tracking-tight italic">{item.label}</span>}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Admin Exclusive Link */}
                {isAdmin && (
                    <div className="pt-6 border-t border-white/5">
                        <Link
                            href="/admin-oseven"
                            className={cn(
                                "flex items-center gap-4 p-3.5 rounded-xl transition-all border border-transparent shadow-[0_0_15px_rgba(255,0,68,0.1)]",
                                pathname === '/admin-oseven'
                                    ? "bg-[#ff004411] text-[#ff0044] border-[#ff004433]"
                                    : "bg-white/5 text-white/50 hover:bg-[#ff004405] hover:text-[#ff0044]"
                            )}
                        >
                            <Lock size={20} />
                            {isOpen && <span className="text-[11px] font-black uppercase tracking-widest italic">Admin Panel</span>}
                        </Link>
                    </div>
                )}
            </div>

            {/* Footer Profile Toggle */}
            <div className="p-4 border-t border-white/5">
                <Link
                    href="/profile"
                    className={cn(
                        "flex items-center gap-4 p-3 rounded-xl transition-all",
                        pathname === '/profile' ? "bg-white/5 text-white" : "text-gray-500 hover:text-white"
                    )}
                >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff0044] to-[#ff004455] shrink-0 flex items-center justify-center text-white font-black text-xs uppercase italic border border-white/10 shadow-lg">
                        {profile?.username?.[0] || 'U'}
                    </div>
                    {isOpen && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[11px] font-black text-white italic truncate uppercase">{profile?.username || 'PERFIL'}</span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Configurações</span>
                        </div>
                    )}
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
