'use client';

import React from 'react';

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
    return (
        <div className={`relative flex items-center gap-3 ${className}`}>
            {/* The "V" with Lightning Icon */}
            <div className="relative w-10 h-10 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_8px_rgba(255,0,68,0.8)]">
                    {/* Main "V" structure */}
                    <path
                        d="M10 20 L40 85 L50 85 L80 20 L70 20 L45 70 L20 20 Z"
                        fill="#ff0044"
                        className="animate-pulse"
                    />
                    <path
                        d="M15 15 L45 80 L55 80 L85 15 L75 15 L50 75 L25 15 Z"
                        fill="white"
                        fillOpacity="0.1"
                    />
                    {/* Lightning Bolt */}
                    <path
                        d="M45 35 L60 35 L40 55 L55 55 L35 75"
                        stroke="#ff0044"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="filter drop-shadow-[0_0_5px_rgba(255,0,68,1)]"
                    />
                </svg>
            </div>

            {/* VOU DE BET Text Styling */}
            <span className="text-xl font-black italic tracking-[0.2em] text-white uppercase flex items-center">
                VOU <span className="text-[#ff0044] ml-2">DE</span> <span className="ml-2">BET</span>
            </span>
        </div>
    );
};

export default Logo;
