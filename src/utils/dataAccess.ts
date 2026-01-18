import { MOCK_DATA } from '../data/mockData';
import type { FilterState } from '../contexts/FilterContext';

/**
 * Get data from MOCK_DATA using a dot-notation path
 * e.g., 'facultyLoad.summary' -> MOCK_DATA.facultyLoad.summary
 */
export const getDataByPath = (path: string): any => {
  const keys = path.split('.');
  let data: any = MOCK_DATA;
  
  for (const key of keys) {
    if (data && typeof data === 'object' && key in data) {
      data = (data as any)[key];
    } else {
      return null;
    }
  }
  
  return data;
};

/**
 * Apply filters to data array
 */
export const applyFilters = (data: any[], filters: FilterState): any[] => {
  if (!Array.isArray(data) || !filters || Object.keys(filters).length === 0) {
    return data;
  }

  let filtered = [...data];

  // Department filter
  if (filters.departments && filters.departments.length > 0) {
    filtered = filtered.filter((item) => 
      filters.departments!.some((dept) => 
        item.department?.toLowerCase().includes(dept.toLowerCase()) ||
        item.dept?.toLowerCase().includes(dept.toLowerCase())
      )
    );
  }

  // Program filter
  if (filters.programs && filters.programs.length > 0) {
    filtered = filtered.filter((item) => 
      filters.programs!.includes(item.program)
    );
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((item) => 
      filters.categories!.includes(item.category) ||
      filters.categories!.includes(item.status)
    );
  }

  // Sector filter
  if (filters.sectors && filters.sectors.length > 0) {
    filtered = filtered.filter((item) => 
      filters.sectors!.includes(item.sector)
    );
  }

  // Year filter
  if (filters.year) {
    filtered = filtered.filter((item) => item.year === filters.year);
  }

  // Date range filter
  if (filters.dateRange) {
    const start = new Date(filters.dateRange.start);
    const end = new Date(filters.dateRange.end);
    filtered = filtered.filter((item) => {
      if (item.date) {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      }
      return true;
    });
  }

  // Enrollment range filter
  if (filters.enrollmentRange) {
    filtered = filtered.filter((item) => {
      if (item.enrollment !== undefined) {
        const enrollment = item.enrollment;
        const min = filters.enrollmentRange!.min ?? -Infinity;
        const max = filters.enrollmentRange!.max ?? Infinity;
        return enrollment >= min && enrollment <= max;
      }
      return true;
    });
  }

  // Employability range filter
  if (filters.employabilityRange) {
    filtered = filtered.filter((item) => {
      if (item.employability !== undefined) {
        const employability = item.employability;
        const min = filters.employabilityRange!.min ?? 0;
        const max = filters.employabilityRange!.max ?? 100;
        return employability >= min && employability <= max;
      }
      return true;
    });
  }

  // Status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((item) => 
      filters.status!.includes(item.status)
    );
  }

  return filtered;
};

/**
 * Aggregate data based on aggregation type
 */
export const aggregateData = (data: any[], aggregation: string, dataKey: string): any[] => {
  if (!aggregation || !dataKey || !Array.isArray(data) || data.length === 0) {
    return data;
  }

  const values = data.map((item) => item[dataKey]).filter((v) => typeof v === 'number');

  if (values.length === 0) return data;

  let result: number;
  switch (aggregation) {
    case 'sum':
      result = values.reduce((a, b) => a + b, 0);
      break;
    case 'avg':
      result = values.reduce((a, b) => a + b, 0) / values.length;
      break;
    case 'max':
      result = Math.max(...values);
      break;
    case 'min':
      result = Math.min(...values);
      break;
    case 'count':
      result = values.length;
      break;
    default:
      return data;
  }

  return [{ [dataKey]: result, label: `${aggregation.toUpperCase()}: ${result.toFixed(2)}` }];
};

/**
 * Get nested value from an object using dot-notation path
 */
export const getNestedValue = (obj: any, path: string): any => {
  const keys = path.split('.');
  let value: any = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return null;
    }
  }
  
  return value;
};
