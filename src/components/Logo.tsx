'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: number;
}

const Logo = ({ className = "", showText = true, size = 160 }: LogoProps) => {
    // Definimos um tamanho padrão maior para a logo horizontal oficial
    // Se showText for false, podemos mostrar apenas uma versão cortada ou a logo inteira menor
    return (
        <div className={`flex items-center ${className}`}>
            <div className="relative flex-shrink-0" style={{ width: size, height: size / 3 }}>
                <Image
                    src="/assets/logo_semfundo.png"
                    alt="VouDeBet Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
};

export default Logo;
