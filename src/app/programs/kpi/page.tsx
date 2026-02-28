'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Minus, FileText, Lightbulb, Target, Info, ChevronDown, ChevronUp, BookOpen, Users } from 'lucide-react';
import { getKPISummary } from '@/data/programs';
import { useColors } from '@/hooks/useColors';
import BarChartComponent from '@/components/charts/BarChart';
import LineChartComponent from '@/components/charts/LineChart';
import RES_01 from '@/data/KPIs/RES-01';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const res01 = RES_01 as any;

const DEPARTMENT_TO_COLLEGE: Record<string, string> = {
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

function getStatusIconRes(status: string) {
  switch (status) {
    case 'green': return <CheckCircle2 size={20} />;
    case 'amber': return <AlertCircle size={20} />;
    case 'red': return <XCircle size={20} />;
    default: return <AlertCircle size={20} />;
  }
}

type TabType = 'summary' | 'publications-per-fte';

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
// SUMMARY TAB (existing content)
// ============================================
function SummaryTab() {
  const colors = useColors();
  const kpis = getKPISummary();

  const getStatusStyles = (status: string) => {
    if (colors.isDark) {
      switch (status) {
        case 'On Track': return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' };
        case 'At Risk': return { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15' };
        default: return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' };
      }
    }
    switch (status) {
      case 'On Track': return { bg: '#f0fdf4', text: '#16a34a' };
      case 'At Risk': return { bg: '#fefce8', text: '#ca8a04' };
      default: return { bg: '#fef2f2', text: '#dc2626' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {kpis.map((kpi) => {
          const statusStyles = getStatusStyles(kpi.status);
          return (
            <div
              key={kpi.metric}
              className="rounded-xl p-5"
              style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: colors.textSecondary }}>{kpi.metric}</p>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: statusStyles.bg, color: statusStyles.text }}
                >
                  {kpi.status}
                </span>
              </div>
              <p className="text-2xl font-semibold mb-1" style={{ color: colors.textPrimary }}>{kpi.value}</p>
              <div className="flex items-center gap-2 mb-3">
                {kpi.trend === 'up' && <TrendingUp size={14} style={{ color: colors.successText }} />}
                {kpi.trend === 'down' && <TrendingDown size={14} style={{ color: colors.dangerText }} />}
                {kpi.trend === 'stable' && <Minus size={14} style={{ color: colors.textSecondary }} />}
                <span className="text-xs" style={{ color: colors.textSecondary }}>Target: {kpi.target}</span>
              </div>
              <p
                className="text-xs p-3 rounded-lg"
                style={{ backgroundColor: colors.tableHeader, color: colors.textSecondary }}
              >
                {kpi.insight}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} style={{ color: colors.accent }} />
          <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Executive Summary</h2>
        </div>
        <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
          The academic portfolio shows strong overall performance with revenue growth of 8% year-over-year.
          STEM programs continue to lead in enrollment and employment outcomes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: colors.successBg }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} style={{ color: colors.successText }} />
              <span className="text-sm font-medium" style={{ color: colors.successText }}>Strengths</span>
            </div>
            <ul className="text-xs space-y-1" style={{ color: colors.successText }}>
              <li>• STEM programs showing highest growth rates</li>
              <li>• Graduate employment outcomes improving</li>
              <li>• Enrollment targets met for 80% of programs</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: colors.warningBg }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} style={{ color: colors.warningText }} />
              <span className="text-sm font-medium" style={{ color: colors.warningText }}>Areas for Attention</span>
            </div>
            <ul className="text-xs space-y-1" style={{ color: colors.warningText }}>
              <li>• Several Arts & Humanities programs at risk</li>
              <li>• Cost per student rising in Healthcare</li>
              <li>• Enrollment declining in Certificate programs</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={16} style={{ color: colors.accent }} />
          <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Recommendations</h2>
        </div>
        <div className="space-y-3">
          {[
            { title: 'Review At-Risk Programs', desc: 'Conduct strategic review of programs with viability scores below 40.' },
            { title: 'Expand High-Performers', desc: 'Increase capacity in Computer Science and Data Science programs.' },
            { title: 'Strengthen Partnerships', desc: 'Develop co-op programs with top employers to improve outcomes.' },
          ].map((rec, idx) => (
            <div
              key={idx}
              className="flex gap-3 p-3 rounded-lg"
              style={{ backgroundColor: colors.tableHeader }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                style={{ backgroundColor: colors.accentBg, color: colors.accent }}
              >
                {idx + 1}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{rec.title}</p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>{rec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// PUBLICATIONS PER FACULTY FTE TAB (RES-01)
// ============================================
function PublicationsPerFteTab() {
  const colors = useColors();
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [granularity, setGranularity] = useState<'college-year' | 'department-year'>('college-year');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortYearOrder, setSortYearOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const colleges = useMemo((): string[] => {
    const set = new Set<string>(res01.collegeYearData.map((d: any) => d.college));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const years = useMemo((): string[] => {
    const set = new Set<string>([
      ...res01.collegeYearData.map((d: any) => d.academicYear),
      ...res01.departmentYearData.map((d: any) => d.academicYear),
    ]);
    return ['All', ...Array.from(set).sort()];
  }, []);

  const departments = useMemo((): string[] => {
    const set = new Set<string>(res01.departmentYearData.map((d: any) => d.department));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'green', label: 'Green (≥1.2)' },
    { value: 'amber', label: 'Amber (0.5–1.2)' },
    { value: 'red', label: 'Red (<0.5)' },
  ];

  const filteredCollegeYearData = useMemo(() => {
    return (res01.collegeYearData || []).filter((d: any) => {
      if (selectedCollege !== 'All' && d.college !== selectedCollege) return false;
      if (selectedYear !== 'All' && d.academicYear !== selectedYear) return false;
      if (selectedStatus !== 'All' && d.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedCollege, selectedYear, selectedStatus]);

  const filteredDepartmentYearData = useMemo(() => {
    return (res01.departmentYearData || []).filter((d: any) => {
      const college = DEPARTMENT_TO_COLLEGE[d.department];
      if (selectedCollege !== 'All' && college !== selectedCollege) return false;
      if (selectedYear !== 'All' && d.academicYear !== selectedYear) return false;
      if (selectedDepartment !== 'All' && d.department !== selectedDepartment) return false;
      if (selectedStatus !== 'All' && d.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedCollege, selectedYear, selectedDepartment, selectedStatus]);

  const filteredData = granularity === 'college-year' ? filteredCollegeYearData : filteredDepartmentYearData;

  const filteredMetrics = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        totalPublications: 0,
        totalFte: 0,
        publicationsPerFte: 0,
        status: 'amber' as const,
      };
    }
    const totalPublications = filteredData.reduce((s: number, d: any) => s + (d.total_publications || 0), 0);
    const totalFte = filteredData.reduce((s: number, d: any) => s + (d.total_fte || 0), 0);
    const publicationsPerFte = totalFte > 0 ? totalPublications / totalFte : 0;
    const status = publicationsPerFte >= 1.2 ? 'green' : publicationsPerFte < 0.5 ? 'red' : 'amber';
    return { totalPublications, totalFte, publicationsPerFte, status };
  }, [filteredData]);

  const barChartData = useMemo(() => {
    const map: Record<string, { total_publications: number; total_fte: number }> = {};
    filteredData.forEach((d: any) => {
      const key = granularity === 'college-year' ? d.college : d.department;
      if (!map[key]) map[key] = { total_publications: 0, total_fte: 0 };
      map[key].total_publications += d.total_publications || 0;
      map[key].total_fte += d.total_fte || 0;
    });
    return Object.entries(map)
      .map(([name, v]) => ({
        name,
        publicationsPerFte: v.total_fte > 0 ? Math.round(v.total_publications / v.total_fte * 100) / 100 : 0,
      }))
      .sort((a, b) => b.publicationsPerFte - a.publicationsPerFte);
  }, [filteredData, granularity]);

  const trendData = useMemo(() => {
    const yearMap: Record<string, { total_publications: number; total_fte: number }> = {};
    filteredData.forEach((d: any) => {
      if (!yearMap[d.academicYear]) yearMap[d.academicYear] = { total_publications: 0, total_fte: 0 };
      yearMap[d.academicYear].total_publications += d.total_publications || 0;
      yearMap[d.academicYear].total_fte += d.total_fte || 0;
    });
    return Object.entries(yearMap)
      .map(([academicYear, v]) => ({
        name: academicYear,
        publicationsPerFte: v.total_fte > 0 ? Math.round(v.total_publications / v.total_fte * 100) / 100 : 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredData]);

  const sortedData = useMemo(() => {
    const s = [...filteredData];
    s.sort((a: any, b: any) =>
      (sortYearOrder === 'desc' ? -1 : 1) * String(a.academicYear).localeCompare(b.academicYear)
    );
    return s;
  }, [filteredData, sortYearOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const resetPage = () => setCurrentPage(1);

  const progressBarData = useMemo(() => {
    if (selectedCollege !== 'All' || selectedStatus !== 'All') return [];
    return barChartData;
  }, [barChartData, selectedCollege, selectedStatus]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-xl p-5 border mb-6" style={{ backgroundColor: colors.accentBg, borderColor: colors.accent }}>
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} style={{ color: colors.accent }} />
          <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Publications per FTE</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{filteredMetrics.totalPublications.toLocaleString()}</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Total Publications</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{filteredMetrics.totalFte.toFixed(2)}</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Total Faculty FTE</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: getStatusColor(colors, filteredMetrics.status) }}>{filteredMetrics.publicationsPerFte.toFixed(2)}</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Pubs per FTE</p>
          </div>
          <div>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold"
              style={{ backgroundColor: getStatusBg(colors, filteredMetrics.status), color: getStatusColor(colors, filteredMetrics.status) }}
            >
              {getStatusIconRes(filteredMetrics.status)}{filteredMetrics.status.toUpperCase()}
            </span>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Target 0.5–1.5+ per FTE</p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>{filteredData.length} record{filteredData.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Total Publications</span>
            <BookOpen size={20} style={{ color: colors.primary1 }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{filteredMetrics.totalPublications.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Faculty FTE</span>
            <Users size={20} style={{ color: colors.primary1 }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{filteredMetrics.totalFte.toFixed(2)}</p>
        </div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Publications per FTE</span>
            <div style={{ color: getStatusColor(colors, filteredMetrics.status) }}>{getStatusIconRes(filteredMetrics.status)}</div>
          </div>
          <p className="text-2xl font-bold" style={{ color: getStatusColor(colors, filteredMetrics.status) }}>{filteredMetrics.publicationsPerFte.toFixed(2)}</p>
        </div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Target</span>
            <Target size={20} style={{ color: colors.accent }} />
          </div>
          <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>0.5 – 3.0 per FTE</p>
        </div>
      </div>

      <div className="p-6 rounded-xl border mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div className="flex items-center gap-4 mb-4">
          <Target size={20} style={{ color: colors.primary1 }} />
          <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Granularity</label>
            <select
              value={granularity}
              onChange={(e) => { setGranularity(e.target.value as any); resetPage(); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              <option value="college-year">College-Year</option>
              <option value="department-year">Department-Year</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>College</label>
            <select
              value={selectedCollege}
              onChange={(e) => { setSelectedCollege(e.target.value); resetPage(); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {colleges.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All' : c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(e.target.value); resetPage(); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y === 'All' ? 'All' : y}</option>
              ))}
            </select>
          </div>
          {granularity === 'department-year' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => { setSelectedDepartment(e.target.value); resetPage(); }}
                className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
                style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d === 'All' ? 'All' : d}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); resetPage(); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Info size={16} style={{ color: colors.infoText }} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            Showing {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}
            {selectedCollege !== 'All' && ` • ${selectedCollege}`}
            {selectedYear !== 'All' && ` • ${selectedYear}`}
            {granularity === 'department-year' && selectedDepartment !== 'All' && ` • ${selectedDepartment}`}
            {selectedStatus !== 'All' && ` • ${selectedStatus}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Publications per FTE by {granularity === 'college-year' ? 'College' : 'Department'}
          </h3>
          {barChartData.length > 0 ? (
            <BarChartComponent
              data={barChartData}
              xKey="name"
              bars={[{ dataKey: 'publicationsPerFte', color: colors.primary1, name: 'Pubs per FTE' }]}
              height={280}
            />
          ) : (
            <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data</p>
          )}
        </div>
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Publications per FTE Trend (by Year)</h3>
          {trendData.length > 0 ? (
            <LineChartComponent
              data={trendData}
              xKey="name"
              lines={[{ dataKey: 'publicationsPerFte', color: colors.primary1, name: 'Pubs per FTE' }]}
              height={280}
              yFormatter={(v) => v.toFixed(2)}
            />
          ) : (
            <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data</p>
          )}
        </div>
      </div>

      {progressBarData.length > 0 && (
        <div className="p-6 rounded-xl border mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: colors.textPrimary }}>
            Publications per FTE by {granularity === 'college-year' ? 'College' : 'Department'}
          </h3>
          <div className="space-y-4">
            {progressBarData.map((row) => {
              const status = row.publicationsPerFte >= 1.2 ? 'green' : row.publicationsPerFte >= 0.5 ? 'amber' : 'red';
              const pct = Math.min(100, (row.publicationsPerFte / 2) * 100);
              return (
                <div key={row.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{row.name}</span>
                    <span className="text-sm font-bold" style={{ color: getStatusColor(colors, status) }}>{row.publicationsPerFte.toFixed(2)}</span>
                  </div>
                  <div className="relative h-6 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: getStatusColor(colors, status) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t" style={{ borderColor: colors.border }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.successText }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>Green: ≥1.2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.warningText }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>Amber: 0.5–1.2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.dangerText }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>Red: &lt;0.5</span>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div className="p-6 border-b flex flex-wrap items-center justify-between gap-4" style={{ borderColor: colors.border }}>
          <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            {granularity === 'college-year' ? 'College-Year' : 'Department-Year'} Data
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSortYearOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              Year {sortYearOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); resetPage(); }}
              className="px-2 py-1 rounded text-xs font-medium border"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {[5, 10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: colors.border }}>
                {granularity === 'department-year' && (
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Department</th>
                )}
                {granularity === 'college-year' && (
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>College</th>
                )}
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Year</th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Publications</th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>FTE</th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Pubs/FTE</th>
                <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row: any, idx: number) => (
                <tr
                  key={idx}
                  className="border-b transition-colors"
                  style={{ borderColor: colors.border }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.tableHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {granularity === 'department-year' ? (
                    <td className="py-3 px-4 text-sm font-medium" style={{ color: colors.textPrimary }}>{row.department}</td>
                  ) : (
                    <td className="py-3 px-4 text-sm font-medium" style={{ color: colors.textPrimary }}>{row.college}</td>
                  )}
                  <td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{row.academicYear}</td>
                  <td className="py-3 px-4 text-sm text-right" style={{ color: colors.textPrimary }}>{row.total_publications?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-right" style={{ color: colors.textPrimary }}>{row.total_fte?.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-right font-bold" style={{ color: getStatusColor(colors, row.status) }}>{row.publications_per_fte?.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-bold"
                      style={{ backgroundColor: getStatusBg(colors, row.status), color: getStatusColor(colors, row.status) }}
                    >
                      {row.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t" style={{ borderColor: colors.border }}>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40"
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
              className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Formula</h3>
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{res01.formula?.description}</p>
          <div className="space-y-2">
            {(res01.formula?.components || []).map((c: any, i: number) => (
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
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{res01.usage?.primary}</p>
          <ul className="list-disc list-inside text-sm space-y-1" style={{ color: colors.textSecondary }}>
            {(res01.usage?.secondary || []).map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function KPIReport() {
  const colors = useColors();
  const tabs: { id: TabType; label: string }[] = [
        { id: 'publications-per-fte', label: 'Publications per Faculty FTE' },
        { id: 'summary', label: 'Summary' },
    ];
    const [activeTab, setActiveTab] = useState<TabType>(tabs[0].id);

  return (
    <div className="animate-fade-in">
      <Header
        title="KPI Summary Report"
        subtitle="Automated narrative insights of program performance"
      />

      <div className="flex flex-wrap gap-0 border-b mb-6" style={{ borderColor: colors.border }}>
        {tabs.map(tab => (
          <Tab key={tab.id} id={tab.id} label={tab.label} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} colors={colors} />
        ))}
      </div>

      {activeTab === 'summary' && <SummaryTab />}
      {activeTab === 'publications-per-fte' && <PublicationsPerFteTab />}
    </div>
  );
}
