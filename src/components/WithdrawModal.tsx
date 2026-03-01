'use client';

import React, { useState } from 'react';
import { X, ArrowUpRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useBalance } from '@/context/BalanceContext';

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
    const { profile, currentType } = useBalance();
    const [amount, setAmount] = useState('');
    const [pixKey, setPixKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const balanceAvailable = currentType === 'real' ? profile?.balance_real ?? 0 : profile?.balance_demo ?? 0;

    if (!isOpen) return null;

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (parseFloat(amount) > balanceAvailable) {
            alert('Saldo insuficiente!');
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            alert('Solicitação de saque enviada com sucesso!');
            setIsLoading(false);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-[#0d121b] border border-white/5 rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]" />

                <button onClick={onClose} className="absolute top-8 right-8 p-2 text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="p-12">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                            <ArrowUpRight size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">SACAR LUCROS</h2>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Disponível: R$ {balanceAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>

                    <form onSubmit={handleWithdraw} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-2">CHAVE PIX (CPF, E-MAIL OU TELEFONE)</label>
                            <input
                                required
                                type="text"
                                placeholder="000.000.000-00"
                                value={pixKey}
                                onChange={(e) => setPixKey(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-yellow-500/40 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-2">VALOR DO SAQUE</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-500">R$</span>
                                <input
                                    required
                                    type="number"
                                    min="20"
                                    step="0.01"
                                    placeholder="0,00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-black text-xl outline-none focus:border-yellow-500/40 transition-all"
                                />
                            </div>
                            <p className="text-[10px] text-gray-600 font-bold uppercase italic ml-2">* Mínimo R$ 20,00</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
                            <AlertCircle size={20} className="text-blue-500 shrink-0" />
                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                O saque será processado para a conta de mesma titularidade do CPF cadastrado. Prazo de até 24 horas.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !amount || parseFloat(amount) > balanceAvailable}
                            className="w-full bg-yellow-500 text-black font-black py-6 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.2)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all italic tracking-[0.2em] disabled:opacity-30 disabled:scale-100"
                        >
                            {isLoading ? 'PROCESSANDO...' : 'SOLICITAR SAQUE'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WithdrawModal;
