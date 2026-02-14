'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import BarChartComponent from '@/components/charts/BarChart';
import { GraduationCap, CheckCircle, DollarSign, TrendingUp, Users, BarChart3, TrendingDown } from 'lucide-react';
import { PROGRAMS_DATA, getViabilityMatrix } from '@/data/programs';
import { useColors } from '@/hooks/useColors';
import { useDateFilter, getDateAdjustments } from '@/context/DateFilterContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ViabilityMatrix() {
    const colors = useColors();
    const { dateRange } = useDateFilter();
    const adjustments = getDateAdjustments(dateRange);
    const { t, isRTL } = useLanguage();

    const matrix = getViabilityMatrix();
    const totalEnrollment = PROGRAMS_DATA.reduce((sum, p) => sum + p.enrollment, 0);
    const totalRevenue = PROGRAMS_DATA.reduce((sum, p) => sum + p.revenue, 0) * adjustments.value;
    const avgViability = PROGRAMS_DATA.reduce((sum, p) => sum + p.viabilityScore, 0) / PROGRAMS_DATA.length;

    const viableCount = Math.round(matrix.viable.length * adjustments.value);
    const marginalCount = Math.round(matrix.marginal.length * adjustments.variation);
    const atRiskCount = Math.round(matrix.atRisk.length * (2 - adjustments.value));

    const deptData = PROGRAMS_DATA.reduce((acc, prog) => {
        const dept = prog.department.split(' ')[0];
        if (!acc[dept]) acc[dept] = { viable: 0, marginal: 0, atRisk: 0 };
        if (prog.viabilityStatus === 'Viable') acc[dept].viable++;
        else if (prog.viabilityStatus === 'Marginal') acc[dept].marginal++;
        else acc[dept].atRisk++;
        return acc;
    }, {} as Record<string, { viable: number; marginal: number; atRisk: number }>);

    const chartData = Object.entries(deptData).map(([name, data]) => ({
        name,
        viable: Math.round(data.viable * adjustments.value),
        marginal: Math.round(data.marginal * adjustments.variation),
        atRisk: Math.round(data.atRisk * (2 - adjustments.value)),
    }));

    const getPrograms = () => {
        return PROGRAMS_DATA.map(prog => ({
            ...prog,
            enrollment: Math.round(prog.enrollment * adjustments.value),
            revenue: Math.round(prog.revenue * adjustments.value),
            profitMargin: Math.round(prog.profitMargin + adjustments.growth * 0.3),
            employmentRate: Math.min(99, Math.round(prog.employmentRate + adjustments.growth * 0.2)),
            viabilityScore: Math.min(100, Math.max(0, Math.round(prog.viabilityScore + adjustments.growth * 0.4))),
        }));
    };

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.programs.title')} 
                subtitle={t('sidebar.programs.dashboard')} 
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Total Programs', value: Math.round(PROGRAMS_DATA.length * adjustments.value), change: Math.round(adjustments.growth * 0.8), label: 'vs last year', icon: <GraduationCap size={20} strokeWidth={1.5} /> },
                    { title: 'Total Enrollment', value: Math.round(totalEnrollment).toLocaleString(), change: Math.round(adjustments.growth * 0.6), label: 'students', icon: <Users size={20} strokeWidth={1.5} /> },
                    { title: 'Viable Programs', value: viableCount, change: Math.round(adjustments.growth * 0.5), label: 'improvement', icon: <CheckCircle size={20} strokeWidth={1.5} /> },
                    { title: 'Portfolio Revenue', value: `$${(totalRevenue / 1000000).toFixed(1)}M`, change: Math.round(adjustments.growth * 0.7), label: 'annual', icon: <DollarSign size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-5 rounded-xl card-hover" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: colors.successBg }}>
                            <CheckCircle size={20} style={{ color: colors.successText }} />
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>Viable Programs</p>
                            <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>{viableCount}</p>
                        </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.isDark ? '#334155' : '#e2e8f0' }}>
                        <div className="h-full rounded-full" style={{ width: `${(viableCount / PROGRAMS_DATA.length) * 100}%`, backgroundColor: colors.success }} />
                    </div>
                </div>

                <div className="p-5 rounded-xl card-hover" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: colors.warningBg }}>
                            <BarChart3 size={20} style={{ color: colors.warningText }} />
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>Marginal Programs</p>
                            <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>{marginalCount}</p>
                        </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.isDark ? '#334155' : '#e2e8f0' }}>
                        <div className="h-full rounded-full" style={{ width: `${(marginalCount / PROGRAMS_DATA.length) * 100}%`, backgroundColor: colors.warning }} />
                    </div>
                </div>

                <div className="p-5 rounded-xl card-hover" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: colors.dangerBg }}>
                            <TrendingDown size={20} style={{ color: colors.dangerText }} />
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>At-Risk Programs</p>
                            <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>{atRiskCount}</p>
                        </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.isDark ? '#334155' : '#e2e8f0' }}>
                        <div className="h-full rounded-full" style={{ width: `${(atRiskCount / PROGRAMS_DATA.length) * 100}%`, backgroundColor: colors.danger }} />
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Academic Program Intelligence
                </h2>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                    Access detailed analytics through the submenu:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { label: 'Program Rationalization', desc: 'Data-driven program portfolio optimization' },
                        { label: 'Learning Sentiment', desc: 'Student feedback and satisfaction analysis' },
                        { label: 'Engagement Heatmaps', desc: 'Visual engagement patterns across programs' },
                        { label: 'Academic Advising', desc: 'Advising effectiveness and student guidance' },
                        { label: 'Portfolio Management', desc: 'Comprehensive program performance tracking' },
                        { label: 'Demand-Supply', desc: 'Market demand vs. program capacity analysis' },
                        { label: 'Class Size Optimization', desc: 'Optimal class sizes for learning outcomes' },
                    ].map((item, i) => (
                        <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: colors.isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${colors.border}` }}>
                            <p className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>{item.label}</p>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
