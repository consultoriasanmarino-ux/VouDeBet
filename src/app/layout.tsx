'use client';

import React, { useState } from 'react';
import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation';
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import AuthModal from "@/components/AuthModal";
import DepositModal from "@/components/DepositModal";
import WithdrawModal from "@/components/WithdrawModal";
import { BalanceProvider, useBalance } from "@/context/BalanceContext";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inter = Inter({ subsets: ["latin"] });

// Modal Controller component to access useBalance inside the provider
const ModalController = () => {
  const { authModal, setAuthModal, depositModal, setDepositModal, withdrawModal, setWithdrawModal } = useBalance();

  return (
    <>
      <AgeVerificationModal />
      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal({ ...authModal, open: false })}
        initialMode={authModal.mode}
      />
      <DepositModal isOpen={depositModal} onClose={() => setDepositModal(false)} />
      <WithdrawModal isOpen={withdrawModal} onClose={() => setWithdrawModal(false)} />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  return (
    <html lang="pt-BR" className="bg-[#0f1923] text-gray-100 antialiased selection:bg-[#f12c4c] selection:text-white">
      <head>
        <title>VouDeBet | Apostas de Elite</title>
        <meta name="description" content="Cassino digital de alta performance inspirado nas melhores plataformas mundiais." />
      </head>
      <body className={cn(inter.className, "min-h-screen relative overflow-x-hidden")}>
        <BalanceProvider>
          {/* Render modals at body level, outside any transformed containers */}
          <ModalController />

          {!isAdmin && <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />}

          <div className={cn(
            "transition-all duration-300 min-h-screen",
            isAdmin ? "w-full" : (isSidebarOpen ? "ml-64" : "ml-20")
          )}>
            {!isAdmin && <Header />}
            <main className={cn(
              "pb-12 px-6 max-w-[1600px] mx-auto overflow-hidden",
              isAdmin ? "pt-0 lg:px-0 max-w-none px-0" : "pt-24 lg:px-12"
            )}>
              {children}
            </main>
          </div>
        </BalanceProvider>
      </body>
    </html>
  );
}
