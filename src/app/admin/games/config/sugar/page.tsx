'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, Save, RefreshCcw, Activity, ShieldAlert, Sparkles, Trash2 } from 'lucide-react';

export default function SugarConfig() {
    const [rtpLevel, setRtpLevel] = useState(50);
    const [payerMode, setPayerMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);

    // Formata logs do histórico de forma legível
    const loadConfigAndLogs = async () => {
        setIsLoadingLogs(true);
        try {
            // Tenta pegar a config ou criar um placeholder se a linha n existir ainda
            let { data: config } = await supabase.from('game_configs').select('*').eq('game_slug', 'sugar_vdb').single();
            if (config) {
                setRtpLevel(config.rtp_level);
                setPayerMode(config.payer_mode);
            }

            // Puxa Logs
            const { data: logs } = await supabase
                .from('game_history')
                .select('*, profiles!game_history_user_id_fkey(email)')
                .order('created_at', { ascending: false })
                .limit(20);

            if (logs) setHistory(logs);
        } catch (error) {
            console.error(error);
        }
        setIsLoadingLogs(false);
    };

    useEffect(() => {
        loadConfigAndLogs();
        // Um real web-socket da config seria bom pro futuro
    }, []);

    const saveConfig = async () => {
        setIsSaving(true);
        // O Supabase requer upsert para configuração base por jogo
        const payload = {
            game_slug: 'sugar_vdb',
            rtp_level: rtpLevel,
            payer_mode: payerMode,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase.from('game_configs').upsert([payload], { onConflict: 'game_slug' });

        setIsSaving(false);
        if (error) {
            alert('Falha ao salvar. Verifique se a tabela game_configs foi criada no Banco de Dados Supabase (SQL). Erro: ' + error.message);
        } else {
            alert('Configuração de RTP atualizada com sucesso!');
        }
    };

    const resetMultipliers = async () => {
        const confirmClear = confirm('Isso apagará TODO o histórico de manchas roxas/RTP de Sessões ativas dos jogadores. Tem certeza?');
        if (!confirmClear) return;

        // Limpa sem WHERE para afetar geral (Cuidado: num ambiente real melhor apagar focado em session_ids velhos)
        const { error } = await supabase.from('game_multipliers').delete().neq('id', 0); // Hacky delete all

        if (error) {
            alert('Falha SQL ao deletar Multipliers: ' + error.message);
        } else {
            alert('Todos os Tumbles (S_marks) foram resetados!');
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in">
            <div>
                <h1 className="text-3xl font-black italic uppercase text-white tracking-widest flex items-center gap-3">
                    <Settings className="text-[#ff0044]" /> Motor Sugar VouDeBet
                </h1>
                <p className="text-gray-400 mt-2">Painel de Controle Matemático da Hash e Engine 7x7 Original</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Painel Esquerdo: Controle da Engine */}
                <div className="bg-[#1a242d] rounded-[2rem] p-8 border border-white/5 space-y-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="text-blue-500" />
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 flex-1">RTP Matemático & Pesos</h2>
                    </div>

                    {/* Controlador de RTP Slider */}
                    <div className="space-y-4 bg-white/5 p-6 rounded-2xl">
                        <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-gray-400">
                            <span>Retorno ao Jogador (RTP)</span>
                            <span className="text-green-400">{rtpLevel}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={rtpLevel}
                            onChange={(e) => setRtpLevel(Number(e.target.value))}
                            className="w-full accent-[#ff0044] bg-[#05070a] rounded-lg appearance-none h-3 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase w-full">
                            <span>Casa suga tudo (0%)</span>
                            <span>Jogadores ganham mais (100%)</span>
                        </div>
                    </div>

                    {/* Switch Modo Pagador */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-red-500/10 to-transparent p-6 rounded-2xl border border-red-500/20">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2"><Sparkles className="text-yellow-400" size={16} /> MODO PAGADOR</h3>
                            <p className="text-xs text-red-300 mt-1">Multiplica a chance do símbolo SCATTER vir aparecer (Marketing)</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={payerMode} onChange={(e) => setPayerMode(e.target.checked)} />
                            <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#ff0044]"></div>
                        </label>
                    </div>

                    <button
                        onClick={saveConfig}
                        disabled={isSaving}
                        className="w-full py-4 rounded-xl font-black uppercase tracking-widest italic text-white bg-[#ff0044] hover:bg-[#d40038] shadow-[0_0_20px_rgba(255,0,68,0.4)] transition-all flex justify-center items-center gap-2"
                    >
                        {isSaving ? <RefreshCcw className="animate-spin" /> : <Save />}
                        {isSaving ? 'Aplicando na GPU...' : 'Aplicar Configurações ao Banco'}
                    </button>


                    {/* Botão de Emergência */}
                    <div className="border-t border-white/5 pt-6 mt-6">
                        <div className="flex items-center gap-2 mb-4 text-red-500">
                            <ShieldAlert />
                            <span className="font-bold text-sm uppercase tracking-widest">Controles de Emergência</span>
                        </div>
                        <button
                            onClick={resetMultipliers}
                            className="px-6 py-3 bg-red-900/40 text-red-400 hover:bg-red-800 hover:text-white rounded-lg flex items-center gap-2 font-bold uppercase text-xs w-full transition-colors border border-red-900"
                        >
                            <Trash2 size={16} /> Limpar Chão de Tumbles (Reset Tabela game_multipliers)
                        </button>
                    </div>

                </div>

                {/* Painel Direito: Live Game Feed (Auditoria) */}
                <div className="bg-[#1a242d] rounded-[2rem] p-8 border border-white/5 flex flex-col h-full max-h-[700px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Feed Real-Time (Logs)</h2>
                        <button onClick={loadConfigAndLogs} className="text-[#ff0044] hover:text-white transition-colors" title="Atualizar Logs">
                            <RefreshCcw size={20} className={isLoadingLogs ? "animate-spin" : ""} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {history.length > 0 ? history.map((log) => (
                            <div key={log.id} className="bg-white/5 p-4 rounded-xl flex items-center justify-between font-mono text-xs border border-white/5 hover:border-white/20 transition-all">
                                <div>
                                    <span className="text-gray-400 block mb-1">{(log.profiles as any)?.email || log.user_id.split('-')[0]}</span>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded text-black font-bold ${log.win_amount > 0 ? 'bg-green-400' : 'bg-gray-500'}`}>
                                            BET: {log.bet_amount}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded font-bold ${log.win_amount > log.bet_amount ? 'text-green-400 border border-green-500' : 'text-gray-300'}`}>
                                            WIN: {log.win_amount}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-gray-600 truncate max-w-[100px] block" title={log.matrix_result}>
                                        {log.matrix_result || "Nenhum Multiplicador"}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 py-10">Nenhuma aposta orgânica registrada ainda na Engine.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
