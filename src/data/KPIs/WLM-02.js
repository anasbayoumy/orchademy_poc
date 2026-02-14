// WLM-02: Overload Rate
// Percentage of faculty exceeding maximum teaching load

export const WLM_02 = {
  id: "WLM-02",
  code: "WLM-02",
  name: "Overload Rate",
  category: "Performance",
  description: "Percentage of faculty exceeding maximum load (burnout risk indicator).",
  
  formula: {
    description: "Faculty where Load_Credits > Max_Load ÷ total faculty",
    components: [
      { name: "Total Overloaded Faculty", description: "Faculty exceeding maximum load credits" },
      { name: "Total Faculty", description: "All faculty in the term" },
      { name: "Overload Rate", formula: "(Total Overloaded Faculty / Total Faculty) × 100" }
    ]
  },

  unit: "Percentage (%)",
  frequency: "Each Term",
  granularity: ["College", "Academic Year", "Term"],

  thresholds: {
    green: { max: 10, label: "Healthy - Within Policy Limits" },
    amber: { min: 10, max: 20, label: "Warning - Monitor for Burnout" },
    red: { min: 20, label: "Critical - Policy Violation & Risk" }
  },

  targets: {
    boardApproved: 10,
    stretch: 0,
    maximum: 15
  },

  // Data organized by College, Academic Year, and Term
  termData: [
    // Computing (High overload rates - needs attention)
    { college: "Computing", academicYear: "2020-21", term: "Fall", totalFaculty: 36, totalOverloaded: 16, overloadRate: 44.44, status: "red" },
    { college: "Computing", academicYear: "2021-22", term: "Fall", totalFaculty: 36, totalOverloaded: 15, overloadRate: 41.67, status: "red" },
    { college: "Computing", academicYear: "2023-24", term: "Fall", totalFaculty: 36, totalOverloaded: 12, overloadRate: 33.33, status: "red" },
    { college: "Computing", academicYear: "2022-23", term: "Fall", totalFaculty: 36, totalOverloaded: 11, overloadRate: 30.56, status: "red" },
    { college: "Computing", academicYear: "2020-21", term: "Spring", totalFaculty: 36, totalOverloaded: 7, overloadRate: 19.44, status: "amber" },
    { college: "Computing", academicYear: "2019-20", term: "Fall", totalFaculty: 35, totalOverloaded: 6, overloadRate: 17.14, status: "amber" },
    { college: "Computing", academicYear: "2021-22", term: "Spring", totalFaculty: 36, totalOverloaded: 6, overloadRate: 16.67, status: "amber" },
    { college: "Computing", academicYear: "2023-24", term: "Spring", totalFaculty: 36, totalOverloaded: 4, overloadRate: 11.11, status: "amber" },
    { college: "Computing", academicYear: "2022-23", term: "Spring", totalFaculty: 36, totalOverloaded: 4, overloadRate: 11.11, status: "amber" },
    { college: "Computing", academicYear: "2019-20", term: "Spring", totalFaculty: 36, totalOverloaded: 3, overloadRate: 8.33, status: "green" },

    // Health Sciences (Concerning trend - high rates)
    { college: "Health Sciences", academicYear: "2019-20", term: "Fall", totalFaculty: 34, totalOverloaded: 13, overloadRate: 38.24, status: "red" },
    { college: "Health Sciences", academicYear: "2021-22", term: "Fall", totalFaculty: 35, totalOverloaded: 13, overloadRate: 37.14, status: "red" },
    { college: "Health Sciences", academicYear: "2020-21", term: "Fall", totalFaculty: 33, totalOverloaded: 12, overloadRate: 36.36, status: "red" },
    { college: "Health Sciences", academicYear: "2019-20", term: "Spring", totalFaculty: 31, totalOverloaded: 11, overloadRate: 35.48, status: "red" },
    { college: "Health Sciences", academicYear: "2020-21", term: "Spring", totalFaculty: 33, totalOverloaded: 11, overloadRate: 33.33, status: "red" },
    { college: "Health Sciences", academicYear: "2022-23", term: "Fall", totalFaculty: 35, totalOverloaded: 8, overloadRate: 22.86, status: "red" },
    { college: "Health Sciences", academicYear: "2023-24", term: "Fall", totalFaculty: 34, totalOverloaded: 6, overloadRate: 17.65, status: "amber" },
    { college: "Health Sciences", academicYear: "2023-24", term: "Spring", totalFaculty: 32, totalOverloaded: 5, overloadRate: 15.62, status: "amber" },
    { college: "Health Sciences", academicYear: "2022-23", term: "Spring", totalFaculty: 33, totalOverloaded: 5, overloadRate: 15.15, status: "amber" },
    { college: "Health Sciences", academicYear: "2021-22", term: "Spring", totalFaculty: 34, totalOverloaded: 5, overloadRate: 14.71, status: "amber" },

    // Engineering (Moderate rates - improving trend)
    { college: "Engineering", academicYear: "2021-22", term: "Fall", totalFaculty: 39, totalOverloaded: 10, overloadRate: 25.64, status: "red" },
    { college: "Engineering", academicYear: "2023-24", term: "Fall", totalFaculty: 40, totalOverloaded: 10, overloadRate: 25.0, status: "red" },
    { college: "Engineering", academicYear: "2021-22", term: "Spring", totalFaculty: 41, totalOverloaded: 10, overloadRate: 24.39, status: "red" },
    { college: "Engineering", academicYear: "2022-23", term: "Spring", totalFaculty: 38, totalOverloaded: 8, overloadRate: 21.05, status: "red" },
    { college: "Engineering", academicYear: "2020-21", term: "Fall", totalFaculty: 40, totalOverloaded: 8, overloadRate: 20.0, status: "red" },
    { college: "Engineering", academicYear: "2022-23", term: "Fall", totalFaculty: 42, totalOverloaded: 8, overloadRate: 19.05, status: "amber" },
    { college: "Engineering", academicYear: "2020-21", term: "Spring", totalFaculty: 39, totalOverloaded: 7, overloadRate: 17.95, status: "amber" },
    { college: "Engineering", academicYear: "2023-24", term: "Spring", totalFaculty: 38, totalOverloaded: 6, overloadRate: 15.79, status: "amber" },
    { college: "Engineering", academicYear: "2019-20", term: "Spring", totalFaculty: 42, totalOverloaded: 6, overloadRate: 14.29, status: "amber" },
    { college: "Engineering", academicYear: "2019-20", term: "Fall", totalFaculty: 39, totalOverloaded: 5, overloadRate: 12.82, status: "amber" },

    // Humanities (Good performance - declining rates)
    { college: "Humanities", academicYear: "2023-24", term: "Fall", totalFaculty: 40, totalOverloaded: 6, overloadRate: 15.0, status: "amber" },
    { college: "Humanities", academicYear: "2020-21", term: "Spring", totalFaculty: 41, totalOverloaded: 6, overloadRate: 14.63, status: "amber" },
    { college: "Humanities", academicYear: "2022-23", term: "Fall", totalFaculty: 41, totalOverloaded: 5, overloadRate: 12.2, status: "amber" },
    { college: "Humanities", academicYear: "2021-22", term: "Fall", totalFaculty: 40, totalOverloaded: 4, overloadRate: 10.0, status: "amber" },
    { college: "Humanities", academicYear: "2020-21", term: "Fall", totalFaculty: 42, totalOverloaded: 4, overloadRate: 9.52, status: "green" },
    { college: "Humanities", academicYear: "2021-22", term: "Spring", totalFaculty: 42, totalOverloaded: 4, overloadRate: 9.52, status: "green" },
    { college: "Humanities", academicYear: "2023-24", term: "Spring", totalFaculty: 39, totalOverloaded: 2, overloadRate: 5.13, status: "green" },
    { college: "Humanities", academicYear: "2022-23", term: "Spring", totalFaculty: 40, totalOverloaded: 2, overloadRate: 5.0, status: "green" },
    { college: "Humanities", academicYear: "2019-20", term: "Fall", totalFaculty: 40, totalOverloaded: 0, overloadRate: 0.0, status: "green" },
    { college: "Humanities", academicYear: "2019-20", term: "Spring", totalFaculty: 41, totalOverloaded: 0, overloadRate: 0.0, status: "green" },

    // Business (Excellent performance - consistently low)
    { college: "Business", academicYear: "2022-23", term: "Fall", totalFaculty: 45, totalOverloaded: 3, overloadRate: 6.67, status: "green" },
    { college: "Business", academicYear: "2023-24", term: "Fall", totalFaculty: 45, totalOverloaded: 2, overloadRate: 4.44, status: "green" },
    { college: "Business", academicYear: "2021-22", term: "Fall", totalFaculty: 45, totalOverloaded: 2, overloadRate: 4.44, status: "green" },
    { college: "Business", academicYear: "2020-21", term: "Spring", totalFaculty: 42, totalOverloaded: 1, overloadRate: 2.38, status: "green" },
    { college: "Business", academicYear: "2019-20", term: "Spring", totalFaculty: 42, totalOverloaded: 0, overloadRate: 0.0, status: "green" },
    { college: "Business", academicYear: "2023-24", term: "Spring", totalFaculty: 40, totalOverloaded: 0, overloadRate: 0.0, status: "green" },
    { college: "Business", academicYear: "2022-23", term: "Spring", totalFaculty: 41, totalOverloaded: 0, overloadRate: 0.0, status: "green" },
    { college: "Business", academicYear: "2021-22", term: "Spring", totalFaculty: 42, totalOverloaded: 0, overloadRate: 0.0, status: "green" },
    { college: "Business", academicYear: "2020-21", term: "Fall", totalFaculty: 44, totalOverloaded: 0, overloadRate: 0.0, status: "green" },
    { college: "Business", academicYear: "2019-20", term: "Fall", totalFaculty: 39, totalOverloaded: 0, overloadRate: 0.0, status: "green" }
  ],
};

// Compute college aggregates from termData (single source of truth)
function computeCollegeAggregates(termData) {
  const collegeMap = {};
  termData.forEach((d) => {
    if (!collegeMap[d.college]) {
      collegeMap[d.college] = { totalFaculty: 0, totalOverloaded: 0, terms: [], rates: [] };
    }
    collegeMap[d.college].totalFaculty += d.totalFaculty;
    collegeMap[d.college].totalOverloaded += d.totalOverloaded;
    collegeMap[d.college].terms.push(d);
    collegeMap[d.college].rates.push(d.overloadRate);
  });

  const colleges = Object.entries(collegeMap).map(([college, agg]) => {
    const avgOverloadRate = (agg.totalOverloaded / agg.totalFaculty) * 100;
    const status = avgOverloadRate >= 20 ? "red" : avgOverloadRate >= 10 ? "amber" : "green";
    const greenTerms = agg.terms.filter((t) => t.status === "green").length;
    const amberTerms = agg.terms.filter((t) => t.status === "amber").length;
    const redTerms = agg.terms.filter((t) => t.status === "red").length;
    const rates = agg.rates.filter((r) => r > 0);
    const minRate = rates.length ? Math.min(...rates) : 0;
    const maxRate = rates.length ? Math.max(...rates) : 0;
    const trend = `${agg.totalOverloaded} overloaded of ${agg.totalFaculty} faculty-terms`;
    return {
      college,
      avgOverloadRate,
      status,
      trend,
      totalTerms: agg.terms.length,
      greenTerms,
      amberTerms,
      redTerms,
    };
  });
  return colleges.sort((a, b) => b.avgOverloadRate - a.avgOverloadRate);
}

// Compute institutional metrics from termData
function computeInstitutionalMetrics(termData, collegeAggregates) {
  if (termData.length === 0) {
    return { currentRate: 0, totalFaculty: 0, totalOverloaded: 0, status: "amber", concernedColleges: [] };
  }
  const totalFaculty = termData.reduce((s, d) => s + d.totalFaculty, 0);
  const totalOverloaded = termData.reduce((s, d) => s + d.totalOverloaded, 0);
  const currentRate = totalFaculty > 0 ? (totalOverloaded / totalFaculty) * 100 : 0;
  const status = currentRate >= 20 ? "red" : currentRate >= 10 ? "amber" : "green";
  const highest = collegeAggregates[0] || { college: "-", avgOverloadRate: 0 };
  const lowest = collegeAggregates[collegeAggregates.length - 1] || { college: "-", avgOverloadRate: 0 };
  const concernedColleges = collegeAggregates.filter((c) => c.status === "red").map((c) => c.college);
  const rates = termData.map((d) => d.overloadRate);
  const overallAvgRate = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;

  return {
    currentRate,
    overallAvgRate,
    totalFaculty,
    totalOverloaded,
    status,
    highestCollege: { name: highest.college, rate: highest.avgOverloadRate },
    lowestCollege: { name: lowest.college, rate: lowest.avgOverloadRate },
    concernedColleges,
  };
}

const collegeAggregates = computeCollegeAggregates(WLM_02.termData);
const institutionalMetrics = computeInstitutionalMetrics(WLM_02.termData, collegeAggregates);

Object.assign(WLM_02, {
  collegeAggregates,
  institutionalMetrics,

  benchmark: {
    industry: {
      average: 12,
      topQuartile: 5,
      median: 10
    },
    sector: "Higher Education",
    source: "AAUP Faculty Workload Standards 2024"
  },

  usage: {
    primary: "Faculty workload monitoring and burnout prevention",
    secondary: [
      "Hiring needs identification signal",
      "Course scheduling optimization trigger",
      "Compensation policy compliance check",
      "Union agreement monitoring"
    ]
  },

  dataConnections: {
    tables: [
      "FACT_FACULTY_LOAD_TERM",
      "DIM_FACULTY",
      "FACT_SECTION",
      "DIM_COURSE",
      "DIM_PROGRAM",
      "FACT_SECTION_CREDENTIAL_GAP",
      "DIM_TEACHING_LOAD_POLICY",
      "FACT_NON_TEACHING_WORKLOAD"
    ]
  },

  insights: (function () {
    const ic = institutionalMetrics;
    const highColleges = collegeAggregates.filter((c) => c.status === "red").map((c) => `${c.college} (${c.avgOverloadRate.toFixed(1)}% avg)`).join(" and ");
    return {
      trend: `Institution-wide overload rate ${ic.currentRate.toFixed(1)}% (${ic.totalOverloaded} of ${ic.totalFaculty} faculty-terms). ${ic.concernedColleges.length ? highColleges + " remain elevated above 15% target" : "All colleges within target"}`,
      concern: ic.concernedColleges.length
        ? `${highColleges} consistently exceed policy thresholds, indicating chronic understaffing or inadequate section distribution`
        : "No colleges currently exceed critical thresholds",
      recommendation: ic.concernedColleges.length
        ? "Immediate hiring plan for " + ic.concernedColleges.join(" and ") + "; implement proactive load balancing using predictive workload allocation AI; review adjunct utilization strategies"
        : "Continue monitoring; maintain current load balancing practices",
    };
  })(),

  riskFactors: (function () {
    const concerned = institutionalMetrics.concernedColleges;
    const amberColleges = collegeAggregates.filter((c) => c.status === "amber").map((c) => c.college);
    const base = [
      {
        risk: "Faculty Burnout",
        likelihood: "High",
        impact: "Critical",
        affectedColleges: concerned.length ? concerned : ["None"],
        mitigation: "Emergency hiring authorization for 2025-26",
      },
      {
        risk: "Policy Non-Compliance",
        likelihood: "High",
        impact: "Major",
        affectedColleges: [...new Set([...concerned, ...amberColleges])].length ? [...new Set([...concerned, ...amberColleges])] : ["None"],
        mitigation: "Formal workload policy review and enforcement plan",
      },
      {
        risk: "Faculty Retention Issues",
        likelihood: concerned.length ? "Medium" : "Low",
        impact: "Major",
        affectedColleges: concerned.length ? concerned : ["None"],
        mitigation: "Competitive compensation for overload work; reduce required overload",
      },
    ];
    return base;
  })(),

  calculationNotes: [
    "Overload defined as Load_Credits exceeding Max_Load per DIM_TEACHING_LOAD_POLICY",
    "Calculated per faculty member per term",
    "Includes both teaching and non-teaching workload components",
    "Excludes voluntary overload with written consent (tracked separately)",
    "Spring term typically shows lower rates due to course cancellations"
  ],

  actions: [
    {
      priority: "Critical",
      action: "Launch immediate hiring campaign for Computing and Health Sciences",
      owner: "Provost Office",
      deadline: "2025-26 Fall Term",
      expectedImpact: "Reduce overload rates by 15-20 percentage points"
    },
    {
      priority: "High",
      action: "Implement AI-driven load balancing system for proactive workload optimization",
      owner: "Academic Affairs & IT",
      deadline: "2025-26 Spring Term",
      expectedImpact: "Prevent future overload spikes through predictive allocation"
    },
    {
      priority: "High",
      action: "Conduct workload policy compliance audit across all colleges",
      owner: "Faculty Affairs",
      deadline: "End of 2024-25",
      expectedImpact: "Identify policy gaps and enforcement mechanisms"
    },
    {
      priority: "Medium",
      action: "Expand adjunct faculty pool and improve utilization strategies",
      owner: "College Deans",
      deadline: "2025-26 Fall Term",
      expectedImpact: "Provide flexible capacity buffer for demand fluctuations"
    }
  ]
});

export default WLM_02;