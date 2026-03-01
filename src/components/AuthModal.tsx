'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === 'register') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username,
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                alert('Cadastro realizado! Verifique seu e-mail.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-[#0d121b] border border-white/5 rounded-[2rem] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff0044] to-transparent" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-10">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-[#ff004411] flex items-center justify-center text-[#ff0044] mb-4 border border-[#ff004433]">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                            {mode === 'login' ? 'BEM-VINDO DE VOLTA' : 'CRIE SUA CONTA'}
                        </h2>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-2 px-6 text-center">
                            {mode === 'login' ? 'Acesse sua conta para apostar' : 'Junte-se ao time de elite da VouDeBet'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {mode === 'register' && (
                            <>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="NOME COMPLETO"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder:text-gray-600 focus:border-[#ff004455] transition-all outline-none"
                                    />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="USUÁRIO"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder:text-gray-600 focus:border-[#ff004455] transition-all outline-none"
                                    />
                                </div>
                            </>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                placeholder="E-MAIL"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder:text-gray-600 focus:border-[#ff004455] transition-all outline-none"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                placeholder="SENHA"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder:text-gray-600 focus:border-[#ff004455] transition-all outline-none"
                            />
                        </div>

                        {error && (
                            <p className="text-[#ff0044] text-xs font-bold text-center uppercase tracking-widest">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#ff0044] text-white font-black py-5 rounded-2xl shadow-[0_0_20px_rgba(255,0,68,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 uppercase tracking-[0.2em] italic"
                        >
                            {isLoading ? 'PROCESSANDO...' : mode === 'login' ? 'ENTRAR NA CONTA' : 'FINALIZAR CADASTRO'}
                        </button>
                    </form>

                    <div className="mt-8 text-center px-4">
                        <button
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                            {mode === 'login' ? (
                                <>Não tem conta? <span className="text-[#ff0044]">Cadastre-se agora</span></>
                            ) : (
                                <>Já tem conta? <span className="text-[#ff0044]">Faça login</span></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
