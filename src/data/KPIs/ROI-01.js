// ROI-01: Cost per SCH (Program/Term)
// Total instructional cost divided by Student Credit Hours
// Formula: Program cost ÷ SCH (by program-term)

const programTermData = require("./ROI-01-program-term.json");

const collegeYearData = [
  { academicYear: "2019-20", college: "Business", totalCost: 6748238, totalSch: 5503, costPerSchAed: 1226.28 },
  { academicYear: "2019-20", college: "Computing", totalCost: 6565040, totalSch: 4583, costPerSchAed: 1432.48 },
  { academicYear: "2019-20", college: "Engineering", totalCost: 6665662, totalSch: 5007, costPerSchAed: 1331.27 },
  { academicYear: "2019-20", college: "Health Sciences", totalCost: 7954188, totalSch: 5960, costPerSchAed: 1334.6 },
  { academicYear: "2019-20", college: "Humanities", totalCost: 6550650, totalSch: 5257, costPerSchAed: 1246.08 },
  { academicYear: "2020-21", college: "Business", totalCost: 5128715, totalSch: 5648, costPerSchAed: 908.06 },
  { academicYear: "2020-21", college: "Computing", totalCost: 5132495, totalSch: 4789, costPerSchAed: 1071.73 },
  { academicYear: "2020-21", college: "Engineering", totalCost: 4881609, totalSch: 5132, costPerSchAed: 951.21 },
  { academicYear: "2020-21", college: "Health Sciences", totalCost: 5705809, totalSch: 5938, costPerSchAed: 960.9 },
  { academicYear: "2020-21", college: "Humanities", totalCost: 4962918, totalSch: 5373, costPerSchAed: 923.68 },
  { academicYear: "2021-22", college: "Business", totalCost: 7051726, totalSch: 5657, costPerSchAed: 1246.55 },
  { academicYear: "2021-22", college: "Computing", totalCost: 6550733, totalSch: 4852, costPerSchAed: 1350.11 },
  { academicYear: "2021-22", college: "Engineering", totalCost: 6484487, totalSch: 5155, costPerSchAed: 1257.9 },
  { academicYear: "2021-22", college: "Health Sciences", totalCost: 7567008, totalSch: 5766, costPerSchAed: 1312.35 },
  { academicYear: "2021-22", college: "Humanities", totalCost: 6530202, totalSch: 5357, costPerSchAed: 1219 },
  { academicYear: "2022-23", college: "Business", totalCost: 6833127, totalSch: 5668, costPerSchAed: 1205.56 },
  { academicYear: "2022-23", college: "Computing", totalCost: 6313042, totalSch: 4950, costPerSchAed: 1275.36 },
  { academicYear: "2022-23", college: "Engineering", totalCost: 6251294, totalSch: 5141, costPerSchAed: 1215.97 },
  { academicYear: "2022-23", college: "Health Sciences", totalCost: 6817432, totalSch: 5641, costPerSchAed: 1208.55 },
  { academicYear: "2022-23", college: "Humanities", totalCost: 6334446, totalSch: 5362, costPerSchAed: 1181.36 },
  { academicYear: "2023-24", college: "Business", totalCost: 6344899, totalSch: 5708, costPerSchAed: 1111.58 },
  { academicYear: "2023-24", college: "Computing", totalCost: 6098997, totalSch: 4983, costPerSchAed: 1223.96 },
  { academicYear: "2023-24", college: "Engineering", totalCost: 5836967, totalSch: 5183, costPerSchAed: 1126.18 },
  { academicYear: "2023-24", college: "Health Sciences", totalCost: 6359962, totalSch: 5663, costPerSchAed: 1123.07 },
  { academicYear: "2023-24", college: "Humanities", totalCost: 5989173, totalSch: 5433, costPerSchAed: 1102.37 },
];

function getStatus(cost, targetMin, targetMax) {
  if (cost >= targetMin && cost <= targetMax) return "green";
  if (cost < targetMin * 0.9 || cost > targetMax * 1.1) return "red";
  return "amber";
}

const targets = { min: 900, max: 2200 };
const programTermDataWithStatus = programTermData.map((d) => ({
  ...d,
  status: getStatus(d.costPerSchAed, targets.min, targets.max),
}));

const collegeYearDataWithStatus = collegeYearData.map((d) => ({
  ...d,
  status: getStatus(d.costPerSchAed, targets.min, targets.max),
}));

const totalCost = programTermData.reduce((s, d) => s + d.programCostAed, 0);
const totalSch = programTermData.reduce((s, d) => s + d.programSch, 0);
const institutionalCostPerSch = totalSch > 0 ? totalCost / totalSch : 0;

const ROI_01 = {
  id: "ROI-01",
  code: "ROI-01",
  name: "Cost per SCH (Program/Term)",
  category: "Performance",
  description: "Total instructional cost divided by Student Credit Hours.",
  formula: {
    description: "Program cost ÷ SCH (by program-term)",
    components: [
      { name: "Program Cost (AED)", description: "Total instructional cost for program in term" },
      { name: "Student Credit Hours (SCH)", description: "Total SCH delivered by program in term" },
      { name: "Cost per SCH", formula: "Program Cost ÷ SCH" },
    ],
  },
  unit: "AED",
  frequency: "Each Term",
  granularity: ["Program-Term", "College-Term"],
  targets: { min: 900, max: 2200 },
  thresholds: {
    green: { min: 900, max: 2200, label: "Within efficiency target" },
    amber: { label: "Borderline - review pricing or costs" },
    red: { label: "Outside target range" },
  },
  programTermData: programTermDataWithStatus,
  collegeYearData: collegeYearDataWithStatus,
  institutionalMetrics: {
    totalCost,
    totalSch,
    costPerSchAed: institutionalCostPerSch,
    status: getStatus(institutionalCostPerSch, targets.min, targets.max),
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
    primary: "Cost efficiency; pricing/discount decisions; scholarship design",
    secondary: ["Program profitability analysis", "Budget allocation", "Pricing strategy"],
  },
};

module.exports = ROI_01;
module.exports.ROI_01 = ROI_01;
