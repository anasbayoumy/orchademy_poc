'use client';

import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {

    const { isRTL } = useLanguage();

    const colors = {
        textPrimary: '#0b1c3d',     // Dark Sapphire
        textSecondary: '#304a78',   // Power Blue
    };

    return (
        <header
            className="mb-8 animate-fade-in"
            style={{
                textAlign: isRTL ? 'right' : 'left',
                fontFamily: 'var(--font-libre), serif'
            }}
        >
            <h1
                className="text-xl sm:text-2xl font-bold tracking-tight"
                style={{
                    color: colors.textPrimary,
                    letterSpacing: '-0.5px'
                }}
            >
                {title}
            </h1>

            {subtitle && (
                <p
                    className="text-sm sm:text-base mt-2"
                    style={{
                        color: colors.textSecondary,
                        maxWidth: '600px',
                        lineHeight: '1.6'
                    }}
                >
                    {subtitle}
                </p>
            )}
        </header>
    );
}
