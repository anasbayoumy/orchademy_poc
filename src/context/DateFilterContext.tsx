'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type DateRange = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'Last Year';

interface DateFilterContextType {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
    getMultiplier: () => number;
}

const DateFilterContext = createContext<DateFilterContextType>({
    dateRange: 'Last 30 Days',
    setDateRange: () => { },
    getMultiplier: () => 1,
});

// Data multipliers for different time ranges to simulate data changes
const multipliers: Record<DateRange, { value: number; growth: number; variation: number }> = {
    'Last 7 Days': { value: 0.92, growth: -5, variation: 0.9 },
    'Last 30 Days': { value: 1, growth: 0, variation: 1 },
    'Last 90 Days': { value: 1.08, growth: 8, variation: 1.05 },
    'Last Year': { value: 1.15, growth: 15, variation: 1.1 },
};

export function DateFilterProvider({ children }: { children: ReactNode }) {
    const [dateRange, setDateRange] = useState<DateRange>('Last 30 Days');

    const getMultiplier = () => multipliers[dateRange].value;

    return (
        <DateFilterContext.Provider value={{ dateRange, setDateRange, getMultiplier }}>
            {children}
        </DateFilterContext.Provider>
    );
}

export function useDateFilter() {
    return useContext(DateFilterContext);
}

// Utility hook to get filtered data
export function useFilteredData<T extends Record<string, unknown>>(
    data: T[],
    numericFields: (keyof T)[]
): T[] {
    const { getMultiplier } = useDateFilter();
    const mult = getMultiplier();

    return data.map(item => {
        const newItem = { ...item };
        numericFields.forEach(field => {
            const value = item[field];
            if (typeof value === 'number') {
                (newItem as Record<string, unknown>)[field as string] = Math.round(value * mult);
            }
        });
        return newItem;
    });
}

// Get specific data adjustments based on date range
export function getDateAdjustments(dateRange: DateRange) {
    return multipliers[dateRange];
}
