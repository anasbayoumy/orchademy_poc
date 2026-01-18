// src/data/mockData.ts

export interface FacultyLoadMetrics {
  department: string;
  currentFte: number;
  requiredFte: number;
  status: "Understaffed" | "Overstaffed" | "Balanced";
  gap: number;
}

export interface ProgramViabilityPoint {
  program: string;
  enrollment: number; // x-axis
  employability: number; // y-axis
  costEfficiency: number; // z-axis (bubble size)
  category: "Growth" | "Mature" | "At Risk";
}

export interface GapTrendData {
  year: number;
  CS: number;
  Business: number;
  Eng: number;
}

export interface SmartAllocationData {
  dept: string;
  suggest: string;
  confidence: number;
  reason: string;
}

export interface SkillsRadarData {
  subject: string;
  demand: number;
  curriculum: number;
  fullMark: number;
}

export interface TopEmployerData {
  name: string;
  hires: number;
  sector: string;
}

export const MOCK_DATA = {
  // MODULE A: FACULTY
  facultyLoad: {
    summary: [
      { department: "Computer Science", currentFte: 12.2, requiredFte: 16.8, gap: -4.6, status: "Understaffed" },
      { department: "Business Admin", currentFte: 16.1, requiredFte: 18.5, gap: -2.4, status: "Understaffed" },
      { department: "Electrical Eng", currentFte: 10.7, requiredFte: 11.8, gap: -1.1, status: "Balanced" },
      { department: "Liberal Arts", currentFte: 8.5, requiredFte: 8.0, gap: 0.5, status: "Balanced" },
      { department: "Health Sciences", currentFte: 14.0, requiredFte: 14.0, gap: 0.0, status: "Balanced" }
    ],
    kpi: {
      totalFte: 61.5,
      requiredFte: 69.1,
      utilization: 89.4
    }
  },

  gapTrends: [
    { year: 2023, CS: 2.1, Business: 1.0, Eng: 0.5 },
    { year: 2024, CS: 3.2, Business: 1.5, Eng: 0.8 },
    { year: 2025, CS: 4.6, Business: 2.3, Eng: 1.1 }, // The widening gap
    { year: 2026, CS: 5.8, Business: 2.8, Eng: 1.5 }
  ],

  smartAllocation: [
    { dept: "Computer Science", suggest: "+4.6 FTE", confidence: 94, reason: "High enrollment growth forecast" },
    { dept: "Business Admin", suggest: "+2.3 FTE", confidence: 87, reason: "Faculty retirement wave" },
    { dept: "Liberal Arts", suggest: "-0.5 FTE", confidence: 65, reason: "Course consolidation" }
  ],

  // MODULE B: PORTFOLIO
  viabilityMatrix: [
    { program: "BS Comp Sci", enrollment: 215, employability: 92, costEfficiency: 85, category: "Growth" },
    { program: "MBA", enrollment: 140, employability: 88, costEfficiency: 60, category: "Mature" },
    { program: "BA History", enrollment: 45, employability: 65, costEfficiency: 40, category: "At Risk" },
    { program: "BS Data Science", enrollment: 180, employability: 95, costEfficiency: 70, category: "Growth" },
    { program: "B.Arch", enrollment: 90, employability: 78, costEfficiency: 50, category: "Mature" }
  ],

  scenarios: {
    baseline: [800, 820, 850, 879, 900, 920], // Enrollment over 6 years
    optimistic: [800, 840, 890, 950, 1053, 1150],
    pessimistic: [800, 810, 800, 780, 701, 650]
  },

  programAnalytics: {
    selected: "Bachelor of Business Administration",
    metrics: {
      enrollment: { value: 122, trend: -48.1 },
      revenue: { value: 1016, unit: "AED", trend: -4.6 },
      cost: { value: 710, unit: "AED", trend: 12.3 },
      employment: { value: 76.5, trend: -11.5 }
    }
  },

  // MODULE C: IMPACT
  skillsRadar: [
    { subject: "AI/ML", demand: 95, curriculum: 73, fullMark: 100 },
    { subject: "Cloud Comp", demand: 90, curriculum: 71, fullMark: 100 },
    { subject: "Cybersec", demand: 88, curriculum: 73, fullMark: 100 },
    { subject: "Proj Mgmt", demand: 80, curriculum: 70, fullMark: 100 },
    { subject: "Data Analysis", demand: 85, curriculum: 81, fullMark: 100 },
    { subject: "Dig. Marketing", demand: 75, curriculum: 71, fullMark: 100 }
  ],

  topEmployers: [
    { name: "Dubai Tech Solutions", hires: 45, sector: "Technology" },
    { name: "Emirates Group", hires: 38, sector: "Logistics" },
    { name: "Dubai Smart Gov", hires: 32, sector: "Government" },
    { name: "Etisalat", hires: 28, sector: "Telecom" }
  ]
} as const;
