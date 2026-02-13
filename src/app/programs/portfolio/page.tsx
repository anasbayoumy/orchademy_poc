'use client';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import { useDateFilter, getDateAdjustments } from '@/context/DateFilterContext';
import MetricCard from '@/components/ui/MetricCard';
import BarChartComponent from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import { PROGRAMS_DATA, getViabilityMatrix, getScenarioSnapshots, getKPISummary, type ScenarioSnapshot } from '@/data/programs';
import { GraduationCap, CheckCircle, DollarSign, TrendingUp, Users, BarChart3, TrendingDown, XCircle, Merge, RefreshCw, Check, AlertTriangle, Target, ArrowUpRight, ArrowDownRight, Minus, Award, Trophy, FileText, Lightbulb } from 'lucide-react';

// ============================================
// TAB COMPONENT
// ============================================
type TabType = 'viability' | 'scenarios' | 'analytics' | 'kpi';

interface TabProps {
    id: TabType;
    label: string;
    isActive: boolean;
    onClick: () => void;
    colors: any;
}

function Tab({ id, label, isActive, onClick, colors }: TabProps) {
    return (
        <button
            onClick={onClick}
            className="px-6 py-3 text-sm font-medium transition-all relative"
            style={{
                color: isActive ? colors.accent : colors.textSecondary,
                borderBottom: isActive ? `2px solid ${colors.accent}` : '2px solid transparent',
                backgroundColor: isActive ? `${colors.accent}10` : 'transparent',
            }}
        >
            {label}
        </button>
    );
}

// ============================================
// VIABILITY MATRIX TAB
// ============================================
function ViabilityMatrixTab() {
    const { t } = useLanguage();
    const colors = useColors();
    const { dateRange } = useDateFilter();
    const adjustments = getDateAdjustments(dateRange);

    const matrix = getViabilityMatrix();
    const totalEnrollment = PROGRAMS_DATA.reduce((sum, p) => sum + p.enrollment, 0);
    const totalRevenue = PROGRAMS_DATA.reduce((sum, p) => sum + p.revenue, 0) * adjustments.value;

    const viableCount = Math.round(matrix.viable.length * adjustments.value);
    const marginalCount = Math.round(matrix.marginal.length * adjustments.variation);
    const atRiskCount = Math.round(matrix.atRisk.length * (2 - adjustments.value));

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Programs" value={Math.round(PROGRAMS_DATA.length * adjustments.value).toString()} change={Math.round(adjustments.growth * 0.8)} icon={<GraduationCap size={20} />} changeLabel="vs last year" />
                <MetricCard title="Total Enrollment" value={Math.round(totalEnrollment * adjustments.value).toLocaleString()} change={Math.round(adjustments.growth * 0.6)} icon={<Users size={20} />} changeLabel="students" />
                <MetricCard title="Viable Programs" value={viableCount.toString()} change={Math.round(adjustments.growth * 0.5)} icon={<CheckCircle size={20} />} changeLabel="improvement" />
                <MetricCard title="Portfolio Revenue" value={`$${(totalRevenue / 1000000).toFixed(1)}M`} change={Math.round(adjustments.growth * 0.7)} icon={<DollarSign size={20} />} changeLabel="annual" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
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

                <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
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

                <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
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

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>Academic Program Intelligence</h2>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>Access detailed analytics through the submenu:</p>
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

// ============================================
// SCENARIOS TAB
// ============================================
function ScenariosTab() {
    const { t } = useLanguage();
    const colors = useColors();
    const scenarios = getScenarioSnapshots();
    const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

    const toggleScenario = (id: string) => {
        setSelectedScenarios(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const getTypeIcon = (type: ScenarioSnapshot['type']) => {
        switch (type) {
            case 'Closure': return <XCircle size={18} />;
            case 'Merger': return <Merge size={18} />;
            case 'Expansion': return <TrendingUp size={18} />;
            case 'Restructure': return <RefreshCw size={18} />;
        }
    };

    const getTypeStyles = (type: ScenarioSnapshot['type']) => {
        if (colors.isDark) {
            switch (type) {
                case 'Closure': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' };
                case 'Merger': return { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15' };
                case 'Expansion': return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' };
                case 'Restructure': return { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' };
            }
        }
        switch (type) {
            case 'Closure': return { bg: '#fef2f2', text: '#dc2626' };
            case 'Merger': return { bg: '#fefce8', text: '#ca8a04' };
            case 'Expansion': return { bg: '#f0fdf4', text: '#16a34a' };
            case 'Restructure': return { bg: '#eff6ff', text: '#2563eb' };
        }
    };

    const getRiskStyles = (riskLevel: string) => {
        if (colors.isDark) {
            switch (riskLevel) {
                case 'Low': return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' };
                case 'Medium': return { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15' };
                case 'High': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' };
                default: return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8' };
            }
        }
        switch (riskLevel) {
            case 'Low': return { bg: '#f0fdf4', text: '#16a34a' };
            case 'Medium': return { bg: '#fefce8', text: '#ca8a04' };
            case 'High': return { bg: '#fef2f2', text: '#dc2626' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    const selectedScenariosData = selectedScenarios.map(id => scenarios.find(s => s.id === id)!);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {scenarios.map(scenario => {
                    const isSelected = selectedScenarios.includes(scenario.id);
                    const typeStyles = getTypeStyles(scenario.type);
                    const riskStyles = getRiskStyles(scenario.riskLevel);

                    return (
                        <div
                            key={scenario.id}
                            onClick={() => toggleScenario(scenario.id)}
                            className="rounded-xl cursor-pointer transition-all duration-200"
                            style={{
                                backgroundColor: colors.cardBg,
                            border: isSelected ? `2px solid ${colors.primary1}` : `1px solid ${colors.border}`,
                            boxShadow: isSelected ? `0 4px 20px ${colors.primary1}40` : undefined,
                                transform: isSelected ? 'scale(1.02)' : undefined,
                            }}
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200" style={{ backgroundColor: typeStyles.bg, color: typeStyles.text }}>
                                            {getTypeIcon(scenario.type)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{scenario.name}</p>
                                            <p className="text-xs" style={{ color: colors.textSecondary }}>{scenario.type}</p>
                                        </div>
                                    </div>
                                <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200" style={{ backgroundColor: isSelected ? colors.primary1 : 'transparent', borderColor: isSelected ? colors.primary1 : colors.border }}>
                                    {isSelected && <Check size={12} className="text-white" />}
                                </div>
                            </div>

                            <p className="text-xs mb-4 leading-relaxed" style={{ color: colors.textSecondary }}>{scenario.description}</p>

                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span style={{ color: colors.textSecondary }}>Savings</span>
                                    <span className="font-medium" style={{ color: scenario.projectedSavings > 0 ? colors.successText : colors.dangerText }}>
                                        {scenario.projectedSavings > 0 ? '+' : ''}${(scenario.projectedSavings / 1000).toFixed(0)}K
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span style={{ color: colors.textSecondary }}>Revenue Impact</span>
                                    <span className="font-medium" style={{ color: scenario.projectedRevenueLoss <= 0 ? colors.successText : colors.dangerText }}>
                                        {scenario.projectedRevenueLoss > 0 ? '-' : '+'}${(Math.abs(scenario.projectedRevenueLoss) / 1000).toFixed(0)}K
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2" style={{ borderTop: `1px solid ${colors.border}` }}>
                                    <span className="font-medium" style={{ color: colors.textPrimary }}>Net Impact</span>
                                    <span className="font-bold" style={{ color: scenario.netImpact >= 0 ? colors.successText : colors.dangerText }}>
                                        {scenario.netImpact >= 0 ? '+' : ''}${(scenario.netImpact / 1000).toFixed(0)}K
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: riskStyles.bg, color: riskStyles.text }}>
                                        {scenario.riskLevel} Risk
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.isDark ? 'rgba(148, 163, 184, 0.15)' : '#f1f5f9', color: colors.textSecondary }}>
                                        {scenario.affectedPrograms.length} programs
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedScenarios.length >= 2 ? (
                <div className="rounded-xl overflow-hidden shadow-sm border animate-fadeIn" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.tableHeader }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accentBg }}>
                            <BarChart3 size={16} style={{ color: colors.accent }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Scenario Comparison</h2>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>Comparing {selectedScenarios.length} scenarios</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ backgroundColor: colors.tableHeader }}>
                                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Metric</th>
                                    {selectedScenariosData.map(scenario => {
                                        const typeStyles = getTypeStyles(scenario.type);
                                        return (
                                            <th key={scenario.id} className="text-left px-6 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: typeStyles.bg, color: typeStyles.text }}>
                                                        {getTypeIcon(scenario.type)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{scenario.name}</p>
                                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{scenario.type}</p>
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={14} style={{ color: colors.textSecondary }} />
                                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Projected Savings</span>
                                        </div>
                                    </td>
                                    {selectedScenariosData.map(scenario => {
                                        const isPositive = scenario.projectedSavings > 0;
                                        return (
                                            <td key={scenario.id} className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: isPositive ? colors.successBg : colors.dangerBg }}>
                                                        {isPositive ? <ArrowUpRight size={12} style={{ color: colors.successText }} /> : <ArrowDownRight size={12} style={{ color: colors.dangerText }} />}
                                                    </div>
                                                    <span className="text-sm font-semibold" style={{ color: isPositive ? colors.successText : colors.dangerText }}>
                                                        {isPositive ? '+' : ''}${(scenario.projectedSavings / 1000).toFixed(0)}K
                                                    </span>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                                <tr style={{ backgroundColor: colors.tableHeader }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 size={14} style={{ color: colors.textSecondary }} />
                                            <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>Net Impact</span>
                                        </div>
                                    </td>
                                    {selectedScenariosData.map(scenario => {
                                        const isPositive = scenario.netImpact >= 0;
                                        return (
                                            <td key={scenario.id} className="px-6 py-4">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: isPositive ? colors.successBg : colors.dangerBg }}>
                                                    {isPositive ? <ArrowUpRight size={16} style={{ color: colors.successText }} /> : <ArrowDownRight size={16} style={{ color: colors.dangerText }} />}
                                                    <span className="text-base font-bold" style={{ color: isPositive ? colors.successText : colors.dangerText }}>
                                                        {isPositive ? '+' : ''}${(scenario.netImpact / 1000).toFixed(0)}K
                                                    </span>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.border}`, backgroundColor: colors.tableHeader }}>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>{selectedScenarios.length} scenarios selected for comparison</p>
                        <button onClick={() => setSelectedScenarios([])} className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: colors.accent, backgroundColor: colors.accentBg }}>
                            Clear Selection
                        </button>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl p-12 text-center shadow-sm border animate-fadeIn" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.accentBg }}>
                        <BarChart3 size={28} style={{ color: colors.accent }} />
                    </div>
                    <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>Compare Scenarios</h3>
                    <p className="text-xs max-w-xs mx-auto" style={{ color: colors.textSecondary }}>
                        Select 2 or more scenarios above to see a detailed side-by-side comparison of their projected impacts.
                    </p>
                </div>
            )}
        </div>
    );
}

// ============================================
// ANALYTICS TAB
// ============================================
function AnalyticsTab() {
    const { t } = useLanguage();
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
        color: level === 'Bachelor' ? colors.primary1 : level === 'Master' ? colors.success : level === 'Doctorate' ? colors.warning : colors.danger,
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
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Enrollment" value={totalEnrollment.toLocaleString()} change={12} icon={<Users size={20} />} changeLabel="vs last year" />
                <MetricCard title="Total Revenue" value={`$${(totalRevenue / 1000000).toFixed(1)}M`} change={8} icon={<DollarSign size={20} />} changeLabel="annual" />
                <MetricCard title="Avg Profit Margin" value={`${avgProfitMargin.toFixed(1)}%`} change={5} icon={<TrendingUp size={20} />} changeLabel="portfolio" />
                <MetricCard title="Net Profit" value={`$${((totalRevenue - totalCost) / 1000000).toFixed(1)}M`} icon={<Award size={20} />} changeLabel="after costs" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="rounded-xl p-5 shadow-sm border lg:col-span-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Revenue vs Cost by Department (in $M)</h2>
                    <BarChartComponent data={revenueChartData} xKey="name" bars={[
                        { dataKey: 'revenue', color: colors.success, name: 'Revenue' },
                        { dataKey: 'cost', color: colors.danger, name: 'Cost' },
                    ]} height={240} showLegend />
                </div>

                <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border, minHeight: '280px' }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Enrollment by Degree</h2>
                    <div className="h-[220px]">
                        <DonutChart data={degreeData} height={220} innerRadius={50} outerRadius={80} />
                    </div>
                </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.tableHeader }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accentBg }}>
                            <Trophy size={16} style={{ color: colors.accent }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Top Performing Programs</h2>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>Ranked by profit margin</p>
                        </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: colors.successBg, color: colors.successText }}>Top 5</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ backgroundColor: colors.tableHeader }}>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Rank</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Program</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Enrollment</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Revenue</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Profit Margin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topPrograms.map((prog, idx) => {
                                const rankStyles = getRankStyles(idx);
                                const maxMargin = Math.max(...topPrograms.map(p => p.profitMargin));
                                const barWidth = (prog.profitMargin / maxMargin) * 100;

                                return (
                                    <tr key={prog.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                        <td className="px-6 py-4">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: rankStyles.bg, color: rankStyles.text }}>
                                                {idx < 3 ? (idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉') : idx + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{prog.name}</p>
                                                <p className="text-xs" style={{ color: colors.textSecondary }}>{prog.department}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{prog.enrollment.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-medium" style={{ color: colors.successText }}>${(prog.revenue / 1000000).toFixed(1)}M</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 min-w-[140px]">
                                                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.isDark ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7' }}>
                                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barWidth}%`, backgroundColor: colors.successIcon }} />
                                                </div>
                                                <span className="text-sm font-bold min-w-[45px] text-right" style={{ color: colors.successText }}>{prog.profitMargin}%</span>
                                            </div>
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

// ============================================
// KPI REPORT TAB
// ============================================
function KPIReportTab() {
    const { t } = useLanguage();
    const colors = useColors();
    const kpis = getKPISummary();

    const getStatusStyles = (status: string) => {
        if (colors.isDark) {
            switch (status) {
                case 'On Track': return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' };
                case 'At Risk': return { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15' };
                default: return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' };
            }
        }
        switch (status) {
            case 'On Track': return { bg: '#f0fdf4', text: '#16a34a' };
            case 'At Risk': return { bg: '#fefce8', text: '#ca8a04' };
            default: return { bg: '#fef2f2', text: '#dc2626' };
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map((kpi) => {
                    const statusStyles = getStatusStyles(kpi.status);
                    return (
                        <div key={kpi.metric} className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: colors.textSecondary }}>{kpi.metric}</p>
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: statusStyles.bg, color: statusStyles.text }}>
                                    {kpi.status}
                                </span>
                            </div>

                            <p className="text-2xl font-semibold mb-1" style={{ color: colors.textPrimary }}>{kpi.value}</p>

                            <div className="flex items-center gap-2 mb-3">
                                {kpi.trend === 'up' && <TrendingUp size={14} style={{ color: colors.successText }} />}
                                {kpi.trend === 'down' && <TrendingDown size={14} style={{ color: colors.dangerText }} />}
                                {kpi.trend === 'stable' && <Minus size={14} style={{ color: colors.textSecondary }} />}
                                <span className="text-xs" style={{ color: colors.textSecondary }}>Target: {kpi.target}</span>
                            </div>

                            <p className="text-xs p-3 rounded-lg" style={{ backgroundColor: colors.tableHeader, color: colors.textSecondary }}>
                                {kpi.insight}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <div className="flex items-center gap-2 mb-4">
                    <FileText size={16} style={{ color: colors.accent }} />
                    <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Executive Summary</h2>
                </div>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                    The academic portfolio shows strong overall performance with revenue growth of 8% year-over-year. STEM programs continue to lead in enrollment and employment outcomes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.successBg }}>
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={16} style={{ color: colors.successText }} />
                            <span className="text-sm font-medium" style={{ color: colors.successText }}>Strengths</span>
                        </div>
                        <ul className="text-xs space-y-1" style={{ color: colors.successText }}>
                            <li>• STEM programs showing highest growth rates</li>
                            <li>• Graduate employment outcomes improving</li>
                            <li>• Enrollment targets met for 80% of programs</li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.warningBg }}>
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={16} style={{ color: colors.warningText }} />
                            <span className="text-sm font-medium" style={{ color: colors.warningText }}>Areas for Attention</span>
                        </div>
                        <ul className="text-xs space-y-1" style={{ color: colors.warningText }}>
                            <li>• Several Arts & Humanities programs at risk</li>
                            <li>• Cost per student rising in Healthcare</li>
                            <li>• Enrollment declining in Certificate programs</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={16} style={{ color: colors.accent }} />
                    <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Recommendations</h2>
                </div>
                <div className="space-y-3">
                    {[
                        { title: 'Review At-Risk Programs', desc: 'Conduct strategic review of programs with viability scores below 40.' },
                        { title: 'Expand High-Performers', desc: 'Increase capacity in Computer Science and Data Science programs.' },
                        { title: 'Strengthen Partnerships', desc: 'Develop co-op programs with top employers to improve outcomes.' },
                    ].map((rec, idx) => (
                        <div key={idx} className="flex gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.tableHeader }}>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0" style={{ backgroundColor: colors.accentBg, color: colors.accent }}>
                                {idx + 1}
                            </div>
                            <div>
                                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{rec.title}</p>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>{rec.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function ProgramPortfolioPage() {
    const { t } = useLanguage();
    const colors = useColors();
    const [activeTab, setActiveTab] = useState<TabType>('viability');

    const tabs: { id: TabType; label: string }[] = [
        { id: 'viability', label: t('programs.viabilityMatrix') },
        { id: 'scenarios', label: t('programs.scenarios') },
        { id: 'analytics', label: t('programs.analytics') },
        { id: 'kpi', label: t('programs.kpiReport') },
    ];

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: colors.bgPrimary }}>
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                        {t('programs.portfolioManagement')}
                    </h1>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                        {t('programs.portfolioDescription')}
                    </p>
                </div>

                <div className="rounded-xl shadow-sm border overflow-hidden" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="flex border-b" style={{ borderColor: colors.border }}>
                        {tabs.map(tab => (
                            <Tab
                                key={tab.id}
                                id={tab.id}
                                label={tab.label}
                                isActive={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                colors={colors}
                            />
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'viability' && <ViabilityMatrixTab />}
                        {activeTab === 'scenarios' && <ScenariosTab />}
                        {activeTab === 'analytics' && <AnalyticsTab />}
                        {activeTab === 'kpi' && <KPIReportTab />}
                    </div>
                </div>
            </div>
        </div>
    );
}
