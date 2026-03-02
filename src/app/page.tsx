'use client';

import React, { useState, useEffect } from 'react';
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
  Activity,
  Plus
} from 'lucide-react';
import { useBalance } from '@/context/BalanceContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const [activeView, setActiveView] = useState<'lobby' | 'crash' | 'double'>('lobby');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [demoGames, setDemoGames] = useState<any[]>([]);

  useEffect(() => {
    if (tab === 'Crash') {
      setActiveView('crash');
      setActiveCategory(null);
    } else if (tab === 'Double') {
      setActiveView('double');
      setActiveCategory(null);
    } else if (tab) {
      setActiveView('lobby');
      setActiveCategory(tab);
    } else {
      setActiveView('lobby');
      setActiveCategory(null);
    }
  }, [tab]);

  useEffect(() => {
    fetchDemoGames();
  }, []);

  const fetchDemoGames = async () => {
    // Para garantir visibilidade em todos os cenários (anon vs auth),
    // pegamos os jogos e filtramos apenas a engine nativa 'vs20sugarrush'.
    const { data, error } = await supabase.from('jogos_demo').select('*').order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar jogos:', error);
      return;
    }

    if (data) {
      const filtered = data.filter(game =>
        game.iframe_url === 'INTERNAL_SUGAR_VDB' ||
        game.slug === 'vs20sugarrush' ||
        game.slug === 'sugar_vdb'
      );
      setDemoGames(filtered);
    }
  };

  const originalGames = [
    {
      title: 'Sugar VouDeBet',
      image: 'https://images.unsplash.com/photo-1579621970588-a3f5ce762692?auto=format&fit=crop&q=80&w=800',
      isNew: true,
      multiplier: '5000x',
      slug: 'vs20sugarrush',
      category: 'Slots',
      provider: 'VouDeBet Originals'
    },
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

              <h2 className="text-6xl font-black text-white leading-[1.1] max-w-2xl italic tracking-tighter uppercase leading-tight">
                DOMINE O <span className="text-[#ff0044]">MERCADO</span> <br />
                DAS APOSTAS ELITE
              </h2>

              <p className="text-gray-400 max-w-md font-medium text-lg leading-relaxed uppercase italic text-xs tracking-[0.2em] font-black">
                Sinta a velocidade do PIX instantâneo e jogue os originais mais lucrativos.
              </p>

              <div className="flex items-center gap-5 mt-4">
                <Link href="/play/vs20sugarrush" className="px-12 py-5 bg-[#ff0044] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(255,0,68,0.4)] hover:scale-105 transition-all active:scale-95 italic text-sm">
                  JOGAR AGORA
                </Link>
              </div>
            </div>
          </section>

          {/* Games Grid */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-16">
              {/* Originals Section */}
              <section className="flex flex-col gap-8">
                <div className="flex items-center justify-between border-l-2 border-[#ff0044] pl-5">
                  <h3 className="text-3xl font-black tracking-tighter italic uppercase text-white">
                    Originais <span className="text-[#ff0044]">VouDeBet</span>
                  </h3>
                  <button className="text-[10px] text-gray-600 font-black uppercase tracking-widest hover:text-white transition-colors italic">Ver Todos</button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {originalGames.map((game, idx) => (
                    <Link key={idx} href={`/play/${game.slug}`} className="cursor-pointer">
                      <GameCard {...game} />
                    </Link>
                  ))}
                </div>
              </section>

              {/* Dynamic Demo Slots Section */}
              <section className="flex flex-col gap-8">
                <div className="flex items-center justify-between border-l-2 border-[#ff0044] pl-5">
                  <h3 className="text-3xl font-black tracking-tighter italic uppercase text-white">
                    Jogos em <span className="text-[#ff0044]">Destaque</span>
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black rounded uppercase tracking-widest">Servidor 1 ATIVO</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {demoGames.length > 0 ? demoGames
                    .filter(g => !activeCategory || g.categoria?.toLowerCase() === activeCategory?.toLowerCase())
                    .map((game, idx) => (
                      <Link href={`/play/${game.slug}`} key={idx}>
                        <GameCard
                          title={game.titulo}
                          image={game.capa_url || 'https://images.unsplash.com/photo-1541250848049-b4f71413cc30?auto=format&fit=crop&q=80&w=800'}
                          provider={game.provedor}
                          isNew={idx === 0}
                        />
                      </Link>
                    )) : (
                    Array.from({ length: 1 }).map((_, i) => (
                      <div key={i} className="aspect-[4/5] rounded-[2rem] bg-white/5 border border-[#ff004455] animate-pulse relative overflow-hidden flex items-center justify-center">
                        <p className="text-[#ff0044] font-black italic uppercase tracking-widest p-4 text-center">Buscando Engines...</p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Live Feed Sidebar */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <LiveBetFeed />

                <div className="p-8 rounded-[2.5rem] bg-[#1a242d] border border-white/5 relative overflow-hidden group shadow-2xl">
                  <Zap className="absolute -right-4 -bottom-4 text-[#ff004405] group-hover:scale-150 transition-transform duration-1000" size={160} />
                  <h4 className="text-xl font-black text-white italic uppercase tracking-tight mb-2">Afiliado VIP</h4>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">Convide amigos e ganhe 15% de cada aposta feita na plataforma.</p>
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black uppercase text-[10px] tracking-widest hover:bg-[#ff0044] hover:border-[#ff0044] transition-all italic">Começar Agora</button>
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
      <div className="grid md:grid-cols-3 gap-8 pt-20 border-t border-white/5 pb-20">
        {[
          { icon: <Zap />, title: 'Saque Rápido', desc: 'Média de 30 segundos' },
          { icon: <ShieldCheck />, title: '100% Seguro', desc: 'SSL & Blockchain' },
          { icon: <Star />, title: 'Transparência', desc: 'Resultados SHA-256' }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 p-8 rounded-[2rem] bg-[#1a242d] border border-white/5 hover:border-[#ff004433] transition-all group shadow-xl hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#ff004411] flex items-center justify-center text-[#ff0044] border border-[#ff004422] transition-colors group-hover:bg-[#ff004422]">
              {item.icon}
            </div>
            <div>
              <p className="text-white font-black uppercase text-sm italic tracking-tight">{item.title}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-[#ff0044] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
