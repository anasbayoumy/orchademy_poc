'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { DollarSign, TrendingUp, PieChart, AlertCircle } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function FinancialsDashboard() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.financials.title')} 
                subtitle={t('sidebar.financials.dashboard')} 
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Total Revenue', value: '$125M', change: 8, label: 'vs last year', icon: <DollarSign size={20} strokeWidth={1.5} /> },
                    { title: 'Operating Margin', value: '18.5%', change: 3, label: 'improvement', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                    { title: 'Budget Utilization', value: '87%', change: -2, label: 'efficient', icon: <PieChart size={20} strokeWidth={1.5} /> },
                    { title: 'Financial Health', value: 'Strong', change: 0, label: 'rating', icon: <AlertCircle size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Financial Management
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Comprehensive financial dashboard for budget planning, revenue tracking, expense management, and financial forecasting.
                </p>
            </div>
        </div>
    );
}
