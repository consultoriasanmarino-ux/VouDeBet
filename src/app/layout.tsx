'use client';

import React, { useState } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import { BalanceProvider } from "@/context/BalanceContext";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="pt-BR" className="bg-[#0f1923] text-gray-100 antialiased selection:bg-[#f12c4c] selection:text-white">
      <head>
        <title>VouDeBet | Apostas de Elite</title>
        <meta name="description" content="Cassino digital de alta performance inspirado nas melhores plataformas mundiais." />
      </head>
      <body className={cn(inter.className, "min-h-screen relative overflow-x-hidden")}>
        <BalanceProvider>
          <AgeVerificationModal />
          <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className={cn(
            "transition-all duration-300 min-h-screen",
            isSidebarOpen ? "ml-64" : "ml-20"
          )}>
            <Header />
            <main className="pt-24 pb-12 px-6 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
              {children}
            </main>
          </div>
        </BalanceProvider>
      </body>
    </html>
  );
}
