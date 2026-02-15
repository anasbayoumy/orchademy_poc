import programsData from './json/programs.json';

// API-06 At-Risk Student Rate - for KPI summary
const API_06 = require('./KPIs/API-06.js') as { programTermData: Array<{ totalActiveStudents?: number; flaggedStudents?: number; atRiskRate?: number }> };

export interface Program {
    id: string;
    name: string;
    department: string;
    degreeLevel: 'Bachelor' | 'Master' | 'Doctorate' | 'Certificate';
    enrollment: number;
    capacity: number;
    cost: number;
    revenue: number;
    profitMargin: number;
    employmentRate: number;
    viabilityScore: number;
    viabilityStatus: 'Viable' | 'Marginal' | 'At-Risk';
}

export interface ScenarioSnapshot {
    id: string;
    name: string;
    type: 'Closure' | 'Merger' | 'Expansion' | 'Restructure';
    description: string;
    affectedPrograms: string[];
    projectedSavings: number;
    projectedRevenueLoss: number;
    netImpact: number;
    riskLevel: 'Low' | 'Medium' | 'High';
}

export interface KPISummary {
    metric: string;
    value: string;
    target: string;
    status: 'On Track' | 'At Risk' | 'Behind';
    trend: 'up' | 'down' | 'stable';
    insight: string;
}

export const PROGRAMS_DATA: Program[] = programsData as Program[];

export function getViabilityMatrix() {
    return {
        viable: PROGRAMS_DATA.filter(p => p.viabilityStatus === 'Viable'),
        marginal: PROGRAMS_DATA.filter(p => p.viabilityStatus === 'Marginal'),
        atRisk: PROGRAMS_DATA.filter(p => p.viabilityStatus === 'At-Risk'),
    };
}

export function getScenarioSnapshots(): ScenarioSnapshot[] {
    return [
        {
            id: 'SCEN001',
            name: 'Close Theater Arts',
            type: 'Closure',
            description: 'Phase out Theater Arts program over 2 years',
            affectedPrograms: ['Theater Arts'],
            projectedSavings: 560000,
            projectedRevenueLoss: 350000,
            netImpact: 210000,
            riskLevel: 'Medium',
        },
        {
            id: 'SCEN002',
            name: 'Merge Art Programs',
            type: 'Merger',
            description: 'Combine Fine Arts, Music, and Theater into Creative Arts',
            affectedPrograms: ['Fine Arts', 'Music Performance', 'Theater Arts'],
            projectedSavings: 400000,
            projectedRevenueLoss: 200000,
            netImpact: 200000,
            riskLevel: 'Low',
        },
        {
            id: 'SCEN003',
            name: 'Expand Data Science',
            type: 'Expansion',
            description: 'Double capacity of Data Science program',
            affectedPrograms: ['Data Science'],
            projectedSavings: -600000,
            projectedRevenueLoss: -1200000,
            netImpact: 600000,
            riskLevel: 'Low',
        },
        {
            id: 'SCEN004',
            name: 'Restructure Engineering',
            type: 'Restructure',
            description: 'Consolidate Civil into Mechanical Engineering',
            affectedPrograms: ['Civil Engineering', 'Mechanical Engineering'],
            projectedSavings: 300000,
            projectedRevenueLoss: 150000,
            netImpact: 150000,
            riskLevel: 'High',
        },
        {
            id: 'SCEN005',
            name: 'Close Philosophy',
            type: 'Closure',
            description: 'Phase out Philosophy BA program',
            affectedPrograms: ['Philosophy'],
            projectedSavings: 480000,
            projectedRevenueLoss: 400000,
            netImpact: 80000,
            riskLevel: 'High',
        },
        {
            id: 'SCEN006',
            name: 'Expand AI Program',
            type: 'Expansion',
            description: 'Increase AI & ML PhD capacity by 50%',
            affectedPrograms: ['AI & Machine Learning'],
            projectedSavings: -200000,
            projectedRevenueLoss: -350000,
            netImpact: 150000,
            riskLevel: 'Low',
        },
    ];
}

export function getKPISummary(): KPISummary[] {
    const pt = API_06?.programTermData || [];
    const totalActive = pt.reduce((s, d) => s + (d.totalActiveStudents || 0), 0);
    const totalFlagged = pt.reduce((s, d) => s + (d.flaggedStudents || 0), 0);
    const atRiskRate = totalActive > 0 ? Math.round((totalFlagged / totalActive) * 1000) / 10 : 0;
    const atRiskStatus: 'On Track' | 'At Risk' | 'Behind' = atRiskRate < 8 ? 'On Track' : atRiskRate >= 25 ? 'Behind' : 'At Risk';

    return [
        {
            metric: 'At-Risk Student Rate',
            value: `${atRiskRate}%`,
            target: '<25% / <15% / <8%',
            status: atRiskStatus,
            trend: atRiskRate >= 25 ? 'down' : 'stable',
            insight: `${totalFlagged.toLocaleString()} of ${totalActive.toLocaleString()} active students flagged (Critical/High/Moderate). Target: keep below 25%.`,
        },
        {
            metric: 'Overall Enrollment',
            value: '4,563',
            target: '5,000',
            status: 'At Risk',
            trend: 'up',
            insight: 'Enrollment up 5% but still 9% below target',
        },
        {
            metric: 'Portfolio Revenue',
            value: '$136.0M',
            target: '$140.0M',
            status: 'On Track',
            trend: 'up',
            insight: 'Revenue growing steadily at 8% YoY',
        },
        {
            metric: 'Avg Profit Margin',
            value: '28.5%',
            target: '30.0%',
            status: 'At Risk',
            trend: 'stable',
            insight: 'Margins pressured by rising faculty costs',
        },
        {
            metric: 'Viable Programs',
            value: '65%',
            target: '75%',
            status: 'At Risk',
            trend: 'up',
            insight: '5 programs moved from At-Risk to Marginal',
        },
        {
            metric: 'Employment Rate',
            value: '84%',
            target: '85%',
            status: 'On Track',
            trend: 'up',
            insight: 'Strong placement in STEM programs',
        },
        {
            metric: 'Student Satisfaction',
            value: '4.2/5',
            target: '4.5/5',
            status: 'Behind',
            trend: 'down',
            insight: 'Facility complaints driving down scores',
        },
    ];
}
