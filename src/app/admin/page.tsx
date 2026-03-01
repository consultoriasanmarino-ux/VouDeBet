'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    Wallet,
    ShieldCheck,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    Activity,
    Lock,
    Plus,
    Gamepad2,
    Trash2,
    Check,
    Globe
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'games'>('stats');

    // Stats State
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDeposits: 0,
        totalWithdraws: 0,
        activeBets: 0
    });

    // Games State
    const [games, setGames] = useState<any[]>([]);
    const [provedoresUnicos, setProvedoresUnicos] = useState<string[]>([]);
    const [isNovoProvedor, setIsNovoProvedor] = useState(false);
    const [newGame, setNewGame] = useState({
        titulo: '',
        provedor: '',
        capa_url: '',
        categoria: 'Slots',
        iframeInput: ''
    });
    const [isAddingGame, setIsAddingGame] = useState(false);

    useEffect(() => {
        const savedPin = localStorage.getItem('admin_master_pin');
        if (savedPin === '216504') {
            setIsAuthenticated(true);
            fetchAdminData();
            fetchGames();
        }
    }, []);

    const fetchAdminData = async () => {
        // Simulated stats
        setStats({
            totalUsers: 1248,
            totalDeposits: 45200.00,
            totalWithdraws: 12150.00,
            activeBets: 84
        });
    };

    const fetchGames = async () => {
        const { data, error } = await supabase.from('jogos_demo').select('*').order('created_at', { ascending: false });
        if (data) {
            setGames(data);
            const providers = Array.from(new Set(data.map(g => g.provedor).filter(Boolean))) as string[];
            setProvedoresUnicos(providers);
            if (providers.length === 0) {
                setIsNovoProvedor(true);
            } else if (!newGame.provedor) {
                setNewGame(prev => ({ ...prev, provedor: providers[0] }));
            }
        }
    };

    const handlePinLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === '216504') {
            setIsAuthenticated(true);
            localStorage.setItem('admin_master_pin', '216504');
            fetchAdminData();
            fetchGames();
        } else {
            alert('Código incorreto!');
            setPin('');
        }
    };

    const extractIframeUrl = (input: string) => {
        // Regex to extract src from iframe
        const match = input.match(/src="([^"]+)"/);
        return match ? match[1] : input; // returns the match or the original input if it's already a URL
    };

    const handleAddGame = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalUrl = extractIframeUrl(newGame.iframeInput);
        const slug = newGame.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const { error } = await supabase.from('jogos_demo').insert([{
            titulo: newGame.titulo,
            provedor: newGame.provedor,
            slug: slug,
            iframe_url: finalUrl,
            capa_url: newGame.capa_url || 'https://images.unsplash.com/photo-1541250848049-b4f71413cc30?auto=format&fit=crop&q=80&w=800',
            categoria: newGame.categoria
        }]);

        if (error) {
            alert('Erro ao adicionar jogo: ' + error.message);
        } else {
            alert('Jogo adicionado com sucesso!');
            setIsAddingGame(false);
            setNewGame({ titulo: '', provedor: provedoresUnicos[0] || '', capa_url: '', categoria: 'Slots', iframeInput: '' });
            setIsNovoProvedor(provedoresUnicos.length === 0);
            fetchGames();
        }
    };

    const deleteGame = async (id: string) => {
        if (!confirm('Deseja realmente excluir este jogo?')) return;
        const { error } = await supabase.from('jogos_demo').delete().eq('id', id);
        if (!error) fetchGames();
    };

    const logOutAdmin = () => {
        localStorage.removeItem('admin_master_pin');
        setIsAuthenticated(false);
        setPin('');
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 bg-[#05070a] z-[99999] flex items-center justify-center p-4">
                <form onSubmit={handlePinLogin} className="bg-[#0d121b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 w-full max-w-[360px] animate-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#ff004411] flex items-center justify-center text-[#ff0044] border border-[#ff004433] mb-6">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Acesso Restrito</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Central Master</p>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="password"
                            placeholder="Código"
                            required
                            maxLength={6}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} // Apenas números
                            className="w-full bg-[#1a242d] border border-white/10 rounded-2xl py-5 px-6 text-white font-black outline-none focus:border-[#ff004455] text-center tracking-[0.5em] text-2xl transition-all"
                        />
                        <button
                            type="submit"
                            className="w-full bg-[#ff0044] text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest italic shadow-[0_0_20px_rgba(255,0,68,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            ACESSAR PAINEL
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 p-4 md:p-8 animate-in fade-in duration-700 relative z-50 bg-[#05070a] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#ff0044] flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,0,68,0.5)] border-4 border-[#0d121b]">
                        <Lock size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">Central <span className="text-[#ff0044]">Master</span></h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1 italic">Acesso Exclusivo</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                        {[
                            { id: 'stats', label: 'Dashboard', icon: <Activity size={16} /> },
                            { id: 'games', label: 'Gerenciar Jogos', icon: <Gamepad2 size={16} /> },
                            { id: 'users', label: 'Usuários', icon: <Users size={16} /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#ff0044] text-white shadow-[0_0_15px_#ff0044]' : 'text-gray-500 hover:text-white'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={logOutAdmin} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-500 hover:text-white hover:bg-[#ff0044] hover:border-[#ff0044] transition-all">
                        <ArrowDownLeft size={20} className="rotate-90" />
                    </button>
                </div>
            </div>

            {activeTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Clientes', value: stats.totalUsers, icon: <Users />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Total Depósitos', value: `R$ ${stats.totalDeposits.toLocaleString()}`, icon: <ArrowDownLeft />, color: 'text-green-500', bg: 'bg-green-500/10' },
                        { label: 'Total Saques', value: `R$ ${stats.totalWithdraws.toLocaleString()}`, icon: <ArrowUpRight />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                        { label: 'Lucro GGR', value: `R$ ${(stats.totalDeposits - stats.totalWithdraws).toLocaleString()}`, icon: <Activity />, color: 'text-[#ff0044]', bg: 'bg-[#ff0044]/10' },
                    ].map((stat, i) => (
                        <div key={i} className="p-8 rounded-[2rem] bg-[#1a242d] border border-white/5 shadow-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} border border-current/20`}>{stat.icon}</div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
                            </div>
                            <p className="text-3xl font-black italic text-white tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'games' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black italic text-white uppercase">Lista de Jogos Demo</h3>
                        <button
                            onClick={() => setIsAddingGame(true)}
                            className="px-6 py-3 bg-[#ff0044] text-white font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg italic"
                        >
                            <Plus size={16} /> ADICIONAR NOVO JOGO
                        </button>
                    </div>

                    {isAddingGame && (
                        <div className="p-8 rounded-[2.5rem] bg-[#1a242d] border border-[#ff004433] animate-in zoom-in-95 duration-300">
                            <form onSubmit={handleAddGame} className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2">TÍTULO DO JOGO</label>
                                        <input required value={newGame.titulo} onChange={e => setNewGame({ ...newGame, titulo: e.target.value })} className="w-full bg-[#0d121b] border border-white/10 rounded-xl py-4 px-6 text-white font-bold outline-none focus:border-[#ff004455]" placeholder="Ex: Fortune Tiger" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2">PROVEDOR</label>
                                        {!isNovoProvedor && provedoresUnicos.length > 0 ? (
                                            <div className="flex gap-2">
                                                <select
                                                    value={newGame.provedor}
                                                    onChange={e => {
                                                        if (e.target.value === 'NOVO_PROVEDOR') {
                                                            setIsNovoProvedor(true);
                                                            setNewGame({ ...newGame, provedor: '' });
                                                        } else {
                                                            setNewGame({ ...newGame, provedor: e.target.value });
                                                        }
                                                    }}
                                                    className="flex-1 bg-[#0d121b] border border-white/10 rounded-xl py-4 px-6 text-white font-bold outline-none border-r-[16px] border-r-transparent"
                                                >
                                                    {provedoresUnicos.map((p, i) => <option key={i} value={p}>{p}</option>)}
                                                    <option value="NOVO_PROVEDOR" className="text-[#ff0044] font-black italic">+ ADICIONAR NOVO...</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input required value={newGame.provedor} onChange={e => setNewGame({ ...newGame, provedor: e.target.value })} className="flex-1 bg-[#0d121b] border border-white/10 rounded-xl py-4 px-6 text-white font-bold outline-none focus:border-[#ff004455]" placeholder="Digite o nome do provedor..." />
                                                {provedoresUnicos.length > 0 && (
                                                    <button type="button" onClick={() => { setIsNovoProvedor(false); setNewGame({ ...newGame, provedor: provedoresUnicos[0] || '' }); }} className="px-6 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">VOLTAR</button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2">CATEGORIA</label>
                                        <select value={newGame.categoria} onChange={e => setNewGame({ ...newGame, categoria: e.target.value })} className="w-full bg-[#0d121b] border border-white/10 rounded-xl py-4 px-6 text-white font-bold outline-none border-r-[16px] border-r-transparent">
                                            <option>Slots</option>
                                            <option>Crash</option>
                                            <option>Mines</option>
                                            <option>Double</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2">CÓDIGO IFRAME OU URL DEMO</label>
                                        <textarea required value={newGame.iframeInput} onChange={e => setNewGame({ ...newGame, iframeInput: e.target.value })} className="w-full h-[124px] bg-[#0d121b] border border-white/10 rounded-xl py-4 px-6 text-white text-xs font-mono outline-none focus:border-[#ff004455]" placeholder='Cole o <iframe> aqui ou apenas a URL...' />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-2">URL DA CAPA (OPCIONAL)</label>
                                        <input value={newGame.capa_url} onChange={e => setNewGame({ ...newGame, capa_url: e.target.value })} className="w-full bg-[#0d121b] border border-white/10 rounded-xl py-4 px-6 text-white font-bold outline-none focus:border-[#ff004455]" placeholder="Link da imagem..." />
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <button type="submit" className="flex-1 bg-[#ff0044] text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest italic shadow-lg">SALVAR JOGO</button>
                                        <button type="button" onClick={() => setIsAddingGame(false)} className="px-8 bg-white/5 text-gray-500 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest italic">CANCELAR</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {games.map((game) => (
                            <div key={game.id} className="bg-[#0d121b] border border-white/5 rounded-[2rem] overflow-hidden group">
                                <div className="h-40 relative">
                                    <img src={game.capa_url} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d121b] to-transparent" />
                                    <button onClick={() => deleteGame(game.id)} className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white font-black italic uppercase tracking-tight truncate">{game.titulo}</h4>
                                        <span className="text-[9px] font-black px-2 py-0.5 bg-white/5 text-gray-500 rounded uppercase">{game.categoria}</span>
                                    </div>
                                    <p className="text-[10px] text-[#ff0044] font-black uppercase tracking-widest italic mb-4">{game.provedor}</p>
                                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/5">
                                        <Globe size={12} className="text-gray-600" />
                                        <p className="text-[9px] text-gray-600 truncate font-mono">{game.iframe_url}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
