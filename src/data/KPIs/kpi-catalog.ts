/**
 * KPI Catalog - Unified metadata for all KPIs with data
 * Used by the KPI Library page for browsing and filtering
 */

export interface KPICatalogEntry {
  code: string;
  name: string;
  category: string;
  domain?: string;
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
    description: 'Composite index summarizing overall institutional strategy execution health (single board-level score).',
    unit: 'Index Score (0-100)',
    frequency: 'Quarterly',
    usagePage: '/strategy',
  },
  {
    code: 'API-06',
    name: 'At-Risk Student Rate',
    category: 'Outcome',
    domain: 'Student Success',
    description: 'Percentage of students flagged as at-risk based on configurable early-warning rules (GPA, DFW rate, velocity, repeats, withdrawals). Supports intervention triage and retention strategy.',
    unit: '%',
    frequency: 'Each Term',
    usagePage: '/programs/analytics',
  },
  {
    code: 'PLN-01',
    name: 'Optimum Class Size (Lecture)',
    category: 'Normative',
    domain: 'Section Planning',
    description: 'Ideal enrollment for lecture section. Compare Enrolled_Count to target band (20–30) for section planning and optimization.',
    unit: 'Count (enrollment)',
    frequency: 'Each Term',
    usagePage: '/workload/balancing',
  },
  {
    code: 'ROI-01',
    name: 'Cost per SCH (Program/Term)',
    category: 'Performance',
    domain: 'Unit Economics',
    description: 'Total instructional cost divided by Student Credit Hours. Program cost ÷ SCH by program-term.',
    unit: 'AED',
    frequency: 'Each Term',
    usagePage: '/roi/cost',
  },
  {
    code: 'ROI-03',
    name: 'Program Margin',
    category: 'Performance',
    domain: 'Unit Economics',
    description: 'Program-level profit/loss (revenue minus cost). Margin % = (Margin ÷ Revenue) × 100.',
    unit: 'AED / %',
    frequency: 'Each Term / Annual',
    usagePage: '/roi/cost',
  },
  {
    code: 'RES-01',
    name: 'Publications per FTE',
    category: 'Outcome',
    domain: 'Research',
    description: 'Research productivity normalized by faculty FTE. Measures scholarly output (publications) per full-time equivalent faculty member annually.',
    unit: 'per faculty-year',
    frequency: 'Annual',
    usagePage: '/programs/kpi',
  },
  {
    code: 'WLM-02',
    name: 'Overload Rate',
    category: 'Performance',
    domain: 'Workload',
    description: 'Percentage of faculty exceeding maximum teaching load (burnout risk indicator).',
    unit: '%',
    frequency: 'Each Term',
    usagePage: '/workload/requirements',
  },
];
