'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { Activity, TrendingUp, Zap, Award } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function EfficiencyDashboard() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.efficiency.title')} 
                subtitle={t('sidebar.efficiency.dashboard')} 
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Efficiency Score', value: '84%', change: 12, label: 'vs last quarter', icon: <Activity size={20} strokeWidth={1.5} /> },
                    { title: 'Resource Utilization', value: '91%', change: 8, label: 'improvement', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                    { title: 'Performance Index', value: '7.8/10', change: 6, label: 'vs benchmark', icon: <Award size={20} strokeWidth={1.5} /> },
                    { title: 'Cost Savings', value: '$2.4M', change: 25, label: 'annual', icon: <Zap size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Efficiency Monitor
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Access benchmarking engine, resource utilization tracking, and performance dashboard through the submenu.
                </p>
            </div>
        </div>
    );
}
