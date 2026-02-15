'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import Header from '@/components/layout/Header';
import BarChartComponent from '@/components/charts/BarChart';
import LineChartComponent from '@/components/charts/LineChart';
import ROI_01 from '@/data/KPIs/ROI-01';
import ROI_03 from '@/data/KPIs/ROI-03';
import {
  DollarSign,
  GraduationCap,
  Target,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  TrendingUp,
} from 'lucide-react';

const roi01 = ROI_01 as any;
const roi03 = ROI_03 as any;

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

function getStatusIcon(status: string) {
  switch (status) {
    case 'green': return <CheckCircle2 size={20} />;
    case 'amber': return <AlertCircle size={20} />;
    case 'red': return <XCircle size={20} />;
    default: return <AlertCircle size={20} />;
  }
}

function formatAedCompact(num: number) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M AED`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k AED`;
  return num.toFixed(2) + ' AED';
}

type TabType = 'cost-per-sch' | 'program-margin';

interface TabProps { id: TabType; label: string; isActive: boolean; onClick: () => void; colors: any; }
function Tab({ id, label, isActive, onClick, colors }: TabProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 text-sm font-medium transition-all relative"
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

// ============================================
// COST PER SCH TAB
// ============================================
function CostPerSchTab() {
  const { t, isRTL } = useLanguage();
  const colors = useColors();
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedTerm, setSelectedTerm] = useState<string>('All');
  const [sortYearOrder, setSortYearOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const colleges = useMemo((): string[] => {
    const set = new Set<string>(roi01.programTermData.map((d: any) => d.college as string));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const years = useMemo((): string[] => {
    const set = new Set<string>((roi01.collegeYearData || []).map((d: any) => d.academicYear as string));
    const programYears = new Set<string>((roi01.programTermData || []).map((d: any) => d.academicYear as string));
    return ['All', ...Array.from(new Set([...set, ...programYears])).sort()];
  }, []);

  const terms = useMemo((): string[] => {
    const set = new Set<string>(roi01.programTermData.map((d: any) => d.term as string));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filteredData = useMemo(() => {
    return (roi01.programTermData || []).filter((d: any) => {
      if (selectedCollege !== 'All' && d.college !== selectedCollege) return false;
      if (selectedYear !== 'All' && d.academicYear !== selectedYear) return false;
      if (selectedTerm !== 'All' && d.term !== selectedTerm) return false;
      return true;
    });
  }, [selectedCollege, selectedYear, selectedTerm]);

  const filteredCollegeYearData = useMemo(() => {
    return (roi01.collegeYearData || []).filter((d: any) => {
      if (selectedCollege !== 'All' && d.college !== selectedCollege) return false;
      if (selectedYear !== 'All' && d.academicYear !== selectedYear) return false;
      return true;
    });
  }, [selectedCollege, selectedYear]);

  const sortedData = useMemo(() => {
    const s = [...filteredData];
    s.sort((a: any, b: any) => (sortYearOrder === 'desc' ? -1 : 1) * a.academicYear.localeCompare(b.academicYear));
    return s;
  }, [filteredData, sortYearOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const filteredMetrics = useMemo(() => {
    let totalCost = 0;
    let totalSch = 0;
    if (filteredData.length > 0) {
      totalCost = filteredData.reduce((s: number, d: any) => s + d.programCostAed, 0);
      totalSch = filteredData.reduce((s: number, d: any) => s + d.programSch, 0);
    } else if (filteredCollegeYearData.length > 0) {
      totalCost = filteredCollegeYearData.reduce((s: number, d: any) => s + d.totalCost, 0);
      totalSch = filteredCollegeYearData.reduce((s: number, d: any) => s + d.totalSch, 0);
    }
    const costPerSch = totalSch > 0 ? totalCost / totalSch : 0;
    const status = costPerSch >= roi01.targets.min && costPerSch <= roi01.targets.max ? 'green'
      : costPerSch < roi01.targets.min * 0.9 || costPerSch > roi01.targets.max * 1.1 ? 'red' : 'amber';
    return { totalCost, totalSch, costPerSchAed: costPerSch, status };
  }, [filteredData, filteredCollegeYearData]);

  const barChartData = useMemo(() => {
    const collegeMap: Record<string, { totalCost: number; totalSch: number }> = {};
    if (filteredData.length > 0) {
      filteredData.forEach((d: any) => {
        if (!collegeMap[d.college]) collegeMap[d.college] = { totalCost: 0, totalSch: 0 };
        collegeMap[d.college].totalCost += d.programCostAed;
        collegeMap[d.college].totalSch += d.programSch;
      });
    } else {
      filteredCollegeYearData.forEach((d: any) => {
        if (!collegeMap[d.college]) collegeMap[d.college] = { totalCost: 0, totalSch: 0 };
        collegeMap[d.college].totalCost += d.totalCost;
        collegeMap[d.college].totalSch += d.totalSch;
      });
    }
    return Object.entries(collegeMap)
      .map(([name, v]) => ({ name, costPerSch: v.totalSch > 0 ? Math.round(v.totalCost / v.totalSch * 100) / 100 : 0 }))
      .sort((a, b) => b.costPerSch - a.costPerSch);
  }, [filteredData, filteredCollegeYearData]);

  const trendData = useMemo(() => {
    const yearMap: Record<string, { totalCost: number; totalSch: number }> = {};
    if (filteredCollegeYearData.length > 0) {
      filteredCollegeYearData.forEach((d: any) => {
        if (!yearMap[d.academicYear]) yearMap[d.academicYear] = { totalCost: 0, totalSch: 0 };
        yearMap[d.academicYear].totalCost += d.totalCost;
        yearMap[d.academicYear].totalSch += d.totalSch;
      });
    } else {
      filteredData.forEach((d: any) => {
        if (!yearMap[d.academicYear]) yearMap[d.academicYear] = { totalCost: 0, totalSch: 0 };
        yearMap[d.academicYear].totalCost += d.programCostAed;
        yearMap[d.academicYear].totalSch += d.programSch;
      });
    }
    return Object.entries(yearMap)
      .map(([academicYear, v]) => ({ name: academicYear, costPerSch: v.totalSch > 0 ? Math.round(v.totalCost / v.totalSch * 100) / 100 : 0 }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredData, filteredCollegeYearData]);

  const resetPage = () => setCurrentPage(1);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-xl p-5 border mb-6" style={{ backgroundColor: colors.accentBg, borderColor: colors.accent }}>
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} style={{ color: colors.accent }} />
          <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>ROI-01 Cost per SCH (Official KPI)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div><p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{formatAedCompact(filteredMetrics.totalCost)}</p><p className="text-xs" style={{ color: colors.textSecondary }}>Total Cost</p></div>
          <div><p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{filteredMetrics.totalSch.toLocaleString()}</p><p className="text-xs" style={{ color: colors.textSecondary }}>Total SCH</p></div>
          <div><p className="text-2xl font-bold" style={{ color: getStatusColor(colors, filteredMetrics.status) }}>{filteredMetrics.costPerSchAed.toFixed(2)} AED</p><p className="text-xs" style={{ color: colors.textSecondary }}>Cost per SCH</p></div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold" style={{ backgroundColor: getStatusBg(colors, filteredMetrics.status), color: getStatusColor(colors, filteredMetrics.status) }}>{getStatusIcon(filteredMetrics.status)}{filteredMetrics.status.toUpperCase()}</span>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Target 900–2,200 AED</p>
          </div>
          <div><p className="text-sm font-medium" style={{ color: colors.textSecondary }}>{filteredData.length} program-terms</p></div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Total Cost</span><DollarSign size={20} style={{ color: colors.primary1 }} /></div><p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{formatAedCompact(filteredMetrics.totalCost)}</p></div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Total SCH</span><GraduationCap size={20} style={{ color: colors.primary1 }} /></div><p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{filteredMetrics.totalSch.toLocaleString()}</p></div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Cost per SCH</span><div style={{ color: getStatusColor(colors, filteredMetrics.status) }}>{getStatusIcon(filteredMetrics.status)}</div></div><p className="text-2xl font-bold" style={{ color: getStatusColor(colors, filteredMetrics.status) }}>{filteredMetrics.costPerSchAed.toFixed(2)} AED</p></div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Target</span><Target size={20} style={{ color: colors.accent }} /></div><p className="text-lg font-bold" style={{ color: colors.textPrimary }}>900 – 2,200 AED</p></div>
      </div>

      <div className="p-6 rounded-xl border mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div className="flex items-center gap-4 mb-4"><Target size={20} style={{ color: colors.primary1 }} /><h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{t('sidebar.roi.filters')}</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>{t('sidebar.roi.college')}</label><select value={selectedCollege} onChange={(e) => { setSelectedCollege(e.target.value); resetPage(); }} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>{colleges.map((c) => <option key={c} value={c}>{c === 'All' ? t('common.all') : c}</option>)}</select></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>{t('sidebar.roi.academicYear')}</label><select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); resetPage(); }} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>{years.map((y) => <option key={y} value={y}>{y === 'All' ? t('common.all') : y}</option>)}</select></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>{t('sidebar.roi.term')}</label><select value={selectedTerm} onChange={(e) => { setSelectedTerm(e.target.value); resetPage(); }} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>{terms.map((term) => <option key={term} value={term}>{term === 'All' ? t('common.all') : term}</option>)}</select></div>
        </div>
        <div className="mt-4 flex items-center gap-2"><Info size={16} style={{ color: colors.infoText }} /><span className="text-xs" style={{ color: colors.textSecondary }}>Showing {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}{selectedCollege !== 'All' && ` • ${selectedCollege}`}{selectedYear !== 'All' && ` • ${selectedYear}`}{selectedTerm !== 'All' && ` • ${selectedTerm}`}</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Cost per SCH by College</h3>{barChartData.length > 0 ? <BarChartComponent data={barChartData} xKey="name" bars={[{ dataKey: 'costPerSch', color: colors.primary1, name: 'Cost per SCH (AED)' }]} height={280} /> : <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data</p>}</div>
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Cost per SCH Trend (by Year)</h3>{trendData.length > 0 ? <LineChartComponent data={trendData} xKey="name" lines={[{ dataKey: 'costPerSch', color: colors.secondary1, name: 'Cost per SCH (AED)' }]} height={280} yFormatter={(v) => v.toFixed(2)} /> : <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data</p>}</div>
      </div>

      {selectedCollege === 'All' && barChartData.length > 0 && (
        <div className="p-6 rounded-xl border mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: colors.textPrimary }}>Cost per SCH by College</h3>
          <div className="space-y-4">{barChartData.map((row) => { const pct = Math.min(100, (row.costPerSch / roi01.targets.max) * 100); const status = row.costPerSch >= roi01.targets.min && row.costPerSch <= roi01.targets.max ? 'green' : row.costPerSch < roi01.targets.min * 0.9 || row.costPerSch > roi01.targets.max * 1.1 ? 'red' : 'amber'; return (<div key={row.name}><div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{row.name}</span><span className="text-sm font-bold" style={{ color: getStatusColor(colors, status) }}>{row.costPerSch.toFixed(2)} AED</span></div><div className="relative h-6 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: getStatusColor(colors, status) }} /></div></div>); })}</div>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div className="p-6 border-b flex flex-wrap items-center justify-between gap-4" style={{ borderColor: colors.border }}><h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Program-Term Data</h3><div className="flex items-center gap-3"><button onClick={() => setSortYearOrder((o) => o === 'desc' ? 'asc' : 'desc')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>Year {sortYearOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />} ({sortYearOrder === 'desc' ? 'Newest first' : 'Oldest first'})</button><select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); resetPage(); }} className="px-2 py-1 rounded text-xs font-medium border" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>{[5, 10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}</select></div></div>
        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b" style={{ borderColor: colors.border }}><th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>{t('sidebar.roi.college')}</th><th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Year</th><th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>{t('sidebar.roi.term')}</th><th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Program</th><th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Cost (AED)</th><th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>SCH</th><th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Cost/SCH</th><th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>{t('common.status')}</th></tr></thead><tbody>{paginatedData.map((row: any, idx: number) => (<tr key={idx} className="border-b transition-colors" style={{ borderColor: colors.border }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.tableHover; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}><td className="py-3 px-4 text-sm font-medium" style={{ color: colors.textPrimary }}>{row.college}</td><td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{row.academicYear}</td><td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{row.term}</td><td className="py-3 px-4 text-sm" style={{ color: colors.textPrimary }}>{row.programName}</td><td className="py-3 px-4 text-sm text-right" style={{ color: colors.textPrimary }}>{row.programCostAed?.toLocaleString('en-AE', { maximumFractionDigits: 0 })}</td><td className="py-3 px-4 text-sm text-right" style={{ color: colors.textPrimary }}>{row.programSch}</td><td className="py-3 px-4 text-sm text-right font-bold" style={{ color: getStatusColor(colors, row.status) }}>{row.costPerSchAed?.toFixed(2)} AED</td><td className="py-3 px-4 text-center"><span className="inline-block px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: getStatusBg(colors, row.status), color: getStatusColor(colors, row.status) }}>{row.status?.toUpperCase()}</span></td></tr>))}</tbody></table></div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t" style={{ borderColor: colors.border }}><span className="text-xs" style={{ color: colors.textSecondary }}>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}</span><div className="flex items-center gap-2"><button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1} className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>Previous</button><span className="text-xs font-medium" style={{ color: colors.textPrimary }}>Page {currentPage} of {totalPages}</span><button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>Next</button></div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Formula</h3><p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{roi01.formula.description}</p><div className="space-y-2">{roi01.formula.components.map((c: any, i: number) => (<div key={i} className="p-3 rounded-lg" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border }}><span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{c.name}</span>{c.formula && <span className="text-sm ml-2" style={{ color: colors.accent }}>= {c.formula}</span>}{c.description && <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>{c.description}</p>}</div>))}</div></div><div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Usage</h3><p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{roi01.usage.primary}</p><ul className="list-disc list-inside text-sm space-y-1" style={{ color: colors.textSecondary }}>{roi01.usage.secondary.map((s: string, i: number) => (<li key={i}>{s}</li>))}</ul></div></div>
    </div>
  );
}

// ============================================
// PROGRAM MARGIN TAB
// ============================================
function ProgramMarginTab() {
  const { t } = useLanguage();
  const colors = useColors();
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedTerm, setSelectedTerm] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortYearOrder, setSortYearOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const colleges = useMemo((): string[] => {
    const set = new Set<string>(roi03.programTermData.map((d: any) => d.college as string));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const years = useMemo((): string[] => {
    const set = new Set<string>(roi03.programTermData.map((d: any) => d.academicYear as string));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const terms = useMemo((): string[] => {
    const set = new Set<string>(roi03.programTermData.map((d: any) => d.term as string));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const statusOptions = useMemo(() => [
    { value: 'All', label: t('common.all') },
    { value: 'green', label: 'Green (≥15%)' },
    { value: 'amber', label: 'Amber (0–15%)' },
    { value: 'red', label: 'Red (Negative)' },
  ], [t]);

  const filteredData = useMemo(() => {
    return (roi03.programTermData || []).filter((d: any) => {
      if (selectedCollege !== 'All' && d.college !== selectedCollege) return false;
      if (selectedYear !== 'All' && d.academicYear !== selectedYear) return false;
      if (selectedTerm !== 'All' && d.term !== selectedTerm) return false;
      if (selectedStatus !== 'All' && d.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedCollege, selectedYear, selectedTerm, selectedStatus]);

  const sortedData = useMemo(() => {
    const s = [...filteredData];
    s.sort((a: any, b: any) => (sortYearOrder === 'desc' ? -1 : 1) * a.academicYear.localeCompare(b.academicYear));
    return s;
  }, [filteredData, sortYearOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const filteredMetrics = useMemo(() => {
    const totalRevenue = filteredData.reduce((s: number, d: any) => s + d.totalRevenue, 0);
    const totalCost = filteredData.reduce((s: number, d: any) => s + d.totalCost, 0);
    const totalMarginAed = totalRevenue - totalCost;
    const totalMarginPct = totalRevenue > 0 ? (totalMarginAed / totalRevenue) * 100 : 0;
    const status = totalMarginAed < 0 ? 'red' : totalMarginPct >= 15 ? 'green' : 'amber';
    return { totalRevenue, totalCost, totalMarginAed, totalMarginPct, status };
  }, [filteredData]);

  const barChartData = useMemo(() => {
    const collegeMap: Record<string, { totalRevenue: number; totalCost: number }> = {};
    filteredData.forEach((d: any) => {
      if (!collegeMap[d.college]) collegeMap[d.college] = { totalRevenue: 0, totalCost: 0 };
      collegeMap[d.college].totalRevenue += d.totalRevenue;
      collegeMap[d.college].totalCost += d.totalCost;
    });
    return Object.entries(collegeMap)
      .map(([name, v]) => ({ name, marginPct: v.totalRevenue > 0 ? Math.round((v.totalRevenue - v.totalCost) / v.totalRevenue * 10000) / 100 : 0 }))
      .sort((a, b) => b.marginPct - a.marginPct);
  }, [filteredData]);

  const trendData = useMemo(() => {
    const yearMap: Record<string, { totalRevenue: number; totalCost: number }> = {};
    filteredData.forEach((d: any) => {
      if (!yearMap[d.academicYear]) yearMap[d.academicYear] = { totalRevenue: 0, totalCost: 0 };
      yearMap[d.academicYear].totalRevenue += d.totalRevenue;
      yearMap[d.academicYear].totalCost += d.totalCost;
    });
    return Object.entries(yearMap)
      .map(([academicYear, v]) => ({ name: academicYear, marginPct: v.totalRevenue > 0 ? Math.round((v.totalRevenue - v.totalCost) / v.totalRevenue * 10000) / 100 : 0 }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredData]);

  const resetPage = () => setCurrentPage(1);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-xl p-5 border mb-6" style={{ backgroundColor: colors.accentBg, borderColor: colors.accent }}>
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} style={{ color: colors.accent }} />
          <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>ROI-03 Program Margin (Official KPI)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div><p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{formatAedCompact(filteredMetrics.totalRevenue)}</p><p className="text-xs" style={{ color: colors.textSecondary }}>Total Revenue</p></div>
          <div><p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{formatAedCompact(filteredMetrics.totalCost)}</p><p className="text-xs" style={{ color: colors.textSecondary }}>Total Cost</p></div>
          <div><p className="text-2xl font-bold" style={{ color: getStatusColor(colors, filteredMetrics.status) }}>{formatAedCompact(filteredMetrics.totalMarginAed)}</p><p className="text-xs" style={{ color: colors.textSecondary }}>Margin</p></div>
          <div><p className="text-2xl font-bold" style={{ color: getStatusColor(colors, filteredMetrics.status) }}>{filteredMetrics.totalMarginPct.toFixed(2)}%</p><p className="text-xs" style={{ color: colors.textSecondary }}>Margin %</p></div>
          <div><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold" style={{ backgroundColor: getStatusBg(colors, filteredMetrics.status), color: getStatusColor(colors, filteredMetrics.status) }}>{getStatusIcon(filteredMetrics.status)}{filteredMetrics.status.toUpperCase()}</span><p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Target ≥0; Stretch ≥15%</p></div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Revenue</span><TrendingUp size={20} style={{ color: colors.primary1 }} /></div><p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{formatAedCompact(filteredMetrics.totalRevenue)}</p></div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Cost</span><DollarSign size={20} style={{ color: colors.primary1 }} /></div><p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{formatAedCompact(filteredMetrics.totalCost)}</p></div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Margin</span><div style={{ color: getStatusColor(colors, filteredMetrics.status) }}>{getStatusIcon(filteredMetrics.status)}</div></div><p className="text-2xl font-bold" style={{ color: getStatusColor(colors, filteredMetrics.status) }}>{formatAedCompact(filteredMetrics.totalMarginAed)}</p></div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Target</span><Target size={20} style={{ color: colors.accent }} /></div><p className="text-lg font-bold" style={{ color: colors.textPrimary }}>≥0; Stretch ≥15%</p></div>
      </div>

      <div className="p-6 rounded-xl border mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div className="flex items-center gap-4 mb-4"><Target size={20} style={{ color: colors.primary1 }} /><h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{t('sidebar.roi.filters')}</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>{t('sidebar.roi.college')}</label><select value={selectedCollege} onChange={(e) => { setSelectedCollege(e.target.value); resetPage(); }} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>{colleges.map((c) => <option key={c} value={c}>{c === 'All' ? t('common.all') : c}</option>)}</select></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>{t('sidebar.roi.academicYear')}</label><select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); resetPage(); }} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>{years.map((y) => <option key={y} value={y}>{y === 'All' ? t('common.all') : y}</option>)}</select></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>{t('sidebar.roi.term')}</label><select value={selectedTerm} onChange={(e) => { setSelectedTerm(e.target.value); resetPage(); }} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>{terms.map((term) => <option key={term} value={term}>{term === 'All' ? t('common.all') : term}</option>)}</select></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>{t('sidebar.roi.statusFilter')}</label><select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); resetPage(); }} className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>{statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
        </div>
        <div className="mt-4 flex items-center gap-2"><Info size={16} style={{ color: colors.infoText }} /><span className="text-xs" style={{ color: colors.textSecondary }}>Showing {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}{selectedCollege !== 'All' && ` • ${selectedCollege}`}{selectedYear !== 'All' && ` • ${selectedYear}`}{selectedTerm !== 'All' && ` • ${selectedTerm}`}{selectedStatus !== 'All' && ` • ${selectedStatus}`}</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Margin % by College</h3>{barChartData.length > 0 ? <BarChartComponent data={barChartData} xKey="name" bars={[{ dataKey: 'marginPct', color: colors.secondary1, name: 'Margin %' }]} height={280} /> : <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data</p>}</div>
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Margin % Trend (by Year)</h3>{trendData.length > 0 ? <LineChartComponent data={trendData} xKey="name" lines={[{ dataKey: 'marginPct', color: colors.secondary1, name: 'Margin %' }]} height={280} yFormatter={(v) => v.toFixed(2) + '%'} /> : <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data</p>}</div>
      </div>

      {selectedCollege === 'All' && selectedStatus === 'All' && barChartData.length > 0 && (
        <div className="p-6 rounded-xl border mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: colors.textPrimary }}>Margin % by College</h3>
          <div className="space-y-4">{barChartData.map((row) => { const status = row.marginPct >= 15 ? 'green' : row.marginPct >= 0 ? 'amber' : 'red'; const pct = Math.min(100, Math.max(-20, row.marginPct) + 20); return (<div key={row.name}><div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{row.name}</span><span className="text-sm font-bold" style={{ color: getStatusColor(colors, status) }}>{row.marginPct.toFixed(2)}%</span></div><div className="relative h-6 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: getStatusColor(colors, status) }} /></div></div>); })}</div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t" style={{ borderColor: colors.border }}><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.successText }} /><span className="text-xs" style={{ color: colors.textSecondary }}>Green: ≥15%</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.warningText }} /><span className="text-xs" style={{ color: colors.textSecondary }}>Amber: 0–15%</span></div><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.dangerText }} /><span className="text-xs" style={{ color: colors.textSecondary }}>Red: Negative</span></div></div>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div className="p-6 border-b flex flex-wrap items-center justify-between gap-4" style={{ borderColor: colors.border }}><h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Program-Term Data</h3><div className="flex items-center gap-3"><button onClick={() => setSortYearOrder((o) => o === 'desc' ? 'asc' : 'desc')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>Year {sortYearOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}</button><select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); resetPage(); }} className="px-2 py-1 rounded text-xs font-medium border" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>{[5, 10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}</select></div></div>
        <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b" style={{ borderColor: colors.border }}><th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>{t('sidebar.roi.college')}</th><th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Year</th><th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>{t('sidebar.roi.term')}</th><th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Program</th><th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Revenue</th><th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Cost</th><th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Margin</th><th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Margin %</th><th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>{t('common.status')}</th></tr></thead><tbody>{paginatedData.map((row: any, idx: number) => (<tr key={idx} className="border-b transition-colors" style={{ borderColor: colors.border }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.tableHover; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}><td className="py-3 px-4 text-sm font-medium" style={{ color: colors.textPrimary }}>{row.college}</td><td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{row.academicYear}</td><td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{row.term}</td><td className="py-3 px-4 text-sm" style={{ color: colors.textPrimary }}>{row.programName}</td><td className="py-3 px-4 text-sm text-right" style={{ color: colors.textPrimary }}>{row.totalRevenue?.toLocaleString('en-AE', { maximumFractionDigits: 0 })}</td><td className="py-3 px-4 text-sm text-right" style={{ color: colors.textPrimary }}>{row.totalCost?.toLocaleString('en-AE', { maximumFractionDigits: 0 })}</td><td className="py-3 px-4 text-sm text-right font-bold" style={{ color: getStatusColor(colors, row.status) }}>{row.marginAed?.toLocaleString('en-AE', { maximumFractionDigits: 0 })}</td><td className="py-3 px-4 text-sm text-right font-bold" style={{ color: getStatusColor(colors, row.status) }}>{row.marginPct?.toFixed(2)}%</td><td className="py-3 px-4 text-center"><span className="inline-block px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: getStatusBg(colors, row.status), color: getStatusColor(colors, row.status) }}>{row.status?.toUpperCase()}</span></td></tr>))}</tbody></table></div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t" style={{ borderColor: colors.border }}><span className="text-xs" style={{ color: colors.textSecondary }}>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}</span><div className="flex items-center gap-2"><button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1} className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>Previous</button><span className="text-xs font-medium" style={{ color: colors.textPrimary }}>Page {currentPage} of {totalPages}</span><button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>Next</button></div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Formula</h3><p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{roi03.formula.description}</p><div className="space-y-2">{roi03.formula.components.map((c: any, i: number) => (<div key={i} className="p-3 rounded-lg" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border }}><span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{c.name}</span>{c.formula && <span className="text-sm ml-2" style={{ color: colors.accent }}>= {c.formula}</span>}{c.description && <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>{c.description}</p>}</div>))}</div></div><div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}><h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Usage</h3><p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{roi03.usage.primary}</p><ul className="list-disc list-inside text-sm space-y-1" style={{ color: colors.textSecondary }}>{roi03.usage.secondary.map((s: string, i: number) => (<li key={i}>{s}</li>))}</ul></div></div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function UnitEconomicsPage() {
  const { t, isRTL } = useLanguage();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>('cost-per-sch');

  return (
    <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Header title={t('sidebar.roi.title')} subtitle={t('sidebar.roi.cost')} />

      <div className="flex flex-wrap gap-0 border-b mb-6" style={{ borderColor: colors.border }}>
        <Tab id="cost-per-sch" label={t('sidebar.roi.costPerSch')} isActive={activeTab === 'cost-per-sch'} onClick={() => setActiveTab('cost-per-sch')} colors={colors} />
        <Tab id="program-margin" label={t('sidebar.roi.programMargin')} isActive={activeTab === 'program-margin'} onClick={() => setActiveTab('program-margin')} colors={colors} />
      </div>

      {activeTab === 'cost-per-sch' && <CostPerSchTab />}
      {activeTab === 'program-margin' && <ProgramMarginTab />}
    </div>
  );
}
