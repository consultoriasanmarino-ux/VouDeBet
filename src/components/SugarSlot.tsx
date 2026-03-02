'use client';

import React, { useState, useEffect } from 'react';
import { useBalance } from '@/context/BalanceContext';
import { Play, Loader2, Coins, Rocket, Trophy } from 'lucide-react';

const SYMBOL_MAP: Record<number, { e: string, color: string, img: string }> = {
    0: { e: '', color: 'bg-transparent', img: '' },
    1: { e: '🚀', color: 'bg-gradient-to-br from-yellow-400 to-red-500 shadow-[0_0_20px_#ffeb3b88]', img: '/assets/sugar/scatter.png' },
    2: { e: '🐻', color: 'bg-orange-500', img: '/assets/sugar/urso-laranja.png' },
    3: { e: '🟣', color: 'bg-purple-500', img: '/assets/sugar/urso-roxo.png' },
    4: { e: '🔴', color: 'bg-red-500', img: '/assets/sugar/urso-vermelho.png' },
    5: { e: '⭐', color: 'bg-green-400', img: '/assets/sugar/estrela.png' },
    6: { e: '🍬', color: 'bg-pink-400', img: '/assets/sugar/feijao.png' },
    7: { e: '❤️', color: 'bg-red-600', img: '/assets/sugar/coracao.png' },
    8: { e: '🍭', color: 'bg-gradient-to-b from-pink-400 to-purple-600 shadow-[0_0_15px_#e91e63]', img: '/assets/sugar/pirulito.png' },
};

function SymbolImageFallback({ src, fallbackEmoji, isExploding, symbolId }: { src: string, fallbackEmoji: string, isExploding: boolean, symbolId: number }) {
    const [hasError, setHasError] = useState(false);

    if (symbolId === 0) return null; // Vazio não tem imagem

    if (hasError || !src) {
        return <span className={isExploding ? "animate-ping" : ""}>{fallbackEmoji}</span>;
    }

    return (
        <img
            src={src}
            alt="Symbol"
            onError={() => setHasError(true)}
            className={`w-[85%] h-[85%] object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 ${isExploding ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
        />
    );
}

type TumbleStep = {
    grid: number[][];
    clusters: { points: { r: number, c: number }[], symbol: number, totalPayout: number }[];
    currentMultipliers: Record<number, number>;
    stepWin: number;
};

export default function SugarSlot() {
    const { profile, currentType, refreshBalance } = useBalance();

    const [bet, setBet] = useState(2.00);
    const [isSpinning, setIsSpinning] = useState(false);

    // Grid inicial limpo 7x7 (cheio de feijões ou vazio)
    const [displayGrid, setDisplayGrid] = useState<number[][]>(
        Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => Math.floor(Math.random() * 7) + 2))
    );
    const [activeClusters, setActiveClusters] = useState<string[]>([]);
    const [multipliers, setMultipliers] = useState<Record<number, number>>({});
    const [totalWin, setTotalWin] = useState(0);

    // Free Spins State (Estado Persistente/Backend)
    const [fsLeft, setFsLeft] = useState(0);
    const [isBonusActive, setIsBonusActive] = useState(false);
    const [fsTotalWin, setFsTotalWin] = useState(0);
    const [showBonusTrigger, setShowBonusTrigger] = useState(false);
    const [showBonusSummary, setShowBonusSummary] = useState(false);

    // Refs para evitar closures obsoletas nas funções de animação/loop
    const isBonusActiveRef = React.useRef(false);
    const fsLeftRef = React.useRef(0);

    // Auto-spin free spins
    useEffect(() => {
        if (isBonusActive && fsLeft > 0 && !isSpinning) {
            const timer = setTimeout(() => {
                spin();
            }, 1000);
            return () => clearTimeout(timer);
        }

        // Fim do bonus
        if (isBonusActive && fsLeft === 0 && !isSpinning && fsTotalWin > 0) {
            setShowBonusSummary(true);
        }
    }, [isBonusActive, fsLeft, isSpinning]);

    const spin = async () => {
        if (!profile || isSpinning) return;
        setIsSpinning(true);
        setActiveClusters([]);
        setMultipliers({});
        if (!isBonusActive) {
            setTotalWin(0);
            setFsTotalWin(0);
        }

        try {
            const res = await fetch('/api/slot/spin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bet,
                    userId: profile.id,
                    type: currentType
                })
            });

            const data = await res.json();
            if (data.error) {
                alert(data.error);
                setIsSpinning(false);
                return;
            }

            // Logica de transição de bônus
            const bonusRetrigger = data.freeSpinsAwarded > 0 && isBonusActiveRef.current;
            const newBonusTrigger = data.freeSpinsAwarded > 0 && !isBonusActiveRef.current;

            if (newBonusTrigger) {
                setShowBonusTrigger(true);
                await new Promise(r => setTimeout(r, 2500));
                setShowBonusTrigger(false);

                isBonusActiveRef.current = true;
                setIsBonusActive(true);
            }

            // Atualiza refs e estados com os dados reais do backend
            setFsLeft(data.fs_left || 0);
            fsLeftRef.current = data.fs_left || 0;

            if (isBonusActiveRef.current || data.freeSpinsAwarded > 0) {
                setFsTotalWin(prev => prev + data.win);
            }

            // Anima Tumbles
            await animateTumbles(data.steps, data.win);

            // A continuidade agora é tratada pelo useEffect
            setIsSpinning(false);
            refreshBalance(); // Atualiza saldo real na navbar
        } catch (err) {
            console.error(err);
            setIsSpinning(false);
        }
    };

    const animateTumbles = async (steps: TumbleStep[], finalWin: number) => {
        let accumulatedWin = 0;

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];

            // 1. Mostra o grid que caiu
            setDisplayGrid(step.grid);
            setMultipliers(step.currentMultipliers);

            if (step.clusters.length > 0) {
                // 2. Destaca os blocos que vão explodir (Clusters da vez)
                const clusterIds = step.clusters.flatMap(c => c.points.map(p => `${p.r}-${p.c}`));
                setActiveClusters(clusterIds);

                // Espera o jogador ver a vitória piscando
                await new Promise(r => setTimeout(r, 600));

                accumulatedWin += step.stepWin;
                setTotalWin(accumulatedWin);

                // 3. Remove os clusters da tela visualmente (viram zero)
                const explodedGrid = step.grid.map(row => [...row]);
                step.clusters.forEach(c => c.points.forEach(p => explodedGrid[p.r][p.c] = 0));
                setDisplayGrid(explodedGrid);
                setActiveClusters([]);

                // Anima as posições vazias (suspense caindo)
                await new Promise(r => setTimeout(r, 400));
            } else {
                // Último passo (Acomodação visual)
                setDisplayGrid(step.grid);
                await new Promise(r => setTimeout(r, 400));
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 lg:p-10 w-full max-w-4xl mx-auto animate-in fade-in duration-700">
            {/* Título */}
            <div className="text-center mb-6">
                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 drop-shadow-[0_0_25px_rgba(233,30,99,0.5)]">
                    Sugar VouDeBet
                </h1>
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs mt-2">✨ Exclusive Custom Engine V1.0 ✨</p>

                {/* Score Board de Vitória */}
                <div className="h-24 mt-6 flex items-center justify-center">
                    {totalWin > 0 && (
                        <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                            <span className="text-[#ff0044] font-black uppercase text-xl italic tracking-widest flex items-center gap-2">
                                <Trophy size={20} /> {isBonusActive ? 'BONUS WIN' : 'SWEET WIN!'}
                            </span>
                            <span className="text-5xl font-black text-white italic tracking-tighter">
                                R$ {totalWin.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    )}
                    {isBonusActive && fsLeft > 0 && totalWin === 0 && (
                        <div className="flex flex-col items-center animate-pulse">
                            <span className="text-pink-500 font-black text-2xl italic uppercase tracking-tighter">FREE SPINS ACTIVATED</span>
                            <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">LUCK IS IN THE AIR</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tela de Resumo do Bônus (Fim) */}
            {showBonusSummary && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="flex flex-col items-center gap-8 animate-in zoom-in-75 duration-500">
                        <div className="w-24 h-24 rounded-full bg-pink-500 flex items-center justify-center shadow-[0_0_50px_rgba(233,30,99,0.5)]">
                            <Trophy size={48} className="text-white" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-400">BONUS TOTAL WIN</h2>
                            <p className="text-7xl font-black text-white italic tracking-tighter mt-2 drop-shadow-[0_0_20px_pink]">
                                R$ {fsTotalWin.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <button
                            onClick={() => { setShowBonusSummary(false); setIsBonusActive(false); setFsTotalWin(0); }}
                            className="px-12 py-5 bg-[#ff0044] text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_0_20px_#ff0044] hover:scale-105 transition-all"
                        >
                            CLOSE SUMMARY
                        </button>
                    </div>
                </div>
            )}

            {/* Banner de Bônus (Trigger) */}
            {showBonusTrigger && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="flex flex-col items-center gap-6 animate-in zoom-in-50 duration-500">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-pink-500 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
                            <Rocket size={120} className="text-[#ff0044] relative animate-bounce" />
                        </div>
                        <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white text-center drop-shadow-2xl">
                            FREE SPINS <br /><span className="text-pink-500">UNLOCKED!</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-bold uppercase tracking-[0.3em]">Prepare for the Sweetness</p>
                    </div>
                </div>
            )}

            {/* Máquina 7x7 */}
            <div className={`relative p-3 md:p-6 rounded-[2.5rem] shadow-2xl transition-all duration-700 border-8 ${isBonusActive ? 'bg-gradient-to-br from-[#2d1a24] to-[#1b0d12] border-pink-500/30 shadow-pink-500/20' : 'bg-gradient-to-br from-[#1a242d] to-[#0d121b] border-white/5'}`}>
                {/* Contador de Free Spins */}
                {isBonusActive && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-2 rounded-full font-black italic tracking-widest shadow-[0_0_20px_rgba(233,30,99,0.5)] flex items-center gap-3 border-2 border-white/20">
                        <Rocket size={16} /> FREE SPINS: {fsLeft}
                    </div>
                )}

                <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {displayGrid.map((row, r) =>
                        row.map((symbol, c) => {
                            const isExploding = activeClusters.includes(`${r}-${c}`);
                            const linearIndex = r * 7 + c;
                            const mult = multipliers[linearIndex];
                            const symInfo = SYMBOL_MAP[symbol] || SYMBOL_MAP[0];

                            return (
                                <div key={`${r}-${c}`} className="relative group">
                                    <div
                                        className={`
                                            w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl 
                                            flex items-center justify-center text-xl md:text-3xl
                                            transition-all duration-300
                                            ${symInfo.color}
                                            ${isExploding ? 'scale-110 brightness-150 animate-pulse ring-4 ring-white z-10' : ''}
                                            ${symbol === 0 ? 'opacity-0 scale-50' : 'opacity-100 shadow-[inset_0_-4px_rgba(0,0,0,0.3)] hover:scale-105 hover:z-20'}
                                        `}
                                    >
                                        <SymbolImageFallback
                                            src={symInfo.img}
                                            fallbackEmoji={symInfo.e}
                                            isExploding={isExploding}
                                            symbolId={symbol}
                                        />
                                    </div>

                                    {/* Marcador de Multiplicador Colado na Grade (As manchas roxas/vermelhas do sugar rush) */}
                                    {mult && symbol === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center z-0">
                                            <div className="w-8 h-8 md:w-12 md:h-12 border-2 border-[#ff004455] bg-[#ff004422] rounded-full flex items-center justify-center text-white font-black text-[10px] md:text-xs">
                                                x{mult}
                                            </div>
                                        </div>
                                    )}
                                    {mult && symbol !== 0 && (
                                        <div className="absolute bottom-[-10px] right-[-10px] bg-red-600 text-white shadow-[0_0_10px_red] rounded-full p-1 border-2 border-[#1a242d] font-black text-[10px] md:text-xs z-30">
                                            x{mult}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Painel de Controle Embutido */}
            <div className="mt-10 flex flex-col md:flex-row items-center gap-6 w-full max-w-2xl bg-white/5 p-4 rounded-[2rem] border border-white/5">
                <div className="flex flex-col flex-1 px-4">
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Saldo Atual</span>
                    <span className="text-xl font-black text-white border-b border-white/10 pb-2">
                        R$ {(currentType === 'real' ? profile?.balance_real : profile?.balance_demo)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </span>
                    <span className="text-[10px] text-green-500 mt-2 font-black uppercase tracking-widest flex items-center gap-1">
                        <Coins size={12} /> Modos Auto & Turbo desativados (BETA)
                    </span>
                </div>

                <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Aposta</span>
                        <div className="flex items-center gap-2 bg-[#0d121b] border border-white/10 rounded-xl p-1">
                            <button onClick={() => setBet(Math.max(0.5, bet - 0.5))} className="w-8 h-8 flex items-center justify-center text-white font-black hover:bg-white/10 rounded-lg">-</button>
                            <span className="w-16 text-center text-white font-black text-sm">R$ {bet.toFixed(2)}</span>
                            <button onClick={() => setBet(bet + 0.5)} className="w-8 h-8 flex items-center justify-center text-white font-black hover:bg-white/10 rounded-lg">+</button>
                        </div>
                    </div>

                    <button
                        onClick={spin}
                        disabled={isSpinning}
                        className="w-20 h-20 bg-gradient-to-tr from-[#ff0044] to-[#f50057] shadow-[0_0_30px_rgba(255,0,68,0.4)] hover:shadow-[0_0_50px_rgba(255,0,68,0.6)] rounded-[2rem] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        {isSpinning ? <Loader2 size={32} className="animate-spin text-white/50" /> : <Play size={32} fill="currentColor" className="ml-2" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
