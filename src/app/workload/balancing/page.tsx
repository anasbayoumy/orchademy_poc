'use client';

import { useState, useMemo, useCallback } from 'react';
import Header from '@/components/layout/Header';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import BarChartComponent from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import {
    Target,
    Layers,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Filter,
    ChevronDown,
    ChevronUp,
    Info,
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    RotateCcw,
} from 'lucide-react';
import PLN_01 from '@/data/KPIs/PLN-01';

type ViewLevel = 'term' | 'course' | 'section';
type StatusFilter = 'All' | 'Optimal' | 'Underfilled' | 'Overfilled';
type SortKey = 'year' | 'term' | 'course' | 'total' | 'optimal' | 'pctOptimal' | 'section' | 'enrolled' | 'status';
type SortDir = 'asc' | 'desc';

const TARGET_MIN = 20;
const TARGET_MAX = 30;

function OptimumClassSizeTab() {
    const colors = useColors();
    const { isRTL } = useLanguage();

    const [filtersOpen, setFiltersOpen] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>('All');
    const [selectedTerm, setSelectedTerm] = useState<string>('All');
    const [selectedCourse, setSelectedCourse] = useState<string>('All');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
    const [courseSearch, setCourseSearch] = useState('');
    const [viewLevel, setViewLevel] = useState<ViewLevel>('term');
    const [sectionPage, setSectionPage] = useState(0);
    const [sectionPageSize, setSectionPageSize] = useState(25);
    const [coursePage, setCoursePage] = useState(0);
    const [coursePageSize, setCoursePageSize] = useState(25);
    const [courseSort, setCourseSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'pctOptimal', dir: 'desc' });
    const [sectionSort, setSectionSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'enrolled', dir: 'asc' });

    const termData = (PLN_01 as any).termData ?? [];
    const courseTermData = (PLN_01 as any).courseTermData ?? [];
    const sectionTermData = (PLN_01 as any).sectionTermData ?? [];

    const years = useMemo((): string[] => ['All', ...Array.from(new Set(termData.map((d: any) => d.AcademicYear as string))).sort() as string[]], [termData]);
    const terms = useMemo(() => ['All', 'Fall', 'Spring'], []);

    const allCourseTitles = useMemo(() => {
        return Array.from(new Set(courseTermData.map((d: any) => d.CourseTitle as string))).sort() as string[];
    }, [courseTermData]);

    const courseOptions = useMemo(() => {
        if (!courseSearch.trim()) return ['All', ...allCourseTitles.slice(0, 150)];
        const q = courseSearch.toLowerCase();
        const filtered = allCourseTitles.filter((c) => c.toLowerCase().includes(q)).slice(0, 100);
        return ['All', ...filtered];
    }, [allCourseTitles, courseSearch]);

    const filteredTermData = useMemo(() => {
        return termData.filter((d: any) => {
            if (selectedYear !== 'All' && d.AcademicYear !== selectedYear) return false;
            if (selectedTerm !== 'All' && d.Term !== selectedTerm) return false;
            return true;
        });
    }, [termData, selectedYear, selectedTerm]);

    const filteredCourseDataBase = useMemo(() => {
        return courseTermData.filter((d: any) => {
            if (selectedYear !== 'All' && d.AcademicYear !== selectedYear) return false;
            if (selectedTerm !== 'All' && d.Term !== selectedTerm) return false;
            if (selectedCourse !== 'All' && d.CourseTitle !== selectedCourse) return false;
            return true;
        });
    }, [courseTermData, selectedYear, selectedTerm, selectedCourse]);

    const filteredSectionDataBase = useMemo(() => {
        return sectionTermData.filter((d: any) => {
            if (selectedYear !== 'All' && d.AcademicYear !== selectedYear) return false;
            if (selectedTerm !== 'All' && d.Term !== selectedTerm) return false;
            if (selectedCourse !== 'All' && d.CourseTitle !== selectedCourse) return false;
            if (statusFilter !== 'All' && d.classSizeStatus !== statusFilter) return false;
            return true;
        });
    }, [sectionTermData, selectedYear, selectedTerm, selectedCourse, statusFilter]);

    const filteredSectionData = filteredSectionDataBase;

    const sectionDataForCharts = useMemo(() => {
        return sectionTermData.filter((d: any) => {
            if (selectedYear !== 'All' && d.AcademicYear !== selectedYear) return false;
            if (selectedTerm !== 'All' && d.Term !== selectedTerm) return false;
            if (selectedCourse !== 'All' && d.CourseTitle !== selectedCourse) return false;
            return true;
        });
    }, [sectionTermData, selectedYear, selectedTerm, selectedCourse]);

    const totalSections = filteredSectionData.length;
    const totalOptimal = filteredSectionData.filter((d: any) => d.classSizeStatus === 'Optimal').length;
    const underfilled = filteredSectionData.filter((d: any) => d.classSizeStatus === 'Underfilled').length;
    const overfilled = filteredSectionData.filter((d: any) => d.classSizeStatus === 'Overfilled').length;
    const pctOptimal = totalSections > 0 ? (totalOptimal / totalSections * 100).toFixed(1) : '0';

    const donutData = useMemo(
        () => [
            { name: 'Optimal', value: totalOptimal, color: colors.successText },
            { name: 'Underfilled', value: underfilled, color: colors.warningText },
            { name: 'Overfilled', value: overfilled, color: colors.dangerText },
        ].filter((d) => d.value > 0),
        [totalOptimal, underfilled, overfilled, colors.successText, colors.warningText, colors.dangerText]
    );

    const termStackedData = useMemo(() => {
        const byTerm = new Map<string, { optimal: number; underfilled: number; overfilled: number }>();
        sectionDataForCharts.forEach((d: any) => {
            const key = `${d.AcademicYear} ${d.Term}`;
            const cur = byTerm.get(key) ?? { optimal: 0, underfilled: 0, overfilled: 0 };
            if (d.classSizeStatus === 'Optimal') cur.optimal++;
            else if (d.classSizeStatus === 'Underfilled') cur.underfilled++;
            else if (d.classSizeStatus === 'Overfilled') cur.overfilled++;
            byTerm.set(key, cur);
        });
        return Array.from(byTerm.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, v]) => ({
                name,
                Optimal: v.optimal,
                Underfilled: v.underfilled,
                Overfilled: v.overfilled,
                total: v.optimal + v.underfilled + v.overfilled,
                pctOptimal: (v.optimal + v.underfilled + v.overfilled) > 0
                    ? ((v.optimal / (v.optimal + v.underfilled + v.overfilled)) * 100).toFixed(1)
                    : '0',
            }));
    }, [sectionDataForCharts]);

    const termChartData = filteredTermData.map((d: any) => ({
        name: `${d.AcademicYear} ${d.Term}`,
        pctOptimal: d.pctOptimal,
        totalSections: d.totalSections,
        optimalSections: d.optimalSections,
    }));

    const courseChartData = useMemo(() => {
        const byCourse = new Map<string, { total: number; optimal: number }>();
        filteredCourseDataBase.forEach((d: any) => {
            const key = d.CourseTitle;
            const cur = byCourse.get(key) ?? { total: 0, optimal: 0 };
            cur.total += d.totalSections ?? 0;
            cur.optimal += d.optimalSections ?? 0;
            byCourse.set(key, cur);
        });
        return Array.from(byCourse.entries())
            .map(([name, v]) => ({ name: name.length > 35 ? name.slice(0, 32) + '…' : name, pctOptimal: v.total > 0 ? (v.optimal / v.total * 100).toFixed(0) : '0', total: v.total }))
            .sort((a, b) => Number(b.pctOptimal) - Number(a.pctOptimal))
            .slice(0, 15);
    }, [filteredCourseDataBase]);

    const sortCourseData = useCallback(
        (data: any[]) => {
            const { key, dir } = courseSort;
            const getVal = (row: any) => {
                if (key === 'year') return row.AcademicYear ?? '';
                if (key === 'term') return row.Term ?? '';
                if (key === 'course') return row.CourseTitle ?? '';
                if (key === 'total') return row.totalSections ?? 0;
                if (key === 'optimal') return row.optimalSections ?? 0;
                return parseFloat(String(row.pctOptimal)) || 0;
            };
            return [...data].sort((a, b) => {
                const va = getVal(a);
                const vb = getVal(b);
                const cmp = va < vb ? -1 : va > vb ? 1 : 0;
                return dir === 'asc' ? cmp : -cmp;
            });
        },
        [courseSort]
    );

    const sortSectionData = useCallback(
        (data: any[]) => {
            const { key, dir } = sectionSort;
            const getVal = (row: any) => {
                if (key === 'year') return row.AcademicYear ?? '';
                if (key === 'term') return row.Term ?? '';
                if (key === 'course') return row.CourseTitle ?? '';
                if (key === 'section') return row.SectionID ?? '';
                if (key === 'enrolled') return Number(row.EnrolledCount) || 0;
                if (key === 'status') return row.classSizeStatus ?? '';
                return Number(row.EnrolledCount) || 0;
            };
            return [...data].sort((a, b) => {
                const va = getVal(a);
                const vb = getVal(b);
                const cmp = typeof va === 'number' && typeof vb === 'number'
                    ? va - vb
                    : String(va).localeCompare(String(vb), undefined, { numeric: true });
                const sign = cmp < 0 ? -1 : cmp > 0 ? 1 : 0;
                return dir === 'asc' ? sign : -sign;
            });
        },
        [sectionSort]
    );

    const sortedCourseData = useMemo(() => sortCourseData(filteredCourseDataBase), [sortCourseData, filteredCourseDataBase]);
    const sortedSectionData = useMemo(() => sortSectionData(filteredSectionData), [sortSectionData, filteredSectionData]);

    const paginatedSections = useMemo(() => {
        const start = sectionPage * sectionPageSize;
        return sortedSectionData.slice(start, start + sectionPageSize);
    }, [sortedSectionData, sectionPage, sectionPageSize]);

    const paginatedCourseData = useMemo(() => {
        const start = coursePage * coursePageSize;
        return sortedCourseData.slice(start, start + coursePageSize);
    }, [sortedCourseData, coursePage, coursePageSize]);

    const totalPages = Math.ceil(totalSections / sectionPageSize) || 1;
    const totalCourseRows = sortedCourseData.length;
    const totalCoursePages = Math.ceil(totalCourseRows / coursePageSize) || 1;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Optimal': return { bg: colors.successBg, text: colors.successText, icon: CheckCircle2 };
            case 'Underfilled': return { bg: colors.warningBg, text: colors.warningText, icon: AlertTriangle };
            case 'Overfilled': return { bg: colors.dangerBg, text: colors.dangerText, icon: XCircle };
            default: return { bg: colors.cardBg, text: colors.textSecondary, icon: Info };
        }
    };

    const toggleCourseSort = (key: SortKey) => {
        setCourseSort((p) => ({ key, dir: p.key === key && p.dir === 'asc' ? 'desc' : 'asc' }));
    };

    const toggleSectionSort = (key: SortKey) => {
        setSectionSort((p) => ({ key, dir: p.key === key && p.dir === 'asc' ? 'desc' : 'asc' }));
    };

    const SortIcon = ({ activeKey, keyVal, dir }: { activeKey: SortKey; keyVal: SortKey; dir: SortDir }) => {
        if (activeKey !== keyVal) return <ArrowUpDown size={12} style={{ color: colors.textSecondary, opacity: 0.5 }} />;
        return dir === 'asc' ? <ArrowUp size={12} style={{ color: colors.primary1 }} /> : <ArrowDown size={12} style={{ color: colors.primary1 }} />;
    };

    const resetFilters = () => {
        setSelectedYear('All');
        setSelectedTerm('All');
        setSelectedCourse('All');
        setStatusFilter('All');
        setCourseSearch('');
        setSectionPage(0);
        setCoursePage(0);
    };

    const enrollmentProgress = (count: number) => {
        const pct = Math.min(100, (count / 40) * 100);
        let barColor = colors.successText;
        if (count < TARGET_MIN) barColor = colors.warningText;
        else if (count > TARGET_MAX) barColor = colors.dangerText;
        return { pct, barColor };
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-[1400px]" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            {/* Filters - Collapsible */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'transparent' }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary1 + '20' }}>
                            <Filter size={18} style={{ color: colors.primary1 }} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>Filters</h3>
                            <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                                {selectedYear !== 'All' && `${selectedYear} • `}
                                {selectedTerm !== 'All' && `${selectedTerm} • `}
                                {selectedCourse !== 'All' && `${selectedCourse.slice(0, 30)}… • `}
                                {statusFilter !== 'All' && statusFilter}
                                {(selectedYear === 'All' && selectedTerm === 'All' && selectedCourse === 'All' && statusFilter === 'All') && 'All years, terms, courses'}
                            </p>
                        </div>
                    </div>
                    {filtersOpen ? <ChevronUp size={20} style={{ color: colors.textSecondary }} /> : <ChevronDown size={20} style={{ color: colors.textSecondary }} />}
                </button>
                {filtersOpen && (
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 border-t" style={{ borderColor: colors.border }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 pt-4">
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>Academic Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => { setSelectedYear(e.target.value); setSectionPage(0); setCoursePage(0); }}
                                    className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
                                >
                                    {years.map((y: string) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>Term</label>
                                <select
                                    value={selectedTerm}
                                    onChange={(e) => { setSelectedTerm(e.target.value); setSectionPage(0); setCoursePage(0); }}
                                    className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
                                >
                                    {terms.map((t: string) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>Course</label>
                                <div className="relative">
                                    <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: colors.textSecondary }} />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={courseSearch}
                                        onChange={(e) => setCourseSearch(e.target.value)}
                                        className="w-full ps-9 pe-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                                        style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
                                    />
                                </div>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => { setSelectedCourse(e.target.value); setSectionPage(0); setCoursePage(0); }}
                                    className="w-full mt-2 px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
                                >
                                    {courseOptions.map((c: string) => (
                                        <option key={c} value={c}>{c.length > 55 ? c.slice(0, 52) + '…' : c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setSectionPage(0); setCoursePage(0); }}
                                    className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
                                >
                                    <option value="All">All</option>
                                    <option value="Optimal">Optimal only</option>
                                    <option value="Underfilled">Underfilled only</option>
                                    <option value="Overfilled">Overfilled only</option>
                                </select>
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={resetFilters}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"
                                    style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                                >
                                    <RotateCcw size={14} />
                                    Reset
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                            <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                                <Target size={14} />
                                <span className="text-xs">Target band: {TARGET_MIN}–{TARGET_MAX} students</span>
                            </div>
                            <span className="text-xs font-medium" style={{ color: colors.primary1 }}>
                                {filteredSectionData.length.toLocaleString()} sections
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* View Level Tabs */}
            <div className="inline-flex gap-1 p-1 rounded-xl" style={{ backgroundColor: colors.surfaceBg }}>
                {(['term', 'course', 'section'] as ViewLevel[]).map((level) => (
                    <button
                        key={level}
                        onClick={() => setViewLevel(level)}
                        className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                        style={{
                            backgroundColor: viewLevel === level ? colors.cardBg : 'transparent',
                            color: viewLevel === level ? colors.textPrimary : colors.textSecondary,
                            boxShadow: viewLevel === level ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                            border: viewLevel === level ? `1px solid ${colors.border}` : '1px solid transparent'
                        }}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {/* KPI Cards + Donut */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="p-5 rounded-xl h-full min-h-[120px] flex flex-col justify-between transition-all hover:shadow-md" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderLeft: `4px solid ${colors.primary1}` }}>
                    <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Total Sections</span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary1 + '18' }}>
                            <Layers size={18} style={{ color: colors.primary1 }} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold mt-2" style={{ color: colors.textPrimary }}>{totalSections.toLocaleString()}</p>
                </div>
                <div className="p-5 rounded-xl h-full min-h-[120px] flex flex-col justify-between transition-all hover:shadow-md" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderLeft: `4px solid ${colors.successText}` }}>
                    <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Optimal</span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.successBg }}>
                            <CheckCircle2 size={18} style={{ color: colors.successText }} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold mt-2" style={{ color: colors.successText }}>{pctOptimal}%</p>
                </div>
                <div className="p-5 rounded-xl h-full min-h-[120px] flex flex-col justify-between transition-all hover:shadow-md" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderLeft: `4px solid ${colors.warningText}` }}>
                    <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Underfilled</span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.warningBg }}>
                            <AlertTriangle size={18} style={{ color: colors.warningText }} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold mt-2" style={{ color: colors.warningText }}>{underfilled.toLocaleString()}</p>
                </div>
                <div className="p-5 rounded-xl h-full min-h-[120px] flex flex-col justify-between transition-all hover:shadow-md" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderLeft: `4px solid ${colors.dangerText}` }}>
                    <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Overfilled</span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.dangerBg }}>
                            <XCircle size={18} style={{ color: colors.dangerText }} />
                        </div>
                    </div>
                    <p className="text-2xl font-bold mt-2" style={{ color: colors.dangerText }}>{overfilled.toLocaleString()}</p>
                </div>
                <div className="col-span-2 p-5 rounded-xl min-h-[180px] flex flex-col transition-all hover:shadow-md" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Status Distribution</h4>
                    {donutData.length > 0 ? (
                        <div className="flex-1 min-h-[180px]">
                            <DonutChart data={donutData} height={180} innerRadius={50} outerRadius={75} showLegend={true} />
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center min-h-[160px]" style={{ color: colors.textSecondary }}>
                            <span className="text-sm">No data for current filters</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Term View: Stacked Bar + % Optimal */}
            {viewLevel === 'term' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                        <h3 className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>Sections by Status</h3>
                        <p className="text-xs mb-4" style={{ color: colors.textSecondary }}>Stacked by term</p>
                        {termStackedData.length > 0 ? (
                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={termStackedData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: colors.textSecondary }} angle={-25} textAnchor="end" height={60} />
                                        <YAxis tick={{ fontSize: 11, fill: colors.textSecondary }} />
                                        <Tooltip
                                            contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 8, fontSize: 12 }}
                                            formatter={(value: number | undefined) => [value ?? 0, '']}
                                            labelFormatter={(label) => label}
                                        />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Bar dataKey="Optimal" stackId="a" fill={colors.successText} name="Optimal" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="Underfilled" stackId="a" fill={colors.warningText} name="Underfilled" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="Overfilled" stackId="a" fill={colors.dangerText} name="Overfilled" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[320px] flex items-center justify-center" style={{ color: colors.textSecondary }}>No data</div>
                        )}
                    </div>
                    <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                        <h3 className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>% Optimal by Term</h3>
                        <p className="text-xs mb-4" style={{ color: colors.textSecondary }}>Within target band 20–30</p>
                        <BarChartComponent
                            data={termChartData}
                            xKey="name"
                            bars={[{ dataKey: 'pctOptimal', color: colors.primary1, name: '% Optimal' }]}
                            height={320}
                        />
                    </div>
                </div>
            )}

            {/* Course View: Chart + Table */}
            {viewLevel === 'course' && (
                <div className="space-y-6">
                    <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                        <h3 className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>Top 15 Courses by % Optimal</h3>
                        <p className="text-xs mb-4" style={{ color: colors.textSecondary }}>Horizontal bar chart</p>
                        {courseChartData.length > 0 ? (
                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={courseChartData} layout="vertical" margin={{ top: 0, right: 20, left: 120, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={colors.border} horizontal={false} />
                                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: colors.textSecondary }} unit="%" />
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: colors.textSecondary }} width={115} />
                                        <Tooltip
                                            contentStyle={{ background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: 8 }}
                                            formatter={(value: any) => [`${value}%`, '% Optimal']}
                                            labelFormatter={(label, payload) => payload?.[0]?.payload?.name || label}
                                        />
                                        <Bar dataKey="pctOptimal" fill={colors.primary1} name="% Optimal" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center" style={{ color: colors.textSecondary }}>No data</div>
                        )}
                    </div>
                    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                        <div className="p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: colors.border, backgroundColor: colors.surfaceBg + '60' }}>
                            <div>
                                <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>Course-Term Detail</h3>
                                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Optimal = enrolled within 20–30 • Click column headers to sort</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium" style={{ color: colors.primary1 }}>{totalCourseRows} rows</span>
                                <label className="flex items-center gap-2 text-xs" style={{ color: colors.textSecondary }}>
                                    Rows per page
                                    <select
                                        value={coursePageSize}
                                        onChange={(e) => { setCoursePageSize(Number(e.target.value)); setCoursePage(0); }}
                                        className="px-2 py-1.5 rounded border text-sm"
                                        style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
                                    >
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                        <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead style={{ backgroundColor: colors.surfaceBg, position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold cursor-pointer hover:opacity-80" style={{ color: colors.textSecondary }} onClick={() => toggleCourseSort('year')}>
                                            <span className="inline-flex items-center gap-1">Year <SortIcon activeKey={courseSort.key} keyVal="year" dir={courseSort.dir} /></span>
                                        </th>
                                        <th className="text-left py-3 px-4 font-semibold cursor-pointer hover:opacity-80" style={{ color: colors.textSecondary }} onClick={() => toggleCourseSort('term')}>
                                            <span className="inline-flex items-center gap-1">Term <SortIcon activeKey={courseSort.key} keyVal="term" dir={courseSort.dir} /></span>
                                        </th>
                                        <th className="text-left py-3 px-4 font-semibold cursor-pointer hover:opacity-80 min-w-[180px]" style={{ color: colors.textSecondary }} onClick={() => toggleCourseSort('course')}>
                                            <span className="inline-flex items-center gap-1">Course <SortIcon activeKey={courseSort.key} keyVal="course" dir={courseSort.dir} /></span>
                                        </th>
                                        <th className="text-right py-3 px-4 font-semibold cursor-pointer hover:opacity-80" style={{ color: colors.textSecondary }} onClick={() => toggleCourseSort('total')}>
                                            <span className="inline-flex items-center gap-1">Total <SortIcon activeKey={courseSort.key} keyVal="total" dir={courseSort.dir} /></span>
                                        </th>
                                        <th className="text-right py-3 px-4 font-semibold cursor-pointer hover:opacity-80" style={{ color: colors.textSecondary }} onClick={() => toggleCourseSort('optimal')}>
                                            <span className="inline-flex items-center gap-1">Optimal <SortIcon activeKey={courseSort.key} keyVal="optimal" dir={courseSort.dir} /></span>
                                        </th>
                                        <th className="text-right py-3 px-4 font-semibold cursor-pointer hover:opacity-80" style={{ color: colors.textSecondary }} onClick={() => toggleCourseSort('pctOptimal')}>
                                            <span className="inline-flex items-center gap-1">% Optimal <SortIcon activeKey={courseSort.key} keyVal="pctOptimal" dir={courseSort.dir} /></span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCourseData.map((row: any, idx: number) => (
                                        <tr key={idx} className="border-t transition-colors hover:opacity-90" style={{ borderColor: colors.border, backgroundColor: idx % 2 === 0 ? 'transparent' : colors.surfaceBg + '30' }}>
                                            <td className="py-2.5 px-4" style={{ color: colors.textPrimary }}>{row.AcademicYear}</td>
                                            <td className="py-2.5 px-4" style={{ color: colors.textPrimary }}>{row.Term}</td>
                                            <td className="py-2.5 px-4" style={{ color: colors.textPrimary }} title={row.CourseTitle}>{row.CourseTitle?.length > 50 ? row.CourseTitle.slice(0, 47) + '…' : row.CourseTitle}</td>
                                            <td className="py-2.5 px-4 text-right" style={{ color: colors.textPrimary }}>{row.totalSections}</td>
                                            <td className="py-2.5 px-4 text-right" style={{ color: colors.textPrimary }}>{row.optimalSections}</td>
                                            <td className="py-2.5 px-4 text-right">
                                                <span className="font-medium" style={{ color: Number(row.pctOptimal) >= 70 ? colors.successText : Number(row.pctOptimal) >= 40 ? colors.warningText : colors.dangerText }}>
                                                    {row.pctOptimal}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-t" style={{ borderColor: colors.border }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>
                                Showing {(coursePage * coursePageSize) + 1}–{Math.min((coursePage + 1) * coursePageSize, totalCourseRows)} of {totalCourseRows.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCoursePage(0)}
                                    disabled={coursePage === 0}
                                    className="px-2.5 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                                    style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => setCoursePage((p) => Math.max(0, p - 1))}
                                    disabled={coursePage === 0}
                                    className="px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                                    style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                                >
                                    Previous
                                </button>
                                <span className="text-xs px-2" style={{ color: colors.textSecondary }}>
                                    Page {coursePage + 1} of {totalCoursePages}
                                </span>
                                <button
                                    onClick={() => setCoursePage((p) => Math.min(totalCoursePages - 1, p + 1))}
                                    disabled={coursePage >= totalCoursePages - 1}
                                    className="px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                                    style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => setCoursePage(totalCoursePages - 1)}
                                    disabled={coursePage >= totalCoursePages - 1}
                                    className="px-2.5 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                                    style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Section View: Table with Progress Bars */}
            {viewLevel === 'section' && (
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                    <div className="p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: colors.border, backgroundColor: colors.surfaceBg + '60' }}>
                        <div>
                            <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>Section-Level Detail</h3>
                            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Enrolled vs target 20–30 • Click headers to sort</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-xs" style={{ color: colors.textSecondary }}>
                                Rows per page
                                <select
                                    value={sectionPageSize}
                                    onChange={(e) => { setSectionPageSize(Number(e.target.value)); setSectionPage(0); }}
                                    className="px-2 py-1.5 rounded border text-sm"
                                    style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
                                >
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead style={{ backgroundColor: colors.surfaceBg, position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold cursor-pointer hover:opacity-80" style={{ color: colors.textSecondary }} onClick={() => toggleSectionSort('year')}>
                                        <span className="inline-flex items-center gap-1">Year <SortIcon activeKey={sectionSort.key} keyVal="year" dir={sectionSort.dir} /></span>
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold cursor-pointer hover:opacity-80" style={{ color: colors.textSecondary }} onClick={() => toggleSectionSort('term')}>
                                        <span className="inline-flex items-center gap-1">Term <SortIcon activeKey={sectionSort.key} keyVal="term" dir={sectionSort.dir} /></span>
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold cursor-pointer hover:opacity-80 min-w-[140px]" style={{ color: colors.textSecondary }} onClick={() => toggleSectionSort('course')}>
                                        <span className="inline-flex items-center gap-1">Course <SortIcon activeKey={sectionSort.key} keyVal="course" dir={sectionSort.dir} /></span>
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold cursor-pointer hover:opacity-80" style={{ color: colors.textSecondary }} onClick={() => toggleSectionSort('section')}>
                                        <span className="inline-flex items-center gap-1">Section <SortIcon activeKey={sectionSort.key} keyVal="section" dir={sectionSort.dir} /></span>
                                    </th>
                                    <th className="text-right py-3 px-4 font-semibold cursor-pointer hover:opacity-80" style={{ color: colors.textSecondary }} onClick={() => toggleSectionSort('enrolled')}>
                                        <span className="inline-flex items-center gap-1">Enrolled <SortIcon activeKey={sectionSort.key} keyVal="enrolled" dir={sectionSort.dir} /></span>
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold w-[140px]" style={{ color: colors.textSecondary }}>Enrollment Bar</th>
                                    <th className="text-left py-3 px-4 font-semibold cursor-pointer hover:opacity-80" style={{ color: colors.textSecondary }} onClick={() => toggleSectionSort('status')}>
                                        <span className="inline-flex items-center gap-1">Status <SortIcon activeKey={sectionSort.key} keyVal="status" dir={sectionSort.dir} /></span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedSections.map((row: any, idx: number) => {
                                    const statusStyle = getStatusColor(row.classSizeStatus);
                                    const Icon = statusStyle.icon;
                                    const { pct, barColor } = enrollmentProgress(row.EnrolledCount ?? 0);
                                    return (
                                        <tr key={idx} className="border-t transition-colors hover:opacity-90" style={{ borderColor: colors.border, backgroundColor: idx % 2 === 0 ? 'transparent' : colors.surfaceBg + '30' }}>
                                            <td className="py-2.5 px-4" style={{ color: colors.textPrimary }}>{row.AcademicYear}</td>
                                            <td className="py-2.5 px-4" style={{ color: colors.textPrimary }}>{row.Term}</td>
                                            <td className="py-2.5 px-4" style={{ color: colors.textPrimary }} title={row.CourseTitle}>{row.CourseTitle?.length > 40 ? row.CourseTitle.slice(0, 37) + '…' : row.CourseTitle}</td>
                                            <td className="py-2.5 px-4 font-mono text-xs" style={{ color: colors.textPrimary }}>{row.SectionID}</td>
                                            <td className="py-2.5 px-4 text-right font-semibold" style={{ color: colors.textPrimary }}>{row.EnrolledCount}</td>
                                            <td className="py-2.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceBg }}>
                                                        <div
                                                            className="h-full rounded-full transition-all"
                                                            style={{ width: `${pct}%`, backgroundColor: barColor }}
                                                        />
                                                    </div>
                                                    <span className="text-xs w-6 text-right" style={{ color: colors.textSecondary }}>0-40</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                                                    <Icon size={12} />
                                                    {row.classSizeStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-t" style={{ borderColor: colors.border }}>
                        <span className="text-sm" style={{ color: colors.textSecondary }}>
                            Showing {(sectionPage * sectionPageSize) + 1}–{Math.min((sectionPage + 1) * sectionPageSize, totalSections)} of {totalSections.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSectionPage(0)}
                                disabled={sectionPage === 0}
                                className="px-2.5 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                                style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                            >
                                First
                            </button>
                            <button
                                onClick={() => setSectionPage((p) => Math.max(0, p - 1))}
                                disabled={sectionPage === 0}
                                className="px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                                style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                            >
                                Previous
                            </button>
                            <span className="text-xs px-2" style={{ color: colors.textSecondary }}>
                                Page {sectionPage + 1} of {totalPages}
                            </span>
                            <button
                                onClick={() => setSectionPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={sectionPage >= totalPages - 1}
                                className="px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                                style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                            >
                                Next
                            </button>
                            <button
                                onClick={() => setSectionPage(totalPages - 1)}
                                disabled={sectionPage >= totalPages - 1}
                                className="px-2.5 py-1.5 rounded text-xs font-medium disabled:opacity-40"
                                style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                            >
                                Last
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Info Card */}
            <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: colors.accentBg, border: `1px solid ${colors.accent}40` }}>
                <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.accent + '20' }}>
                        <Target size={22} style={{ color: colors.accent }} />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>About Optimum Class Size (Lecture)</h4>
                        <p className="text-sm leading-relaxed mb-2" style={{ color: colors.textSecondary }}>
                            Normative KPI comparing enrollment to the target band of 20–30 students per lecture section. Sections within this band are <strong>Optimal</strong>; 
                            below 20 are <strong>Underfilled</strong> (consider consolidation); above 30 are <strong>Overfilled</strong> (consider splitting). 
                            Supports section planning, capacity planning, room allocation, and faculty workload optimization.
                        </p>
                        <p className="text-xs" style={{ color: colors.textSecondary, opacity: 0.9 }}>Data: FACT_SECTION • Granularity: Section-Term, Course-Term, Term</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function WorkloadBalancingPage() {
    const colors = useColors();
    const { isRTL } = useLanguage();
    const [activeTab, setActiveTab] = useState<'optimum-class-size'>('optimum-class-size');

    return (
        <div className="min-h-screen" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header
                title="Normative Class Size Standards"
                subtitle="Section planning and optimum class size analysis"
            />

            <div className="rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <div className="flex border-b" style={{ borderColor: colors.border }}>
                    <button
                        onClick={() => setActiveTab('optimum-class-size')}
                        className="px-6 py-3 text-sm font-medium transition-all"
                        style={{
                            color: activeTab === 'optimum-class-size' ? colors.accent : colors.textSecondary,
                            borderBottom: activeTab === 'optimum-class-size' ? `2px solid ${colors.accent}` : '2px solid transparent',
                            backgroundColor: activeTab === 'optimum-class-size' ? `${colors.accent}10` : 'transparent'
                        }}
                    >
                        Optimum Class Size (Lecture)
                    </button>
                </div>
                <div className="p-4 sm:p-6">
                    {activeTab === 'optimum-class-size' && <OptimumClassSizeTab />}
                </div>
            </div>
        </div>
    );
}
