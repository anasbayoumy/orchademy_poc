'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import BarChartComponent from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import { Users, GraduationCap, CheckCircle, Briefcase, Settings, Plus, X, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { FACULTY_DATA, getDepartmentSummary, getDefaultTotalFaculty } from '@/data/faculty';
import { PROGRAMS_DATA, getViabilityMatrix } from '@/data/programs';
import { useColors } from '@/hooks/useColors';
import { useDateFilter } from '@/context/DateFilterContext';
import { useLanguage } from '@/context/LanguageContext';
import EFF_12 from '@/data/KPIs/EFF-12';
import OBF_01 from '@/data/KPIs/OBF-01';
import WLM_02 from '@/data/KPIs/WLM-02';
import API_06 from '@/data/KPIs/API-06';
import GOV_00 from '@/data/KPIs/GOV-00';
import OrchaBotWidget from '@/components/ui/OrchaBotWidget';

// ============================================
// WIDGET TYPES & REGISTRY
// ============================================
type WidgetSize = 'small' | 'medium' | 'large';

interface Widget {
    id: string;
    title: string;
    size: WidgetSize;
    component: React.ComponentType<any>;
}

// Compute API-06 institution at-risk rate for latest term
function getAPI06InstitutionRate(api06: { collegeTermData?: Array<{ academicYear: string; term: string; totalActiveStudents?: number; flaggedStudents?: number }> }) {
    const data = api06?.collegeTermData ?? [];
    const latest = data.filter((d: { academicYear: string }) => d.academicYear === '2023-24');
    if (latest.length === 0) return { rate: 0, total: 0, flagged: 0 };
    const total = latest.reduce((s: number, d: { totalActiveStudents?: number }) => s + (d.totalActiveStudents ?? 0), 0);
    const flagged = latest.reduce((s: number, d: { flaggedStudents?: number }) => s + (d.flaggedStudents ?? 0), 0);
    const rate = total > 0 ? Math.round((flagged / total) * 1000) / 10 : 0;
    return { rate, total, flagged };
}

// Widget Components
function MetricsOverviewWidget() {
    const { t } = useLanguage();
    const eff12 = EFF_12 as { institutionData?: Array<{ activeStudents?: number; facultyFTE?: number; studentToFacultyRatio?: number }> };
    const obf01 = OBF_01 as { institutionalMetrics?: { employmentRate1YPct?: number; totalGraduates?: number } };
    const wlm02 = WLM_02 as { institutionalMetrics?: { currentRate?: number } };
    const gov00 = GOV_00 as { yearlyData?: Array<{ fiscalYear: string; value: number }> };

    const inst = eff12?.institutionData?.[0];
    const totalFaculty = getDefaultTotalFaculty();
    const totalPrograms = PROGRAMS_DATA.length;
    const viabilityMatrix = getViabilityMatrix();
    const viablePct = totalPrograms > 0 ? Math.round((viabilityMatrix.viable.length / totalPrograms) * 100) : 0;
    const employmentRate = obf01?.institutionalMetrics?.employmentRate1YPct ?? 0;
    const overloadRate = wlm02?.institutionalMetrics?.currentRate ?? 0;
    const api06Rate = getAPI06InstitutionRate(API_06 as Parameters<typeof getAPI06InstitutionRate>[0]);

    const latestGov = gov00?.yearlyData?.slice(-1)?.[0];
    const strategyIndex = latestGov?.value ?? 0;

    const metrics = useMemo(() => [
        { title: t('dashboard.studentToFaculty'), value: inst ? `${(inst.studentToFacultyRatio ?? 0).toFixed(2)}:1` : '-', change: -3, label: t('common.improvement'), icon: <Target size={20} strokeWidth={1.5} /> },
        { title: t('dashboard.employmentRate'), value: `${employmentRate.toFixed(1)}%`, change: 2, label: t('common.vsLastYear'), icon: <Briefcase size={20} strokeWidth={1.5} /> },
        { title: t('dashboard.activeStudents'), value: String(inst?.activeStudents ?? 0), change: undefined, label: t('common.vsLastYear'), icon: <Users size={20} strokeWidth={1.5} /> },
        { title: t('dashboard.totalFaculty'), value: String(totalFaculty), change: undefined, label: t('common.vsLastYear'), icon: <GraduationCap size={20} strokeWidth={1.5} /> },
        { title: t('dashboard.overloadRate'), value: `${overloadRate.toFixed(1)}%`, change: overloadRate > 15 ? 1 : -2, label: t('common.vsLastYear'), icon: <AlertTriangle size={20} strokeWidth={1.5} /> },
        { title: t('dashboard.atRiskStudentRate'), value: `${api06Rate.rate}%`, change: api06Rate.rate > 25 ? 1 : -1, label: t('common.vsLastYear'), icon: <TrendingUp size={20} strokeWidth={1.5} /> },
        { title: t('dashboard.viablePrograms'), value: `${viablePct}%`, change: 2, label: t('common.improvement'), icon: <CheckCircle size={20} strokeWidth={1.5} /> },
        { title: t('dashboard.strategyIndex'), value: strategyIndex > 0 ? strategyIndex.toFixed(1) : '-', change: strategyIndex >= 60 ? 1 : -5, label: t('common.vsLastYear'), icon: <Target size={20} strokeWidth={1.5} /> },
    ], [t, inst, employmentRate, overloadRate, api06Rate.rate, totalFaculty, strategyIndex, viablePct]);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {metrics.map(m => <MetricCard key={m.title} title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />)}
        </div>
    );
}

function FacultyFTEChartWidget() {
    const colors = useColors();
    const { dateRange } = useDateFilter();
    const { t, isRTL } = useLanguage();
    const deptSummary = getDepartmentSummary();

    const deptChartData = deptSummary.map(d => ({
        name: d.department.split(' ')[0],
        current: Math.round(d.currentFTE * 100) / 100,
        required: d.requiredFTE
    }));

    return (
        <div>
            <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>
                {t('dashboard.facultyFTEByDept')}
                <span className="text-xs font-normal" style={{ color: colors.textSecondary, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>({dateRange})</span>
            </h2>
            <BarChartComponent
                data={deptChartData}
                xKey="name"
                bars={[
                    { dataKey: 'current', color: colors.primary1, name: t('dashboard.currentFTE') },
                    { dataKey: 'required', color: '#94a3b8', name: t('dashboard.requiredFTE') }
                ]}
                height={260}
                showLegend
            />
        </div>
    );
}

function ProgramViabilityWidget() {
    const colors = useColors();
    const { t } = useLanguage();
    const viabilityMatrix = getViabilityMatrix();

    const viabilityChartData = [
        { name: t('dashboard.viable'), value: viabilityMatrix.viable.length, color: colors.success },
        { name: t('dashboard.marginal'), value: viabilityMatrix.marginal.length, color: colors.warning },
        { name: t('dashboard.atRisk'), value: viabilityMatrix.atRisk.length, color: colors.danger },
    ];

    return (
        <div>
            <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>{t('dashboard.programViability')}</h2>
            <div className="w-[200px] h-[200px] mx-auto">
                <DonutChart data={viabilityChartData} height={200} innerRadius={50} outerRadius={80} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {viabilityChartData.map((v, i) => (
                    <div key={v.name} className="p-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: i === 0 ? colors.successBg : i === 1 ? colors.warningBg : colors.dangerBg }}>
                        <p className="text-base sm:text-lg font-semibold" style={{ color: i === 0 ? colors.successText : i === 1 ? colors.warningText : colors.dangerText }}>{v.value}</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>{v.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DepartmentTableWidget() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();
    const deptSummary = getDepartmentSummary();

    return (
        <div className="overflow-hidden">
            <div className="px-4 py-3 mb-2">
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
                            const adjustedCurrent = Math.round(dept.currentFTE * 100) / 100;
                            const gap = Math.round(adjustedCurrent - dept.requiredFTE);
                            return (
                                <tr key={dept.department} className="transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.tableHover}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td className="px-3 sm:px-4 py-3 text-sm font-medium" style={{ color: colors.textPrimary }}>{dept.department}</td>
                                    <td className="px-3 sm:px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{dept.totalFaculty}</td>
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
    );
}

// Widget registry - titles will be translated at render time
const WIDGET_REGISTRY: Widget[] = [
    { id: 'metrics-overview', title: 'dashboard.keyMetrics', size: 'large', component: MetricsOverviewWidget },
    { id: 'faculty-fte-chart', title: 'dashboard.facultyFTEByDept', size: 'medium', component: FacultyFTEChartWidget },
    { id: 'program-viability', title: 'dashboard.programViability', size: 'small', component: ProgramViabilityWidget },
    { id: 'department-table', title: 'dashboard.departmentOverview', size: 'large', component: DepartmentTableWidget },
];

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
export default function DashboardHome() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [activeWidgetIds, setActiveWidgetIds] = useState<string[]>([]);

    // Load layout from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('dashboard_layout');
        if (saved) {
            try {
                setActiveWidgetIds(JSON.parse(saved));
            } catch {
                // If parse fails, use default
                setActiveWidgetIds(WIDGET_REGISTRY.map(w => w.id));
            }
        } else {
            // Default: all widgets active
            setActiveWidgetIds(WIDGET_REGISTRY.map(w => w.id));
        }
    }, []);

    // Save layout to localStorage whenever it changes
    useEffect(() => {
        if (activeWidgetIds.length > 0) {
            localStorage.setItem('dashboard_layout', JSON.stringify(activeWidgetIds));
        }
    }, [activeWidgetIds]);

    const addWidget = (widgetId: string) => {
        setActiveWidgetIds(prev => [...prev, widgetId]);
    };

    const removeWidget = (widgetId: string) => {
        setActiveWidgetIds(prev => prev.filter(id => id !== widgetId));
    };

    const getWidgetColSpan = (size: WidgetSize): string => {
        switch (size) {
            case 'small': return 'lg:col-span-1';
            case 'medium': return 'lg:col-span-2';
            case 'large': return 'lg:col-span-3';
            default: return 'lg:col-span-1';
        }
    };

    const activeWidgets = activeWidgetIds
        .map(id => WIDGET_REGISTRY.find(w => w.id === id))
        .filter((w): w is Widget => w !== undefined);

    const availableWidgets = WIDGET_REGISTRY.filter(w => !activeWidgetIds.includes(w.id));

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <div className="flex items-center justify-between mb-6">
                <Header title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                        backgroundColor: isEditing ? colors.accent : colors.cardBg,
                        color: isEditing ? '#ffffff' : colors.textPrimary,
                        border: `1px solid ${isEditing ? colors.accent : colors.border}`,
                    }}
                >
                    {isEditing ? <X size={16} /> : <Settings size={16} />}
                    {isEditing ? t('dashboard.done') : t('dashboard.customize')}
                </button>
            </div>

            {/* Add Widget Panel (Edit Mode Only) */}
            {isEditing && availableWidgets.length > 0 && (
                <div 
                    className="mb-6 p-4 rounded-xl border-2 border-dashed animate-fade-in"
                    style={{ borderColor: colors.border, backgroundColor: colors.isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.02)' }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Plus size={18} style={{ color: colors.accent }} />
                        <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{t('dashboard.addWidgets')}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {availableWidgets.map(widget => (
                            <button
                                key={widget.id}
                                onClick={() => addWidget(widget.id)}
                                className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                                style={{
                                    backgroundColor: colors.accentBg,
                                    color: colors.accent,
                                    border: `1px solid ${colors.accent}`,
                                }}
                            >
                                <Plus size={14} className={isRTL ? "inline ml-1" : "inline mr-1"} />
                                {t(widget.title)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* OrchaBot — always first, non-removable */}
                <div className="lg:col-span-3">
                    <OrchaBotWidget />
                </div>

                {/* Customisable widgets */}
                {activeWidgets.map((widget) => {
                    const WidgetComponent = widget.component;
                    return (
                        <div
                            key={widget.id}
                            className={`p-4 sm:p-5 rounded-xl card-hover ${getWidgetColSpan(widget.size)} relative`}
                            style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                        >
                            {isEditing && (
                                <button
                                    onClick={() => removeWidget(widget.id)}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg transition-all hover:scale-110 z-10"
                                    style={{
                                        backgroundColor: colors.dangerBg,
                                        color: colors.dangerText,
                                    }}
                                    title={t('dashboard.removeWidget')}
                                >
                                    <X size={16} />
                                </button>
                            )}
                            <WidgetComponent />
                        </div>
                    );
                })}
            </div>

            {activeWidgets.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg mb-4" style={{ color: colors.textSecondary }}>{t('dashboard.noWidgetsYet')}</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: colors.accent, color: '#ffffff' }}
                    >
                        {t('dashboard.addWidgets')}
                    </button>
                </div>
            )}
        </div>
    );
}
