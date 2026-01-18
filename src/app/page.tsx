'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import BarChartComponent from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import { Users, GraduationCap, CheckCircle, Briefcase } from 'lucide-react';
import { FACULTY_DATA, getDepartmentSummary } from '@/data/faculty';
import { PROGRAMS_DATA, getViabilityMatrix } from '@/data/programs';
import { getImpactMetrics } from '@/data/employability';
import { useColors } from '@/hooks/useColors';
import { useDateFilter, getDateAdjustments } from '@/context/DateFilterContext';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardHome() {
    const colors = useColors();
    const { dateRange } = useDateFilter();
    const adjustments = getDateAdjustments(dateRange);
    const { t, isRTL } = useLanguage();

    const deptSummary = getDepartmentSummary();
    const viabilityMatrix = getViabilityMatrix();
    const impactMetrics = getImpactMetrics();

    const totalFaculty = Math.round(FACULTY_DATA.length * adjustments.value);
    const totalPrograms = Math.round(PROGRAMS_DATA.length * adjustments.value);
    const viablePrograms = Math.round(viabilityMatrix.viable.length * adjustments.value);
    const employmentBase = parseInt(impactMetrics.find(m => m.label.includes('Employment'))?.value || '85');
    const avgEmploymentRate = `${Math.min(99, Math.round(employmentBase + adjustments.growth / 2))}%`;

    const deptChartData = deptSummary.map(d => ({
        name: d.department.split(' ')[0],
        current: Math.round(d.currentFTE * adjustments.value),
        required: d.requiredFTE
    }));

    const viabilityChartData = [
        { name: t('dashboard.viable'), value: Math.round(viabilityMatrix.viable.length * adjustments.value), color: '#22c55e' },
        { name: t('dashboard.marginal'), value: Math.round(viabilityMatrix.marginal.length * adjustments.variation), color: '#eab308' },
        { name: t('dashboard.atRisk'), value: Math.round(viabilityMatrix.atRisk.length * (2 - adjustments.value)), color: '#ef4444' },
    ];

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: t('dashboard.totalFaculty'), value: totalFaculty, change: Math.round(adjustments.growth * 0.6), label: t('common.vsLastYear'), icon: <Users size={20} strokeWidth={1.5} /> },
                    { title: t('dashboard.activePrograms'), value: totalPrograms, change: Math.round(adjustments.growth * 0.4), label: t('common.vsLastYear'), icon: <GraduationCap size={20} strokeWidth={1.5} /> },
                    { title: t('dashboard.viablePrograms'), value: `${Math.round((viablePrograms / Math.max(totalPrograms, 1)) * 100)}%`, change: Math.round(adjustments.growth * 0.3), label: t('common.improvement'), icon: <CheckCircle size={20} strokeWidth={1.5} /> },
                    { title: t('dashboard.employmentRate'), value: avgEmploymentRate, change: Math.round(adjustments.growth * 0.25), label: t('common.vsLastYear'), icon: <Briefcase size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 sm:p-5 lg:col-span-2 rounded-xl card-hover animate-fade-in" style={{ animationDelay: '200ms', backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>
                        {t('dashboard.facultyFTEByDept')}
                        <span className="text-xs font-normal" style={{ color: colors.textSecondary, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>({dateRange})</span>
                    </h2>
                    <BarChartComponent
                        data={deptChartData}
                        xKey="name"
                        bars={[
                            { dataKey: 'current', color: '#6366f1', name: t('dashboard.currentFTE') },
                            { dataKey: 'required', color: '#94a3b8', name: t('dashboard.requiredFTE') }
                        ]}
                        height={260}
                        showLegend
                    />
                </div>
                <div className="p-4 sm:p-5 rounded-xl card-hover animate-fade-in" style={{ animationDelay: '250ms', backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>{t('dashboard.programViability')}</h2>
                    <DonutChart data={viabilityChartData} height={200} />
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        {viabilityChartData.map((v, i) => (
                            <div key={v.name} className="p-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: i === 0 ? colors.successBg : i === 1 ? colors.warningBg : colors.dangerBg }}>
                                <p className="text-base sm:text-lg font-semibold" style={{ color: i === 0 ? colors.successText : i === 1 ? colors.warningText : colors.dangerText }}>{v.value}</p>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>{v.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl card-hover animate-fade-in" style={{ animationDelay: '300ms', backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <div className="px-4 sm:px-5 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>{t('dashboard.departmentOverview')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead><tr style={{ backgroundColor: colors.tableHeader }}>
                            {[t('dashboard.department'), t('dashboard.facultyCount'), t('dashboard.currentFTE'), t('dashboard.requiredFTE'), t('common.gap'), t('common.status')].map(h => (
                                <th key={h} className="text-left px-3 sm:px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}`, textAlign: isRTL ? 'right' : 'left' }}>{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {deptSummary.map((dept) => {
                                const adjustedCurrent = Math.round(dept.currentFTE * adjustments.value);
                                const gap = adjustedCurrent - dept.requiredFTE;
                                return (
                                    <tr key={dept.department} className="transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.tableHover}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        <td className="px-3 sm:px-4 py-3 text-sm font-medium" style={{ color: colors.textPrimary }}>{dept.department}</td>
                                        <td className="px-3 sm:px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{Math.round(dept.totalFaculty * adjustments.value)}</td>
                                        <td className="px-3 sm:px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{adjustedCurrent}</td>
                                        <td className="px-3 sm:px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{dept.requiredFTE}</td>
                                        <td className="px-3 sm:px-4 py-3 text-sm font-medium" style={{ color: gap >= 0 ? colors.successText : colors.dangerText }}>{gap >= 0 ? '+' : ''}{gap}</td>
                                        <td className="px-3 sm:px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {dept.overloaded > 0 && <span className="text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap" style={{ backgroundColor: colors.dangerBg, color: colors.dangerText }}>{dept.overloaded} {t('common.over')}</span>}
                                                {dept.underloaded > 0 && <span className="text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap" style={{ backgroundColor: colors.infoBg, color: colors.infoText }}>{dept.underloaded} {t('common.under')}</span>}
                                                {dept.overloaded === 0 && dept.underloaded === 0 && <span className="text-xs px-2 py-1 rounded-md font-medium" style={{ backgroundColor: colors.successBg, color: colors.successText }}>{t('common.balanced')}</span>}
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
