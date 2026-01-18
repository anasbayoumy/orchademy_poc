import { useMemo } from 'react';

export interface MockDataPoint {
  [key: string]: string | number;
}

export interface MockData {
  [key: string]: MockDataPoint[];
}

const generateFacultyLoadData = (): MockDataPoint[] => {
  const departments = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Sciences', 'Medicine'];
  return departments.map((dept) => ({
    department: dept,
    load: Math.floor(Math.random() * 50) + 20,
    capacity: Math.floor(Math.random() * 30) + 50,
  }));
};

const generateTimeSeriesData = (months: number = 12, baseValue: number = 50): MockDataPoint[] => {
  return Array.from({ length: months }, (_, i) => ({
    month: `Month ${i + 1}`,
    value: baseValue + Math.random() * 20 - 10,
    load: baseValue + Math.random() * 20 - 10,
    gaps: Math.floor(Math.random() * 10) + 5,
  }));
};

const generateGapData = (): MockDataPoint[] => {
  const departments = ['CS', 'Eng', 'Bus', 'Arts', 'Sci', 'Med'];
  return departments.map((dept) => ({
    department: dept,
    count: Math.floor(Math.random() * 15) + 5,
  }));
};

const generateViabilityScatterData = (): MockDataPoint[] => {
  return Array.from({ length: 30 }, () => ({
    enrollment: Math.floor(Math.random() * 500) + 50,
    employability: Math.floor(Math.random() * 40) + 60,
    cost: Math.floor(Math.random() * 50000) + 20000,
    program: `Program ${Math.floor(Math.random() * 30) + 1}`,
  }));
};

const generateRadarData = (): MockDataPoint[] => {
  const skills = ['Technical', 'Communication', 'Problem Solving', 'Leadership', 'Analytical', 'Creative'];
  return skills.map((skill) => ({
    skill,
    value: Math.floor(Math.random() * 30) + 70,
    target: 90,
  }));
};

const generateProgramData = (count: number = 10): MockDataPoint[] => {
  return Array.from({ length: count }, (_, i) => ({
    program: `Program ${i + 1}`,
    value: Math.floor(Math.random() * 50) + 50,
    rate: Math.floor(Math.random() * 30) + 70,
    coverage: Math.floor(Math.random() * 30) + 70,
    score: Math.floor(Math.random() * 30) + 70,
  }));
};

const generateSchoolData = (): MockDataPoint[] => {
  const schools = ['School of Tech', 'School of Business', 'School of Arts', 'School of Sciences'];
  return schools.map((school) => ({
    school,
    score: Math.floor(Math.random() * 30) + 70,
  }));
};

const generateYearlyData = (years: number = 5): MockDataPoint[] => {
  return Array.from({ length: years }, (_, i) => ({
    year: 2020 + i,
    enrollment: Math.floor(Math.random() * 200) + 300,
    rate: Math.floor(Math.random() * 20) + 80,
    impact: Math.floor(Math.random() * 2) + 8,
  }));
};

const generateQuarterlyData = (): MockDataPoint[] => {
  return ['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => ({
    quarter,
    hires: Math.floor(Math.random() * 15) + 10,
    performance: Math.floor(Math.random() * 20) + 75,
  }));
};

const generateRegionData = (): MockDataPoint[] => {
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  return regions.map((region) => ({
    region,
    score: Math.floor(Math.random() * 20) + 80,
  }));
};

const generateScenarioData = (): MockDataPoint[] => {
  return ['Scenario A', 'Scenario B', 'Scenario C', 'Scenario D'].map((scenario) => ({
    scenario,
    value: Math.floor(Math.random() * 30) + 70,
  }));
};

export const useMockData = (widgetId: string): MockDataPoint[] => {
  return useMemo(() => {
    // Faculty Load widgets
    if (widgetId.includes('faculty-load') || widgetId.includes('load-by-department')) {
      return generateFacultyLoadData();
    }
    
    if (widgetId.includes('load-trend') || widgetId.includes('trend')) {
      return generateTimeSeriesData(12, 60);
    }
    
    if (widgetId.includes('gap-trend')) {
      return generateTimeSeriesData(12, 15);
    }
    
    if (widgetId.includes('gap-by-department') || widgetId.includes('department')) {
      return generateGapData();
    }
    
    // Viability Matrix
    if (widgetId.includes('viability-scatter') || widgetId.includes('scatter')) {
      return generateViabilityScatterData();
    }
    
    if (widgetId.includes('viability-by-school') || widgetId.includes('school')) {
      return generateSchoolData();
    }
    
    // Skills Alignment
    if (widgetId.includes('skills-radar') || widgetId.includes('radar')) {
      return generateRadarData();
    }
    
    if (widgetId.includes('skills-by-program') || widgetId.includes('program') && !widgetId.includes('viability')) {
      return generateProgramData(8);
    }
    
    // Employment
    if (widgetId.includes('employment-trend') || widgetId.includes('employment-by-program')) {
      return generateYearlyData();
    }
    
    // Impact
    if (widgetId.includes('impact-trend')) {
      return generateYearlyData();
    }
    
    if (widgetId.includes('impact-by-region') || widgetId.includes('region')) {
      return generateRegionData();
    }
    
    // Scenarios
    if (widgetId.includes('scenario')) {
      return generateScenarioData();
    }
    
    // Program Analytics
    if (widgetId.includes('enrollment-trend')) {
      return generateYearlyData();
    }
    
    if (widgetId.includes('completion-rate') || widgetId.includes('program-performance')) {
      return generateProgramData(6);
    }
    
    if (widgetId.includes('kpi-trend')) {
      return generateTimeSeriesData(12, 80);
    }
    
    // Planning
    if (widgetId.includes('planning-timeline') || widgetId.includes('timeline')) {
      return generateQuarterlyData();
    }
    
    // Allocation
    if (widgetId.includes('allocation')) {
      return generateProgramData(6);
    }
    
    // Default fallback
    return generateTimeSeriesData(10, 50);
  }, [widgetId]);
};
