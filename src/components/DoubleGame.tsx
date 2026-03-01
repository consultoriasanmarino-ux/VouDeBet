'use client';

import React, { useState } from 'react';
import { History, ShieldCheck, Zap } from 'lucide-react';

const DoubleGame = () => {
    const [gameState, setGameState] = useState<'waiting' | 'spinning' | 'finished'>('waiting');
    const [result, setResult] = useState<number | null>(null);

    const spin = () => {
        setGameState('spinning');
        setTimeout(() => {
            setResult(Math.floor(Math.random() * 15));
            setGameState('finished');
        }, 3000);
    };

    return (
        <div className="flex flex-col gap-8 min-h-[500px]">
            {/* Betting Areas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Red Area */}
                <div className="bg-[#ff004411] border border-[#ff004433] rounded-3xl p-8 flex flex-col gap-4 group hover:bg-[#ff004422] transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-[#ff0044] shadow-[0_0_20px_#ff0044]" />
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">VERMELHO</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">PAGAMENTO 2X</p>
                    <button onClick={spin} className="w-full bg-[#ff0044] py-4 rounded-xl text-white font-black uppercase tracking-widest italic mt-4 shadow-lg group-hover:scale-105 transition-all">APOSTAR</button>
                </div>

                {/* White Area (Jackpot) */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-4 group hover:bg-white/10 transition-all items-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-[0_0_20px_white]" />
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">BRANCO</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">PAGAMENTO 14X</p>
                    <button onClick={spin} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest italic mt-4 shadow-lg group-hover:scale-105 transition-all">APOSTAR</button>
                </div>

                {/* Black Area */}
                <div className="bg-[#05070a]/50 border border-white/10 rounded-3xl p-8 flex flex-col gap-4 group hover:bg-white/5 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-[#05070a] border border-white/20 shadow-[0_0_20px_rgba(0,0,0,1)]" />
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">PRETO</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">PAGAMENTO 2X</p>
                    <button onClick={spin} className="w-full bg-white/10 border border-white/10 py-4 rounded-xl text-white font-black uppercase tracking-widest italic mt-4 shadow-lg group-hover:scale-105 transition-all">APOSTAR</button>
                </div>
            </div>

            {/* Spinner Visual */}
            <div className="h-48 bg-[#0d121b] border border-white/5 rounded-[2rem] relative overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-[#ff0044] z-10 shadow-[0_0_15px_#ff0044]" />

                <div className={`flex gap-3 transition-transform duration-[3000ms] ease-out ${gameState === 'spinning' ? '-translate-x-[2000px]' : 'translate-x-0'}`}>
                    {Array.from({ length: 50 }).map((_, i) => {
                        const num = i % 15;
                        const color = num === 0 ? 'bg-white' : num <= 7 ? 'bg-[#ff0044]' : 'bg-[#05070a]';
                        return (
                            <div key={i} className={`w-20 h-24 rounded-2xl ${color} flex-shrink-0 flex items-center justify-center border border-white/10`}>
                                <span className={`text-xl font-black italic ${num === 0 ? 'text-black' : 'text-white'}`}>{num}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Result Indicator */}
            {gameState === 'finished' && result !== null && (
                <div className="text-center animate-in zoom-in-50 duration-500">
                    <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] mb-2">RESULTADO</p>
                    <div className={`inline-flex items-center gap-4 px-10 py-5 rounded-3xl border ${result === 0 ? 'bg-white text-black border-white shadow-[0_0_30px_white]' : result <= 7 ? 'bg-[#ff0044] text-white border-[#ff0044] shadow-[0_0_30px_#ff0044]' : 'bg-[#05070a] text-white border-white/20 shadow-[0_0_30px_black]'}`}>
                        <span className="text-4xl font-black italic leading-none">{result}</span>
                        <span className="text-xs font-black uppercase tracking-widest">{result === 0 ? 'BRANCO' : result <= 7 ? 'VERMELHO' : 'PRETO'}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoubleGame;
