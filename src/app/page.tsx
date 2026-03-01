'use client';

import React, { useState } from 'react';
import GameCard from '@/components/GameCard';
import CrashGame from '@/components/CrashGame';
import DoubleGame from '@/components/DoubleGame';
import LiveBetFeed from '@/components/LiveBetFeed';
import {
  Rocket,
  Flame,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Trophy,
  History,
  LayoutGrid,
  Activity
} from 'lucide-react';
import { useBalance } from '@/context/BalanceContext';

export default function Home() {
  const [activeView, setActiveView] = useState<'lobby' | 'crash' | 'double'>('lobby');

  const originalGames = [
    { title: 'Crash Royal', image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&q=80&w=800', isNew: true, multiplier: '2.5x', slug: 'crash' },
    { title: 'Double Neon', image: 'https://images.unsplash.com/photo-1541250848049-b4f71413cc30?auto=format&fit=crop&q=80&w=800', multiplier: '14.0x', slug: 'double' },
    { title: 'Cyber Mines', image: 'https://images.unsplash.com/photo-1596443686812-2f45229eebc3?auto=format&fit=crop&q=80&w=800' },
    { title: 'Electric Dice', image: 'https://images.unsplash.com/photo-1596728321064-3b475c9756a8?auto=format&fit=crop&q=80&w=800', multiplier: '98.0x' },
  ];

  const slotGames = [
    { title: 'Fortune Tiger', image: 'https://images.unsplash.com/photo-1520610115053-ec5247fc8e4b?auto=format&fit=crop&q=80&w=800', isNew: true, provider: 'PG Soft' },
    { title: 'Gates of Olympus', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800', provider: 'Pragmatic Play' },
    { title: 'Sugar Rush', image: 'https://images.unsplash.com/photo-1581792902715-db12cdd443d1?auto=format&fit=crop&q=80&w=800', provider: 'Pragmatic Play' },
  ];

  return (
    <div className="flex flex-col gap-12 animate-in fade-in duration-1000">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveView('lobby')}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'lobby' ? 'bg-[#ff0044] text-white shadow-[0_0_15px_#ff0044]' : 'bg-white/5 text-gray-500 hover:text-white'}`}
        >
          Lobby Principal
        </button>
        {activeView !== 'lobby' && (
          <>
            <ChevronRight size={14} className="text-gray-700" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff0044] italic">
              {activeView === 'crash' ? 'Crash Game' : 'Double Roulette'}
            </span>
          </>
        )}
      </div>

      {activeView === 'lobby' ? (
        <>
          {/* Hero Cyber Banner */}
          <section className="relative h-[380px] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2600"
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-[#05070a99] to-transparent flex flex-col justify-center px-16 gap-6">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-[#ff004411] border border-[#ff004455] rounded-full text-[10px] font-black uppercase tracking-widest text-[#ff0044] shadow-[0_0_15px_rgba(255,0,68,0.3)]">
                  <Trophy size={14} /> VIP CLUB
                </div>
              </div>

              <h2 className="text-6xl font-black text-white leading-[1.1] max-w-2xl italic tracking-tighter">
                DOMINE O <span className="text-[#ff0044] neon-text">MERCADO</span> <br />
                DAS APOSTAS ELITE
              </h2>

              <p className="text-gray-400 max-w-md font-medium text-lg leading-relaxed">
                Sinta a velocidade do PIX instantâneo e jogue os originais mais lucrativos.
              </p>

              <div className="flex items-center gap-5 mt-4">
                <button onClick={() => setActiveView('crash')} className="px-12 py-5 bg-[#ff0044] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(255,0,68,0.4)] hover:scale-105 transition-all active:scale-95 italic">
                  JOGAR AGORA
                </button>
              </div>
            </div>
          </section>

          {/* Games Grid */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section className="flex flex-col gap-8">
                <div className="flex items-center justify-between border-l-2 border-[#ff0044] pl-5">
                  <h3 className="text-3xl font-black tracking-tighter italic uppercase text-white">
                    Originais <span className="text-[#ff0044]">VouDeBet</span>
                  </h3>
                  <button className="text-[10px] text-gray-600 font-black uppercase tracking-widest hover:text-white transition-colors italic">Ver Catálogo</button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {originalGames.map((game, idx) => (
                    <div key={idx} onClick={() => game.slug && setActiveView(game.slug as any)}>
                      <GameCard {...game} />
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-8">
                <div className="flex items-center gap-4 text-white">
                  <h3 className="text-3xl font-black tracking-tighter italic uppercase">Top Slots</h3>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {slotGames.map((game, idx) => (
                    <GameCard key={idx} {...game} />
                  ))}
                </div>
              </section>
            </div>

            {/* Live Feed Sidebar */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <LiveBetFeed />

                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#ff004411] to-transparent border border-[#ff004433] relative overflow-hidden group">
                  <Zap className="absolute -right-4 -bottom-4 text-[#ff004411] group-hover:scale-150 transition-transform duration-1000" size={120} />
                  <h4 className="text-xl font-black text-white italic uppercase tracking-tight mb-2">Afiliado VIP</h4>
                  <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6">Convide amigos e ganhe 15% de cada aposta feita na plataforma.</p>
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Começar Agora</button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-12 duration-700">
          {activeView === 'crash' ? <CrashGame /> : <DoubleGame />}
          <div className="mt-16">
            <LiveBetFeed />
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-white/5 pb-12">
        {[
          { icon: <Zap />, title: 'Saque Rápido', desc: 'Média de 30 segundos' },
          { icon: <ShieldCheck />, title: '100% Seguro', desc: 'SSL & Blockchain' },
          { icon: <Star />, title: 'Transparência', desc: 'Resultados SHA-256' }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#ff004411] flex items-center justify-center text-[#ff0044] border border-[#ff004422]">
              {item.icon}
            </div>
            <div>
              <p className="text-white font-black uppercase text-sm italic">{item.title}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
