import facultyData from './json/faculty.json';
import workloadRulesData from './json/workload-rules.json';

export interface Faculty {
    id: string;
    name: string;
    rank: string;
    department: string;
    contractType: string;
    ftePercentage: number;
    coursesTaught: number;
    teachingLoad: number;
    maxTeachingLoad: number;
    researchHours: number;
    adminHours: number;
    status: 'Balanced' | 'Overloaded' | 'Underloaded';
    [key: string]: unknown; // Index signature to satisfy Record<string, unknown> constraint
}

export interface WorkloadRule {
    rank: string;
    expectedCreditHours: number;
    overloadThreshold: number;
    releaseHours: number;
}

export interface DepartmentSummary {
    department: string;
    totalFaculty: number;
    currentFTE: number;
    requiredFTE: number;
    gap: number;
    overloaded: number;
    underloaded: number;
    balanced: number;
}

export interface AllocationSuggestion {
    id: string;
    type: 'Hire' | 'Rebalance' | 'Release' | 'Reassign';
    department: string;
    description: string;
    impact: string;
    priority: 'High' | 'Medium' | 'Low';
    savings?: number;
}

export const FACULTY_DATA: Faculty[] = facultyData as Faculty[];
export const WORKLOAD_RULES: WorkloadRule[] = workloadRulesData as WorkloadRule[];

export function getDepartmentSummary(): DepartmentSummary[] {
    const deptMap = new Map<string, Faculty[]>();

    FACULTY_DATA.forEach(faculty => {
        const existing = deptMap.get(faculty.department) || [];
        deptMap.set(faculty.department, [...existing, faculty]);
    });

    return Array.from(deptMap.entries()).map(([dept, members]) => ({
        department: dept,
        totalFaculty: members.length,
        currentFTE: members.reduce((sum, f) => sum + (f.ftePercentage / 100), 0),
        requiredFTE: Math.ceil(members.length * 0.9),
        gap: Math.round(members.reduce((sum, f) => sum + (f.ftePercentage / 100), 0) - Math.ceil(members.length * 0.9)),
        overloaded: members.filter(f => f.status === 'Overloaded').length,
        underloaded: members.filter(f => f.status === 'Underloaded').length,
        balanced: members.filter(f => f.status === 'Balanced').length,
    }));
}

export function getSmartSuggestions(): AllocationSuggestion[] {
    return [
        {
            id: 'SUG001',
            type: 'Hire',
            department: 'Computer Science',
            description: 'Hire 1 Assistant Professor to reduce overload in CS department',
            impact: 'Reduces average teaching load by 2 hours per faculty',
            priority: 'High',
            savings: -75000,
        },
        {
            id: 'SUG002',
            type: 'Rebalance',
            department: 'Business',
            description: 'Redistribute 2 courses from Dr. Wilson to Dr. Taylor',
            impact: 'Balances workload without additional hiring costs',
            priority: 'High',
            savings: 0,
        },
        {
            id: 'SUG003',
            type: 'Reassign',
            department: 'Engineering',
            description: 'Move Dr. Martinez to teach shared STEM courses',
            impact: 'Better utilization of cross-department expertise',
            priority: 'Medium',
            savings: 15000,
        },
        {
            id: 'SUG004',
            type: 'Release',
            department: 'Healthcare',
            description: 'Approve research release for Dr. Thompson',
            impact: 'Allows focus on research grants worth $200K+',
            priority: 'Medium',
            savings: 50000,
        },
        {
            id: 'SUG005',
            type: 'Hire',
            department: 'Arts',
            description: 'Convert 1 part-time to full-time position',
            impact: 'Improves stability and reduces administrative overhead',
            priority: 'Low',
            savings: -25000,
        },
    ];
}
