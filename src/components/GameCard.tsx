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
            "group relative overflow-hidden rounded-2xl bg-[#1a242d] transition-all duration-300 ease-out cursor-pointer hover:-translate-y-2 hover:shadow-[0_10px_40px_-5px_rgba(0,0,0,0.8)] border border-transparent hover:border-[#f12c4c33]",
            className
        )}>
            {/* Thumbnail */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 scale-100 group-hover:scale-110"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px] flex items-center justify-center p-6">
                    <div className="flex flex-col items-center gap-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="w-14 h-14 rounded-full bg-[#f12c4c] flex items-center justify-center shadow-[0_0_30px_rgba(241,44,76,0.6)] animate-pulse">
                            <Play fill="white" className="text-white ml-1" size={24} />
                        </div>
                        <p className="text-white font-black uppercase text-sm tracking-widest drop-shadow-lg">Jogar Agora</p>
                    </div>
                </div>

                {/* Badges */}
                {isNew && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#f12c4c] text-[10px] text-white font-black uppercase tracking-tighter shadow-lg">
                        Novo
                    </div>
                )}

                {multiplier && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-green-500/90 text-[10px] text-white font-black uppercase tracking-tighter shadow-lg flex items-center gap-1 backdrop-blur-sm">
                        <TrendingUp size={10} />
                        {multiplier}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="p-4 bg-gradient-to-t from-[#0f1923] to-[#1a242d] border-t border-[#2d3a4655]">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">{provider}</p>
                <h3 className="text-sm text-gray-100 font-bold truncate group-hover:text-white transition-colors">{title}</h3>
            </div>
        </div>
    );
};

export default GameCard;
