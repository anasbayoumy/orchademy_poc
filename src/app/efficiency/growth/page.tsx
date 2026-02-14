'use client';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { TrendingUp, Users, Activity, AlertCircle } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function GrowthPressurePage() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.efficiency.growthPressure')} 
                subtitle="Headcount growth vs enrollment growth analysis (EFF-05)"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Headcount Growth', value: '+8.5%', change: 8, label: 'annual', icon: <Users size={20} strokeWidth={1.5} /> },
                    { title: 'Enrollment Growth', value: '+12.3%', change: 12, label: 'annual', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                    { title: 'Growth Ratio', value: '0.69', change: -4, label: 'efficiency', icon: <Activity size={20} strokeWidth={1.5} /> },
                    { title: 'Pressure Index', value: 'Moderate', change: 0, label: 'status', icon: <AlertCircle size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>Growth Pressure</h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Analyze the relationship between headcount growth and enrollment growth to identify staffing pressure points and maintain sustainable growth.
                </p>
            </div>
        </div>
    );
}
