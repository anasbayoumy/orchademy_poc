'use client';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { Activity, TrendingUp, Users, Building, CheckCircle2 } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function CapacityUtilizationPage() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.efficiency.capacityUtilization')} 
                subtitle="Classroom fill rate and facility utilization analysis"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Classroom Fill Rate', value: '82%', change: 8, label: 'vs last term', icon: <Building size={20} strokeWidth={1.5} /> },
                    { title: 'Utilization Index', value: '87%', change: 5, label: 'improvement', icon: <Activity size={20} strokeWidth={1.5} /> },
                    { title: 'Peak Capacity', value: '94%', change: 3, label: 'efficiency', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                    { title: 'Space Optimization', value: 'Good', change: 0, label: 'status', icon: <Users size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>Capacity Utilization</h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Track classroom fill rates and facility utilization to optimize space allocation and improve operational efficiency.
                </p>
            </div>

            {/* Expected KPIs */}
            <div className="mt-6 rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: colors.accent }}>
                    Expected KPIs for Capacity Utilization
                </p>
                <ul className="space-y-2">
                    {['Classroom Fill Rate'].map((kpi, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                            <CheckCircle2 size={15} strokeWidth={2} style={{ color: colors.secondary1, flexShrink: 0 }} />
                            <span className="text-sm" style={{ color: colors.textSecondary }}>{kpi}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
