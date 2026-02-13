'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { Target, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function StrategyDashboard() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.strategy.title')} 
                subtitle="Strategic alignment, governance, and institutional compliance overview" 
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Strategic KPIs Tracked', value: '24', change: 12, label: 'vs last quarter', icon: <Target size={20} strokeWidth={1.5} /> },
                    { title: 'Alignment Score', value: '87%', change: 5, label: 'improvement', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                    { title: 'Compliance Rate', value: '95%', change: 3, label: 'vs last year', icon: <CheckCircle size={20} strokeWidth={1.5} /> },
                    { title: 'Accreditation Status', value: 'Active', change: 0, label: 'all programs', icon: <Award size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Strategy & Governance Hub
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Navigate through the submenu to access institutional alignment, strategic KPIs, mission scorecard, compliance monitoring, and accreditation tracking.
                </p>
            </div>
        </div>
    );
}
