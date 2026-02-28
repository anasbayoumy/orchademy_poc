/**
 * KPI Catalog - Unified metadata for all KPIs with data
 * Used by the KPI Library page for browsing and filtering
 */

export interface KPICatalogEntry {
  code: string;
  name: string;
  category: string;
  module: string;
  description: string;
  unit?: string;
  frequency?: string;
  usagePage: string;
}

export const KPI_CATALOG: KPICatalogEntry[] = [
  {
    code: 'GOV-00',
    name: 'Overall Strategy Performance Index',
    category: 'Performance',
    module: 'sidebar.strategy.title',
    description: 'Composite index summarizing overall institutional strategy execution health (single board-level score).',
    unit: 'Index Score (0-100)',
    frequency: 'Quarterly',
    usagePage: '/strategy',
  },
  {
    code: 'API-06',
    name: 'At-Risk Student Rate',
    category: 'Outcome',
    module: 'sidebar.programs.title',
    description: 'Percentage of students flagged as at-risk based on configurable early-warning rules (GPA, DFW rate, velocity, repeats, withdrawals). Supports intervention triage and retention strategy.',
    unit: '%',
    frequency: 'Each Term',
    usagePage: '/programs/analytics',
  },
  {
    code: 'PLN-01',
    name: 'Optimum Class Size (Lecture)',
    category: 'Normative',
    module: 'sidebar.workload.title',
    description: 'Ideal enrollment for lecture section. Compare Enrolled_Count to target band (20–30) for section planning and optimization.',
    unit: 'Count (enrollment)',
    frequency: 'Each Term',
    usagePage: '/workload/balancing',
  },
  {
    code: 'ROI-01',
    name: 'Cost per SCH (Program/Term)',
    category: 'Performance',
    module: 'sidebar.roi.title',
    description: 'Total instructional cost divided by Student Credit Hours. Program cost ÷ SCH by program-term.',
    unit: 'AED',
    frequency: 'Each Term',
    usagePage: '/roi/cost',
  },
  {
    code: 'ROI-03',
    name: 'Program Margin',
    category: 'Performance',
    module: 'sidebar.roi.title',
    description: 'Program-level profit/loss (revenue minus cost). Margin % = (Margin ÷ Revenue) × 100.',
    unit: 'AED / %',
    frequency: 'Each Term / Annual',
    usagePage: '/roi/cost',
  },
  {
    code: 'RES-01',
    name: 'Publications per FTE',
    category: 'Outcome',
    module: 'sidebar.programs.title',
    description: 'Research productivity normalized by faculty FTE. Measures scholarly output (publications) per full-time equivalent faculty member annually.',
    unit: 'per faculty-year',
    frequency: 'Annual',
    usagePage: '/programs/kpi',
  },
  {
    code: 'WLM-02',
    name: 'Overload Rate',
    category: 'Performance',
    module: 'sidebar.workload.title',
    description: 'Percentage of faculty exceeding maximum teaching load (burnout risk indicator).',
    unit: '%',
    frequency: 'Each Term',
    usagePage: '/workload/requirements',
  },
  {
    code: 'EFF-12',
    name: 'Student-to-Faculty Ratio (Actual)',
    category: 'Performance',
    module: 'sidebar.efficiency.title',
    description: 'Actual ratio of active students to faculty FTE. Measures instructional capacity and resource balance. Active_Students ÷ Faculty_FTE (by unit and period).',
    unit: ':1 ratio',
    frequency: 'Each Term; Annual',
    usagePage: '/efficiency/workforce',
  },
  {
    code: 'OBF-01',
    name: 'Employment Rate',
    category: 'Compliance',
    module: 'sidebar.roi.title',
    description: 'Employment rate within 1 year. (Employed or further study) ÷ graduates.',
    unit: '%',
    frequency: 'Annual',
    usagePage: '/roi/employability',
  },
];
