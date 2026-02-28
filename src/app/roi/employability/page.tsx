'use client';
import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import MetricCard from '@/components/ui/MetricCard';
import DataTable from '@/components/ui/DataTable';
import BarChartComponent from '@/components/charts/BarChart';
import LineChartComponent from '@/components/charts/LineChart';
import { EMPLOYABILITY_DATA, getSkillAlignmentData, getImpactMetrics, getEmployerFeedback, type EmployabilityMetric } from '@/data/employability';
import OBF_01 from '@/data/KPIs/OBF-01';
import { Briefcase, DollarSign, Users, Star, CheckCircle, AlertTriangle, TrendingUp, ThumbsUp, AlertCircle, Network, List, Target, Info, XCircle, Sparkles, RotateCcw } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

const obf01 = OBF_01 as any;

// ============================================
// TAB COMPONENT
// ============================================
type TabType = 'scorecard' | 'skills' | 'impact' | 'obef';

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

function getStatusColor(colors: any, status: string) {
    switch (status) {
        case 'green': return colors.successText;
        case 'amber': return colors.warningText;
        case 'red': return colors.dangerText;
        default: return colors.textSecondary;
    }
}

function getStatusBg(colors: any, status: string) {
    switch (status) {
        case 'green': return colors.successBg;
        case 'amber': return colors.warningBg;
        case 'red': return colors.dangerBg;
        default: return colors.cardBg;
    }
}

// ============================================
// SCORECARD TAB
// ============================================
function ScorecardTab() {
    const { t } = useLanguage();
    const colors = useColors();

    const m = obf01?.institutionalMetrics;
    const avgEmploymentRate = m?.employmentRate1YPct ?? EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.employmentRate, 0) / EMPLOYABILITY_DATA.length;
    const avgSalary = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.avgStartingSalary, 0) / EMPLOYABILITY_DATA.length;
    const totalGraduates = m?.totalGraduates ?? EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.graduateCount, 0);
    const avgSatisfaction = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.employerSatisfaction, 0) / EMPLOYABILITY_DATA.length;

    const chartData = (obf01?.programData ?? EMPLOYABILITY_DATA).map((e: any) => ({
        name: (e.programName || e.name || '').split(' ').slice(0, 2).join(' ') || 'Program',
        rate: e.employmentRate1YPct ?? e.employmentRate ?? 0,
    }));

    const useOBF = obf01?.programData?.length > 0;
    const tableData = useOBF ? obf01.programData : EMPLOYABILITY_DATA;
    const columns = useOBF
        ? [
            { key: 'programName', header: t('programs.programName') },
            { key: 'college', header: t('faculty.dept') },
            { key: 'totalGraduates', header: t('employability.totalGraduates') },
            {
                key: 'employmentRate1YPct',
                header: t('programs.employment'),
                render: (item: any) => {
                    const rate = item.employmentRate1YPct ?? 0;
                    const status = item.status ?? 'amber';
                    return (
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceBg }}>
                                <div className="h-full" style={{ width: `${Math.min(rate, 100)}%`, backgroundColor: status === 'green' ? colors.successText : status === 'red' ? colors.dangerText : colors.warningText }} />
                            </div>
                            <span className="text-xs" style={{ color: getStatusColor(colors, status) }}>{rate.toFixed(1)}%</span>
                        </div>
                    );
                },
            },
            {
                key: 'status',
                header: 'Status',
                render: (item: any) => {
                    const s = item.status ?? 'amber';
                    return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: getStatusBg(colors, s), color: getStatusColor(colors, s) }}>
                            {s === 'green' ? <CheckCircle size={12} /> : s === 'red' ? <XCircle size={12} /> : <AlertCircle size={12} />}
                            {s.toUpperCase()}
                        </span>
                    );
                },
            },
        ]
        : [
            { key: 'programName', header: t('programs.programName') },
            { key: 'department', header: t('faculty.dept') },
            {
                key: 'employmentRate',
                header: t('programs.employment'),
                render: (item: EmployabilityMetric) => (
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceBg }}>
                            <div className="h-full" style={{ width: `${item.employmentRate}%`, backgroundColor: item.employmentRate >= 85 ? colors.successText : item.employmentRate >= 70 ? colors.warningText : colors.dangerText }} />
                        </div>
                        <span className="text-xs">{item.employmentRate}%</span>
                    </div>
                )
            },
            { key: 'avgTimeToEmployment', header: t('employability.timeToEmploy'), render: (item: EmployabilityMetric) => `${item.avgTimeToEmployment} mo` },
            { key: 'avgStartingSalary', header: t('employability.avgSalary'), render: (item: EmployabilityMetric) => `$${(item.avgStartingSalary / 1000).toFixed(0)}K` },
            { key: 'employerSatisfaction', header: t('employability.rating'), render: (item: EmployabilityMetric) => <div className="flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /><span>{item.employerSatisfaction.toFixed(1)}</span></div> },
            { key: 'graduateCount', header: t('employability.totalGraduates') },
        ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title={t('employability.employmentRate')} value={`${avgEmploymentRate.toFixed(1)}%`} change={4} icon={<Briefcase size={20} />} changeLabel={t('common.vsLastYear')} />
                <MetricCard title={t('employability.avgSalary')} value={`$${(avgSalary / 1000).toFixed(0)}K`} change={8} icon={<DollarSign size={20} />} changeLabel="annual" />
                <MetricCard title={t('employability.totalGraduates')} value={totalGraduates.toString()} change={12} icon={<Users size={20} />} changeLabel="graduates" />
                <MetricCard title={t('employability.employerRating')} value={`${avgSatisfaction.toFixed(1)}/5`} change={3} icon={<Star size={20} />} changeLabel="satisfaction" />
            </div>

            <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>{t('employability.employmentRateByProgram')}</h2>
                <BarChartComponent data={chartData} xKey="name" bars={[{ dataKey: 'rate', color: colors.primary1, name: t('dashboard.employmentRate') }]} height={200} />
            </div>

            <div>
                <h2 className="text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>{t('employability.programScorecard')}</h2>
                <DataTable data={tableData} columns={columns} searchPlaceholder={t('common.search')} pageSize={10} />
            </div>
        </div>
    );
}

// ============================================
// SKILLS MAP TAB
// ============================================
const MARKET_TARGET: Record<string, number> = { High: 85, Medium: 70, Low: 50 };

function SkillsMapTab() {
    const { t } = useLanguage();
    const colors = useColors();
    const baselineSkills = getSkillAlignmentData();
    const [skillsView, setSkillsView] = useState<'radar' | 'list' | 'scenarios'>('radar');
    const [adjustedCoverage, setAdjustedCoverage] = useState<Record<string, number>>({});

    const getCoverage = (skill: string, baseline: number) => adjustedCoverage[skill] ?? baseline;

    const skillsWithAdjusted = useMemo(() => {
        return baselineSkills.map(s => {
            const cov = getCoverage(s.skill, s.curriculumCoverage);
            const target = MARKET_TARGET[s.marketDemand] ?? 75;
            const gap = cov - target;
            return { ...s, curriculumCoverage: cov, gap };
        });
    }, [baselineSkills, adjustedCoverage]);

    const alignedSkills = skillsWithAdjusted.filter(s => Math.abs(s.gap) <= 10);
    const gapSkills = skillsWithAdjusted.filter(s => s.gap < -10);
    const highDemandSkills = skillsWithAdjusted.filter(s => s.marketDemand === 'High');

    const chartData = skillsWithAdjusted.slice(0, 8).map(s => ({
        name: s.skill.split(' ')[0],
        coverage: s.curriculumCoverage,
    }));

    const radarData = skillsWithAdjusted.slice(0, 8).map(s => ({
        skill: s.skill.length > 15 ? s.skill.substring(0, 15) + '...' : s.skill,
        curriculum: s.curriculumCoverage,
        market: s.marketDemand === 'High' ? 90 : s.marketDemand === 'Medium' ? 65 : 40,
    }));

    const baselineGapCount = baselineSkills.filter(s => (s.curriculumCoverage - (MARKET_TARGET[s.marketDemand] ?? 75)) < -10).length;
    const baselineAlignedCount = baselineSkills.filter(s => Math.abs((s.curriculumCoverage - (MARKET_TARGET[s.marketDemand] ?? 75))) <= 10).length;
    const projectedEmploymentDelta = useMemo(() => {
        const gapsClosed = baselineGapCount - gapSkills.length;
        const avgCoverageBoost = skillsWithAdjusted.reduce((sum, s, i) => sum + (s.curriculumCoverage - baselineSkills[i].curriculumCoverage), 0) / skillsWithAdjusted.length;
        return Math.round((gapsClosed * 1.2 + Math.max(0, avgCoverageBoost) * 0.15) * 10) / 10;
    }, [baselineGapCount, gapSkills.length, skillsWithAdjusted, baselineSkills]);
    const projectedSkillsMatch = useMemo(() => {
        const avgCoverage = skillsWithAdjusted.reduce((s, sk) => s + sk.curriculumCoverage, 0) / skillsWithAdjusted.length;
        return Math.min(98, Math.round(avgCoverage * 0.85));
    }, [skillsWithAdjusted]);

    const getDemandStyles = (demand: string) => {
        if (colors.isDark) {
            switch (demand) {
                case 'High': return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' };
                case 'Medium': return { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15' };
                default: return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8' };
            }
        }
        switch (demand) {
            case 'High': return { bg: '#f0fdf4', text: '#16a34a' };
            case 'Medium': return { bg: '#fefce8', text: '#ca8a04' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    const resetScenarios = () => setAdjustedCoverage({});
    const hasChanges = Object.keys(adjustedCoverage).length > 0;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl p-5 flex items-center gap-4 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.successBg }}>
                        <CheckCircle size={20} style={{ color: colors.successText }} />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>{alignedSkills.length}</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Well-Aligned</p>
                    </div>
                </div>
                <div className="rounded-xl p-5 flex items-center gap-4 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.dangerBg }}>
                        <AlertTriangle size={20} style={{ color: colors.dangerText }} />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>{gapSkills.length}</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Skills Gaps</p>
                    </div>
                </div>
                <div className="rounded-xl p-5 flex items-center gap-4 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accentBg }}>
                        <TrendingUp size={20} style={{ color: colors.accent }} />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>{highDemandSkills.length}</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>High Demand</p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Skills Analysis</h2>
                    <div className="flex gap-2 p-1 rounded-lg" style={{ backgroundColor: colors.isDark ? '#1e293b' : '#f1f5f9' }}>
                        <button
                            onClick={() => setSkillsView('radar')}
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
                            style={{ backgroundColor: skillsView === 'radar' ? colors.accent : 'transparent', color: skillsView === 'radar' ? '#ffffff' : colors.textSecondary }}
                        >
                            <Network size={14} />
                            Radar View
                        </button>
                        <button
                            onClick={() => setSkillsView('list')}
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
                            style={{ backgroundColor: skillsView === 'list' ? colors.accent : 'transparent', color: skillsView === 'list' ? '#ffffff' : colors.textSecondary }}
                        >
                            <List size={14} />
                            List View
                        </button>
                        <button
                            onClick={() => setSkillsView('scenarios')}
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
                            style={{ backgroundColor: skillsView === 'scenarios' ? colors.accent : 'transparent', color: skillsView === 'scenarios' ? '#ffffff' : colors.textSecondary }}
                        >
                            <Sparkles size={14} />
                            Scenarios
                        </button>
                    </div>
                </div>

                {skillsView === 'radar' ? (
                    <div style={{ height: 480 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData} cy="45%" outerRadius="70%">
                                <PolarGrid stroke={colors.isDark ? '#334155' : '#e2e8f0'} />
                                <PolarAngleAxis dataKey="skill" tick={{ fill: colors.textSecondary, fontSize: 12 }} />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: colors.textSecondary, fontSize: 10 }} />
                                <Radar name="Curriculum Coverage" dataKey="curriculum" stroke={colors.primary1} fill={colors.primary1} fillOpacity={0.5} />
                                <Radar name="Market Demand" dataKey="market" stroke={colors.success} fill={colors.success} fillOpacity={0.3} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '10px' }} formatter={(value) => <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{value}</span>} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                ) : skillsView === 'list' ? (
                    <BarChartComponent data={chartData} xKey="name" bars={[{ dataKey: 'coverage', color: colors.primary1, name: 'Coverage %' }]} height={220} />
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles size={20} style={{ color: colors.accent }} />
                                <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>What-If Scenarios</h3>
                            </div>
                            {hasChanges && (
                                <button onClick={resetScenarios} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}>
                                    <RotateCcw size={14} />
                                    Reset to baseline
                                </button>
                            )}
                        </div>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                            Adjust curriculum coverage sliders to simulate &quot;what if we increased [skill]&quot; and see projected impact on employment and skills alignment.
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="rounded-lg p-4" style={{ backgroundColor: colors.accentBg, border: `1px solid ${colors.accent}40` }}>
                                <p className="text-xs font-semibold mb-1" style={{ color: colors.textSecondary }}>Projected Employment Rate</p>
                                <p className="text-xl font-bold" style={{ color: projectedEmploymentDelta >= 0 ? colors.successText : colors.dangerText }}>
                                    {projectedEmploymentDelta >= 0 ? '+' : ''}{projectedEmploymentDelta}%
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>vs baseline (closing gaps + coverage boost)</p>
                            </div>
                            <div className="rounded-lg p-4" style={{ backgroundColor: colors.successBg, border: `1px solid ${colors.successText}40` }}>
                                <p className="text-xs font-semibold mb-1" style={{ color: colors.textSecondary }}>Skills Gaps Closed</p>
                                <p className="text-xl font-bold" style={{ color: colors.successText }}>{baselineGapCount - gapSkills.length}</p>
                                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>from {baselineGapCount} → {gapSkills.length}</p>
                            </div>
                            <div className="rounded-lg p-4" style={{ backgroundColor: colors.infoBg, border: `1px solid ${colors.infoText}40` }}>
                                <p className="text-xs font-semibold mb-1" style={{ color: colors.textSecondary }}>Projected Skills Match</p>
                                <p className="text-xl font-bold" style={{ color: colors.infoText }}>{projectedSkillsMatch}%</p>
                                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>employer-aligned (based on coverage)</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {skillsWithAdjusted.map((s) => {
                                const baseline = baselineSkills.find(b => b.skill === s.skill)?.curriculumCoverage ?? s.curriculumCoverage;
                                const isChanged = (adjustedCoverage[s.skill] ?? baseline) !== baseline;
                                const demandStyles = getDemandStyles(s.marketDemand);
                                return (
                                    <div key={s.skill} className="p-4 rounded-lg" style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}` }}>
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{s.skill}</span>
                                                <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: demandStyles.bg, color: demandStyles.text }}>{s.marketDemand} demand</span>
                                                {isChanged && <span className="text-xs" style={{ color: colors.successText }}>(adjusted)</span>}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs" style={{ color: colors.textSecondary }}>Baseline: {baseline}%</span>
                                                <span className="text-sm font-semibold" style={{ color: getCoverage(s.skill, baseline) >= (MARKET_TARGET[s.marketDemand] ?? 75) ? colors.successText : colors.dangerText }}>
                                                    {getCoverage(s.skill, baseline)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min={0}
                                                max={100}
                                                value={getCoverage(s.skill, baseline)}
                                                onChange={(e) => setAdjustedCoverage(prev => ({ ...prev, [s.skill]: Number(e.target.value) }))}
                                                className="flex-1 h-2 rounded-lg cursor-pointer"
                                                style={{ accentColor: colors.primary1 }}
                                            />
                                            <span className="text-xs font-mono w-10" style={{ color: colors.textSecondary }}>{getCoverage(s.skill, baseline)}%</span>
                                        </div>
                                        <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                                            Gap: {s.gap >= 0 ? '+' : ''}{s.gap}% vs market target ({MARKET_TARGET[s.marketDemand] ?? 75}%). {s.gap < -10 ? 'Below target—consider increasing coverage.' : s.gap > 10 ? 'Above target—strong alignment.' : 'Within target.'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Skills to Strengthen</h2>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.dangerBg, color: colors.dangerText }}>{gapSkills.length}</span>
                    </div>
                    <div className="p-5 space-y-3">
                        {gapSkills.length === 0 ? (
                            <p className="text-sm" style={{ color: colors.textSecondary }}>No significant gaps</p>
                        ) : (
                            gapSkills.map(skill => (
                                <div key={skill.skill} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{skill.skill}</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{skill.curriculumCoverage}% coverage</p>
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: colors.dangerText }}>{skill.gap}%</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Well-Aligned Skills</h2>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.successBg, color: colors.successText }}>{alignedSkills.length}</span>
                    </div>
                    <div className="p-5 space-y-3">
                        {alignedSkills.slice(0, 5).map(skill => {
                            const demandStyles = getDemandStyles(skill.marketDemand);
                            return (
                                <div key={skill.skill} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{skill.skill}</p>
                                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: demandStyles.bg, color: demandStyles.text }}>{skill.marketDemand}</span>
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: colors.successText }}>{skill.curriculumCoverage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// IMPACT ANALYSIS TAB
// ============================================
function ImpactAnalysisTab() {
    const { t } = useLanguage();
    const colors = useColors();
    const metrics = getImpactMetrics(obf01);
    const feedback = getEmployerFeedback();

    const trendData = (obf01?.institutionYearData ?? []).map((d: any) => ({
        year: String(d.academicYear || d.year || '').split('-')[0] || d.academicYear,
        rate: d.employmentRate1YPct ?? d.rate ?? 0,
    }));
    const fallbackTrend = [
        { year: '2021', rate: 78 },
        { year: '2022', rate: 81 },
        { year: '2023', rate: 84 },
        { year: '2024', rate: 87 },
    ];
    const displayTrend = trendData.length > 0 ? trendData : fallbackTrend;

    const programList = obf01?.programData ?? EMPLOYABILITY_DATA;
    const sortedPrograms = [...programList].sort((a: any, b: any) =>
        (b.employmentRate1YPct ?? b.employmentRate ?? 0) - (a.employmentRate1YPct ?? a.employmentRate ?? 0)
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-xl p-4 text-center shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                        <p className="text-xl font-semibold" style={{ color: colors.textPrimary }}>{metric.value}</p>
                        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>{metric.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Employment Rate Trend</h2>
                    <LineChartComponent data={displayTrend} xKey="year" lines={[{ dataKey: 'rate', color: colors.success, name: 'Employment Rate %' }]} height={200} yFormatter={(v) => `${v}%`} />
                </div>

                <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Employment by Program</h2>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {sortedPrograms.map((prog: any) => {
                            const rate = prog.employmentRate1YPct ?? prog.employmentRate ?? 0;
                            const status = prog.status;
                            const barColor = status === 'green' ? colors.successText : status === 'red' ? colors.dangerText : colors.warningText;
                            return (
                                <div key={prog.programId ?? prog.programName} className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>{prog.programName}</span>
                                            <span className="text-xs font-medium" style={{ color: getStatusColor(colors, status || 'amber') }}>
                                                {rate.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceBg }}>
                                            <div className="h-full rounded-full" style={{ width: `${Math.min(rate, 100)}%`, backgroundColor: barColor }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Employer Feedback</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feedback.map((emp) => (
                        <div key={emp.employer} className="p-4 rounded-lg" style={{ backgroundColor: colors.tableHeader }}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium" style={{ backgroundColor: colors.accentBg, color: colors.accent }}>
                                    {emp.employer.substring(0, 2)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{emp.employer}</p>
                                    <p className="text-xs" style={{ color: colors.textSecondary }}>{emp.industry}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <Star size={12} className="fill-yellow-500" style={{ color: colors.warning }} />
                                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{emp.satisfactionScore.toFixed(1)}</span>
                                <span style={{ color: colors.textSecondary }}>•</span>
                                <span className="text-xs" style={{ color: colors.textSecondary }}>{emp.hiresCount} hires</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <ThumbsUp size={12} className="mt-0.5" style={{ color: colors.successText }} />
                                    <div className="flex flex-wrap gap-1">
                                        {emp.strengthAreas.slice(0, 2).map((s, i) => (
                                            <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: colors.successBg, color: colors.successText }}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={12} className="mt-0.5" style={{ color: colors.warningText }} />
                                    <div className="flex flex-wrap gap-1">
                                        {emp.improvementAreas.slice(0, 2).map((s, i) => (
                                            <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: colors.warningBg, color: colors.warningText }}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================
// EMPLOYMENT RATE TAB
// ============================================
const STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: 'All', label: 'All Statuses' },
    { value: 'green', label: 'On Target (≥70%)' },
    { value: 'amber', label: 'Near Target (65–70%)' },
    { value: 'red', label: 'Below Target (<65%)' },
];

function EmploymentRateTab() {
    const { t } = useLanguage();
    const colors = useColors();
    const [selectedCollege, setSelectedCollege] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');

    const instData = obf01?.institutionYearData ?? [];
    const progData = obf01?.programData ?? [];
    const targetPct = obf01?.targets?.minPct ?? 70;

    const colleges = useMemo(() => {
        const unique = Array.from(new Set(progData.map((d: any) => String(d.college ?? '')))).filter(Boolean).sort();
        return ['All', ...unique] as string[];
    }, [progData]);

    const filteredProg = useMemo(() => {
        return progData.filter((d: any) => {
            if (selectedCollege !== 'All' && String(d.college) !== selectedCollege) return false;
            if (selectedStatus !== 'All' && d.status !== selectedStatus) return false;
            return true;
        });
    }, [progData, selectedCollege, selectedStatus]);

    const resetFilters = () => { setSelectedCollege('All'); setSelectedStatus('All'); };
    const hasActiveFilters = selectedCollege !== 'All' || selectedStatus !== 'All';

    const instMetrics = obf01?.institutionalMetrics ?? {};
    const trendChartData = instData.map((d: any) => ({
        name: d.academicYear,
        actual: d.employmentRate1YPct,
        target: targetPct,
    }));
    const barByCollege = useMemo(() => {
        const byCollege: Record<string, { total: number; employed: number }> = {};
        filteredProg.forEach((d: any) => {
            const col = String(d.college ?? '');
            if (!byCollege[col]) byCollege[col] = { total: 0, employed: 0 };
            byCollege[col].total += d.totalGraduates ?? 0;
            byCollege[col].employed += d.successfulOutcomesTotal ?? d.employedWithin1Year ?? 0;
        });
        return Object.entries(byCollege)
            .map(([name, v]) => ({ name, rate: v.total > 0 ? Math.round((v.employed / v.total) * 10000) / 100 : 0 }))
            .sort((a, b) => b.rate - a.rate);
    }, [filteredProg]);

    const cardStyle = { backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' };

    const tableColumns = [
        { key: 'programName', header: t('programs.programName'), sortable: true },
        { key: 'college', header: t('faculty.dept'), sortable: true },
        { key: 'totalGraduates', header: t('employability.totalGraduates'), sortable: true },
        { key: 'employedWithin1Year', header: 'Employed', sortable: true },
        { key: 'furtherStudyWithin1Year', header: 'Further Study', sortable: true },
        {
            key: 'employmentRate1YPct',
            header: 'Rate %',
            sortable: true,
            render: (item: any) => {
                const r = item.employmentRate1YPct ?? 0;
                const s = item.status ?? 'amber';
                return <span className="font-semibold" style={{ color: getStatusColor(colors, s) }}>{r.toFixed(2)}%</span>;
            },
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (item: any) => {
                const s = item.status ?? 'amber';
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold" style={{ backgroundColor: getStatusBg(colors, s), color: getStatusColor(colors, s) }}>
                        {s === 'green' ? <CheckCircle size={12} /> : s === 'red' ? <XCircle size={12} /> : <AlertCircle size={12} />}
                        {s === 'green' ? 'On Target' : s === 'red' ? 'Below Target' : 'Near Target'}
                    </span>
                );
            },
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Summary metrics */}
            <div className="rounded-xl p-6" style={{ backgroundColor: colors.accentBg, border: `1px solid ${colors.accent}40`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-2 mb-4">
                    <Target size={22} style={{ color: colors.accent }} />
                    <span className="text-base font-semibold" style={{ color: colors.textPrimary }}>Employment Rate</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Actual Rate (1Y)', value: Number(instMetrics.employmentRate1YPct ?? 0).toFixed(2) + '%', color: getStatusColor(colors, instMetrics.status ?? 'amber') },
                        { label: 'Target', value: targetPct + '%', color: colors.textPrimary },
                        { label: 'Total Graduates', value: String(instMetrics.totalGraduates ?? 0), color: colors.textPrimary },
                        { label: 'Successful Outcomes', value: String(instMetrics.successfulOutcomesTotal ?? instMetrics.employedWithin1Year ?? 0), color: colors.successText },
                    ].map((m) => (
                        <div key={m.label} className="p-4 rounded-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                            <p className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</p>
                            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>{m.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl p-6" style={cardStyle}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.primary1}20` }}>
                            <Target size={18} style={{ color: colors.primary1 }} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>Filters</h3>
                            <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>Filter programs by college and compliance status</p>
                        </div>
                    </div>
                    {hasActiveFilters && (
                        <button onClick={resetFilters} className="px-3 py-2 rounded-lg text-xs font-medium transition-colors" style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}>
                            Reset filters
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>College</label>
                        <select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2" style={{ backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }}>
                            <option value="All">All Colleges</option>
                            {colleges.filter(c => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Compliance Status</label>
                        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2" style={{ backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }}>
                            {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop: `1px solid ${colors.border}` }}>
                    <Info size={16} style={{ color: colors.infoText }} />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                        Showing <strong style={{ color: colors.textPrimary }}>{filteredProg.length}</strong> program{filteredProg.length !== 1 ? 's' : ''}
                        {selectedCollege !== 'All' && <span> in <strong style={{ color: colors.textPrimary }}>{selectedCollege}</strong></span>}
                        {selectedStatus !== 'All' && <span> • <strong style={{ color: getStatusColor(colors, selectedStatus) }}>{STATUS_OPTIONS.find(o => o.value === selectedStatus)?.label ?? selectedStatus}</strong></span>}
                    </span>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl p-6" style={cardStyle}>
                    <h3 className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>Employment Rate Trend</h3>
                    <p className="text-xs mb-4" style={{ color: colors.textSecondary }}>Institutional actual vs target ({targetPct}%) by academic year</p>
                    {trendChartData.length > 0 ? (
                        <>
                            <LineChartComponent data={trendChartData} xKey="name" lines={[{ dataKey: 'actual', color: colors.primary1, name: 'Actual %' }, { dataKey: 'target', color: colors.successText, name: 'Target' }]} height={260} showLegend={true} yFormatter={(v) => `${v}%`} />
                            <div className="mt-4 pt-4 flex flex-wrap gap-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary1 }} /><span className="text-xs" style={{ color: colors.textSecondary }}>Actual</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.successText }} /><span className="text-xs" style={{ color: colors.textSecondary }}>Target ≥{targetPct}%</span></div>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm py-12 text-center" style={{ color: colors.textSecondary }}>No trend data available</p>
                    )}
                </div>
                <div className="rounded-xl p-6" style={cardStyle}>
                    <h3 className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>Rate by College</h3>
                    <p className="text-xs mb-4" style={{ color: colors.textSecondary }}>Employment rate by college (filtered programs)</p>
                    {barByCollege.length > 0 ? (
                        <>
                            <BarChartComponent data={barByCollege} xKey="name" bars={[{ dataKey: 'rate', color: colors.primary1, name: 'Employment Rate %' }]} height={260} />
                            <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop: `1px solid ${colors.border}` }}>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary1 }} />
                                <span className="text-xs" style={{ color: colors.textSecondary }}>Employment Rate</span>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm py-12 text-center" style={{ color: colors.textSecondary }}>No data for selected filters</p>
                    )}
                </div>
            </div>

            {/* Program table */}
            <div className="rounded-xl overflow-hidden" style={cardStyle}>
                <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>All Programs</h3>
                    <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>Employed or further study within 1 year ÷ total graduates</p>
                </div>
                <DataTable data={filteredProg} columns={tableColumns} searchPlaceholder={t('common.search')} pageSize={15} exportFileName="obf-01-programs" />
            </div>
        </div>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function ProgramImpactPage() {
    const { t } = useLanguage();
    const colors = useColors();
    const tabs: { id: TabType; label: string }[] = [
        { id: 'obef', label: 'Employment Rate' },
        { id: 'scorecard', label: t('employability.scorecard') },
        { id: 'skills', label: t('employability.skillsMap') },
        { id: 'impact', label: t('employability.impactAnalysis') },
    ];
    const [activeTab, setActiveTab] = useState<TabType>(tabs[0].id);

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: colors.bgPrimary }}>
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                        {t('employability.programImpact')}
                    </h1>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                        {t('employability.programImpactDescription')}
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
                        {activeTab === 'obef' && <EmploymentRateTab />}
                        {activeTab === 'scorecard' && <ScorecardTab />}
                        {activeTab === 'skills' && <SkillsMapTab />}
                        {activeTab === 'impact' && <ImpactAnalysisTab />}
                    </div>
                </div>
            </div>
        </div>
    );
}
