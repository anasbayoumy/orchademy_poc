'use client';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { Target, CheckCircle, Users, Activity } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function NormativeTargetsPage() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.efficiency.normativeTargets')} 
                subtitle="Target student-faculty ratio, advisor caseload, and staff per manager benchmarks (PLN-12, PLN-13, PLN-14)"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Target Student-Faculty', value: '20:1', change: 0, label: 'benchmark', icon: <Target size={20} strokeWidth={1.5} /> },
                    { title: 'Target Advisor Caseload', value: '45', change: 0, label: 'standard', icon: <Users size={20} strokeWidth={1.5} /> },
                    { title: 'Staff per Manager', value: '6:1', change: 0, label: 'normative', icon: <Activity size={20} strokeWidth={1.5} /> },
                    { title: 'Compliance Rate', value: '88%', change: 4, label: 'vs targets', icon: <CheckCircle size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>Normative Targets & Controls</h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Establish and monitor normative targets for student-faculty ratios, advisor caseloads, and managerial spans of control to maintain operational standards.
                </p>
            </div>
        </div>
    );
}
