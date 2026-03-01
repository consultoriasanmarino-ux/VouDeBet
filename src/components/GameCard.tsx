'use client';

import React from 'react';
import { Play, TrendingUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GameCardProps {
    title: string;
    image: string;
    provider?: string;
    isNew?: boolean;
    multiplier?: string;
    className?: string;
}

const GameCard = ({ title, image, provider = 'Originals', isNew = false, multiplier, className }: GameCardProps) => {
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-2xl bg-[#0d121b] transition-all duration-500 ease-out cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,0,68,0.2)] border border-white/5 hover:border-[#ff004455]",
            className
        )}>
            {/* Thumbnail */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                    <div className="flex flex-col items-center gap-4 text-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="w-16 h-16 rounded-2xl bg-[#ff0044] flex items-center justify-center shadow-[0_0_30px_rgba(255,0,68,0.6)] rotate-12 group-hover:rotate-0 transition-transform duration-500">
                            <Play fill="white" className="text-white ml-1" size={28} />
                        </div>
                        <p className="text-white font-black uppercase text-xs tracking-[0.2em] drop-shadow-xl italic">Entrar Agora</p>
                    </div>
                </div>

                {/* Badges */}
                {isNew && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[#ff0044] text-[9px] text-white font-black uppercase tracking-widest shadow-lg italic">
                        NOVO
                    </div>
                )}

                {multiplier && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-[9px] text-[#ff0044] font-black uppercase tracking-widest border border-[#ff004433] shadow-lg flex items-center gap-1.5 italic">
                        <TrendingUp size={10} />
                        {multiplier}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="p-5 bg-[#0d121b] border-t border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em] mb-1 italic">{provider}</p>
                <h3 className="text-sm text-gray-200 font-black truncate group-hover:text-white transition-colors uppercase tracking-tight">{title}</h3>
            </div>
        </div>
    );
};

export default GameCard;
