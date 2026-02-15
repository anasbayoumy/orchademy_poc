'use client';

import { useTheme } from '@/context/ThemeContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps { title: string; value: string | number; change?: number; changeLabel?: string; icon?: React.ReactNode; className?: string; }

export default function MetricCard({ title, value, change, changeLabel, icon, className = '' }: MetricCardProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const isPositive = change !== undefined && change > 0;
    const isNegative = change !== undefined && change < 0;

    const colors = {
        cardBg: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '#334155' : '#e2e8f0',
        textPrimary: isDark ? '#f1f5f9' : '#0f172a',
        textSecondary: isDark ? '#94a3b8' : '#64748b',
        iconBg: isDark ? '#334155' : '#f1f5f9',
        successBg: isDark ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4',
        successText: isDark ? '#4ade80' : '#15803d',
        dangerBg: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
        dangerText: isDark ? '#f87171' : '#dc2626',
    };

    return (
        <div className={`p-4 sm:p-5 rounded-xl transition-all card-hover h-full ${className}`.trim()} style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: colors.textSecondary }}>{title}</p>
                    <p className="text-xl sm:text-2xl font-semibold mt-1" style={{ color: colors.textPrimary }}>{value}</p>
                    {change !== undefined && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <div className="p-1 rounded-full" style={{ backgroundColor: isPositive ? colors.successBg : isNegative ? colors.dangerBg : colors.iconBg }}>
                                {isPositive && <TrendingUp size={12} style={{ color: colors.successText }} />}
                                {isNegative && <TrendingDown size={12} style={{ color: colors.dangerText }} />}
                                {!isPositive && !isNegative && <Minus size={12} style={{ color: colors.textSecondary }} />}
                            </div>
                            <span className="text-xs font-medium" style={{ color: isPositive ? colors.successText : isNegative ? colors.dangerText : colors.textSecondary }}>{isPositive ? '+' : ''}{change}%</span>
                            {changeLabel && <span className="text-xs" style={{ color: colors.textSecondary }}>{changeLabel}</span>}
                        </div>
                    )}
                </div>
                {icon && <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.iconBg, color: colors.textSecondary }}>{icon}</div>}
            </div>
        </div>
    );
}
