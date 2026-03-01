'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Logo from './Logo';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [identifier, setIdentifier] = useState(''); // Can be email or username
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

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
            } else { // mode === 'login'
                let loginIdentifier = identifier;

                if (!identifier.includes('@')) {
                    // Usuário comum login via username (tentativa simples de converter para email padrão do App)
                    const cleanIdentifier = identifier.trim().toLowerCase();
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('email')
                        .eq('username', cleanIdentifier)
                        .single();

                    if (!profile) {
                        loginIdentifier = `${cleanIdentifier}@test.com`; // Assumindo padrão se não houver mapeamento
                    } else {
                        loginIdentifier = profile.email || `${cleanIdentifier}@test.com`;
                    }
                }

                const { error } = await supabase.auth.signInWithPassword({
                    email: loginIdentifier,
                    password,
                });

                if (error) throw error;
            }
            onClose();
            window.location.reload();
        } catch (err: any) {
            setError(err.message === 'Invalid login credentials' ? 'Dados inválidos. Verifique seu login/senha.' : err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <div className="fixed inset-0 bg-[#000000bc] backdrop-blur-[2px]" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-full max-w-[420px] bg-[#1a242d] border border-white/5 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    {/* Logo & Title */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex justify-center mb-6">
                            <Logo />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            {mode === 'login' ? 'Faça login em sua conta' : 'Crie sua conta na VouDeBet'}
                        </h2>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {mode === 'register' ? (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Nome Completo"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-[#0f1923] border border-white/5 rounded-lg py-3.5 px-4 text-sm font-medium text-white placeholder:text-gray-600 focus:border-[#f12c4c55] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Usuário</label>
                                    <input
                                        type="text"
                                        placeholder="Usuário"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-[#0f1923] border border-white/5 rounded-lg py-3.5 px-4 text-sm font-medium text-white placeholder:text-gray-600 focus:border-[#f12c4c55] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">E-mail</label>
                                    <input
                                        type="email"
                                        placeholder="E-mail"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#0f1923] border border-white/5 rounded-lg py-3.5 px-4 text-sm font-medium text-white placeholder:text-gray-600 focus:border-[#f12c4c55] transition-all outline-none"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">USUÁRIO OU E-MAIL</label>
                                <input
                                    type="text"
                                    placeholder="USUÁRIO OU E-MAIL"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full bg-[#0f1923] border border-white/5 rounded-lg py-3.5 px-4 text-sm font-medium text-white placeholder:text-gray-600 focus:border-[#f12c4c55] transition-all outline-none"
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Senha</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Senha"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0f1923] border border-white/5 rounded-lg py-3.5 px-4 text-sm font-medium text-white placeholder:text-gray-600 focus:border-[#f12c4c55] transition-all outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {mode === 'login' && (
                            <div className="flex justify-start">
                                <button type="button" className="text-[11px] text-gray-500 hover:text-white transition-colors">
                                    Esqueci a minha senha
                                </button>
                            </div>
                        )}

                        {error && (
                            <p className="text-[#f12c4c] text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#f12c4c] text-white font-bold py-4 rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? 'CARREGANDO...' : (
                                <>
                                    {mode === 'login' ? 'Entrar' : 'Cadastrar'}
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] font-bold uppercase">
                            <span className="bg-[#1a242d] px-4 text-gray-600">OU</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            {mode === 'login' ? 'Não tem uma conta ainda?' : 'Já possui uma conta?'}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                className="text-[#f12c4c] hover:underline ml-1 font-bold"
                            >
                                {mode === 'login' ? 'Crie uma agora!' : 'Faça login!'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
