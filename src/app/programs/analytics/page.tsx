'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import BarChartComponent from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import { Users, DollarSign, TrendingUp, Award, Trophy } from 'lucide-react';
import { PROGRAMS_DATA } from '@/data/programs';
import { useColors } from '@/hooks/useColors';

export default function ProgramAnalytics() {
    const colors = useColors();
    const totalEnrollment = PROGRAMS_DATA.reduce((sum, p) => sum + p.enrollment, 0);
    const totalRevenue = PROGRAMS_DATA.reduce((sum, p) => sum + p.revenue, 0);
    const totalCost = PROGRAMS_DATA.reduce((sum, p) => sum + p.cost, 0);
    const avgProfitMargin = PROGRAMS_DATA.reduce((sum, p) => sum + p.profitMargin, 0) / PROGRAMS_DATA.length;

    const deptStats = PROGRAMS_DATA.reduce((acc, prog) => {
        const dept = prog.department.split(' ')[0];
        if (!acc[dept]) acc[dept] = { revenue: 0, cost: 0 };
        acc[dept].revenue += prog.revenue;
        acc[dept].cost += prog.cost;
        return acc;
    }, {} as Record<string, { revenue: number; cost: number }>);

    const revenueChartData = Object.entries(deptStats).map(([name, data]) => ({
        name,
        revenue: Math.round(data.revenue / 1000000 * 10) / 10,
        cost: Math.round(data.cost / 1000000 * 10) / 10,
    }));

    const degreeData = ['Bachelor', 'Master', 'Doctorate', 'Certificate'].map(level => ({
        name: level,
        value: PROGRAMS_DATA.filter(p => p.degreeLevel === level).reduce((sum, p) => sum + p.enrollment, 0),
        color: level === 'Bachelor' ? '#6366f1' : level === 'Master' ? '#22c55e' : level === 'Doctorate' ? '#eab308' : '#ef4444',
    }));

    const topPrograms = [...PROGRAMS_DATA].sort((a, b) => b.profitMargin - a.profitMargin).slice(0, 5);

    const getRankStyles = (idx: number) => {
        if (colors.isDark) {
            if (idx === 0) return { bg: 'rgba(234, 179, 8, 0.2)', text: '#facc15' };
            if (idx === 1) return { bg: 'rgba(148, 163, 184, 0.2)', text: '#cbd5e1' };
            if (idx === 2) return { bg: 'rgba(180, 83, 9, 0.2)', text: '#fbbf24' };
            return { bg: 'rgba(148, 163, 184, 0.15)', text: colors.textSecondary };
        }
        if (idx === 0) return { bg: '#fef3c7', text: '#b45309' };
        if (idx === 1) return { bg: '#e2e8f0', text: '#475569' };
        if (idx === 2) return { bg: '#fed7aa', text: '#c2410c' };
        return { bg: '#f1f5f9', text: '#64748b' };
    };

    return (
        <div className="animate-fade-in">
            <Header
                title="Program Analytics Dashboard"
                subtitle="Program size, cost, revenue, and performance overview"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                    title="Total Enrollment"
                    value={totalEnrollment.toLocaleString()}
                    change={12}
                    changeLabel="vs last year"
                    icon={<Users size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title="Total Revenue"
                    value={`$${(totalRevenue / 1000000).toFixed(1)}M`}
                    change={8}
                    icon={<DollarSign size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title="Avg Profit Margin"
                    value={`${avgProfitMargin.toFixed(1)}%`}
                    change={5}
                    icon={<TrendingUp size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title="Net Profit"
                    value={`$${((totalRevenue - totalCost) / 1000000).toFixed(1)}M`}
                    icon={<Award size={20} strokeWidth={1.5} />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div
                    className="rounded-xl p-4 sm:p-5 lg:col-span-2 order-2 lg:order-1"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Revenue vs Cost by Department (in $M)</h2>
                    <BarChartComponent
                        data={revenueChartData}
                        xKey="name"
                        bars={[
                            { dataKey: 'revenue', color: '#22c55e', name: 'Revenue' },
                            { dataKey: 'cost', color: '#ef4444', name: 'Cost' },
                        ]}
                        height={240}
                        showLegend
                    />
                </div>

                <div
                    className="rounded-xl p-4 sm:p-5 order-1 lg:order-2"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, minHeight: '280px' }}
                >
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Enrollment by Degree</h2>
                    <div className="h-[220px] sm:h-[200px]">
                        <DonutChart data={degreeData} height={220} innerRadius={50} outerRadius={80} />
                    </div>
                </div>
            </div>

            <div
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
            >
                {/* Header */}
                <div
                    className="px-6 py-4 flex items-center justify-between"
                    style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.tableHeader }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: colors.accentBg }}
                        >
                            <Trophy size={16} style={{ color: colors.accent }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Top Performing Programs</h2>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>Ranked by profit margin</p>
                        </div>
                    </div>
                    <span
                        className="px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: colors.successBg, color: colors.successText }}
                    >
                        Top 5
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ backgroundColor: colors.tableHeader }}>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>
                                    Rank
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>
                                    Program
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>
                                    Enrollment
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>
                                    Revenue
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>
                                    Cost
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>
                                    Profit Margin
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {topPrograms.map((prog, idx) => {
                                const rankStyles = getRankStyles(idx);
                                const maxMargin = Math.max(...topPrograms.map(p => p.profitMargin));
                                const barWidth = (prog.profitMargin / maxMargin) * 100;

                                return (
                                    <tr
                                        key={prog.id}
                                        className="transition-colors"
                                        style={{ borderBottom: `1px solid ${colors.border}` }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.tableHover}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td className="px-6 py-4">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                                style={{ backgroundColor: rankStyles.bg, color: rankStyles.text }}
                                            >
                                                {idx < 3 ? (
                                                    idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'
                                                ) : (
                                                    idx + 1
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{prog.name}</p>
                                                <p className="text-xs" style={{ color: colors.textSecondary }}>{prog.department}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                                {prog.enrollment.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-medium" style={{ color: colors.successText }}>
                                                ${(prog.revenue / 1000000).toFixed(1)}M
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-medium" style={{ color: colors.dangerText }}>
                                                ${(prog.cost / 1000000).toFixed(1)}M
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 min-w-[140px]">
                                                <div
                                                    className="flex-1 h-2 rounded-full overflow-hidden"
                                                    style={{ backgroundColor: colors.isDark ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7' }}
                                                >
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${barWidth}%`,
                                                            backgroundColor: colors.successIcon
                                                        }}
                                                    />
                                                </div>
                                                <span
                                                    className="text-sm font-bold min-w-[45px] text-right"
                                                    style={{ color: colors.successText }}
                                                >
                                                    {prog.profitMargin}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div
                    className="px-6 py-3 flex items-center justify-between"
                    style={{ borderTop: `1px solid ${colors.border}`, backgroundColor: colors.tableHeader }}
                >
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Showing top 5 of {PROGRAMS_DATA.length} programs
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.successIcon }} />
                            <span className="text-xs" style={{ color: colors.textSecondary }}>Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.dangerIcon }} />
                            <span className="text-xs" style={{ color: colors.textSecondary }}>Cost</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
