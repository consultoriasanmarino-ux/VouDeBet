'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Rocket, History, ShieldCheck, Zap } from 'lucide-react';

const CrashGame = () => {
    const [multiplier, setMultiplier] = useState(1.00);
    const [gameState, setGameState] = useState<'waiting' | 'running' | 'crashed'>('waiting');
    const [betAmount, setBetAmount] = useState('10.00');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Simple game loop simulation
    useEffect(() => {
        let interval: any;
        if (gameState === 'running') {
            const startTime = Date.now();
            interval = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000;
                const newMultiplier = Math.pow(Math.E, 0.06 * elapsed);
                setMultiplier(newMultiplier);

                // Simulated crash random logic
                if (Math.random() < 0.01 && elapsed > 2) {
                    setGameState('crashed');
                }
            }, 50);
        }
        return () => clearInterval(interval);
    }, [gameState]);

    const handleStart = () => {
        setMultiplier(1.00);
        setGameState('running');
    };

    return (
        <div className="grid lg:grid-cols-4 gap-6 min-h-[600px]">
            {/* Controls Sidebar */}
            <div className="lg:col-span-1 bg-[#1a242d] rounded-3xl p-8 border border-white/5 flex flex-col gap-6">
                <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2 block">Quantia da Aposta</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            className="w-full bg-[#0d121b] border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white font-black outline-none focus:border-[#ff004455] transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <button className="py-2 bg-white/5 rounded-lg text-[10px] font-black uppercase text-gray-400 hover:bg-white/10 transition-all">½</button>
                        <button className="py-2 bg-white/5 rounded-lg text-[10px] font-black uppercase text-gray-400 hover:bg-white/10 transition-all">2x</button>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2 block">Auto Retirar</label>
                    <input
                        type="number"
                        defaultValue="2.00"
                        className="w-full bg-[#0d121b] border border-white/10 rounded-xl py-4 px-4 text-white font-black outline-none focus:border-[#ff004455] transition-all"
                    />
                </div>

                <button
                    onClick={handleStart}
                    disabled={gameState === 'running'}
                    className="w-full bg-[#ff0044] text-white font-black py-6 rounded-2xl shadow-[0_0_30px_rgba(255,0,68,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 uppercase tracking-[0.2em] italic mt-auto"
                >
                    {gameState === 'running' ? 'APOSTADO...' : 'COMEÇAR JOGO'}
                </button>
            </div>

            {/* Game Display */}
            <div className="lg:col-span-3 bg-[#0d121b] rounded-3xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
                {/* Provably Fair Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 text-[9px] font-black text-gray-500 tracking-widest uppercase italic">
                    <ShieldCheck size={14} /> Provably Fair
                </div>

                {/* Multiplier Display */}
                <div className="text-center z-10">
                    <h2 className={`text-8xl font-black italic tracking-tighter tabular-nums ${gameState === 'crashed' ? 'text-[#ff0044]' : 'text-white'}`}>
                        {multiplier.toFixed(2)}<span className="text-4xl ml-2">x</span>
                    </h2>
                    {gameState === 'crashed' && (
                        <p className="text-[#ff0044] text-xl font-black uppercase tracking-[0.3em] mt-4 animate-bounce">BOOM!</p>
                    )}
                </div>

                {/* Background Animation / Rocket */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20">
                    <Rocket size={120} className={gameState === 'running' ? 'animate-pulse text-[#ff0044]' : 'text-gray-700'} />
                </div>

                {/* Game History Bar */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-white/5 border-t border-white/5 flex gap-2 overflow-hidden">
                    {[1.25, 4.52, 1.02, 15.20, 2.10, 1.15, 3.40].map((h, i) => (
                        <span key={i} className={`px-3 py-1 rounded-lg text-[10px] font-black italic ${h > 2 ? 'bg-green-500/10 text-green-500' : 'bg-[#ff004411] text-[#ff0044]'}`}>
                            {h.toFixed(2)}x
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CrashGame;
