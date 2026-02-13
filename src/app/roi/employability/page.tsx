'use client';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import MetricCard from '@/components/ui/MetricCard';
import DataTable from '@/components/ui/DataTable';
import BarChartComponent from '@/components/charts/BarChart';
import LineChartComponent from '@/components/charts/LineChart';
import { EMPLOYABILITY_DATA, getSkillAlignmentData, getImpactMetrics, getEmployerFeedback, type EmployabilityMetric } from '@/data/employability';
import { Briefcase, DollarSign, Users, Star, CheckCircle, AlertTriangle, TrendingUp, ThumbsUp, AlertCircle, Network, List } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

// ============================================
// TAB COMPONENT
// ============================================
type TabType = 'scorecard' | 'skills' | 'impact';

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
// SCORECARD TAB
// ============================================
function ScorecardTab() {
    const { t } = useLanguage();
    const colors = useColors();

    const avgEmploymentRate = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.employmentRate, 0) / EMPLOYABILITY_DATA.length;
    const avgSalary = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.avgStartingSalary, 0) / EMPLOYABILITY_DATA.length;
    const totalGraduates = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.graduateCount, 0);
    const avgSatisfaction = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.employerSatisfaction, 0) / EMPLOYABILITY_DATA.length;

    const chartData = EMPLOYABILITY_DATA.map(e => ({
        name: e.programName.split(' ')[0],
        rate: e.employmentRate,
    }));

    const columns = [
        { key: 'programName', header: t('programs.programName') },
        { key: 'department', header: t('faculty.dept') },
        {
            key: 'employmentRate',
            header: t('programs.employment'),
            render: (item: EmployabilityMetric) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.isDark ? '#334155' : '#e2e8f0' }}>
                        <div
                            className={`h-full ${item.employmentRate >= 85 ? 'bg-green-500' : item.employmentRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${item.employmentRate}%` }}
                        />
                    </div>
                    <span className="text-xs">{item.employmentRate}%</span>
                </div>
            )
        },
        {
            key: 'avgTimeToEmployment',
            header: t('employability.timeToEmploy'),
            render: (item: EmployabilityMetric) => `${item.avgTimeToEmployment} mo`
        },
        {
            key: 'avgStartingSalary',
            header: t('employability.avgSalary'),
            render: (item: EmployabilityMetric) => `$${(item.avgStartingSalary / 1000).toFixed(0)}K`
        },
        {
            key: 'employerSatisfaction',
            header: t('employability.rating'),
            render: (item: EmployabilityMetric) => (
                <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span>{item.employerSatisfaction.toFixed(1)}</span>
                </div>
            )
        },
        { key: 'graduateCount', header: t('employability.totalGraduates') },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title={t('employability.employmentRate')} value={`${avgEmploymentRate.toFixed(0)}%`} change={4} icon={<Briefcase size={20} />} changeLabel={t('common.vsLastYear')} />
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
                <DataTable<EmployabilityMetric> data={EMPLOYABILITY_DATA} columns={columns} searchPlaceholder={t('common.search')} pageSize={10} />
            </div>
        </div>
    );
}

// ============================================
// SKILLS MAP TAB
// ============================================
function SkillsMapTab() {
    const { t } = useLanguage();
    const colors = useColors();
    const skillsData = getSkillAlignmentData();
    const [skillsView, setSkillsView] = useState<'radar' | 'list'>('radar');

    const alignedSkills = skillsData.filter(s => Math.abs(s.gap) <= 10);
    const gapSkills = skillsData.filter(s => s.gap < -10);
    const highDemandSkills = skillsData.filter(s => s.marketDemand === 'High');

    const chartData = skillsData.slice(0, 8).map(s => ({
        name: s.skill.split(' ')[0],
        coverage: s.curriculumCoverage,
    }));

    // Radar chart data: normalize to 0-100 scale
    const radarData = skillsData.slice(0, 8).map(s => ({
        skill: s.skill.length > 15 ? s.skill.substring(0, 15) + '...' : s.skill,
        curriculum: s.curriculumCoverage,
        market: s.marketDemand === 'High' ? 90 : s.marketDemand === 'Medium' ? 65 : 40,
    }));

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

    return (
        <div className="space-y-6 animate-fadeIn">
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
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Skills Analysis</h2>
                    <div className="flex gap-2 p-1 rounded-lg" style={{ backgroundColor: colors.isDark ? '#1e293b' : '#f1f5f9' }}>
                        <button
                            onClick={() => setSkillsView('radar')}
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
                            style={{
                                backgroundColor: skillsView === 'radar' ? colors.accent : 'transparent',
                                color: skillsView === 'radar' ? '#ffffff' : colors.textSecondary,
                            }}
                        >
                            <Network size={14} />
                            Radar View
                        </button>
                        <button
                            onClick={() => setSkillsView('list')}
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
                            style={{
                                backgroundColor: skillsView === 'list' ? colors.accent : 'transparent',
                                color: skillsView === 'list' ? '#ffffff' : colors.textSecondary,
                            }}
                        >
                            <List size={14} />
                            List View
                        </button>
                    </div>
                </div>

                {skillsView === 'radar' ? (
                    <div style={{ height: 480 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData} cy="45%" outerRadius="70%">
                                <PolarGrid stroke={colors.isDark ? '#334155' : '#e2e8f0'} />
                                <PolarAngleAxis
                                    dataKey="skill"
                                    tick={{ fill: colors.textSecondary, fontSize: 12 }}
                                />
                                <PolarRadiusAxis
                                    angle={90}
                                    domain={[0, 100]}
                                    tick={{ fill: colors.textSecondary, fontSize: 10 }}
                                />
                                <Radar
                                    name="Curriculum Coverage"
                                    dataKey="curriculum"
                                    stroke={colors.primary1}
                                    fill={colors.primary1}
                                    fillOpacity={0.5}
                                />
                                <Radar
                                    name="Market Demand"
                                    dataKey="market"
                                    stroke={colors.success}
                                    fill={colors.success}
                                    fillOpacity={0.3}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: '10px' }}
                                    formatter={(value) => <span style={{ color: colors.textSecondary, fontSize: '12px' }}>{value}</span>}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <BarChartComponent data={chartData} xKey="name" bars={[{ dataKey: 'coverage', color: colors.primary1, name: 'Coverage %' }]} height={220} />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Skills to Strengthen</h2>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.dangerBg, color: colors.dangerText }}>
                            {gapSkills.length}
                        </span>
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
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.successBg, color: colors.successText }}>
                            {alignedSkills.length}
                        </span>
                    </div>
                    <div className="p-5 space-y-3">
                        {alignedSkills.slice(0, 5).map(skill => {
                            const demandStyles = getDemandStyles(skill.marketDemand);
                            return (
                                <div key={skill.skill} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{skill.skill}</p>
                                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: demandStyles.bg, color: demandStyles.text }}>
                                            {skill.marketDemand}
                                        </span>
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
    const metrics = getImpactMetrics();
    const feedback = getEmployerFeedback();

    const trendData = [
        { year: '2021', rate: 78 },
        { year: '2022', rate: 81 },
        { year: '2023', rate: 84 },
        { year: '2024', rate: 87 },
    ];

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
                    <LineChartComponent data={trendData} xKey="year" lines={[{ dataKey: 'rate', color: colors.success, name: 'Employment Rate' }]} height={200} />
                </div>

                <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Employment by Program</h2>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {EMPLOYABILITY_DATA.sort((a, b) => b.employmentRate - a.employmentRate).map((prog) => (
                            <div key={prog.programId} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>{prog.programName}</span>
                                        <span className="text-xs font-medium" style={{ color: prog.employmentRate >= 85 ? colors.successText : colors.warningText }}>
                                            {prog.employmentRate}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.isDark ? 'rgba(148, 163, 184, 0.2)' : '#e5e7eb' }}>
                                        <div className="h-full rounded-full" style={{ width: `${prog.employmentRate}%`, backgroundColor: prog.employmentRate >= 85 ? colors.successIcon : colors.warningText }} />
                                    </div>
                                </div>
                            </div>
                        ))}
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
// MAIN PAGE COMPONENT
// ============================================
export default function ProgramImpactPage() {
    const { t } = useLanguage();
    const colors = useColors();
    const [activeTab, setActiveTab] = useState<TabType>('scorecard');

    const tabs: { id: TabType; label: string }[] = [
        { id: 'scorecard', label: t('employability.scorecard') },
        { id: 'skills', label: t('employability.skillsMap') },
        { id: 'impact', label: t('employability.impactAnalysis') },
    ];

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
                        {activeTab === 'scorecard' && <ScorecardTab />}
                        {activeTab === 'skills' && <SkillsMapTab />}
                        {activeTab === 'impact' && <ImpactAnalysisTab />}
                    </div>
                </div>
            </div>
        </div>
    );
}
