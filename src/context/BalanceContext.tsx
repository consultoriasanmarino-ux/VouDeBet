'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { profileService } from '@/services/profileService';
import { Profile } from '@/types/database';

type BalanceType = 'real' | 'demo';

interface ModalState {
    open: boolean;
    mode?: 'login' | 'register';
}

interface BalanceContextType {
    profile: Profile | null;
    currentType: BalanceType;
    setBalanceType: (type: BalanceType) => void;
    isLoading: boolean;
    refreshBalance: () => Promise<void>;
    user: any | null;
    isAdmin: boolean;

    // Modal Controls
    authModal: ModalState;
    setAuthModal: (state: ModalState) => void;
    depositModal: boolean;
    setDepositModal: (open: boolean) => void;
    withdrawModal: boolean;
    setWithdrawModal: (open: boolean) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [currentType, setCurrentType] = useState<BalanceType>('real');
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [authModal, setAuthModal] = useState<ModalState>({ open: false, mode: 'login' });
    const [depositModal, setDepositModal] = useState(false);
    const [withdrawModal, setWithdrawModal] = useState(false);

    const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
            await fetchProfile(session.user.id);
        } else {
            setProfile(null);
            setIsLoading(false);
        }
    };

    const fetchProfile = async (userId: string) => {
        setIsLoading(true);
        const data = await profileService.getProfile(userId);
        setProfile(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setIsLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        const subscription = profileService.subscribeToProfile(user.id, (newProfile) => {
            setProfile(newProfile);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [user?.id]);

    return (
        <BalanceContext.Provider
            value={{
                profile,
                currentType,
                setBalanceType: setCurrentType,
                isLoading,
                refreshBalance: async () => { if (user) await fetchProfile(user.id); },
                user,
                isAdmin: profile?.is_admin || false,
                authModal,
                setAuthModal,
                depositModal,
                setDepositModal,
                withdrawModal,
                setWithdrawModal
            }}
        >
            {children}
        </BalanceContext.Provider>
    );
}

export function useBalance() {
    const context = useContext(BalanceContext);
    if (context === undefined) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }
    return context;
}
