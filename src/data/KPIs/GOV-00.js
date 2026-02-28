// GOV-00: Overall Strategy Performance Index
// Composite index summarizing overall institutional strategy execution health

export const GOV_00 = {
  id: "GOV-00",
  code: "GOV-00",
  name: "Overall Strategy Performance Index",
  category: "Performance",
  description: "Composite index summarizing overall institutional strategy execution health (single board-level score).",
  
  formula: {
    description: "Weighted composite of (i) KPI Health Rate, (ii) Initiative Delivery Rate, (iii) Strategic Spend Alignment, (iv) inverse Risk Exposure Index.",
    components: [
      { name: "KPI Health Rate", weight: 0.25 },
      { name: "Initiative Delivery Rate", weight: 0.25 },
      { name: "Strategic Spend Alignment", weight: 0.25 },
      { name: "Risk Exposure Index (inverse)", weight: 0.25 }
    ]
  },

  unit: "Index Score (0-100)",
  frequency: "Quarterly",
  granularity: ["Institution", "Year/Quarter"],

  thresholds: {
    red: { max: 60, label: "Critical - Immediate Action Required" },
    amber: { min: 60, max: 80, label: "Warning - Strategic Review Needed" },
    green: { min: 80, label: "Healthy - On Track" }
  },

  targets: {
    boardApproved: 80,
    stretch: 85,
    minimum: 60
  },

  // Yearly Data (2019-20 to 2023-24)
  yearlyData: [
    {
      fiscalYear: "2019-20",
      value: 50.62,
      status: "red",
      period: { start: "2019-07-01", end: "2020-06-30" }
    },
    {
      fiscalYear: "2020-21",
      value: 50.86,
      status: "red",
      period: { start: "2020-07-01", end: "2021-06-30" }
    },
    {
      fiscalYear: "2021-22",
      value: 61.32,
      status: "amber",
      period: { start: "2021-07-01", end: "2022-06-30" }
    },
    {
      fiscalYear: "2022-23",
      value: 51.33,
      status: "red",
      period: { start: "2022-07-01", end: "2023-06-30" }
    },
    {
      fiscalYear: "2023-24",
      value: 57.57,
      status: "red",
      period: { start: "2023-07-01", end: "2024-06-30" }
    }
  ],

  // Quarterly Data (Mocked with realistic distribution)
  quarterlyData: [
    // 2019-20
    { fiscalYear: "2019-20", quarter: "Q1", period: "2019-Q3", value: 48.23, status: "red", date: "2019-09-30" },
    { fiscalYear: "2019-20", quarter: "Q2", period: "2019-Q4", value: 49.45, status: "red", date: "2019-12-31" },
    { fiscalYear: "2019-20", quarter: "Q3", period: "2020-Q1", value: 51.78, status: "red", date: "2020-03-31" },
    { fiscalYear: "2019-20", quarter: "Q4", period: "2020-Q2", value: 53.02, status: "red", date: "2020-06-30" },
    
    // 2020-21
    { fiscalYear: "2020-21", quarter: "Q1", period: "2020-Q3", value: 47.91, status: "red", date: "2020-09-30" },
    { fiscalYear: "2020-21", quarter: "Q2", period: "2020-Q4", value: 50.12, status: "red", date: "2020-12-31" },
    { fiscalYear: "2020-21", quarter: "Q3", period: "2021-Q1", value: 51.89, status: "red", date: "2021-03-31" },
    { fiscalYear: "2020-21", quarter: "Q4", period: "2021-Q2", value: 53.53, status: "red", date: "2021-06-30" },
    
    // 2021-22
    { fiscalYear: "2021-22", quarter: "Q1", period: "2021-Q3", value: 56.78, status: "red", date: "2021-09-30" },
    { fiscalYear: "2021-22", quarter: "Q2", period: "2021-Q4", value: 59.42, status: "red", date: "2021-12-31" },
    { fiscalYear: "2021-22", quarter: "Q3", period: "2022-Q1", value: 63.15, status: "amber", date: "2022-03-31" },
    { fiscalYear: "2021-22", quarter: "Q4", period: "2022-Q2", value: 65.93, status: "amber", date: "2022-06-30" },
    
    // 2022-23
    { fiscalYear: "2022-23", quarter: "Q1", period: "2022-Q3", value: 58.67, status: "red", date: "2022-09-30" },
    { fiscalYear: "2022-23", quarter: "Q2", period: "2022-Q4", value: 52.34, status: "red", date: "2022-12-31" },
    { fiscalYear: "2022-23", quarter: "Q3", period: "2023-Q1", value: 48.91, status: "red", date: "2023-03-31" },
    { fiscalYear: "2022-23", quarter: "Q4", period: "2023-Q2", value: 45.39, status: "red", date: "2023-06-30" },
    
    // 2023-24
    { fiscalYear: "2023-24", quarter: "Q1", period: "2023-Q3", value: 52.34, status: "red", date: "2023-09-30" },
    { fiscalYear: "2023-24", quarter: "Q2", period: "2023-Q4", value: 55.67, status: "red", date: "2023-12-31" },
    { fiscalYear: "2023-24", quarter: "Q3", period: "2024-Q1", value: 58.89, status: "red", date: "2024-03-31" },
    { fiscalYear: "2023-24", quarter: "Q4", period: "2024-Q2", value: 63.39, status: "amber", date: "2024-06-30" }
  ],

  benchmark: {
    industry: {
      average: 65,
      topQuartile: 78,
      median: 62
    },
    sector: "Higher Education",
    source: "Executive scorecard best practice"
  },

  usage: {
    primary: "Board dashboard headline",
    secondary: [
      "Strategic course-correction trigger",
      "AI recommendation anchor",
      "Executive scorecard KPI"
    ]
  },

  dataConnections: {
    tables: [
      "DIM_STRATEGIC_OBJECTIVE",
      "FACT_INITIATIVE_PORTFOLIO",
      "FACT_MILESTONES",
      "FACT_RISK_REGISTER",
      "FACT_KPI_TARGETS",
      "FACT_KPI_ACTUALS",
      "DIM_NATURAL_ACCOUNT",
      "FACT_PNL_NATURAL",
      "FACT_PNL_FUNCTION",
      "FACT_TRIAL_BALANCE",
      "FACT_BALANCE_SHEET",
      "FACT_CASH_FLOW",
      "DIM_COST_CENTER",
      "BRIDGE_ORG_COST_CENTER"
    ]
  },

  insights: {
    trend: "Volatile performance with improvement in 2021-22 (61.32), followed by decline in 2022-23 (51.33) and slight recovery in 2023-24 (57.57)",
    concern: "Consistently below board-approved target of 80; only 2021-22 achieved amber status",
    recommendation: "Requires comprehensive strategic review and intervention to improve KPI health, initiative delivery, and spend alignment"
  },

  calculationNotes: [
    "All component scores normalized to 0-100 scale before weighting",
    "Weights are configurable by board governance committee",
    "Risk Exposure Index inverted (100 - score) before application",
    "Final score rounded to 2 decimal places"
  ]
};

export default GOV_00;