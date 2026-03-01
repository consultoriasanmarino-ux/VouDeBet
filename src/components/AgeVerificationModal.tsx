'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import Logo from './Logo';

const AgeVerificationModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const verified = localStorage.getItem('age-verified');
        if (!verified) {
            setIsVisible(true);
        }
    }, []);

    const handleConfirm = () => {
        localStorage.setItem('age-verified', 'true');
        setIsVisible(false);
    };

    const handleReject = () => {
        window.location.href = 'https://www.google.com';
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#05070a]/95 backdrop-blur-md" />

            <div className="relative w-full max-w-lg bg-[#0d121b] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(255,0,68,0.2)] animate-in fade-in zoom-in-95 duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff0044] to-transparent" />

                <div className="p-12 flex flex-col items-center text-center">
                    <div className="mb-8 relative">
                        <Logo className="w-16 h-16" />
                        <div className="absolute -top-2 -right-2 bg-[#ff0044] rounded-full p-1.5 shadow-[0_0_15px_#ff0044]">
                            <ShieldAlert size={16} className="text-white" />
                        </div>
                    </div>

                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4 leading-tight">
                        BEM-VINDO AO <br /> <span className="text-[#ff0044]">VOUDEBET</span>
                    </h2>

                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-10 max-w-[300px] leading-relaxed">
                        Por favor, verifique sua idade antes de entrar na plataforma. Jogo responsável.
                    </p>

                    <div className="grid grid-cols-1 gap-4 w-full">
                        <button
                            onClick={handleConfirm}
                            className="w-full bg-[#ff0044] text-white font-black py-6 rounded-2xl shadow-[0_0_30px_rgba(255,0,68,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all italic tracking-[0.2em]"
                        >
                            EU TENHO +18 ANOS
                        </button>

                        <button
                            onClick={handleReject}
                            className="w-full bg-white/5 border border-white/10 text-gray-500 font-black py-5 rounded-2xl hover:bg-white/10 transition-all italic tracking-[0.2em] text-xs"
                        >
                            TENHO MENOS DE 18 ANOS
                        </button>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 w-full flex items-center justify-center gap-6 opacity-30">
                        <p className="text-[10px] font-black tracking-widest text-gray-500">SSL ENCRYPTED</p>
                        <div className="w-1 h-1 rounded-full bg-gray-700" />
                        <p className="text-[10px] font-black tracking-widest text-gray-500">PROVABLY FAIR</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgeVerificationModal;
