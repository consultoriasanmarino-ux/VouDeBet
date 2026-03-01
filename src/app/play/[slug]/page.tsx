'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useBalance } from '@/context/BalanceContext';
import {
    ChevronLeft,
    Maximize2,
    Expand,
    ShieldCheck,
    Zap,
    Flame,
    RefreshCcw,
    Gamepad2
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import SugarSlot from '@/components/SugarSlot';

const PlayGame = () => {
    const { slug } = useParams();
    const router = useRouter();
    const { currentType } = useBalance();
    const [game, setGame] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchGame();
    }, [slug]);

    const fetchGame = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('jogos_demo')
            .select('*')
            .eq('slug', slug)
            .single();

        if (data) setGame(data);
        setIsLoading(false);
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
            <div className="w-16 h-16 border-4 border-[#ff0044] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#ff0044]" />
            <p className="text-white font-black italic uppercase tracking-[0.3em] animate-pulse">CARREGANDO ENGINE...</p>
        </div>
    );

    if (!game) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-6">
            <Gamepad2 size={64} className="text-gray-800" />
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">JOGO NÃO ENCONTRADO</h2>
            <Link href="/" className="px-10 py-4 bg-[#ff0044] text-white font-black rounded-xl italic uppercase tracking-widest shadow-lg">VOLTAR AO LOBBY</Link>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-700 pb-20">
            {/* Game Header Controls */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-all border border-white/5">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">{game.titulo}</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-[#ff0044] font-black uppercase tracking-widest italic">{game.provedor}</span>
                            <div className="w-1 h-1 rounded-full bg-gray-700" />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${currentType === 'real' ? 'text-green-500' : 'text-yellow-500'}`}>MODO {currentType.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <button onClick={fetchGame} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 transition-all"><RefreshCcw size={18} /></button>
                    <button className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black text-white italic border border-white/5 transition-all">
                        <Expand size={16} /> TELA CHEIA
                    </button>
                </div>
            </div>

            {/* Game Iframe Container or Custom React Slot */}
            {game.iframe_url === 'INTERNAL_SUGAR_VDB' ? (
                <div className="w-full bg-[#05070a] rounded-[2.5rem] border border-[#ff004433] overflow-hidden shadow-[0_0_50px_rgba(255,0,68,0.1)] py-10">
                    <SugarSlot />
                </div>
            ) : (
                <div className="relative aspect-video w-full max-h-[750px] bg-[#05070a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                    <iframe
                        src={game.iframe_url}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        scrolling="no"
                    />
                </div>
            )}

            {/* Game Footer / Info */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 p-8 rounded-[2rem] bg-[#1a242d] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#ff004411] border border-[#ff004422] flex items-center justify-center text-[#ff0044]">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <p className="text-white font-black italic tracking-tight uppercase">SISTEMA PROVABLY FAIR</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Sessão protegida por criptografia de ponta a ponta.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-30 grayscale pointer-events-none hidden sm:flex">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/18plus.svg" className="w-8" alt="18+" />
                    </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-[#ff004411] to-transparent border border-[#ff004433] flex items-center justify-center gap-4">
                    <Flame className="text-[#ff0044] animate-pulse" size={24} />
                    <span className="text-white font-black italic tracking-widest uppercase text-sm">EM ALTA HOJE</span>
                </div>
            </div>
        </div>
    );
};

export default PlayGame;
