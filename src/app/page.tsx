'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import BarChartComponent from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import { Users, GraduationCap, CheckCircle, Briefcase, Settings, Plus, X } from 'lucide-react';
import { FACULTY_DATA, getDepartmentSummary } from '@/data/faculty';
import { PROGRAMS_DATA, getViabilityMatrix } from '@/data/programs';
import { getImpactMetrics } from '@/data/employability';
import { useColors } from '@/hooks/useColors';
import { useDateFilter, getDateAdjustments } from '@/context/DateFilterContext';
import { useLanguage } from '@/context/LanguageContext';

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

// Widget Components
function MetricsOverviewWidget() {
    const colors = useColors();
    const { dateRange } = useDateFilter();
    const adjustments = getDateAdjustments(dateRange);
    const { t } = useLanguage();
    const impactMetrics = getImpactMetrics();

    const totalFaculty = Math.round(FACULTY_DATA.length * adjustments.value);
    const totalPrograms = Math.round(PROGRAMS_DATA.length * adjustments.value);
    const viabilityMatrix = getViabilityMatrix();
    const viablePrograms = Math.round(viabilityMatrix.viable.length * adjustments.value);
    const employmentBase = parseInt(impactMetrics.find(m => m.label.includes('Employment'))?.value || '85');
    const avgEmploymentRate = `${Math.min(99, Math.round(employmentBase + adjustments.growth / 2))}%`;

    return (
        <div className="grid grid-cols-2 gap-3">
            {[
                { title: t('dashboard.totalFaculty'), value: totalFaculty, change: Math.round(adjustments.growth * 0.6), label: t('common.vsLastYear'), icon: <Users size={20} strokeWidth={1.5} /> },
                { title: t('dashboard.activePrograms'), value: totalPrograms, change: Math.round(adjustments.growth * 0.4), label: t('common.vsLastYear'), icon: <GraduationCap size={20} strokeWidth={1.5} /> },
                { title: t('dashboard.viablePrograms'), value: `${Math.round((viablePrograms / Math.max(totalPrograms, 1)) * 100)}%`, change: Math.round(adjustments.growth * 0.3), label: t('common.improvement'), icon: <CheckCircle size={20} strokeWidth={1.5} /> },
                { title: t('dashboard.employmentRate'), value: avgEmploymentRate, change: Math.round(adjustments.growth * 0.25), label: t('common.vsLastYear'), icon: <Briefcase size={20} strokeWidth={1.5} /> },
            ].map(m => <MetricCard key={m.title} title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />)}
        </div>
    );
}

function FacultyFTEChartWidget() {
    const colors = useColors();
    const { dateRange } = useDateFilter();
    const adjustments = getDateAdjustments(dateRange);
    const { t, isRTL } = useLanguage();
    const deptSummary = getDepartmentSummary();

    const deptChartData = deptSummary.map(d => ({
        name: d.department.split(' ')[0],
        current: Math.round(d.currentFTE * adjustments.value),
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
    const { dateRange } = useDateFilter();
    const adjustments = getDateAdjustments(dateRange);
    const { t } = useLanguage();
    const viabilityMatrix = getViabilityMatrix();

    const viabilityChartData = [
        { name: t('dashboard.viable'), value: Math.round(viabilityMatrix.viable.length * adjustments.value), color: colors.success },
        { name: t('dashboard.marginal'), value: Math.round(viabilityMatrix.marginal.length * adjustments.variation), color: colors.warning },
        { name: t('dashboard.atRisk'), value: Math.round(viabilityMatrix.atRisk.length * (2 - adjustments.value)), color: colors.danger },
    ];

    return (
        <div>
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
    );
}

function DepartmentTableWidget() {
    const colors = useColors();
    const { dateRange } = useDateFilter();
    const adjustments = getDateAdjustments(dateRange);
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
    );
}

const WIDGET_REGISTRY: Widget[] = [
    { id: 'metrics-overview', title: 'Key Metrics', size: 'large', component: MetricsOverviewWidget },
    { id: 'faculty-fte-chart', title: 'Faculty FTE by Department', size: 'medium', component: FacultyFTEChartWidget },
    { id: 'program-viability', title: 'Program Viability', size: 'small', component: ProgramViabilityWidget },
    { id: 'department-table', title: 'Department Overview', size: 'large', component: DepartmentTableWidget },
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
                    {isEditing ? 'Done' : 'Customize'}
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
                        <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Add Widgets</h3>
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
                                <Plus size={14} className="inline mr-1" />
                                {widget.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                                    title="Remove widget"
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
                    <p className="text-lg mb-4" style={{ color: colors.textSecondary }}>No widgets added yet.</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: colors.accent, color: '#ffffff' }}
                    >
                        Add Widgets
                    </button>
                </div>
            )}
        </div>
    );
}
