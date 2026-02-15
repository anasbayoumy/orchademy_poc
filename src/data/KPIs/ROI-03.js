// ROI-03: Program Margin
// Program-level profit/loss (revenue minus cost)
// Formula: Revenue − Cost (program-term or annual)

const programTermData = require("./ROI-03-program-term.json");
const programYearData = require("./ROI-03-program-year.json");

function getStatus(marginAed, marginPct) {
  if (marginAed < 0) return "red";
  if (marginPct >= 15) return "green";
  return "amber";
}

const targets = { min: 0, stretchPct: 15 };
const programTermDataWithStatus = programTermData.map((d) => ({
  ...d,
  status: getStatus(d.marginAed, d.marginPct),
}));

const programYearDataWithStatus = programYearData.map((d) => ({
  ...d,
  status: getStatus(d.marginAed, d.marginPct),
}));

const totalRevenue = programTermData.reduce((s, d) => s + d.totalRevenue, 0);
const totalCost = programTermData.reduce((s, d) => s + d.totalCost, 0);
const totalMarginAed = totalRevenue - totalCost;
const totalMarginPct = totalRevenue > 0 ? (totalMarginAed / totalRevenue) * 100 : 0;

const ROI_03 = {
  id: "ROI-03",
  code: "ROI-03",
  name: "Program Margin",
  category: "Performance",
  description: "Program-level profit/loss (revenue minus cost).",
  formula: {
    description: "Revenue − Cost (program-term or annual)",
    components: [
      { name: "Revenue (AED)", description: "Total program revenue in period" },
      { name: "Cost (AED)", description: "Total program cost in period" },
      { name: "Margin", formula: "Revenue − Cost" },
      { name: "Margin %", formula: "(Margin ÷ Revenue) × 100" },
    ],
  },
  unit: "AED",
  frequency: "Each Term / Annual",
  granularity: ["Program-Term", "Program-Year"],
  targets: { min: 0, stretchPct: 15 },
  thresholds: {
    green: { label: "Stretch target met (margin ≥ 15%)" },
    amber: { label: "Target met (margin ≥ 0) but below stretch" },
    red: { label: "Negative margin - program loss" },
  },
  programTermData: programTermDataWithStatus,
  programYearData: programYearDataWithStatus,
  institutionalMetrics: {
    totalRevenue,
    totalCost,
    totalMarginAed,
    totalMarginPct,
    status: getStatus(totalMarginAed, totalMarginPct),
  },
  dataConnections: {
    tables: [
      "FACT_SECTION_COSTING",
      "FACT_FACULTY_COMP_ALLOC",
      "FACT_SCH_BY_PROGRAM_TERM",
      "FACT_REVENUE_BY_PROGRAM_TERM",
      "DIM_PROGRAM",
      "DIM_COURSE",
    ],
  },
  usage: {
    primary: "Program viability; cross-subsidy insights",
    secondary: ["Portfolio policy", "Program profitability analysis", "Revenue-cost alignment"],
  },
};

module.exports = ROI_03;
module.exports.ROI_03 = ROI_03;
