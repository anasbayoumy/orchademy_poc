'use client';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { Users, Activity, TrendingUp, UserCheck } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function WorkforceRatiosPage() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.efficiency.workforceRatios')} 
                subtitle="Student-to-faculty, admin-to-faculty, and advisor caseload ratios (EFF-12, EFF-13, EFF-14, EFF-06)"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Student-to-Faculty', value: '18:1', change: -3, label: 'improvement', icon: <Users size={20} strokeWidth={1.5} /> },
                    { title: 'Admin-to-Faculty', value: '0.42:1', change: 2, label: 'ratio', icon: <Activity size={20} strokeWidth={1.5} /> },
                    { title: 'Student-to-Admin', value: '28:1', change: -5, label: 'optimized', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                    { title: 'Advisor Caseload', value: '42', change: -8, label: 'per advisor', icon: <UserCheck size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>Workforce Ratios (Actual)</h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Monitor actual workforce ratios including student-to-faculty, admin-to-faculty, student-to-admin, and advisor caseloads to ensure optimal staffing levels.
                </p>
            </div>
        </div>
    );
}
