'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { FACULTY_DATA, getDefaultTotalFaculty } from '@/data/faculty';

export default function WorkloadDashboard() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    const totalFaculty = getDefaultTotalFaculty();
    const overloaded = FACULTY_DATA.filter(f => f.status === 'Overloaded').length;
    const avgLoad = totalFaculty > 0
        ? (FACULTY_DATA.reduce((s, f) => s + f.teachingLoad, 0) / totalFaculty).toFixed(1)
        : '0';
    const balanced = FACULTY_DATA.filter(f => f.status === 'Balanced').length;
    const utilizationPct = totalFaculty > 0 ? Math.round((balanced / totalFaculty) * 100) : 0;

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.workload.title')} 
                subtitle="Faculty workload management, optimization, and efficiency tracking" 
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Total Faculty', value: totalFaculty.toString(), change: 0, label: t('faculty.allFaculty'), icon: <Users size={20} strokeWidth={1.5} /> },
                    { title: 'Avg Teaching Load', value: `${avgLoad}hrs`, change: 0, label: t('faculty.avgWorkload'), icon: <Clock size={20} strokeWidth={1.5} /> },
                    { title: 'Utilization Rate', value: `${utilizationPct}%`, change: 0, label: t('common.balanced'), icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                    { title: 'Overloaded Faculty', value: overloaded.toString(), change: 0, label: t('faculty.overloadedDescription'), icon: <AlertCircle size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Academic Workload Management
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Access requirements & utilization, credential audit, load optimization, cross-college balancing, and efficiency tracking through the submenu.
                </p>
            </div>
        </div>
    );
}
