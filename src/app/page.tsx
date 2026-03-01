'use client';

import React from 'react';
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
  Star,
  Trophy,
  History
} from 'lucide-react';
import { useBalance } from '@/context/BalanceContext';

export default function Home() {
  const { currentType } = useBalance();

  const originalGames = [
    { title: 'Crash Royal', image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&q=80&w=800', isNew: true, multiplier: '2.5x' },
    { title: 'Double Neon', image: 'https://images.unsplash.com/photo-1541250848049-b4f71413cc30?auto=format&fit=crop&q=80&w=800', multiplier: '14.0x' },
    { title: 'Cyber Mines', image: 'https://images.unsplash.com/photo-1596443686812-2f45229eebc3?auto=format&fit=crop&q=80&w=800' },
    { title: 'Electric Dice', image: 'https://images.unsplash.com/photo-1596728321064-3b475c9756a8?auto=format&fit=crop&q=80&w=800', multiplier: '98.0x' },
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
    <div className="flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Hero Cyber Banner Section */}
      <section className="relative h-[440px] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl group">
        <img
          src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2600"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-[#05070a88] to-transparent flex flex-col justify-center px-16 gap-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#ff004411] border border-[#ff004455] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#ff0044] shadow-[0_0_15px_rgba(255,0,68,0.3)]">
              <Trophy size={14} /> NOVO SISTEMA VOUDEBET
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/40 font-bold uppercase tracking-widest italic">
              <History size={14} /> Versão 2.4.0
            </div>
          </div>

          <h2 className="text-6xl font-black text-white leading-tight max-w-2xl italic tracking-tighter">
            CADA APOSTA É UMA <br />
            <span className="text-[#ff0044] drop-shadow-[0_0_20px_rgba(255,0,68,0.5)]">ADRENALINA</span> ELÉTRICA
          </h2>

          <p className="text-gray-400 max-w-md font-medium text-lg leading-relaxed">
            A maior tecnologia de cassino digital com saques instantâneos e segurança de nível militar.
          </p>

          <div className="flex items-center gap-5 mt-4">
            <button className="px-12 py-5 bg-[#ff0044] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(255,0,68,0.4)] hover:shadow-[0_0_50px_rgba(255,0,68,0.6)] hover:scale-105 transition-all active:scale-95 italic">
              Jogar Agora
            </button>
            <button className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all italic">
              Ver Detalhes
            </button>
          </div>
        </div>

        {/* Animated Scan Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff0044] to-transparent opacity-20 blur-sm animate-[scan_4s_linear_infinite]" />
      </section>

      {/* Originals Section */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-[#ff0044] rounded-full shadow-[0_0_15px_rgba(255,0,68,0.8)]" />
            <h3 className="text-3xl font-black tracking-tighter italic uppercase text-white">
              Originais <span className="text-[#ff0044]">VouDeBet</span>
            </h3>
          </div>
          <button className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] hover:text-[#ff0044] transition-colors group italic">
            EXPLORAR CATALOGO
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {originalGames.map((game, idx) => (
            <GameCard key={idx} {...game} />
          ))}
        </div>
      </section>

      {/* Featured Slots Section */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-white/20 rounded-full" />
            <h3 className="text-3xl font-black tracking-tighter italic uppercase text-white">Slots em Destaque</h3>
          </div>
          <button className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] hover:text-white transition-colors group italic">
            VER TODOS SLOTS
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {slotGames.map((game, idx) => (
            <GameCard key={idx} {...game} />
          ))}
        </div>
      </section>

      {/* Footer Trust Section */}
      <div className="grid md:grid-cols-3 gap-8 pt-20 border-t border-white/5">
        <div className="flex flex-col gap-4 p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-[#ff004433] transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-[#ff004411] flex items-center justify-center text-[#ff0044] border border-[#ff004433] group-hover:scale-110 transition-transform">
            <Zap size={28} />
          </div>
          <div>
            <p className="text-white font-black text-xl italic uppercase tracking-tight">PIX Instantâneo</p>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Sua conta em segundos</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-[#ff004433] transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-white font-black text-xl italic uppercase tracking-tight">Segurança Total</p>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Criptografia Ponta-a-Ponta</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-[#ff004433] transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 group-hover:scale-110 transition-transform">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-white font-black text-xl italic uppercase tracking-tight">VIP Experience</p>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Cashback em cada aposta</p>
          </div>
        </div>
      </div>
    </div>
  );
}
