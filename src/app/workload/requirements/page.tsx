'use client';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useDateFilter } from '@/context/DateFilterContext';
import { useColors } from '@/hooks/useColors';
import MetricCard from '@/components/ui/MetricCard';
import DataTable from '@/components/ui/DataTable';
import BarChartComponent from '@/components/charts/BarChart';
import LineChartComponent from '@/components/charts/LineChart';
import { FACULTY_DATA, WORKLOAD_RULES, getSmartSuggestions } from '@/data/faculty';
import { Users, Briefcase, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Sparkles, Clock, DollarSign, Target, AlertCircle, Info, Zap, Save, Check, GitCompare, RotateCcw, ChevronRight } from 'lucide-react';

// ============================================
// TAB COMPONENT
// ============================================
type TabType = 'load-summary' | 'workload-gap' | 'smart-allocation' | 'simulation';

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
// LOAD SUMMARY TAB
// ============================================
function LoadSummaryTab() {
    const { t } = useLanguage();
    const colors = useColors();

    const getDepartmentSummary = () => {
        const deptMap: any = {};
        FACULTY_DATA.forEach(f => {
            if (!deptMap[f.department]) {
                deptMap[f.department] = { name: f.department, totalFTE: 0, avgLoad: 0, count: 0, overloaded: 0, underloaded: 0 };
            }
            deptMap[f.department].totalFTE += f.ftePercentage / 100;
            deptMap[f.department].avgLoad += f.teachingLoad;
            deptMap[f.department].count += 1;
            if (f.status === 'Overloaded') deptMap[f.department].overloaded += 1;
            if (f.status === 'Underloaded') deptMap[f.department].underloaded += 1;
        });
        return Object.values(deptMap).map((d: any) => ({ ...d, avgLoad: Math.round(d.avgLoad / d.count) }));
    };

    const totalFaculty = FACULTY_DATA.length;
    const totalFTE = FACULTY_DATA.reduce((sum, f) => sum + (f.ftePercentage / 100), 0);
    const overloaded = FACULTY_DATA.filter(f => f.status === 'Overloaded').length;
    const underloaded = FACULTY_DATA.filter(f => f.status === 'Underloaded').length;
    const departmentSummary = getDepartmentSummary();

    const workloadData = departmentSummary.map(d => ({ name: d.name, avgLoad: d.avgLoad }));

    const columns = [
        { key: 'name', header: t('faculty.name'), sortable: true },
        { key: 'rank', header: t('faculty.rank'), sortable: true },
        { key: 'department', header: t('faculty.department'), sortable: true },
        { key: 'contractType', header: t('faculty.contractType'), sortable: true },
        { key: 'ftePercentage', header: t('faculty.fte'), sortable: true, render: (item: any) => `${item.ftePercentage}%` },
        { key: 'teachingLoad', header: t('faculty.currentLoad'), sortable: true, render: (item: any) => `${item.teachingLoad} / ${item.maxTeachingLoad} hrs` },
        { key: 'status', header: t('common.status'), sortable: true, render: (item: any) => {
            const statusColors = { Overloaded: { bg: colors.dangerBg, text: colors.dangerText }, Balanced: { bg: colors.successBg, text: colors.successText }, Underloaded: { bg: colors.warningBg, text: colors.warningText } };
            const color = statusColors[item.status as keyof typeof statusColors] || { bg: colors.cardBg, text: colors.textPrimary };
            return (<span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: color.bg, color: color.text }}>{item.status}</span>);
        }}
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title={t('faculty.totalFaculty')} value={totalFaculty.toString()} trend={{ value: 5, isPositive: true }} icon={<Users size={24} />} description={t('faculty.allFaculty')} />
                <MetricCard title={t('faculty.totalFTE')} value={totalFTE.toFixed(1)} trend={{ value: 3, isPositive: true }} icon={<Briefcase size={24} />} description={t('faculty.fteDescription')} />
                <MetricCard title={t('faculty.overloaded')} value={overloaded.toString()} trend={{ value: 2, isPositive: false }} icon={<AlertTriangle size={24} />} description={t('faculty.overloadedDescription')} />
                <MetricCard title={t('faculty.underloaded')} value={underloaded.toString()} trend={{ value: 1, isPositive: true }} icon={<CheckCircle2 size={24} />} description={t('faculty.underloadedDescription')} />
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>{t('faculty.workloadByDepartment')}</h3>
                <BarChartComponent data={workloadData} xKey="name" bars={[
                    { dataKey: 'avgLoad', color: '#6366f1', name: t('faculty.avgWorkload') }
                ]} height={300} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {departmentSummary.map(dept => (
                    <div key={dept.name} className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                        <h4 className="text-base font-semibold mb-4" style={{ color: colors.textPrimary }}>{dept.name}</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.totalFTE')}</span>
                                <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{dept.totalFTE.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.avgWorkload')}</span>
                                <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{dept.avgLoad}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.overloaded')}</span>
                                <span className="text-sm font-semibold" style={{ color: colors.dangerText }}>{dept.overloaded}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.underloaded')}</span>
                                <span className="text-sm font-semibold" style={{ color: colors.warningText }}>{dept.underloaded}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl shadow-sm border overflow-hidden" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <div className="p-6 border-b" style={{ borderColor: colors.border }}>
                    <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>{t('faculty.allFaculty')}</h3>
                </div>
                <DataTable data={FACULTY_DATA} columns={columns} pageSize={10} />
            </div>
        </div>
    );
}

// ============================================
// WORKLOAD GAP TAB
// ============================================
function WorkloadGapTab() {
    const { t } = useLanguage();
    const colors = useColors();

    const overloadedFaculty = FACULTY_DATA.filter(f => f.status === 'Overloaded');
    const underloadedFaculty = FACULTY_DATA.filter(f => f.status === 'Underloaded');
    const balancedFaculty = FACULTY_DATA.filter(f => f.status === 'Balanced');

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.dangerBg, borderColor: colors.border }}>
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp size={20} style={{ color: colors.dangerText }} />
                        <h3 className="text-sm font-medium" style={{ color: colors.dangerText }}>{t('faculty.overloaded')}</h3>
                    </div>
                    <p className="text-3xl font-bold" style={{ color: colors.dangerText }}>{overloadedFaculty.length}</p>
                    <p className="text-xs mt-1" style={{ color: colors.dangerText, opacity: 0.8 }}>{t('faculty.facultyMembers')}</p>
                </div>

                <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.warningBg, borderColor: colors.border }}>
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingDown size={20} style={{ color: colors.warningText }} />
                        <h3 className="text-sm font-medium" style={{ color: colors.warningText }}>{t('faculty.underloaded')}</h3>
                    </div>
                    <p className="text-3xl font-bold" style={{ color: colors.warningText }}>{underloadedFaculty.length}</p>
                    <p className="text-xs mt-1" style={{ color: colors.warningText, opacity: 0.8 }}>{t('faculty.facultyMembers')}</p>
                </div>

                <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.successBg, borderColor: colors.border }}>
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 size={20} style={{ color: colors.successText }} />
                        <h3 className="text-sm font-medium" style={{ color: colors.successText }}>{t('faculty.balanced')}</h3>
                    </div>
                    <p className="text-3xl font-bold" style={{ color: colors.successText }}>{balancedFaculty.length}</p>
                    <p className="text-xs mt-1" style={{ color: colors.successText, opacity: 0.8 }}>{t('faculty.facultyMembers')}</p>
                </div>
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>{t('faculty.workloadRules')}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b" style={{ borderColor: colors.border }}>
                                <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: colors.textPrimary }}>{t('faculty.rank')}</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: colors.textPrimary }}>{t('faculty.expectedLoad')}</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: colors.textPrimary }}>{t('faculty.thresholdHours')}</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: colors.textPrimary }}>{t('faculty.releaseHours')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {WORKLOAD_RULES.map((rule, i) => (
                                <tr key={i} className="border-b" style={{ borderColor: colors.border }}>
                                    <td className="py-3 px-4 text-sm" style={{ color: colors.textPrimary }}>{rule.rank}</td>
                                    <td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{rule.expectedLoad}%</td>
                                    <td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{rule.thresholdHours}h</td>
                                    <td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{rule.releaseHours}h</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl shadow-sm border overflow-hidden" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="p-4 border-b" style={{ backgroundColor: colors.dangerBg, borderColor: colors.border }}>
                        <h3 className="text-base font-semibold flex items-center gap-2" style={{ color: colors.dangerText }}>
                            <AlertTriangle size={18} />
                            {t('faculty.overloadedFaculty')}
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {overloadedFaculty.map(f => (
                            <div key={f.id} className="rounded-lg p-3 border" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-medium text-sm" style={{ color: colors.textPrimary }}>{f.name}</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{f.rank} • {f.department}</p>
                                    </div>
                                    <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: colors.dangerBg, color: colors.dangerText }}>
                                        +{f.teachingLoad - f.maxTeachingLoad} hrs
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                                        <div className="h-full rounded-full" style={{ width: `${Math.min((f.teachingLoad / f.maxTeachingLoad) * 100, 150)}%`, backgroundColor: colors.danger }}></div>
                                    </div>
                                    <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>{f.teachingLoad} hrs</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl shadow-sm border overflow-hidden" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="p-4 border-b" style={{ backgroundColor: colors.warningBg, borderColor: colors.border }}>
                        <h3 className="text-base font-semibold flex items-center gap-2" style={{ color: colors.warningText }}>
                            <TrendingDown size={18} />
                            {t('faculty.underloadedFaculty')}
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {underloadedFaculty.map(f => (
                            <div key={f.id} className="rounded-lg p-3 border" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-medium text-sm" style={{ color: colors.textPrimary }}>{f.name}</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{f.rank} • {f.department}</p>
                                    </div>
                                    <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: colors.warningBg, color: colors.warningText }}>
                                        -{f.maxTeachingLoad - f.teachingLoad} hrs
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                                        <div className="h-full rounded-full" style={{ width: `${(f.teachingLoad / f.maxTeachingLoad) * 100}%`, backgroundColor: colors.warning }}></div>
                                    </div>
                                    <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>{f.teachingLoad} hrs</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// SMART ALLOCATION TAB
// ============================================
function SmartAllocationTab() {
    const { t } = useLanguage();
    const colors = useColors();
    const [priorityFilter, setPriorityFilter] = useState<string>('All');

    const suggestions = getSmartSuggestions();
    const filteredSuggestions = priorityFilter === 'All' ? suggestions : suggestions.filter(s => s.priority === priorityFilter);

    const priorityCounts = {
        total: suggestions.length,
        high: suggestions.filter(s => s.priority === 'High').length,
        medium: suggestions.filter(s => s.priority === 'Medium').length,
        low: suggestions.filter(s => s.priority === 'Low').length,
    };

    const totalSavings = suggestions.reduce((sum, s) => sum + (s.costSavings || 0), 0);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Reassign': return <ChevronRight size={16} />;
            case 'Hire': return <Users size={16} />;
            case 'Reduce': return <TrendingDown size={16} />;
            default: return <Zap size={16} />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return { bg: colors.dangerBg, text: colors.dangerText };
            case 'Medium': return { bg: colors.warningBg, text: colors.warningText };
            case 'Low': return { bg: colors.infoBg, text: colors.infoText };
            default: return { bg: colors.cardBg, text: colors.textPrimary };
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.accentBg, borderColor: colors.accent }}>
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: colors.accent + '20' }}>
                        <Sparkles size={24} style={{ color: colors.accent }} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1" style={{ color: colors.textPrimary }}>{t('faculty.aiRecommendations')}</h3>
                        <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>{t('faculty.aiRecommendationsDescription')}</p>
                        <div className="flex items-center gap-2">
                            <DollarSign size={18} style={{ color: colors.success }} />
                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                {t('faculty.potentialSavings')}: <span style={{ color: colors.success }}>${totalSavings.toLocaleString()}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-xl p-4 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Target size={16} style={{ color: colors.accent }} />
                        <h4 className="text-xs font-medium" style={{ color: colors.textSecondary }}>{t('faculty.totalSuggestions')}</h4>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{priorityCounts.total}</p>
                </div>
                <div className="rounded-xl p-4 shadow-sm border" style={{ backgroundColor: colors.dangerBg, borderColor: colors.border }}>
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} style={{ color: colors.dangerText }} />
                        <h4 className="text-xs font-medium" style={{ color: colors.dangerText }}>{t('faculty.highPriority')}</h4>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: colors.dangerText }}>{priorityCounts.high}</p>
                </div>
                <div className="rounded-xl p-4 shadow-sm border" style={{ backgroundColor: colors.warningBg, borderColor: colors.border }}>
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} style={{ color: colors.warningText }} />
                        <h4 className="text-xs font-medium" style={{ color: colors.warningText }}>{t('faculty.mediumPriority')}</h4>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: colors.warningText }}>{priorityCounts.medium}</p>
                </div>
                <div className="rounded-xl p-4 shadow-sm border" style={{ backgroundColor: colors.infoBg, borderColor: colors.border }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Info size={16} style={{ color: colors.infoText }} />
                        <h4 className="text-xs font-medium" style={{ color: colors.infoText }}>{t('faculty.lowPriority')}</h4>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: colors.infoText }}>{priorityCounts.low}</p>
                </div>
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>{t('faculty.suggestions')}</h3>
                    <div className="flex gap-2">
                        {['All', 'High', 'Medium', 'Low'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPriorityFilter(p)}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                style={{
                                    backgroundColor: priorityFilter === p ? colors.accent : 'transparent',
                                    color: priorityFilter === p ? '#ffffff' : colors.textSecondary,
                                    border: `1px solid ${priorityFilter === p ? colors.accent : colors.border}`,
                                }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredSuggestions.map(suggestion => {
                        const priorityColor = getPriorityColor(suggestion.priority);
                        return (
                            <div key={suggestion.id} className="rounded-lg p-4 border" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border }}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: colors.accentBg }}>
                                            {getTypeIcon(suggestion.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: priorityColor.bg, color: priorityColor.text }}>
                                                    {suggestion.priority}
                                                </span>
                                                <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>{suggestion.type}</span>
                                            </div>
                                            <h4 className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>{suggestion.suggestion}</h4>
                                            <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>{suggestion.impact}</p>
                                            {suggestion.costSavings && (
                                                <div className="flex items-center gap-1">
                                                    <DollarSign size={14} style={{ color: colors.success }} />
                                                    <span className="text-xs font-medium" style={{ color: colors.success }}>
                                                        ${suggestion.costSavings.toLocaleString()} {t('faculty.savings')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                        style={{
                                            backgroundColor: colors.accent,
                                            color: '#ffffff',
                                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                                        }}
                                    >
                                        {t('faculty.apply')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ============================================
// SIMULATION TAB
// ============================================
function SimulationTab() {
    const { t } = useLanguage();
    const colors = useColors();
    const [courseLoadChange, setCourseLoadChange] = useState(0);
    const [newHires, setNewHires] = useState(0);
    const [selectedDept, setSelectedDept] = useState<string>('All');
    const [saved, setSaved] = useState(false);
    const [comparing, setComparing] = useState(false);

    const getDepartmentSummary = () => {
        const deptMap: any = {};
        FACULTY_DATA.forEach(f => {
            if (selectedDept !== 'All' && f.department !== selectedDept) return;
            if (!deptMap[f.department]) {
                deptMap[f.department] = { totalFTE: 0, avgLoad: 0, count: 0, overloaded: 0, underloaded: 0 };
            }
            deptMap[f.department].totalFTE += f.ftePercentage / 100;
            deptMap[f.department].avgLoad += f.teachingLoad;
            deptMap[f.department].count += 1;
            if (f.status === 'Overloaded') deptMap[f.department].overloaded += 1;
            if (f.status === 'Underloaded') deptMap[f.department].underloaded += 1;
        });
        return Object.values(deptMap).reduce((acc: any, d: any) => ({
            totalFTE: acc.totalFTE + d.totalFTE,
            avgLoad: acc.avgLoad + d.avgLoad,
            count: acc.count + d.count,
            overloaded: acc.overloaded + d.overloaded,
            underloaded: acc.underloaded + d.underloaded,
        }), { totalFTE: 0, avgLoad: 0, count: 0, overloaded: 0, underloaded: 0 });
    };

    const currentSummary = getDepartmentSummary();
    const currentAvgLoad = currentSummary.count > 0 ? Math.round(currentSummary.avgLoad / currentSummary.count) : 0;

    const projectedFTE = currentSummary.totalFTE + newHires;
    const projectedAvgLoad = Math.max(0, Math.round(currentAvgLoad + courseLoadChange - (newHires * 10)));
    const projectedOverloaded = Math.max(0, Math.round(currentSummary.overloaded * (projectedAvgLoad / currentAvgLoad)));
    const projectedUnderloaded = Math.round(currentSummary.underloaded * (projectedAvgLoad / currentAvgLoad));

    const trendData = [
        { name: t('common.current'), avgLoad: currentAvgLoad },
        { name: 'Q1', avgLoad: Math.round(currentAvgLoad + (projectedAvgLoad - currentAvgLoad) * 0.25) },
        { name: 'Q2', avgLoad: Math.round(currentAvgLoad + (projectedAvgLoad - currentAvgLoad) * 0.5) },
        { name: 'Q3', avgLoad: Math.round(currentAvgLoad + (projectedAvgLoad - currentAvgLoad) * 0.75) },
        { name: t('faculty.projected'), avgLoad: projectedAvgLoad },
    ];

    const departments = ['All', ...Array.from(new Set(FACULTY_DATA.map(f => f.department)))];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleCompare = () => {
        setComparing(true);
        setTimeout(() => setComparing(false), 1500);
    };

    const handleReset = () => {
        setCourseLoadChange(0);
        setNewHires(0);
        setSelectedDept('All');
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>{t('faculty.simulationParameters')}</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>{t('faculty.department')}</label>
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border text-sm"
                            style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium" style={{ color: colors.textPrimary }}>{t('faculty.courseLoadChange')}</label>
                            <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: courseLoadChange > 0 ? colors.dangerBg : courseLoadChange < 0 ? colors.successBg : colors.border, color: courseLoadChange > 0 ? colors.dangerText : courseLoadChange < 0 ? colors.successText : colors.textSecondary }}>
                                {courseLoadChange > 0 ? '+' : ''}{courseLoadChange}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="-20"
                            max="20"
                            value={courseLoadChange}
                            onChange={(e) => setCourseLoadChange(Number(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{ background: `linear-gradient(to right, ${colors.success} 0%, ${colors.border} 50%, ${colors.danger} 100%)` }}
                        />
                        <div className="flex justify-between text-xs mt-1" style={{ color: colors.textSecondary }}>
                            <span>-20%</span>
                            <span>0%</span>
                            <span>+20%</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium" style={{ color: colors.textPrimary }}>{t('faculty.newHires')}</label>
                            <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: colors.accentBg, color: colors.accent }}>
                                +{newHires} {t('faculty.facultyMembers')}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={newHires}
                            onChange={(e) => setNewHires(Number(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{ background: `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${(newHires / 10) * 100}%, ${colors.border} ${(newHires / 10) * 100}%, ${colors.border} 100%)` }}
                        />
                        <div className="flex justify-between text-xs mt-1" style={{ color: colors.textSecondary }}>
                            <span>0</span>
                            <span>5</span>
                            <span>10</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}>
                        <Clock size={18} />
                        {t('faculty.currentState')}
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.surfaceBg }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.totalFTE')}</span>
                            <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>{currentSummary.totalFTE.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.surfaceBg }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.avgWorkload')}</span>
                            <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>{currentAvgLoad}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.surfaceBg }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.overloaded')}</span>
                            <span className="text-lg font-bold" style={{ color: colors.dangerText }}>{currentSummary.overloaded}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.surfaceBg }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.underloaded')}</span>
                            <span className="text-lg font-bold" style={{ color: colors.warningText }}>{currentSummary.underloaded}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.accentBg, borderColor: colors.accent }}>
                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: colors.accent }}>
                        <TrendingUp size={18} />
                        {t('faculty.projectedState')}
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.cardBg }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.totalFTE')}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>{projectedFTE.toFixed(1)}</span>
                                {newHires > 0 && (
                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.successBg, color: colors.successText }}>
                                        +{newHires}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.cardBg }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.avgWorkload')}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>{projectedAvgLoad}%</span>
                                {courseLoadChange !== 0 && (
                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: courseLoadChange > 0 ? colors.dangerBg : colors.successBg, color: courseLoadChange > 0 ? colors.dangerText : colors.successText }}>
                                        {courseLoadChange > 0 ? '+' : ''}{courseLoadChange}%
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.cardBg }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.overloaded')}</span>
                            <span className="text-lg font-bold" style={{ color: colors.dangerText }}>{projectedOverloaded}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.cardBg }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>{t('faculty.underloaded')}</span>
                            <span className="text-lg font-bold" style={{ color: colors.warningText }}>{projectedUnderloaded}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>{t('faculty.projectionTrend')}</h3>
                <LineChartComponent data={trendData} xKey="name" lines={[
                    { dataKey: 'avgLoad', color: '#6366f1', name: t('faculty.avgWorkload') }
                ]} height={300} />
            </div>

            <div className="flex flex-wrap gap-3">
                <button onClick={handleSave}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: saved ? colors.successBg : '#6366f1', color: saved ? colors.successText : '#ffffff', boxShadow: saved ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                    {saved ? <Check size={16} /> : <Save size={16} />}
                    {saved ? t('common.saved') : t('faculty.saveScenario')}
                </button>
                <button onClick={handleCompare}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: comparing ? colors.infoBg : 'transparent', color: comparing ? colors.infoText : colors.textPrimary, border: `1px solid ${colors.border}` }}>
                    <GitCompare size={16} />
                    {comparing ? t('common.opening') : t('common.compare')}
                </button>
                <button onClick={handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: 'transparent', color: colors.textPrimary, border: `1px solid ${colors.border}` }}>
                    <RotateCcw size={16} />
                    {t('common.reset')}
                </button>
            </div>
        </div>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function FacultyRequirementsPage() {
    const { t } = useLanguage();
    const colors = useColors();
    const [activeTab, setActiveTab] = useState<TabType>('load-summary');

    const tabs: { id: TabType; label: string }[] = [
        { id: 'load-summary', label: t('faculty.loadSummary') },
        { id: 'workload-gap', label: t('faculty.workloadGap') },
        { id: 'smart-allocation', label: t('faculty.smartAllocation') },
        { id: 'simulation', label: t('faculty.simulation') },
    ];

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: colors.bgPrimary }}>
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                        {t('faculty.requirementsUtilization')}
                    </h1>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                        {t('faculty.requirementsDescription')}
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
                        {activeTab === 'load-summary' && <LoadSummaryTab />}
                        {activeTab === 'workload-gap' && <WorkloadGapTab />}
                        {activeTab === 'smart-allocation' && <SmartAllocationTab />}
                        {activeTab === 'simulation' && <SimulationTab />}
                    </div>
                </div>
            </div>
        </div>
    );
}
