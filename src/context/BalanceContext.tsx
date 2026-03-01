'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

type BalanceType = 'real' | 'demo';

interface BalanceContextType {
    balanceReal: number;
    balanceDemo: number;
    currentType: BalanceType;
    setBalanceType: (type: BalanceType) => void;
    isLoading: boolean;
    refreshBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
    const [balanceReal, setBalanceReal] = useState(0);
    const [balanceDemo, setBalanceDemo] = useState(1000); // Default demo balance
    const [currentType, setCurrentType] = useState<BalanceType>('real');
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserBalance = async () => {
        try {
            setIsLoading(true);
            // For now, let's assume we're fetching for a dummy user or authenticated session
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('balance_real, balance_demo')
                    .eq('id', user.id)
                    .single();

                if (data && !error) {
                    setBalanceReal(data.balance_real);
                    setBalanceDemo(data.balance_demo);
                }
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserBalance();

        // Subscribe to realtime updates for profiles table
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles' },
                (payload) => {
                    // If we had a mechanism to identify current user, check payload.new.id
                    setBalanceReal(payload.new.balance_real);
                    setBalanceDemo(payload.new.balance_demo);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <BalanceContext.Provider
            value={{
                balanceReal,
                balanceDemo,
                currentType,
                setBalanceType: setCurrentType,
                isLoading,
                refreshBalance: fetchUserBalance
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
