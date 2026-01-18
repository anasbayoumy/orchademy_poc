import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface DateRangeFilter {
  start: string;
  end: string;
}

export interface MultiSelectFilter {
  values: string[];
  options: string[];
}

export interface RangeFilter {
  min: number;
  max: number;
}

export interface FilterState {
  // Date filters
  dateRange?: DateRangeFilter;
  year?: number;
  quarter?: string;
  month?: string;
  
  // Department/Program filters
  departments?: string[];
  programs?: string[];
  categories?: string[];
  sectors?: string[];
  
  // Range filters
  enrollmentRange?: RangeFilter;
  employabilityRange?: RangeFilter;
  costRange?: RangeFilter;
  
  // Status filters
  status?: string[];
  
  // Aggregation
  aggregation?: 'sum' | 'avg' | 'max' | 'min' | 'count';
  groupBy?: string;
  
  // Visualization settings
  chartType?: 'bar' | 'line' | 'area' | 'scatter';
  timePeriod?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  
  // Custom filters
  [key: string]: any;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
  exportFilters: () => string;
  importFilters: (filterString: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>({});

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => {
      if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = useCallback(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  const getActiveFilterCount = useCallback(() => {
    return Object.keys(filters).length;
  }, [filters]);

  const exportFilters = useCallback(() => {
    return JSON.stringify(filters);
  }, [filters]);

  const importFilters = useCallback((filterString: string) => {
    try {
      const imported = JSON.parse(filterString);
      setFilters(imported);
    } catch (error) {
      console.error('Failed to import filters:', error);
    }
  }, []);

  return (
    <FilterContext.Provider 
      value={{ 
        filters, 
        setFilters, 
        updateFilter, 
        clearFilters,
        hasActiveFilters,
        getActiveFilterCount,
        exportFilters,
        importFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
};
