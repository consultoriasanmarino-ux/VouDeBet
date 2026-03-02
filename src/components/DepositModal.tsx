'use client';

import React, { useState, useEffect } from 'react';
import { X, Wallet, Copy, CheckCircle2, QrCode, ArrowRight, Gift, Loader2 } from 'lucide-react';
import { useBalance } from '@/context/BalanceContext';
import { supabase } from '@/lib/supabase';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
    const { profile, user, refreshBalance } = useBalance();

    const [amount, setAmount] = useState('50');
    const [step, setStep] = useState<'amount' | 'cpf_verification' | 'pix'>('amount');
    const pixKey = "00020126580014BR.GOV.BCB.PIX01366dec3a0b-1f8a-4c2a-aac4-85c6750b018c5204000053039865802BR5915VOU DE BET LTDA6009SAO PAULO62070503***6304E2B1";

    const [cpf, setCpf] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Reset state upon opening
    useEffect(() => {
        if (isOpen) {
            setStep('amount');
            setCouponCode('');
            setCpf('');
            setBirthDate('');
            setErrorMsg('');
            setSuccessMsg('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNextPix = () => {
        if (!profile) return;
        setErrorMsg('');

        // Verifica se CPF ou Nascimento faltam no BD
        if (!profile.cpf || !profile.birth_date) {
            setStep('cpf_verification');
        } else {
            setStep('pix');
        }
    };

    const handleSaveCpfAndPix = async () => {
        if (!cpf || !birthDate) {
            setErrorMsg('Preencha os campos (000.000.000-00 e DD/MM/AAAA).');
            return;
        }
        setIsLoading(true);
        setErrorMsg('');

        try {
            const { error } = await supabase.from('profiles').update({
                cpf,
                birth_date: birthDate
            }).eq('id', user?.id);

            if (error) throw error;

            await refreshBalance();
            setStep('pix');
        } catch (e: any) {
            setErrorMsg(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRedeemCoupon = async () => {
        if (!couponCode) {
            setErrorMsg('Digite um cupom válido.');
            return;
        }
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await fetch('/api/deposit/coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id, couponCode })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            await refreshBalance();
            setSuccessMsg(`Sucesso! R$ ${data.valor} depositado via Cupom!`);
            setCouponCode('');
        } catch (e: any) {
            setErrorMsg(e.message);
        } finally {
            setIsLoading(false);
        }
    };

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
                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                            {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold text-center">
                            {successMsg}
                        </div>
                    )}

                    {step === 'amount' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 rounded-2xl bg-[#ff004411] flex items-center justify-center text-[#ff0044] border border-[#ff004433]">
                                    <Wallet size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">DEPOSITAR</h2>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Crédito instantâneo via PIX</p>
                                </div>
                            </div>

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

                            <div className="w-full border-t border-white/5 pt-6 mt-4">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">POSSUI UM CÓDIGO PROMOCIONAL?</p>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Gift size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff0044]" />
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="CÓDIGO"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-black text-white outline-none focus:border-[#ff004455] transition-all uppercase tracking-[0.1em]"
                                        />
                                    </div>
                                    <button
                                        onClick={handleRedeemCoupon}
                                        disabled={isLoading || !couponCode}
                                        className="bg-white/10 hover:bg-[#ff0044] text-white border border-white/10 rounded-xl px-6 py-4 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'RESGATAR'}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleNextPix}
                                className="w-full bg-[#ff0044] text-white font-black py-6 rounded-2xl shadow-[0_0_30px_rgba(255,0,68,0.4)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all italic tracking-[0.2em]"
                            >
                                GERAR QR CODE PIX <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 'cpf_verification' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white text-center mb-6">CONFIRME SEUS DADOS</h2>
                            <p className="text-gray-500 text-xs font-bold text-center px-4 mb-4">Para gerar o QRCode em seu nome, precisamos confirmar seu CPF e Data de Nascimento obrigatórios do Banco Central.</p>

                            <input
                                placeholder="CPF (Apenas números)"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                                maxLength={11}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-bold text-white outline-none focus:border-[#ff004455] transition-all"
                            />

                            <input
                                placeholder="Data de Nascimento (DD/MM/AAAA)"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-bold text-white outline-none focus:border-[#ff004455] transition-all"
                            />

                            <button
                                onClick={handleSaveCpfAndPix}
                                disabled={isLoading}
                                className="w-full bg-[#ff0044] text-white font-black py-6 rounded-2xl shadow-[0_0_30px_rgba(255,0,68,0.4)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all italic tracking-[0.2em] disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : 'CONFIRMAR E GERAR PIX'}
                            </button>
                        </div>
                    )}

                    {step === 'pix' && (
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
                                <p className="text-xs font-black uppercase tracking-widest">Aguardando pagamento de R$ {amount}...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepositModal;
