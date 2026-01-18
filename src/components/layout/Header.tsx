'use client';

import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    const { theme } = useTheme();
    const { isRTL } = useLanguage();
    const isDark = theme === 'dark';

    const colors = {
        textPrimary: isDark ? '#f1f5f9' : '#0f172a',
        textSecondary: isDark ? '#94a3b8' : '#64748b',
    };

    return (
        <header className="mb-6 animate-fade-in" style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <h1 className="text-lg sm:text-xl font-semibold" style={{ color: colors.textPrimary }}>{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm mt-0.5" style={{ color: colors.textSecondary }}>{subtitle}</p>}
        </header>
    );
}
