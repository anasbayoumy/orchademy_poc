'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import BarChartComponent from '@/components/charts/BarChart';
import LineChartComponent from '@/components/charts/LineChart';
import DataTable from '@/components/ui/DataTable';
import { Users, Activity, TrendingUp, UserCheck, Target, CheckCircle2, AlertCircle, XCircle, Info, Lightbulb, RotateCcw, Layers } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import EFF_12 from '@/data/KPIs/EFF-12';

const eff12 = EFF_12 as any;
const TARGET_MAX = eff12?.targets?.max ?? 18;

const DEPT_TO_COLLEGE: Record<string, string> = {
  'Civil Department': 'Engineering',
  'Computer Science Department': 'Computing',
  'Cybersecurity Department': 'Computing',
  'Data Science Department': 'Computing',
  'Education Department': 'Humanities',
  'Electrical Department': 'Engineering',
  'Finance Department': 'Business',
  'Management Department': 'Business',
  'Marketing Department': 'Business',
  'Mechanical Department': 'Engineering',
  'Media Department': 'Humanities',
  'Nursing Department': 'Health Sciences',
  'Pharmacy Department': 'Health Sciences',
  'Psychology Department': 'Humanities',
  'Public Health Department': 'Health Sciences',
};

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

type TabType = 'overview' | 'student-faculty';
function Tab({ id, label, isActive, onClick, colors }: { id: TabType; label: string; isActive: boolean; onClick: () => void; colors: any }) {
    return (
        <button
            onClick={onClick}
            className="px-6 py-3 text-sm font-medium transition-all"
            style={{
                color: isActive ? colors.accent : colors.textSecondary,
                borderBottom: isActive ? `2px solid ${colors.accent}` : '2px solid transparent',
                backgroundColor: isActive ? `${colors.accent}15` : 'transparent',
            }}
        >
            {label}
        </button>
    );
}

function StudentToFacultyRatioTab() {
    const colors = useColors();
    const [granularity, setGranularity] = useState<'college' | 'department'>('college');
    const [selectedCollege, setSelectedCollege] = useState<string>('All');
    const [selectedYear, setSelectedYear] = useState<string>('All');
    const [selectedTerm, setSelectedTerm] = useState<string>('All');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

    const collegeTermData = eff12.collegeTermData || [];
    const departmentYearData = eff12.departmentYearData || [];
    const institutionData = eff12.institutionData || [];

    const years = useMemo(() => {
        const fromCollege = collegeTermData.map((d: any) => String(d.academicYear ?? ''));
        const fromDept = departmentYearData.map((d: any) => String(d.academicYear ?? ''));
        return ['All', ...Array.from(new Set([...fromCollege, ...fromDept])).filter(Boolean).sort()] as string[];
    }, [collegeTermData, departmentYearData]);

    const colleges = useMemo(() => {
        const vals = collegeTermData.map((d: any) => String(d.college ?? ''));
        return ['All', ...Array.from(new Set(vals)).sort()] as string[];
    }, [collegeTermData]);

    const terms = useMemo((): string[] => ['All', 'Fall', 'Spring'], []);

    const departments = useMemo(() => {
        let depts = departmentYearData.map((d: any) => String(d.department ?? ''));
        if (selectedCollege !== 'All') {
            depts = depts.filter((d: string) => DEPT_TO_COLLEGE[d] === selectedCollege);
        }
        return ['All', ...Array.from(new Set(depts)).sort()] as string[];
    }, [departmentYearData, selectedCollege]);

    const filteredCollegeData = useMemo(() => {
        return collegeTermData.filter((d: any) => {
            if (selectedCollege !== 'All' && d.college !== selectedCollege) return false;
            if (selectedYear !== 'All' && d.academicYear !== selectedYear) return false;
            if (selectedTerm !== 'All' && d.term !== selectedTerm) return false;
            return true;
        });
    }, [collegeTermData, selectedCollege, selectedYear, selectedTerm]);

    const filteredDeptData = useMemo(() => {
        return departmentYearData.filter((d: any) => {
            if (selectedYear !== 'All' && d.academicYear !== selectedYear) return false;
            if (selectedCollege !== 'All' && DEPT_TO_COLLEGE[d.department] !== selectedCollege) return false;
            if (selectedDepartment !== 'All' && d.department !== selectedDepartment) return false;
            return true;
        });
    }, [departmentYearData, selectedYear, selectedCollege, selectedDepartment]);

    const isCollegeView = granularity === 'college';
    const filteredData = isCollegeView ? filteredCollegeData : filteredDeptData;

    const metrics = useMemo(() => {
        if (filteredData.length === 0) {
            const inst = institutionData[0];
            if (inst) {
                const r = inst.studentToFacultyRatio ?? 0;
                const gap = r - TARGET_MAX;
                const status = r <= TARGET_MAX ? 'green' : r <= (eff12?.targets?.watch ?? 25) ? 'amber' : 'red';
                return { actual: r, target: TARGET_MAX, gap, status };
            }
            return { actual: 0, target: TARGET_MAX, gap: 0, status: 'amber' as const };
        }
        const totalStudents = filteredData.reduce((s: number, d: any) => s + (d.activeStudents ?? 0), 0);
        const totalFaculty = filteredData.reduce((s: number, d: any) => s + (d.facultyFTE ?? 0), 0);
        const actual = totalFaculty > 0 ? Math.round((totalStudents / totalFaculty) * 100) / 100 : 0;
        const gap = actual - TARGET_MAX;
        const status = actual <= TARGET_MAX ? 'green' : actual <= (eff12?.targets?.watch ?? 25) ? 'amber' : 'red';
        return { actual, target: TARGET_MAX, gap, status };
    }, [filteredData, institutionData]);

    const trendData = useMemo(() => {
        if (isCollegeView) {
            const byPeriod: Record<string, { students: number; faculty: number }> = {};
            filteredCollegeData.forEach((d: any) => {
                const k = `${d.academicYear} ${d.term ?? ''}`.trim();
                if (!byPeriod[k]) byPeriod[k] = { students: 0, faculty: 0 };
                byPeriod[k].students += d.activeStudents ?? 0;
                byPeriod[k].faculty += d.facultyFTE ?? 0;
            });
            return Object.entries(byPeriod)
                .map(([name, v]) => ({ name, actual: v.faculty > 0 ? Math.round((v.students / v.faculty) * 100) / 100 : 0, target: TARGET_MAX }))
                .sort((a, b) => a.name.localeCompare(b.name));
        }
        const byYear: Record<string, { students: number; faculty: number }> = {};
        filteredDeptData.forEach((d: any) => {
            const k = d.academicYear;
            if (!byYear[k]) byYear[k] = { students: 0, faculty: 0 };
            byYear[k].students += d.activeStudents ?? 0;
            byYear[k].faculty += d.facultyFTE ?? 0;
        });
        return Object.entries(byYear)
            .map(([name, v]) => ({ name, actual: v.faculty > 0 ? Math.round((v.students / v.faculty) * 100) / 100 : 0, target: TARGET_MAX }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [isCollegeView, filteredCollegeData, filteredDeptData]);

    const barData = useMemo(() => {
        if (isCollegeView) {
            const byCollege: Record<string, { students: number; faculty: number }> = {};
            filteredCollegeData.forEach((d: any) => {
                if (!byCollege[d.college]) byCollege[d.college] = { students: 0, faculty: 0 };
                byCollege[d.college].students += d.activeStudents ?? 0;
                byCollege[d.college].faculty += d.facultyFTE ?? 0;
            });
            return Object.entries(byCollege)
                .map(([name, v]) => ({ name, ratio: v.faculty > 0 ? Math.round((v.students / v.faculty) * 100) / 100 : 0 }))
                .sort((a, b) => b.ratio - a.ratio);
        }
        const byDept: Record<string, { students: number; faculty: number }> = {};
        filteredDeptData.forEach((d: any) => {
            const name = d.department ?? '';
            if (!byDept[name]) byDept[name] = { students: 0, faculty: 0 };
            byDept[name].students += d.activeStudents ?? 0;
            byDept[name].faculty += d.facultyFTE ?? 0;
        });
        return Object.entries(byDept)
            .map(([name, v]) => ({ name: name.replace(' Department', ''), ratio: v.faculty > 0 ? Math.round((v.students / v.faculty) * 100) / 100 : 0 }))
            .sort((a, b) => b.ratio - a.ratio);
    }, [isCollegeView, filteredCollegeData, filteredDeptData]);

    const insights = useMemo(() => {
        const redItems = [...new Set(filteredData.filter((d: any) => d.status === 'red').map((d: any) => d.college ?? d.department ?? ''))];
        const greenItems = [...new Set(filteredData.filter((d: any) => d.status === 'green').map((d: any) => d.college ?? d.department ?? ''))];
        const label = isCollegeView ? 'college' : 'department';
        const list: string[] = [];
        if (metrics.actual > TARGET_MAX) {
            list.push(`Filtered ratio is ${metrics.gap.toFixed(2)} above the ${TARGET_MAX}:1 target. Consider hiring additional faculty or adjusting enrollment.`);
        } else {
            list.push(`Filtered ratio is within the ${TARGET_MAX}:1 target. Current ratio ${metrics.actual.toFixed(2)}:1.`);
        }
        if (redItems.filter(Boolean).length > 0) {
            list.push(`${redItems.filter(Boolean).join(', ')} ${redItems.length === 1 ? 'exceeds' : 'exceed'} the target. Prioritize faculty hiring or load rebalancing.`);
        }
        if (greenItems.filter(Boolean).length > 0 && redItems.filter(Boolean).length > 0) {
            list.push(`Best-performing (within target): ${greenItems.filter(Boolean).join(', ')}. Consider sharing workload strategies.`);
        }
        list.push(`Target band 12–18:1; watch >${eff12?.targets?.watch ?? 25}:1. Lower ratio = fewer students per faculty = higher quality engagement.`);
        return list;
    }, [filteredData, metrics, isCollegeView]);

    const resetFilters = () => {
        setSelectedCollege('All');
        setSelectedYear('All');
        setSelectedTerm('All');
        setSelectedDepartment('All');
    };
    const hasFilters = selectedCollege !== 'All' || selectedYear !== 'All' || selectedTerm !== 'All' || selectedDepartment !== 'All';

    const tableColumns = isCollegeView
        ? [
            { key: 'academicYear', header: 'Academic Year' },
            { key: 'term', header: 'Term' },
            { key: 'college', header: 'College' },
            { key: 'activeStudents', header: 'Active Students' },
            { key: 'facultyFTE', header: 'Faculty FTE' },
            {
                key: 'studentToFacultyRatio',
                header: 'Ratio',
                render: (d: any) => (
                    <span className="font-semibold" style={{ color: getStatusColor(colors, d.status ?? 'amber') }}>
                        {(d.studentToFacultyRatio ?? 0).toFixed(2)}:1
                    </span>
                ),
            },
            {
                key: 'status',
                header: 'Status',
                render: (d: any) => (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: getStatusBg(colors, d.status ?? 'amber'), color: getStatusColor(colors, d.status ?? 'amber') }}>
                        {(d.status ?? 'amber').toUpperCase()}
                    </span>
                ),
            },
        ]
        : [
            { key: 'academicYear', header: 'Academic Year' },
            { key: 'department', header: 'Department' },
            { key: 'activeStudents', header: 'Active Students' },
            { key: 'facultyFTE', header: 'Faculty FTE' },
            {
                key: 'studentToFacultyRatio',
                header: 'Ratio',
                render: (d: any) => (
                    <span className="font-semibold" style={{ color: getStatusColor(colors, d.status ?? 'amber') }}>
                        {(d.studentToFacultyRatio ?? 0).toFixed(2)}:1
                    </span>
                ),
            },
            {
                key: 'status',
                header: 'Status',
                render: (d: any) => (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: getStatusBg(colors, d.status ?? 'amber'), color: getStatusColor(colors, d.status ?? 'amber') }}>
                        {(d.status ?? 'amber').toUpperCase()}
                    </span>
                ),
            },
        ];

    const cardStyle = { backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl p-6 border" style={{ ...cardStyle, backgroundColor: colors.accentBg, borderColor: colors.accent, border: `1px solid ${colors.accent}` }}>
                <div className="flex items-center gap-2 mb-4">
                    <Target size={22} style={{ color: colors.accent }} />
                    <span className="text-base font-semibold" style={{ color: colors.textPrimary }}>Student-to-Faculty Ratio (Actual)</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <p className="text-2xl font-bold" style={{ color: getStatusColor(colors, metrics.status) }}>{metrics.actual.toFixed(2)}:1</p>
                        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Actual Ratio</p>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{TARGET_MAX}:1</p>
                        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Target (max)</p>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <p className="text-2xl font-bold" style={{ color: metrics.gap > 0 ? colors.dangerText : colors.successText }}>{metrics.gap > 0 ? '+' : ''}{metrics.gap.toFixed(2)}</p>
                        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Gap vs Target</p>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold" style={{ backgroundColor: getStatusBg(colors, metrics.status), color: getStatusColor(colors, metrics.status) }}>
                            {metrics.status === 'green' ? <CheckCircle2 size={14} /> : metrics.status === 'red' ? <XCircle size={14} /> : <AlertCircle size={14} />}
                            {metrics.status.toUpperCase()}
                        </span>
                        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Target ≤{TARGET_MAX}:1</p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl p-6" style={cardStyle}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.primary1}20` }}>
                            <Layers size={18} style={{ color: colors.primary1 }} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>Filters</h3>
                            <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>Combine filters for Year, Term, College, Department</p>
                        </div>
                    </div>
                    {hasFilters && (
                        <button onClick={resetFilters} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}>
                            <RotateCcw size={14} />
                            Reset filters
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 p-2 rounded-lg mb-4" style={{ backgroundColor: colors.surfaceBg }}>
                    <button onClick={() => setGranularity('college')} className="px-3 py-2 rounded-md text-xs font-medium" style={{ backgroundColor: granularity === 'college' ? colors.accent : 'transparent', color: granularity === 'college' ? '#fff' : colors.textSecondary }}>By College (Term)</button>
                    <button onClick={() => setGranularity('department')} className="px-3 py-2 rounded-md text-xs font-medium" style={{ backgroundColor: granularity === 'department' ? colors.accent : 'transparent', color: granularity === 'department' ? '#fff' : colors.textSecondary }}>By Department (Year)</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Academic Year</label>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }}>
                            {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    {isCollegeView && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Term</label>
                            <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }}>
                                {terms.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>College</label>
                        <select value={selectedCollege} onChange={(e) => { setSelectedCollege(e.target.value); if (e.target.value !== selectedCollege) setSelectedDepartment('All'); }} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }}>
                            {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    {!isCollegeView && (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Department</label>
                            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }}>
                                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    )}
                </div>
                <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop: `1px solid ${colors.border}` }}>
                    <Info size={16} style={{ color: colors.infoText }} />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                        Showing <strong style={{ color: colors.textPrimary }}>{filteredData.length}</strong> record{filteredData.length !== 1 ? 's' : ''}
                        {selectedYear !== 'All' && ` • ${selectedYear}`}
                        {isCollegeView && selectedTerm !== 'All' && ` • ${selectedTerm}`}
                        {selectedCollege !== 'All' && ` • ${selectedCollege}`}
                        {!isCollegeView && selectedDepartment !== 'All' && ` • ${selectedDepartment}`}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl p-6" style={cardStyle}>
                    <h3 className="text-base font-semibold mb-4" style={{ color: colors.textPrimary }}>Ratio Trend (Target vs Actual)</h3>
                    {trendData.length > 0 ? (
                        <LineChartComponent data={trendData} xKey="name" lines={[{ dataKey: 'actual', color: colors.primary1, name: 'Actual' }, { dataKey: 'target', color: colors.successText, name: 'Target' }]} height={280} showLegend={true} yFormatter={(v) => v.toFixed(1) + ':1'} />
                    ) : (
                        <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data for selected filters</p>
                    )}
                </div>
                <div className="rounded-xl p-6" style={cardStyle}>
                    <h3 className="text-base font-semibold mb-4" style={{ color: colors.textPrimary }}>Ratio by {isCollegeView ? 'College' : 'Department'}</h3>
                    {barData.length > 0 ? (
                        <BarChartComponent data={barData} xKey="name" bars={[{ dataKey: 'ratio', color: colors.primary1, name: 'Ratio' }]} height={280} />
                    ) : (
                        <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data for selected filters</p>
                    )}
                    <div className="mt-4 pt-4 flex flex-wrap gap-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.successText }} /><span className="text-xs" style={{ color: colors.textSecondary }}>Within target (≤{TARGET_MAX}:1)</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.warningText }} /><span className="text-xs" style={{ color: colors.textSecondary }}>Watch (18–25:1)</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.dangerText }} /><span className="text-xs" style={{ color: colors.textSecondary }}>Above threshold ({'>'}25:1)</span></div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl overflow-hidden" style={cardStyle}>
                <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>Data Table</h3>
                    <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>Active_Students ÷ Faculty_FTE by {isCollegeView ? 'College & Term' : 'Department & Year'}</p>
                </div>
                <DataTable data={filteredData} columns={tableColumns} searchPlaceholder="Search..." pageSize={12} exportFileName="student-faculty-ratio" />
            </div>

            <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.accentBg, borderColor: `${colors.accent}40` }}>
                <div className="flex items-center gap-3 mb-4">
                    <Lightbulb size={22} style={{ color: colors.accent }} />
                    <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Key Insights</h3>
                </div>
                <ul className="space-y-2">
                    {insights.map((text, i) => (
                        <li key={i} className="flex gap-2 text-sm" style={{ color: colors.textSecondary }}>
                            <span style={{ color: colors.accent }}>•</span>
                            {text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function OverviewTab() {
    const colors = useColors();
    const inst = (eff12?.institutionData ?? [])[0];
    const stfValue = inst ? `${inst.studentToFacultyRatio?.toFixed(2) ?? '5.51'}:1` : '5.51:1';

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Student-to-Faculty Ratio', value: stfValue, change: -3, label: 'improvement', icon: <Users size={20} strokeWidth={1.5} /> },
                    { title: 'Admin-to-Faculty', value: '0.42:1', change: 2, label: 'ratio', icon: <Activity size={20} strokeWidth={1.5} /> },
                    { title: 'Student-to-Admin', value: '28:1', change: -5, label: 'optimized', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                    { title: 'Advisor Caseload', value: '42', change: -8, label: 'per advisor', icon: <UserCheck size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>Workforce Ratios (Actual)</h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Monitor actual workforce ratios including student-to-faculty, admin-to-faculty, student-to-admin, and advisor caseloads to ensure optimal staffing levels.
                </p>
            </div>
        </div>
    );
}

export default function WorkforceRatiosPage() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();
    const tabs = [{ id: 'student-faculty' as TabType, label: 'Student-to-Faculty Ratio' }, { id: 'overview' as TabType, label: 'Overview' }];
    const [activeTab, setActiveTab] = useState<TabType>(tabs[0].id);

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header
                title={t('sidebar.efficiency.workforceRatios')}
                subtitle="Student-to-faculty, admin-to-faculty, and advisor caseload ratios"
            />

            <div className="flex flex-wrap gap-0 border-b mb-6" style={{ borderColor: colors.border }}>
                {tabs.map(tab => (
                    <Tab key={tab.id} id={tab.id} label={tab.label} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} colors={colors} />
                ))}
            </div>

            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'student-faculty' && <StudentToFacultyRatioTab />}
        </div>
    );
}
