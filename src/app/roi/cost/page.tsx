'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';
import Header from '@/components/layout/Header';
import BarChartComponent from '@/components/charts/BarChart';
import LineChartComponent from '@/components/charts/LineChart';
import ROI_01 from '@/data/KPIs/ROI-01';
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
} from 'lucide-react';

const kpi = ROI_01 as any;

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

export default function CostPerStudentPage() {
  const { t, isRTL } = useLanguage();
  const colors = useColors();

  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedTerm, setSelectedTerm] = useState<string>('All');
  const [sortYearOrder, setSortYearOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const colleges = useMemo((): string[] => {
    const set = new Set<string>(kpi.programTermData.map((d: any) => d.college as string));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const years = useMemo((): string[] => {
    const set = new Set<string>((kpi.collegeYearData || []).map((d: any) => d.academicYear as string));
    const programYears = new Set<string>((kpi.programTermData || []).map((d: any) => d.academicYear as string));
    const union = new Set([...set, ...programYears]);
    return ['All', ...Array.from(union).sort()];
  }, []);

  const terms = useMemo((): string[] => {
    const set = new Set<string>(kpi.programTermData.map((d: any) => d.term as string));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filteredProgramTermData = useMemo(() => {
    return (kpi.programTermData || []).filter((d: any) => {
      if (selectedCollege !== 'All' && d.college !== selectedCollege) return false;
      if (selectedYear !== 'All' && d.academicYear !== selectedYear) return false;
      if (selectedTerm !== 'All' && d.term !== selectedTerm) return false;
      return true;
    });
  }, [selectedCollege, selectedYear, selectedTerm]);

  const filteredCollegeYearData = useMemo(() => {
    return (kpi.collegeYearData || []).filter((d: any) => {
      if (selectedCollege !== 'All' && d.college !== selectedCollege) return false;
      if (selectedYear !== 'All' && d.academicYear !== selectedYear) return false;
      return true;
    });
  }, [selectedCollege, selectedYear]);

  const sortedProgramTermData = useMemo(() => {
    const s = [...filteredProgramTermData];
    s.sort((a: any, b: any) => {
      const yearA = a.academicYear;
      const yearB = b.academicYear;
      const cmp = yearA.localeCompare(yearB);
      return sortYearOrder === 'desc' ? -cmp : cmp;
    });
    return s;
  }, [filteredProgramTermData, sortYearOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedProgramTermData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProgramTermData.slice(start, start + pageSize);
  }, [sortedProgramTermData, currentPage, pageSize]);

  // Filtered institutional metrics (use collegeYearData when program-term has no rows for selected filters)
  const filteredMetrics = useMemo(() => {
    let totalCost = 0;
    let totalSch = 0;
    if (filteredProgramTermData.length > 0) {
      totalCost = filteredProgramTermData.reduce((s: number, d: any) => s + d.programCostAed, 0);
      totalSch = filteredProgramTermData.reduce((s: number, d: any) => s + d.programSch, 0);
    } else if (filteredCollegeYearData.length > 0) {
      totalCost = filteredCollegeYearData.reduce((s: number, d: any) => s + d.totalCost, 0);
      totalSch = filteredCollegeYearData.reduce((s: number, d: any) => s + d.totalSch, 0);
    }
    const costPerSch = totalSch > 0 ? totalCost / totalSch : 0;
    const status = costPerSch >= kpi.targets.min && costPerSch <= kpi.targets.max ? 'green'
      : costPerSch < kpi.targets.min * 0.9 || costPerSch > kpi.targets.max * 1.1 ? 'red' : 'amber';
    return { totalCost, totalSch, costPerSchAed: costPerSch, status };
  }, [filteredProgramTermData, filteredCollegeYearData]);

  // Bar chart: Cost per SCH by college (use collegeYearData when no program-term rows, e.g. other years)
  const barChartData = useMemo(() => {
    const collegeMap: Record<string, { totalCost: number; totalSch: number }> = {};
    if (filteredProgramTermData.length > 0) {
      filteredProgramTermData.forEach((d: any) => {
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
      .map(([name, v]) => ({
        name,
        costPerSch: v.totalSch > 0 ? Math.round(v.totalCost / v.totalSch * 100) / 100 : 0,
      }))
      .sort((a, b) => b.costPerSch - a.costPerSch);
  }, [filteredProgramTermData, filteredCollegeYearData]);

  // Line chart: Cost per SCH trend by year (use collegeYearData for full 5-year trend)
  const trendData = useMemo(() => {
    const yearMap: Record<string, { totalCost: number; totalSch: number }> = {};
    if (filteredCollegeYearData.length > 0) {
      filteredCollegeYearData.forEach((d: any) => {
        if (!yearMap[d.academicYear]) yearMap[d.academicYear] = { totalCost: 0, totalSch: 0 };
        yearMap[d.academicYear].totalCost += d.totalCost;
        yearMap[d.academicYear].totalSch += d.totalSch;
      });
    } else {
      filteredProgramTermData.forEach((d: any) => {
        if (!yearMap[d.academicYear]) yearMap[d.academicYear] = { totalCost: 0, totalSch: 0 };
        yearMap[d.academicYear].totalCost += d.programCostAed;
        yearMap[d.academicYear].totalSch += d.programSch;
      });
    }
    return Object.entries(yearMap)
      .map(([academicYear, v]) => ({
        name: academicYear,
        costPerSch: v.totalSch > 0 ? Math.round(v.totalCost / v.totalSch * 100) / 100 : 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredProgramTermData, filteredCollegeYearData]);

  const showInstitutionView = selectedCollege === 'All' && selectedYear === 'All' && selectedTerm === 'All';

  return (
    <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Header
        title={t('sidebar.roi.title')}
        subtitle="Cost per SCH"
      />

      {/* ROI-01 Institutional KPI Overview */}
      <div className="rounded-xl p-5 border mb-6" style={{ backgroundColor: colors.accentBg, borderColor: colors.accent }}>
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} style={{ color: colors.accent }} />
          <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>ROI-01 Cost per SCH (Official KPI)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{formatAedCompact(filteredMetrics.totalCost)}</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Total Cost</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{filteredMetrics.totalSch.toLocaleString()}</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Total SCH</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: getStatusColor(colors, filteredMetrics.status) }}>
              {filteredMetrics.costPerSchAed.toFixed(2)} AED
            </p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Cost per SCH</p>
          </div>
          <div>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold"
              style={{
                backgroundColor: getStatusBg(colors, filteredMetrics.status),
                color: getStatusColor(colors, filteredMetrics.status),
              }}
            >
              {getStatusIcon(filteredMetrics.status)}
              {filteredMetrics.status.toUpperCase()}
            </span>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Target 900–2,200 AED</p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
              {showInstitutionView ? 'Institution-wide' : 'Filtered view'}
            </p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>{kpi.programTermData.length} program-terms</p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Total Cost</span>
            <DollarSign size={20} style={{ color: colors.primary1 }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{formatAedCompact(filteredMetrics.totalCost)}</p>
        </div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Total SCH</span>
            <GraduationCap size={20} style={{ color: colors.primary1 }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{filteredMetrics.totalSch.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Cost per SCH</span>
            <div style={{ color: getStatusColor(colors, filteredMetrics.status) }}>{getStatusIcon(filteredMetrics.status)}</div>
          </div>
          <p className="text-2xl font-bold" style={{ color: getStatusColor(colors, filteredMetrics.status) }}>
            {filteredMetrics.costPerSchAed.toFixed(2)} AED
          </p>
        </div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Target Range</span>
            <Target size={20} style={{ color: colors.accent }} />
          </div>
          <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>900 – 2,200 AED</p>
          <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>{kpi.thresholds.green.label}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 rounded-xl border mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div className="flex items-center gap-4 mb-4">
          <Target size={20} style={{ color: colors.primary1 }} />
          <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>College</label>
            <select
              value={selectedCollege}
              onChange={(e) => { setSelectedCollege(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {colleges.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => { setSelectedTerm(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {terms.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Info size={16} style={{ color: colors.infoText }} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            Showing {filteredProgramTermData.length} program-term record{filteredProgramTermData.length !== 1 ? 's' : ''}
            {selectedCollege !== 'All' && ` • ${selectedCollege}`}
            {selectedYear !== 'All' && ` • ${selectedYear}`}
            {selectedTerm !== 'All' && ` • ${selectedTerm}`}
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Cost per SCH by College</h3>
          {barChartData.length > 0 ? (
            <BarChartComponent
              data={barChartData}
              xKey="name"
              bars={[{ dataKey: 'costPerSch', color: colors.primary1, name: 'Cost per SCH (AED)' }]}
              height={280}
            />
          ) : (
            <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data for selected filters</p>
          )}
        </div>
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Cost per SCH Trend (by Year)</h3>
          {trendData.length > 0 ? (
            <LineChartComponent
              data={trendData}
              xKey="name"
              lines={[{ dataKey: 'costPerSch', color: colors.secondary1, name: 'Cost per SCH (AED)' }]}
              height={280}
              yFormatter={(v) => v.toFixed(2)}
            />
          ) : (
            <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data for selected filters</p>
          )}
        </div>
      </div>

      {/* College progress bars when showing all */}
      {selectedCollege === 'All' && barChartData.length > 0 && (
        <div className="p-6 rounded-xl border mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: colors.textPrimary }}>Cost per SCH by College</h3>
          <div className="space-y-4">
            {barChartData.map((row) => {
              const pct = Math.min(100, (row.costPerSch / kpi.targets.max) * 100);
              const status = row.costPerSch >= kpi.targets.min && row.costPerSch <= kpi.targets.max ? 'green'
                : row.costPerSch < kpi.targets.min * 0.9 || row.costPerSch > kpi.targets.max * 1.1 ? 'red' : 'amber';
              return (
                <div key={row.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{row.name}</span>
                    <span className="text-sm font-bold" style={{ color: getStatusColor(colors, status) }}>
                      {row.costPerSch.toFixed(2)} AED
                    </span>
                  </div>
                  <div className="relative h-6 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: getStatusColor(colors, status),
                      }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-black opacity-30"
                      style={{ left: `${(kpi.targets.min / kpi.targets.max) * 100}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-black opacity-30"
                      style={{ left: '100%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t" style={{ borderColor: colors.border }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.successText }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>Green: 900–2,200 AED</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.warningText }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>Amber: Borderline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.dangerText }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>Red: Outside range</span>
            </div>
          </div>
        </div>
      )}

      {/* Program-Term Data Table */}
      <div className="rounded-xl border overflow-hidden mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div className="p-6 border-b flex flex-wrap items-center justify-between gap-4" style={{ borderColor: colors.border }}>
          <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Program-Term Data</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSortYearOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              Year {sortYearOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              <span style={{ color: colors.textSecondary }}>({sortYearOrder === 'desc' ? 'Newest first' : 'Oldest first'})</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: colors.textSecondary }}>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 rounded text-xs font-medium border"
                style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
              >
                {[5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: colors.border }}>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>College</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Year</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Term</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Program</th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Cost (AED)</th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>SCH</th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Cost/SCH</th>
                <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row: any, idx: number) => (
                <tr key={idx} className="border-b transition-colors" style={{ borderColor: colors.border }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.tableHover; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <td className="py-3 px-4 text-sm font-medium" style={{ color: colors.textPrimary }}>{row.college}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{row.academicYear}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{row.term}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: colors.textPrimary }}>{row.programName}</td>
                  <td className="py-3 px-4 text-sm text-right" style={{ color: colors.textPrimary }}>{row.programCostAed.toLocaleString('en-AE', { maximumFractionDigits: 0 })}</td>
                  <td className="py-3 px-4 text-sm text-right" style={{ color: colors.textPrimary }}>{row.programSch}</td>
                  <td className="py-3 px-4 text-sm text-right font-bold" style={{ color: getStatusColor(colors, row.status) }}>
                    {row.costPerSchAed.toFixed(2)} AED
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-bold"
                      style={{ backgroundColor: getStatusBg(colors, row.status), color: getStatusColor(colors, row.status) }}
                    >
                      {row.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t" style={{ borderColor: colors.border }}>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedProgramTermData.length)} of {sortedProgramTermData.length} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              Previous
            </button>
            <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Formula & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Formula</h3>
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{kpi.formula.description}</p>
          <div className="space-y-2">
            {kpi.formula.components.map((c: any, i: number) => (
              <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border }}>
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{c.name}</span>
                {c.formula && <span className="text-sm ml-2" style={{ color: colors.accent }}>= {c.formula}</span>}
                {c.description && <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>{c.description}</p>}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Usage</h3>
          <p className="text-sm mb-2 font-medium" style={{ color: colors.textPrimary }}>Primary</p>
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{kpi.usage.primary}</p>
          <p className="text-sm mb-2 font-medium" style={{ color: colors.textPrimary }}>Secondary</p>
          <ul className="list-disc list-inside text-sm space-y-1" style={{ color: colors.textSecondary }}>
            {kpi.usage.secondary.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
