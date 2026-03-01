'use client';

import React, { useState } from 'react';
import GameCard from '@/components/GameCard';
import {
  Rocket,
  CircleDot,
  Grid3X3,
  Flame,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { useBalance } from '@/context/BalanceContext';

export default function Home() {
  const { currentType, balanceReal, balanceDemo } = useBalance();

  const originalGames = [
    { title: 'Crash', image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&q=80&w=800', isNew: true, multiplier: '2.5x' },
    { title: 'Double', image: 'https://images.unsplash.com/photo-1541250848049-b4f71413cc30?auto=format&fit=crop&q=80&w=800', multiplier: '14.0x' },
    { title: 'Mines', image: 'https://images.unsplash.com/photo-1596443686812-2f45229eebc3?auto=format&fit=crop&q=80&w=800' },
    { title: 'Dice', image: 'https://images.unsplash.com/photo-1596728321064-3b475c9756a8?auto=format&fit=crop&q=80&w=800', multiplier: '98.0x' },
  ];

  const slotGames = [
    { title: 'Fortune Tiger', image: 'https://images.unsplash.com/photo-1520610115053-ec5247fc8e4b?auto=format&fit=crop&q=80&w=800', isNew: true, provider: 'PG Soft' },
    { title: 'Gates of Olympus', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800', provider: 'Pragmatic Play' },
    { title: 'Sugar Rush', image: 'https://images.unsplash.com/photo-1581792902715-db12cdd443d1?auto=format&fit=crop&q=80&w=800', provider: 'Pragmatic Play' },
    { title: 'Sweet Bonanza', image: 'https://images.unsplash.com/photo-1575224300306-1b8da3bb1d62?auto=format&fit=crop&q=80&w=800', provider: 'PG Soft' },
    { title: 'The Dog House', image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800', isNew: true },
    { title: 'Wolf Gold', image: 'https://images.unsplash.com/photo-1589139267150-13f56ce26581?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero Banner Section */}
      <section className="relative h-[340px] rounded-3xl overflow-hidden group shadow-2xl border border-[#1a242d]">
        <img
          src="https://images.unsplash.com/photo-1518133830412-45934a49c938?auto=format&fit=crop&q=80&w=2600"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-[#0f1923cc] to-transparent flex flex-col justify-center px-12 gap-6">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-[#f12c4c] rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(241,44,76,0.4)]">
              VIP EXCLUSIVO
            </div>
            <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-bold uppercase tracking-widest">
              <Star size={14} fill="#eab308" />
              Bônus de Boas-Vindas 100%
            </div>
          </div>

          <h2 className="text-5xl font-black text-white leading-tight max-w-xl group-hover:drop-shadow-[0_0_15px_rgba(241,44,76,0.3)] transition-all">
            Sinta a Adrenalina de Apostar na <span className="text-[#f12c4c]">VouDeBet</span>
          </h2>

          <p className="text-gray-400 max-w-md font-medium leading-relaxed">
            A plataforma número 1 para quem busca segurança, rapidez e as melhores odds do mercado internacional.
          </p>

          <div className="flex items-center gap-4 mt-2">
            <button className="px-10 py-4 bg-[#f12c4c] text-white font-black uppercase tracking-widest rounded-xl shadow-xl hover:bg-[#e02a46] hover:scale-105 transition-all active:scale-95">
              Jogar Agora
            </button>
            <button className="px-10 py-4 border border-[#2d3a46] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#1a242d] transition-all">
              Recarregar
            </button>
          </div>
        </div>
      </section>

      {/* Originals Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[#1a242d] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#f12c4c11] rounded-xl text-[#f12c4c] ring-1 ring-[#f12c4c44]">
              <Flame size={20} />
            </div>
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
              Jogos Originais <span className="text-xs text-gray-500 uppercase font-black px-2 py-0.5 bg-[#1a242d] rounded ml-2">House</span>
            </h3>
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-500 font-bold uppercase tracking-widest hover:text-[#f12c4c] transition-colors group">
            Ver Tudo
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {originalGames.map((game, idx) => (
            <GameCard key={idx} {...game} />
          ))}
        </div>
      </section>

      {/* Featured Slots Section */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[#1a242d] pb-4">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-500 ring-1 ring-yellow-500/30">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Slots Recomendados</h3>
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors group">
            Ver Tudo
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {slotGames.map((game, idx) => (
            <GameCard key={idx} {...game} />
          ))}
        </div>
      </section>

      {/* Footer Stats / Trust */}
      <div className="grid md:grid-cols-3 gap-6 pt-12 border-t border-[#1a242d]">
        <div className="flex items-center gap-4 p-6 rounded-2xl bg-[#1a242d] border border-transparent hover:border-[#2d3a46] transition-all">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-white font-black text-lg">Saque Instantâneo</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Média de 2 minutos</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 rounded-2xl bg-[#1a242d] border border-transparent hover:border-[#2d3a46] transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Grid3X3 size={24} />
          </div>
          <div>
            <p className="text-white font-black text-lg">+5,000 Jogos</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Principais Provedores</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 rounded-2xl bg-[#1a242d] border border-transparent hover:border-[#2d3a46] transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#f12c4c11] flex items-center justify-center text-[#f12c4c]">
            <Rocket size={24} />
          </div>
          <div>
            <p className="text-white font-black text-lg">Suporte 24/7</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Língua Portuguesa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
