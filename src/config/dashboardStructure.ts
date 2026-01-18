// Dashboard configuration - maps routes to page layouts

export interface WidgetConfig {
  id: string;
  type: 'StatCard' | 'BarChart' | 'LineChart' | 'AreaChart' | 'ScatterChart' | 'RadarChart' | 'Table';
  props: {
    title?: string;
    dataKey?: string;
    dataPath?: string; // Path to data in MOCK_DATA (e.g., 'facultyLoad.summary')
    xKey?: string;
    yKey?: string;
    zKey?: string;
    categoryKey?: string;
    columns?: Array<{ key: string; label: string }>;
    [key: string]: any;
  };
}

export interface LayoutRow {
  widgets: WidgetConfig[];
  columns?: number;
  gap?: number;
}

export interface PageLayout {
  title: string;
  path: string;
  layout: LayoutRow[];
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  children?: NavigationItem[];
}

export interface DashboardConfig {
  navigation: NavigationItem[];
  pageLayouts: Record<string, PageLayout>;
}

export const DASHBOARD_CONFIG: DashboardConfig = {
  navigation: [
    {
      id: 'faculty',
      label: 'Faculty Requirements',
      icon: 'Users',
      path: '/faculty',
      children: [
        { id: 'load-summary', label: 'Load Summary', icon: 'BarChart3', path: '/faculty/load-summary' },
        { id: 'gap-report', label: 'Gap Report', icon: 'AlertCircle', path: '/faculty/gap-report' },
        { id: 'smart-allocation', label: 'Smart Allocation', icon: 'Zap', path: '/faculty/smart-allocation' },
        { id: 'planning', label: 'Planning', icon: 'Calendar', path: '/faculty/planning' },
      ],
    },
    {
      id: 'portfolio',
      label: 'Program Portfolio',
      icon: 'Briefcase',
      path: '/portfolio',
      children: [
        { id: 'viability-matrix', label: 'Viability Matrix', icon: 'Grid', path: '/portfolio/viability-matrix' },
        { id: 'scenarios', label: 'Scenarios', icon: 'Layers', path: '/portfolio/scenarios' },
        { id: 'program-analytics', label: 'Program Analytics', icon: 'TrendingUp', path: '/portfolio/program-analytics' },
        { id: 'kpi-summary', label: 'KPI Summary', icon: 'Target', path: '/portfolio/kpi-summary' },
      ],
    },
    {
      id: 'impact',
      label: 'Program Impact',
      icon: 'TrendingUp',
      path: '/impact',
      children: [
        { id: 'employability', label: 'Employability', icon: 'Briefcase', path: '/impact/employability' },
        { id: 'skills-alignment', label: 'Skills Alignment', icon: 'CheckCircle', path: '/impact/skills-alignment' },
        { id: 'impact-dashboard', label: 'Impact Dashboard', icon: 'Activity', path: '/impact/impact-dashboard' },
      ],
    },
  ],
  pageLayouts: {
    '/faculty/load-summary': {
      title: 'Faculty Load Summary',
      path: '/faculty/load-summary',
      layout: [
        {
          widgets: [
            { 
              id: 'total-fte', 
              type: 'StatCard', 
              props: { 
                title: 'Total FTE', 
                value: 'totalFte',
                dataPath: 'facultyLoad.kpi'
              } 
            },
            { 
              id: 'required-fte', 
              type: 'StatCard', 
              props: { 
                title: 'Required FTE', 
                value: 'requiredFte',
                dataPath: 'facultyLoad.kpi'
              } 
            },
            { 
              id: 'utilization', 
              type: 'StatCard', 
              props: { 
                title: 'Utilization Rate', 
                value: 'utilization',
                dataPath: 'facultyLoad.kpi',
                suffix: '%'
              } 
            },
          ],
          columns: 3,
        },
        {
          widgets: [
            { 
              id: 'faculty-load-chart', 
              type: 'BarChart', 
              props: { 
                title: 'Faculty Load by Department', 
                dataPath: 'facultyLoad.summary',
                xKey: 'department',
                dataKey: 'currentFte',
                secondaryDataKey: 'requiredFte'
              } 
            },
          ],
        },
      ],
    },
    '/faculty/gap-report': {
      title: 'Faculty Gap Analysis',
      path: '/faculty/gap-report',
      layout: [
        {
          widgets: [
            { 
              id: 'gap-trend', 
              type: 'LineChart', 
              props: { 
                title: 'Gap Trends Over Time', 
                dataPath: 'gapTrends',
                xKey: 'year',
                dataKeys: ['CS', 'Business', 'Eng']
              } 
            },
          ],
        },
        {
          widgets: [
            { 
              id: 'gap-by-dept', 
              type: 'BarChart', 
              props: { 
                title: 'Gap by Department', 
                dataPath: 'facultyLoad.summary',
                xKey: 'department',
                dataKey: 'gap'
              } 
            },
          ],
        },
      ],
    },
    '/faculty/smart-allocation': {
      title: 'Smart Faculty Allocation',
      path: '/faculty/smart-allocation',
      layout: [
        {
          widgets: [
            { 
              id: 'allocation-table', 
              type: 'Table', 
              props: { 
                title: 'Allocation Recommendations', 
                dataPath: 'smartAllocation',
                columns: [
                  { key: 'dept', label: 'Department' },
                  { key: 'suggest', label: 'Recommendation' },
                  { key: 'confidence', label: 'Confidence %' },
                  { key: 'reason', label: 'Reason' }
                ]
              } 
            },
          ],
        },
      ],
    },
    '/faculty/planning': {
      title: 'Faculty Planning',
      path: '/faculty/planning',
      layout: [
        {
          widgets: [
            { 
              id: 'planning-summary', 
              type: 'StatCard', 
              props: { 
                title: 'Planning Summary', 
                value: 'Planning data coming soon'
              } 
            },
          ],
        },
      ],
    },
    '/portfolio/viability-matrix': {
      title: 'Program Viability Matrix',
      path: '/portfolio/viability-matrix',
      layout: [
        {
          widgets: [
            { 
              id: 'viability-scatter', 
              type: 'ScatterChart', 
              props: { 
                title: 'Program Viability Matrix', 
                dataPath: 'viabilityMatrix',
                xKey: 'enrollment',
                yKey: 'employability',
                zKey: 'costEfficiency'
              } 
            },
          ],
        },
        {
          widgets: [
            { 
              id: 'viability-table', 
              type: 'Table', 
              props: { 
                title: 'Program Details', 
                dataPath: 'viabilityMatrix',
                columns: [
                  { key: 'program', label: 'Program' },
                  { key: 'enrollment', label: 'Enrollment' },
                  { key: 'employability', label: 'Employability %' },
                  { key: 'costEfficiency', label: 'Cost Efficiency' },
                  { key: 'category', label: 'Category' }
                ]
              } 
            },
          ],
        },
      ],
    },
    '/portfolio/scenarios': {
      title: 'Portfolio Scenarios',
      path: '/portfolio/scenarios',
      layout: [
        {
          widgets: [
            { 
              id: 'scenario-chart', 
              type: 'LineChart', 
              props: { 
                title: 'Enrollment Scenarios (6-Year Forecast)', 
                dataPath: 'scenarios',
                xKey: 'year',
                dataKeys: ['baseline', 'optimistic', 'pessimistic']
              } 
            },
          ],
        },
      ],
    },
    '/portfolio/program-analytics': {
      title: 'Program Analytics',
      path: '/portfolio/program-analytics',
      layout: [
        {
          widgets: [
            { 
              id: 'enrollment-metric', 
              type: 'StatCard', 
              props: { 
                title: 'Enrollment', 
                value: 'value',
                dataPath: 'programAnalytics.metrics.enrollment',
                trend: 'trend'
              } 
            },
            { 
              id: 'revenue-metric', 
              type: 'StatCard', 
              props: { 
                title: 'Revenue', 
                value: 'value',
                dataPath: 'programAnalytics.metrics.revenue',
                unit: ' AED',
                trend: 'trend'
              } 
            },
            { 
              id: 'cost-metric', 
              type: 'StatCard', 
              props: { 
                title: 'Cost', 
                value: 'value',
                dataPath: 'programAnalytics.metrics.cost',
                unit: ' AED',
                trend: 'trend'
              } 
            },
            { 
              id: 'employment-metric', 
              type: 'StatCard', 
              props: { 
                title: 'Employment Rate', 
                value: 'value',
                dataPath: 'programAnalytics.metrics.employment',
                suffix: '%',
                trend: 'trend'
              } 
            },
          ],
          columns: 4,
        },
      ],
    },
    '/portfolio/kpi-summary': {
      title: 'KPI Summary',
      path: '/portfolio/kpi-summary',
      layout: [
        {
          widgets: [
            { 
              id: 'kpi-summary-card', 
              type: 'StatCard', 
              props: { 
                title: 'Portfolio KPI Summary', 
                value: 'Summary data'
              } 
            },
          ],
        },
      ],
    },
    '/impact/employability': {
      title: 'Employability Metrics',
      path: '/impact/employability',
      layout: [
        {
          widgets: [
            { 
              id: 'top-employers', 
              type: 'Table', 
              props: { 
                title: 'Top Employers', 
                dataPath: 'topEmployers',
                columns: [
                  { key: 'name', label: 'Employer' },
                  { key: 'hires', label: 'Hires' },
                  { key: 'sector', label: 'Sector' }
                ]
              } 
            },
          ],
        },
        {
          widgets: [
            { 
              id: 'employers-chart', 
              type: 'BarChart', 
              props: { 
                title: 'Hires by Employer', 
                dataPath: 'topEmployers',
                xKey: 'name',
                dataKey: 'hires'
              } 
            },
          ],
        },
      ],
    },
    '/impact/skills-alignment': {
      title: 'Skills Alignment Analysis',
      path: '/impact/skills-alignment',
      layout: [
        {
          widgets: [
            { 
              id: 'skills-radar', 
              type: 'RadarChart', 
              props: { 
                title: 'Skills Gap Analysis', 
                dataPath: 'skillsRadar',
                categoryKey: 'subject',
                dataKeys: ['demand', 'curriculum']
              } 
            },
          ],
        },
      ],
    },
    '/impact/impact-dashboard': {
      title: 'Program Impact Dashboard',
      path: '/impact/impact-dashboard',
      layout: [
        {
          widgets: [
            { 
              id: 'impact-summary', 
              type: 'StatCard', 
              props: { 
                title: 'Impact Summary', 
                value: 'Impact metrics'
              } 
            },
          ],
        },
      ],
    },
  },
};
