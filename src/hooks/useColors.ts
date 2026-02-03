'use client';

import { useTheme } from '@/context/ThemeContext';

export function useColors() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return {
        isDark,
        cardBg: isDark ? '#1e293b' : '#ffffff',
        pageBg: isDark ? '#0f172a' : '#f8fafc',
        bgPrimary: isDark ? '#0f172a' : '#f8fafc',
        surfaceBg: isDark ? '#1e293b' : '#f8fafc',
        tableHeader: isDark ? '#0f172a' : '#f8fafc',
        tableHover: isDark ? '#334155' : '#f1f5f9',
        inputBg: isDark ? '#334155' : '#ffffff',
        border: isDark ? '#334155' : '#e2e8f0',
        textPrimary: isDark ? '#f1f5f9' : '#0f172a',
        textSecondary: isDark ? '#94a3b8' : '#64748b',
        success: '#22c55e',
        successBg: isDark ? 'rgba(34, 197, 94, 0.15)' : '#f0fdf4',
        successText: isDark ? '#4ade80' : '#15803d',
        successIcon: isDark ? '#4ade80' : '#22c55e',
        warning: '#eab308',
        warningBg: isDark ? 'rgba(234, 179, 8, 0.15)' : '#fefce8',
        warningText: isDark ? '#facc15' : '#a16207',
        danger: isDark ? '#f87171' : '#ef4444',
        dangerBg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
        dangerText: isDark ? '#f87171' : '#dc2626',
        dangerIcon: isDark ? '#f87171' : '#ef4444',
        infoBg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff',
        infoText: isDark ? '#60a5fa' : '#2563eb',
        accent: '#6366f1',
        accentBg: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
        accentText: isDark ? '#a5b4fc' : '#4f46e5',
        hoverBg: isDark ? '#334155' : '#e2e8f0',
    };
}
