'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import BarChartComponent from '@/components/charts/BarChart';
import { GraduationCap, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import { PROGRAMS_DATA, getViabilityMatrix } from '@/data/programs';
import { useColors } from '@/hooks/useColors';
import { useDateFilter, getDateAdjustments } from '@/context/DateFilterContext';

export default function ViabilityMatrix() {
    const colors = useColors();
    const { dateRange } = useDateFilter();
    const adjustments = getDateAdjustments(dateRange);

    const matrix = getViabilityMatrix();
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

    const programs = getPrograms();

    return (
        <div className="animate-fade-in">
            <Header title="Program Viability Matrix" subtitle="Programs categorized by enrollment, employability, and cost-efficiency" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <MetricCard title="Total Programs" value={Math.round(PROGRAMS_DATA.length * adjustments.value)} icon={<GraduationCap size={20} strokeWidth={1.5} />} />
                <MetricCard title="Viable Programs" value={viableCount} change={Math.round(adjustments.growth * 0.8)} changeLabel="vs last year" icon={<CheckCircle size={20} strokeWidth={1.5} />} />
                <MetricCard title="Portfolio Revenue" value={`$${(totalRevenue / 1000000).toFixed(1)}M`} change={Math.round(adjustments.growth * 0.6)} icon={<DollarSign size={20} strokeWidth={1.5} />} />
                <MetricCard title="Avg Viability" value={Math.round(avgViability + adjustments.growth * 0.3)} icon={<TrendingUp size={20} strokeWidth={1.5} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 sm:p-5 lg:col-span-2 rounded-xl card-hover" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Viability by Department <span className="text-xs ml-2 font-normal" style={{ color: colors.textSecondary }}>({dateRange})</span></h2>
                    <BarChartComponent data={chartData} xKey="name" bars={[
                        { dataKey: 'viable', color: '#22c55e', name: 'Viable' },
                        { dataKey: 'marginal', color: '#eab308', name: 'Marginal' },
                        { dataKey: 'atRisk', color: '#ef4444', name: 'At-Risk' },
                    ]} height={240} showLegend />
                </div>

                <div className="space-y-4">
                    {[
                        { label: 'Viable', count: viableCount, color: colors.successText, bg: colors.successBg, barColor: '#22c55e' },
                        { label: 'Marginal', count: marginalCount, color: colors.warningText, bg: colors.warningBg, barColor: '#eab308' },
                        { label: 'At-Risk', count: atRiskCount, color: colors.dangerText, bg: colors.dangerBg, barColor: '#ef4444' },
                    ].map((item) => (
                        <div key={item.label} className="p-4 rounded-xl card-hover" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{item.label}</span>
                                <span className="text-lg font-semibold" style={{ color: item.color }}>{item.count}</span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.isDark ? '#334155' : '#e2e8f0' }}>
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.count / PROGRAMS_DATA.length) * 100}%`, backgroundColor: item.barColor }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-xl card-hover" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <div className="px-4 sm:px-5 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>All Programs</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr style={{ backgroundColor: colors.tableHeader }}>
                                {['Program', 'Department', 'Enrollment', 'Revenue', 'Margin', 'Employment', 'Score', 'Status'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {programs.map(prog => {
                                const status = prog.viabilityScore >= 60 ? 'Viable' : prog.viabilityScore >= 40 ? 'Marginal' : 'At-Risk';
                                const statusStyle = status === 'Viable' ? { bg: colors.successBg, color: colors.successText }
                                    : status === 'Marginal' ? { bg: colors.warningBg, color: colors.warningText }
                                        : { bg: colors.dangerBg, color: colors.dangerText };

                                return (
                                    <tr key={prog.id} className="transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.tableHover}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td className="px-4 py-3 text-sm font-medium" style={{ color: colors.textPrimary }}>{prog.name}</td>
                                        <td className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{prog.department.split(' ')[0]}</td>
                                        <td className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{prog.enrollment}</td>
                                        <td className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>${(prog.revenue / 1000000).toFixed(2)}M</td>
                                        <td className="px-4 py-3 text-sm font-medium" style={{ color: prog.profitMargin >= 20 ? colors.successText : prog.profitMargin >= 0 ? colors.warningText : colors.dangerText }}>{prog.profitMargin}%</td>
                                        <td className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{prog.employmentRate}%</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.isDark ? '#334155' : '#e2e8f0' }}>
                                                    <div className="h-full rounded-full" style={{
                                                        width: `${prog.viabilityScore}%`,
                                                        backgroundColor: prog.viabilityScore >= 60 ? '#22c55e' : prog.viabilityScore >= 40 ? '#eab308' : '#ef4444'
                                                    }} />
                                                </div>
                                                <span className="text-xs" style={{ color: colors.textSecondary }}>{prog.viabilityScore}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-1 rounded-md font-medium" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>{status}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
