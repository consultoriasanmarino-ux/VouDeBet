'use client';

import React, { useState } from 'react';
import { X, Wallet, Copy, CheckCircle2, QrCode, ArrowRight } from 'lucide-react';
import { useBalance } from '@/context/BalanceContext';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
    const [amount, setAmount] = useState('50');
    const [step, setStep] = useState<'amount' | 'pix'>('amount');
    const pixKey = "00020126580014BR.GOV.BCB.PIX01366dec3a0b-1f8a-4c2a-aac4-85c6750b018c5204000053039865802BR5915VOU DE BET LTDA6009SAO PAULO62070503***6304E2B1";

    if (!isOpen) return null;

    const handleNext = () => setStep('pix');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(pixKey);
        alert('Código PIX Copiado!');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-[#0d121b] border border-white/5 rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#ff0044] shadow-[0_0_15px_#ff0044]" />

                <button onClick={onClose} className="absolute top-8 right-8 p-2 text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <div className="p-12">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-[#ff004411] flex items-center justify-center text-[#ff0044] border border-[#ff004433]">
                            <Wallet size={28} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">DEPOSITAR</h2>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Crédito instantâneo via PIX</p>
                        </div>
                    </div>

                    {step === 'amount' ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-3 gap-3">
                                {['20', '50', '100', '200', '500', '1000'].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(val)}
                                        className={`py-4 rounded-xl font-black text-sm transition-all border ${amount === val ? 'bg-[#ff0044] text-white border-[#ff0044]' : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10'}`}
                                    >
                                        R$ {val}
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-black">R$</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-2xl font-black text-white outline-none focus:border-[#ff004455] transition-all"
                                />
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full bg-[#ff0044] text-white font-black py-6 rounded-2xl shadow-[0_0_30px_rgba(255,0,68,0.4)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all italic tracking-[0.2em]"
                            >
                                GERAR QR CODE <ArrowRight size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-8 animate-in slide-in-from-right-8 duration-500">
                            <div className="p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(255,0,68,0.2)]">
                                <QrCode size={180} className="text-black" />
                            </div>

                            <div className="w-full space-y-4">
                                <p className="text-center text-xs text-gray-500 font-bold uppercase tracking-widest">Ou use o código Copia e Cola</p>
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl">
                                    <input
                                        readOnly
                                        value={pixKey}
                                        className="bg-transparent border-none flex-1 text-[10px] text-gray-400 font-mono px-2 outline-none truncate"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-3 bg-[#ff0044] text-white rounded-xl hover:bg-[#e02a46] transition-colors"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full p-6 rounded-2xl bg-green-500/5 border border-green-500/20 text-green-500">
                                <CheckCircle2 size={24} className="animate-pulse" />
                                <p className="text-xs font-black uppercase tracking-widest">Aguardando pagamento...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepositModal;
