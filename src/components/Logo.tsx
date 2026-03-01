'use client';

import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: number;
}

const Logo = ({ className = "", showText = true, size = 48 }: LogoProps) => {
    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {/* The Stylized "V" Neon Icon - EXACT MATCH TO SECOND IMAGE */}
            <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
                <svg viewBox="0 0 120 120" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(241,44,76,0.7)]">
                    {/* Dark Background Base for the V */}
                    <path
                        d="M20 20 L55 100 L65 100 L100 20"
                        stroke="#1a1a1a"
                        strokeWidth="14"
                        fill="none"
                        strokeLinejoin="round"
                    />

                    {/* Main Neon Red "V" Outline */}
                    <path
                        d="M20 20 L55 100 L65 100 L100 20"
                        stroke="#f12c4c"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_#f12c4c]"
                    />

                    {/* Inner Neon Red Glow Layer */}
                    <path
                        d="M25 22 L58 95 L62 95 L95 22"
                        stroke="#f12c4c"
                        strokeWidth="2"
                        fill="none"
                        className="opacity-50 blur-[1px]"
                    />

                    {/* Gray "Straps" from image */}
                    <path
                        d="M15 35 L35 35 L50 70 L30 70 Z"
                        fill="#4a5568"
                        className="opacity-90"
                    />
                    <path
                        d="M105 35 L85 35 L70 70 L90 70 Z"
                        fill="#4a5568"
                        className="opacity-90"
                    />

                    {/* Central Lightning Bolt - White Neon */}
                    <path
                        d="M52 40 L70 40 L50 65 L68 65 L45 90"
                        stroke="white"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                    />

                    {/* Red Core on Bolt */}
                    <path
                        d="M55 43 L65 43 L52 62 L62 62 L48 85"
                        stroke="#f12c4c"
                        strokeWidth="1"
                        fill="none"
                        className="animate-pulse"
                    />
                </svg>
            </div>

            {/* VOU DE BET Text Styling */}
            {showText && (
                <div className="flex items-center leading-none">
                    <span className="text-3xl font-black italic tracking-tighter text-white uppercase whitespace-nowrap">
                        VOU <span className="text-[#f12c4c] mx-1">DE</span> BET
                    </span>
                </div>
            )}
        </div>
    );
};

export default Logo;
