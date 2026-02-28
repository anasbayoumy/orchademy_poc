'use client';

import { useState } from 'react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { 
    TrendingUp, 
    TrendingDown, 
    Sparkles, 
    CheckCircle2, 
    ArrowRight,
    DollarSign,
    Users,
    BookOpen,
    Zap,
    Target,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

// Financial Data from P&L pages
const PL_NATURAL_DATA = {
    revenue: {
        tuition: [53210997, 42062036, 49823674, 49006215, 47449161],
        fees: [3837373, 2605082, 4903966, 3115160, 4497736],
        grants: [3960077, 3362637, 3970317, 3763630, 4978918],
        other: [2133343, 1959062, 2080707, 1270559, 1332414],
    },
    expenses: {
        facultySalaries: [19188093, 15281422, 20523106, 18552397, 17473400],
        staffSalaries: [10358510, 8106800, 11693547, 10034367, 9634582],
        benefits: [7204703, 6263865, 8377810, 8072623, 7497485],
        scholarships: [5459023, 3585401, 3376458, 4913112, 4107891],
        academicSupplies: [2626001, 1534535, 2096815, 1750752, 2210102],
        facilities: [6435412, 3278158, 6323955, 4765376, 4949040],
        itSystems: [3523890, 2986062, 3171978, 3439346, 3516911],
        marketing: [2182936, 1267948, 1728823, 1856895, 1572494],
        professionalServices: [3244700, 2161497, 1769117, 1995303, 2645969],
        depreciation: [1211175, 1120207, 1473906, 1516862, 1698613],
    }
};

const PL_FUNCTIONAL_DATA = {
    tuitionRevenue: [53210997, 42062036, 49823674, 49006215, 47449161],
    feesRevenue: [3837373, 2605082, 4903966, 3115160, 4497736],
    grantsRevenue: [3960077, 3362637, 3970317, 3763630, 4978918],
    otherRevenue: [2133343, 1959062, 2080707, 1270559, 1332414],
    totalRevenue: [63141790, 49988817, 60778664, 57155564, 58258229],
    instructionCost: [20959493, 16934372, 20941728, 20828313, 17538533],
    scholarships: [5459023, 3585401, 3376458, 4913112, 4107891],
    research: [1968009, 1275117, 2625633, 1717236, 2941950],
    operationsMaintenance: [8692048, 5892050, 8467069, 6873943, 7221634],
    studentServices: [5896576, 4185001, 6050164, 5325047, 5689170],
    academicSupport: [8266921, 6215334, 8393543, 7878063, 7764747],
    institutionalSupport: [8704172, 6349979, 9121935, 7960093, 8509646],
    auxiliary: [1488201, 1148641, 1558985, 1401226, 1532916],
    totalExpenses: [61434443, 45585895, 60535515, 56897033, 55306487],
    netSurplus: [1707347, 4402922, 243149, 258531, 2951742],
};

// Current year index (2023-24 is index 4)
const CURRENT_YEAR_INDEX = 4;

// Calculate totals for Natural classification
const totalNaturalRevenue = PL_NATURAL_DATA.revenue.tuition[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.revenue.fees[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.revenue.grants[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.revenue.other[CURRENT_YEAR_INDEX];

const totalNaturalExpenses = PL_NATURAL_DATA.expenses.facultySalaries[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.expenses.staffSalaries[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.expenses.benefits[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.expenses.scholarships[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.expenses.academicSupplies[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.expenses.facilities[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.expenses.itSystems[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.expenses.marketing[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.expenses.professionalServices[CURRENT_YEAR_INDEX] + 
    PL_NATURAL_DATA.expenses.depreciation[CURRENT_YEAR_INDEX];

const naturalNetSurplus = totalNaturalRevenue - totalNaturalExpenses;

// Format currency
const formatCurrency = (value: number, decimals = 1) => {
    if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(decimals)}M`;
    if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
};

// Format expected impact from actual surplus delta (ensures consistency)
const formatExpectedImpact = (delta: number) => {
    const absVal = Math.abs(delta);
    if (absVal >= 1000000) return `+$${(absVal / 1000000).toFixed(1)}M`;
    if (absVal >= 1000) return `+$${(absVal / 1000).toFixed(0)}K`;
    return `+$${absVal.toFixed(0)}`;
};

// Helper: expense metrics where decrease = good (green), increase = bad (red)
const isExpenseMetric = (key: string) => {
    const k = key.toLowerCase();
    return k.includes('expense') || k.includes('cost') || k.includes('scholarships') || k.includes('admin') ||
        k.includes('operation') || k.includes('services') || k.includes('instruction') || k.includes('auxiliary') ||
        k.includes('support') || k.includes('maintenance');
};

// Compute surplus delta for consistency (expectedImpact = surplusDelta)
const tuitionSurplusDelta = PL_NATURAL_DATA.revenue.tuition[CURRENT_YEAR_INDEX] * 0.056;
const NATURAL_SCENARIOS = [
    {
        id: 1,
        name: 'Tuition Optimization',
        description: 'Increase undergraduate tuition by 3.5% with 2% enrollment growth',
        icon: BookOpen,
        surplusDelta: tuitionSurplusDelta,
        expectedImpact: formatExpectedImpact(tuitionSurplusDelta),
        impactType: 'positive' as const,
        confidence: 92,
        category: 'Revenue',
        affectedMetrics: {
            tuitionRevenue: { 
                before: PL_NATURAL_DATA.revenue.tuition[CURRENT_YEAR_INDEX], 
                after: PL_NATURAL_DATA.revenue.tuition[CURRENT_YEAR_INDEX] * 1.056, 
                change: 5.6 
            },
            netSurplus: { 
                before: naturalNetSurplus, 
                after: naturalNetSurplus + tuitionSurplusDelta, 
                change: (tuitionSurplusDelta / naturalNetSurplus) * 100 
            }
        },
        yearlyProjection: ['2019-20','2020-21','2021-22','2022-23','2023-24','2024-25','2025-26','2026-27'].map((year, i) => {
            const base = PL_NATURAL_DATA.revenue.tuition[Math.min(i, 4)];
            const proj = i <= 4 ? base : PL_NATURAL_DATA.revenue.tuition[4] * (i === 5 ? 1.056 : i === 6 ? 1.115 : 1.177);
            return { year, baseline: base, projected: i <= 4 ? base : proj };
        }),
        breakdown: [
            { label: 'Tuition Growth', value: Math.round(tuitionSurplusDelta * 0.54) },
            { label: 'Enrollment Impact', value: Math.round(tuitionSurplusDelta * 0.30) },
            { label: 'Retention Benefit', value: Math.round(tuitionSurplusDelta * 0.16) }
        ]
    },
    {
        id: 2,
        name: 'Operational Efficiency',
        description: 'Reduce administrative overhead by 8% through process automation',
        icon: Zap,
        surplusDelta: (PL_NATURAL_DATA.expenses.staffSalaries[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.professionalServices[CURRENT_YEAR_INDEX]) * 0.08,
        expectedImpact: formatExpectedImpact((PL_NATURAL_DATA.expenses.staffSalaries[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.professionalServices[CURRENT_YEAR_INDEX]) * 0.08),
        impactType: 'positive' as const,
        confidence: 88,
        category: 'Expense',
        affectedMetrics: {
            adminExpenses: { 
                before: PL_NATURAL_DATA.expenses.staffSalaries[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.professionalServices[CURRENT_YEAR_INDEX], 
                after: (PL_NATURAL_DATA.expenses.staffSalaries[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.professionalServices[CURRENT_YEAR_INDEX]) * 0.92, 
                change: -8.0 
            },
            netSurplus: { 
                before: naturalNetSurplus, 
                after: naturalNetSurplus + ((PL_NATURAL_DATA.expenses.staffSalaries[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.professionalServices[CURRENT_YEAR_INDEX]) * 0.08), 
                change: (((PL_NATURAL_DATA.expenses.staffSalaries[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.professionalServices[CURRENT_YEAR_INDEX]) * 0.08) / naturalNetSurplus) * 100 
            }
        },
        yearlyProjection: ['2019-20','2020-21','2021-22','2022-23','2023-24','2024-25','2025-26','2026-27'].map((year, i) => {
            const base = PL_NATURAL_DATA.expenses.staffSalaries[Math.min(i, 4)] + PL_NATURAL_DATA.expenses.professionalServices[Math.min(i, 4)];
            const proj = i <= 4 ? base : (PL_NATURAL_DATA.expenses.staffSalaries[4] + PL_NATURAL_DATA.expenses.professionalServices[4]) * (i === 5 ? 0.92 : i === 6 ? 0.90 : 0.88);
            return { year, baseline: base, projected: i <= 4 ? base : proj };
        }),
        breakdown: [
            { label: 'Process Automation', value: 950000 },
            { label: 'Staff Optimization', value: 650000 },
            { label: 'Technology Savings', value: 300000 }
        ]
    },
    {
        id: 3,
        name: 'Revenue Diversification',
        description: 'Expand non-tuition revenue streams (fees, grants, other)',
        icon: Target,
        surplusDelta: (PL_NATURAL_DATA.revenue.fees[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.grants[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.other[CURRENT_YEAR_INDEX]) * 0.12,
        expectedImpact: formatExpectedImpact((PL_NATURAL_DATA.revenue.fees[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.grants[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.other[CURRENT_YEAR_INDEX]) * 0.12),
        impactType: 'positive' as const,
        confidence: 85,
        category: 'Revenue',
        affectedMetrics: {
            otherRevenue: { 
                before: PL_NATURAL_DATA.revenue.fees[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.grants[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.other[CURRENT_YEAR_INDEX], 
                after: (PL_NATURAL_DATA.revenue.fees[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.grants[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.other[CURRENT_YEAR_INDEX]) * 1.12, 
                change: 12.0 
            },
            netSurplus: { 
                before: naturalNetSurplus, 
                after: naturalNetSurplus + (PL_NATURAL_DATA.revenue.fees[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.grants[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.other[CURRENT_YEAR_INDEX]) * 0.12, 
                change: (((PL_NATURAL_DATA.revenue.fees[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.grants[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.revenue.other[CURRENT_YEAR_INDEX]) * 0.12) / naturalNetSurplus) * 100 
            }
        },
        yearlyProjection: ['2019-20','2020-21','2021-22','2022-23','2023-24','2024-25','2025-26','2026-27'].map((year, i) => {
            const fees = PL_NATURAL_DATA.revenue.fees[Math.min(i, 4)], grants = PL_NATURAL_DATA.revenue.grants[Math.min(i, 4)], other = PL_NATURAL_DATA.revenue.other[Math.min(i, 4)];
            const base = fees + grants + other;
            const proj = i <= 4 ? base : base * (i === 5 ? 1.12 : i === 6 ? 1.16 : 1.20);
            return { year, baseline: base, projected: i <= 4 ? base : proj };
        }),
        breakdown: [
            { label: 'Fees & Auxiliary', value: 500000 },
            { label: 'Grants Growth', value: 450000 },
            { label: 'Other Revenue', value: 250000 }
        ]
    },
    {
        id: 4,
        name: 'Cost Rationalization',
        description: 'Strategic procurement and vendor consolidation',
        icon: PieChart,
        surplusDelta: (PL_NATURAL_DATA.expenses.academicSupplies[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.facilities[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.marketing[CURRENT_YEAR_INDEX]) * 0.09,
        expectedImpact: formatExpectedImpact((PL_NATURAL_DATA.expenses.academicSupplies[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.facilities[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.marketing[CURRENT_YEAR_INDEX]) * 0.09),
        impactType: 'positive' as const,
        confidence: 86,
        category: 'Expense',
        affectedMetrics: {
            operatingCosts: { 
                before: PL_NATURAL_DATA.expenses.academicSupplies[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.facilities[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.marketing[CURRENT_YEAR_INDEX], 
                after: (PL_NATURAL_DATA.expenses.academicSupplies[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.facilities[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.marketing[CURRENT_YEAR_INDEX]) * 0.91, 
                change: -9.0 
            },
            netSurplus: { 
                before: naturalNetSurplus, 
                after: naturalNetSurplus + (PL_NATURAL_DATA.expenses.academicSupplies[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.facilities[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.marketing[CURRENT_YEAR_INDEX]) * 0.09, 
                change: (((PL_NATURAL_DATA.expenses.academicSupplies[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.facilities[CURRENT_YEAR_INDEX] + PL_NATURAL_DATA.expenses.marketing[CURRENT_YEAR_INDEX]) * 0.09) / naturalNetSurplus) * 100 
            }
        },
        yearlyProjection: ['2019-20','2020-21','2021-22','2022-23','2023-24','2024-25','2025-26','2026-27'].map((year, i) => {
            const base = PL_NATURAL_DATA.expenses.academicSupplies[Math.min(i, 4)] + PL_NATURAL_DATA.expenses.facilities[Math.min(i, 4)] + PL_NATURAL_DATA.expenses.marketing[Math.min(i, 4)];
            const proj = i <= 4 ? base : base * (i === 5 ? 0.91 : i === 6 ? 0.89 : 0.87);
            return { year, baseline: base, projected: i <= 4 ? base : proj };
        }),
        breakdown: [
            { label: 'Procurement Savings', value: 1100000 },
            { label: 'Vendor Consolidation', value: 700000 },
            { label: 'Volume Discounts', value: 300000 }
        ]
    }
];

// Functional surplus deltas (computed for consistency)
const campusSustainabilityDelta = (PL_FUNCTIONAL_DATA.operationsMaintenance[CURRENT_YEAR_INDEX] * 0.172) + (PL_FUNCTIONAL_DATA.auxiliary[CURRENT_YEAR_INDEX] * 0.094);
const programRationalizationDelta = (PL_FUNCTIONAL_DATA.tuitionRevenue[CURRENT_YEAR_INDEX] * 0.052) + (PL_FUNCTIONAL_DATA.instructionCost[CURRENT_YEAR_INDEX] * 0.053);
const instructionalEfficiencyDelta = PL_FUNCTIONAL_DATA.instructionCost[CURRENT_YEAR_INDEX] * 0.08;
const supportStreamliningDelta = (PL_FUNCTIONAL_DATA.institutionalSupport[CURRENT_YEAR_INDEX] * 0.06) + (PL_FUNCTIONAL_DATA.academicSupport[CURRENT_YEAR_INDEX] * 0.04);

// AI Scenarios for Functional Classification (aligned with financials page)
const FUNCTIONAL_SCENARIOS = [
    {
        id: 5,
        name: 'Campus Sustainability',
        description: 'Implement energy-efficient systems and reduce carbon footprint',
        icon: Zap,
        surplusDelta: campusSustainabilityDelta,
        expectedImpact: formatExpectedImpact(campusSustainabilityDelta),
        impactType: 'positive' as const,
        confidence: 91,
        category: 'Expense',
        affectedMetrics: {
            operationsMaintenance: { 
                before: PL_FUNCTIONAL_DATA.operationsMaintenance[CURRENT_YEAR_INDEX], 
                after: PL_FUNCTIONAL_DATA.operationsMaintenance[CURRENT_YEAR_INDEX] * 0.828, 
                change: -17.2 
            },
            auxiliary: { 
                before: PL_FUNCTIONAL_DATA.auxiliary[CURRENT_YEAR_INDEX], 
                after: PL_FUNCTIONAL_DATA.auxiliary[CURRENT_YEAR_INDEX] * 0.906, 
                change: -9.4 
            },
            netSurplus: { 
                before: PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX], 
                after: PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX] + campusSustainabilityDelta, 
                change: (campusSustainabilityDelta / PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX]) * 100 
            }
        },
        yearlyProjection: ['2019-20','2020-21','2021-22','2022-23','2023-24','2024-25','2025-26','2026-27'].map((year, i) => {
            const base = PL_FUNCTIONAL_DATA.operationsMaintenance[Math.min(i, 4)] + PL_FUNCTIONAL_DATA.auxiliary[Math.min(i, 4)];
            const proj = i <= 4 ? base : (PL_FUNCTIONAL_DATA.operationsMaintenance[4] + PL_FUNCTIONAL_DATA.auxiliary[4]) * (i === 5 ? 0.85 : i === 6 ? 0.82 : 0.79);
            return { year, baseline: base, projected: i <= 4 ? base : proj };
        }),
        breakdown: [
            { label: 'Energy Efficiency', value: 900000 },
            { label: 'Water Conservation', value: 300000 },
            { label: 'Waste Reduction', value: 300000 }
        ]
    },
    {
        id: 6,
        name: 'Program Rationalization',
        description: 'Consolidate underperforming programs and invest in high-demand areas',
        icon: Target,
        surplusDelta: programRationalizationDelta,
        expectedImpact: formatExpectedImpact(programRationalizationDelta),
        impactType: 'positive' as const,
        confidence: 84,
        category: 'Mixed',
        affectedMetrics: {
            instructionCost: { 
                before: PL_FUNCTIONAL_DATA.instructionCost[CURRENT_YEAR_INDEX], 
                after: PL_FUNCTIONAL_DATA.instructionCost[CURRENT_YEAR_INDEX] * 0.947, 
                change: -5.3 
            },
            tuitionRevenue: { 
                before: PL_FUNCTIONAL_DATA.tuitionRevenue[CURRENT_YEAR_INDEX], 
                after: PL_FUNCTIONAL_DATA.tuitionRevenue[CURRENT_YEAR_INDEX] * 1.052, 
                change: 5.2 
            },
            netSurplus: { 
                before: PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX], 
                after: PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX] + programRationalizationDelta, 
                change: (programRationalizationDelta / PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX]) * 100 
            }
        },
        yearlyProjection: ['2019-20','2020-21','2021-22','2022-23','2023-24','2024-25','2025-26','2026-27'].map((year, i) => {
            const base = PL_FUNCTIONAL_DATA.instructionCost[Math.min(i, 4)];
            const proj = i <= 4 ? base : PL_FUNCTIONAL_DATA.instructionCost[4] * (i === 5 ? 0.947 : i === 6 ? 0.93 : 0.92);
            return { year, baseline: base, projected: i <= 4 ? base : proj };
        }),
        breakdown: [
            { label: 'Cost Reduction', value: 1500000 },
            { label: 'Revenue Growth', value: 1700000 },
            { label: 'Quality Impact', value: 0 }
        ]
    },
    {
        id: 7,
        name: 'Instructional Efficiency',
        description: 'Optimize student-faculty ratios and section sizing',
        icon: BookOpen,
        surplusDelta: instructionalEfficiencyDelta,
        expectedImpact: formatExpectedImpact(instructionalEfficiencyDelta),
        impactType: 'positive' as const,
        confidence: 82,
        category: 'Expense',
        affectedMetrics: {
            instructionCost: { 
                before: PL_FUNCTIONAL_DATA.instructionCost[CURRENT_YEAR_INDEX], 
                after: PL_FUNCTIONAL_DATA.instructionCost[CURRENT_YEAR_INDEX] * 0.92, 
                change: -8.0 
            },
            netSurplus: { 
                before: PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX], 
                after: PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX] + instructionalEfficiencyDelta, 
                change: (instructionalEfficiencyDelta / PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX]) * 100 
            }
        },
        yearlyProjection: ['2019-20','2020-21','2021-22','2022-23','2023-24','2024-25','2025-26','2026-27'].map((year, i) => {
            const base = PL_FUNCTIONAL_DATA.instructionCost[Math.min(i, 4)];
            const proj = i <= 4 ? base : PL_FUNCTIONAL_DATA.instructionCost[4] * (i === 5 ? 0.92 : i === 6 ? 0.89 : 0.86);
            return { year, baseline: base, projected: i <= 4 ? base : proj };
        }),
        breakdown: [
            { label: 'Section Sizing', value: 900000 },
            { label: 'Ratio Optimization', value: 700000 },
            { label: 'Delivery Mix', value: 200000 }
        ]
    },
    {
        id: 8,
        name: 'Support Streamlining',
        description: 'Consolidate administrative support functions',
        icon: Users,
        surplusDelta: supportStreamliningDelta,
        expectedImpact: formatExpectedImpact(supportStreamliningDelta),
        impactType: 'positive' as const,
        confidence: 79,
        category: 'Expense',
        affectedMetrics: {
            institutionalSupport: { 
                before: PL_FUNCTIONAL_DATA.institutionalSupport[CURRENT_YEAR_INDEX], 
                after: PL_FUNCTIONAL_DATA.institutionalSupport[CURRENT_YEAR_INDEX] * 0.94, 
                change: -6.0 
            },
            academicSupport: { 
                before: PL_FUNCTIONAL_DATA.academicSupport[CURRENT_YEAR_INDEX], 
                after: PL_FUNCTIONAL_DATA.academicSupport[CURRENT_YEAR_INDEX] * 0.96, 
                change: -4.0 
            },
            netSurplus: { 
                before: PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX], 
                after: PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX] + supportStreamliningDelta, 
                change: (supportStreamliningDelta / PL_FUNCTIONAL_DATA.netSurplus[CURRENT_YEAR_INDEX]) * 100 
            }
        },
        yearlyProjection: ['2019-20','2020-21','2021-22','2022-23','2023-24','2024-25','2025-26','2026-27'].map((year, i) => {
            const base = PL_FUNCTIONAL_DATA.institutionalSupport[Math.min(i, 4)] + PL_FUNCTIONAL_DATA.academicSupport[Math.min(i, 4)];
            const proj = i <= 4 ? base : (PL_FUNCTIONAL_DATA.institutionalSupport[4] + PL_FUNCTIONAL_DATA.academicSupport[4]) * (i === 5 ? 0.95 : i === 6 ? 0.93 : 0.91);
            return { year, baseline: base, projected: i <= 4 ? base : proj };
        }),
        breakdown: [
            { label: 'Admin Consolidation', value: 500000 },
            { label: 'Shared Services', value: 250000 },
            { label: 'Process Standardization', value: 150000 }
        ]
    }
];

export default function SimulationsPage() {
    const colors = useColors();
    const { isRTL } = useLanguage();
    const [activeTab, setActiveTab] = useState<'natural' | 'functional'>('natural');
    const [appliedScenario, setAppliedScenario] = useState<any>(null);

    const currentScenarios = activeTab === 'natural' ? NATURAL_SCENARIOS : FUNCTIONAL_SCENARIOS;

    const handleApplyScenario = (scenario: any) => {
        setAppliedScenario(scenario);
    };

    const resetSimulation = () => {
        setAppliedScenario(null);
    };

    return (
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto min-w-0 overflow-x-hidden" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles size={28} style={{ color: colors.secondary3 }} />
                    <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                        AI Financial Simulations
                    </h1>
                </div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Explore AI-powered scenarios to optimize your financial performance
                </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                    <button
                    onClick={() => {
                        setActiveTab('natural');
                        setAppliedScenario(null);
                    }}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                    style={{
                        backgroundColor: activeTab === 'natural' ? colors.primary1 : colors.cardBg,
                        color: activeTab === 'natural' ? '#ffffff' : colors.textPrimary,
                        border: `1px solid ${activeTab === 'natural' ? colors.primary1 : colors.border}`
                    }}
                >
                    Natural Classification
                </button>
                    <button
                    onClick={() => {
                        setActiveTab('functional');
                        setAppliedScenario(null);
                    }}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base"
                    style={{
                        backgroundColor: activeTab === 'functional' ? colors.secondary1 : colors.cardBg,
                        color: activeTab === 'functional' ? '#ffffff' : colors.textPrimary,
                        border: `1px solid ${activeTab === 'functional' ? colors.secondary1 : colors.border}`
                    }}
                >
                    Functional Classification
                </button>
            </div>

            {/* Scenarios Table */}
            {!appliedScenario && (
                <div className="p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 min-w-0 overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                        AI-Recommended Scenarios
                    </h2>
                    <div className="space-y-3">
                        {currentScenarios.map((scenario) => {
                            const Icon = scenario.icon;
                            const isPositive = scenario.impactType === 'positive';
                            
                            return (
                                <div 
                                    key={scenario.id}
                                    className="p-5 rounded-lg border-l-4 transition-all hover:shadow-lg"
                                    style={{ 
                                        backgroundColor: colors.isDark ? '#1e293b' : '#f8fafc',
                                        borderLeftColor: activeTab === 'natural' ? colors.primary1 : colors.secondary1
                                    }}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                                            <div 
                                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                                style={{ 
                                                    backgroundColor: (activeTab === 'natural' ? colors.primary1 : colors.secondary1) + '20' 
                                                }}
                                            >
                                                <Icon size={24} style={{ color: activeTab === 'natural' ? colors.primary1 : colors.secondary1 }} />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                                                        {scenario.name}
                                                    </h3>
                                                    <span 
                                                        className="text-xs px-2 py-1 rounded-full font-semibold"
                                                        style={{ 
                                                            backgroundColor: colors.secondary3 + '20',
                                                            color: colors.secondary3
                                                        }}
                                                    >
                                                        {scenario.category}
                                                    </span>
                                                </div>
                                                <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
                                                    {scenario.description}
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                                            Expected Impact:
                                                        </span>
                                                        <span 
                                                            className="text-sm font-bold flex items-center gap-1"
                                                            style={{ color: isPositive ? colors.successText : colors.dangerText }}
                                                        >
                                                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                            {scenario.expectedImpact}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                                            Confidence:
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <div 
                                                                className="h-2 w-24 rounded-full overflow-hidden"
                                                                style={{ backgroundColor: colors.border }}
                                                            >
                                                                <div 
                                                                    className="h-full rounded-full transition-all"
                                                                    style={{ 
                                                                        width: `${scenario.confidence}%`,
                                                                        backgroundColor: scenario.confidence >= 90 ? colors.successText : 
                                                                                       scenario.confidence >= 85 ? colors.secondary3 : colors.secondary2
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-semibold" style={{ color: colors.textPrimary }}>
                                                                {scenario.confidence}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => handleApplyScenario(scenario)}
                                            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all hover:opacity-90 shrink-0"
                                            style={{ 
                                                backgroundColor: activeTab === 'natural' ? colors.primary1 : colors.secondary1,
                                                color: '#ffffff'
                                            }}
                                        >
                                            Apply
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Applied Scenario Details */}
            {appliedScenario && (
                <div className="space-y-6">
                    {/* 3 Before/After Summary Cards - always shown for all scenarios */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(() => {
                            const metrics = appliedScenario.affectedMetrics;
                            const netSurplus = metrics.netSurplus;
                            const otherMetrics = Object.entries(metrics).filter(([k]) => k !== 'netSurplus');
                            const primaryMetric = otherMetrics[0];
                            const secondaryMetric = otherMetrics[1];
                            const surplusDelta = appliedScenario.surplusDelta ?? (netSurplus.after - netSurplus.before);
                            const cardFromMetric = ([key, data]: [string, any]) => ({
                                title: key.replace(/([A-Z])/g, ' $1').trim(),
                                before: data.before,
                                after: data.after,
                                change: data.after - data.before,
                                isGood: isExpenseMetric(key) ? data.after < data.before : data.after > data.before,
                                color: key.includes('Revenue') || key.includes('tuition') ? colors.secondary1 : key.includes('Surplus') ? colors.secondary3 : colors.primary1,
                                isImprovementCard: false
                            });
                            const cards: any[] = [
                                cardFromMetric(['netSurplus', netSurplus]),
                                ...(primaryMetric ? [cardFromMetric(primaryMetric)] : []),
                                ...(secondaryMetric ? [cardFromMetric(secondaryMetric)] : [{
                                    title: 'Expected Impact',
                                    before: 0,
                                    after: surplusDelta,
                                    change: surplusDelta,
                                    isGood: surplusDelta >= 0,
                                    color: colors.successText,
                                    isImprovementCard: true
                                }])
                            ];
                            return cards.map((card, idx) => (
                                <div key={idx} className="p-5 rounded-xl border-2 min-w-0" style={{ backgroundColor: colors.cardBg, borderColor: card.color }}>
                                    <p className="text-xs font-semibold uppercase mb-4" style={{ color: colors.textSecondary }}>{card.title}</p>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>Before</p>
                                            <p className="text-base sm:text-lg font-bold truncate" style={{ color: colors.textPrimary }}>
                                                {card.isImprovementCard ? '$0' : formatCurrency(card.before)}
                                            </p>
                                        </div>
                                        <ArrowRight size={18} className="flex-shrink-0" style={{ color: colors.border }} />
                                        <div className="flex-1 min-w-0 text-right">
                                            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>After</p>
                                            <p className="text-base sm:text-lg font-bold truncate" style={{ color: card.isGood ? colors.successText : colors.dangerText }}>
                                                {card.isImprovementCard ? formatExpectedImpact(card.after) : formatCurrency(card.after)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 px-2 py-1.5 rounded-lg text-center" style={{ backgroundColor: (card.isGood ? colors.successText : colors.dangerText) + '15' }}>
                                        <span className="text-xs font-bold" style={{ color: card.isGood ? colors.successText : colors.dangerText }}>
                                            {card.change >= 0 ? '+' : ''}{formatCurrency(card.change)} {card.isImprovementCard ? 'improvement' : 'change'}
                                        </span>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>

                    {/* Header with Reset Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={24} style={{ color: colors.successText }} />
                            <div>
                                <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                                    Scenario Applied: {appliedScenario.name}
                                </h2>
                                <p className="text-sm" style={{ color: colors.textSecondary }}>
                                    {appliedScenario.description}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={resetSimulation}
                            className="px-5 py-2.5 rounded-lg font-semibold transition-all"
                            style={{ 
                                backgroundColor: colors.border,
                                color: colors.textPrimary
                            }}
                        >
                            Reset Simulation
                        </button>
                    </div>

                    {/* Before/After Comparison Chart - Overlapping Bars */}
                    <div className="p-4 sm:p-6 rounded-xl min-w-0 overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <h3 className="text-base font-bold mb-4 sm:mb-6" style={{ color: colors.textPrimary }}>
                            Before vs After Comparison
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {Object.entries(appliedScenario.affectedMetrics).map(([key, data]: [string, any]) => {
                                const maxValue = Math.max(data.before, data.after) * 1.1; // Add 10% padding
                                const beforeHeight = (data.before / maxValue) * 100;
                                const afterHeight = (data.after / maxValue) * 100;
                                // Cost down = green; Revenue up = green
                                const isGoodChange = isExpenseMetric(key) ? data.after < data.before : data.after > data.before;
                                
                                const metricColor = key.includes('Revenue') || key.includes('tuition') || key.includes('grants') || key.includes('fees')
                                    ? colors.secondary1 
                                    : key.includes('Surplus') 
                                    ? colors.secondary3 
                                    : colors.primary1;
                                
                                return (
                                    <div key={key}>
                                        <p className="text-xs font-semibold mb-4 text-center" style={{ color: colors.textSecondary }}>
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </p>
                                        <div className="flex items-end justify-center" style={{ height: '220px' }}>
                                            <div className="flex-1 flex flex-col items-center gap-3 max-w-[200px]">
                                                {/* Labels with colors */}
                                                <div className="w-full space-y-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span style={{ color: colors.textSecondary }}>Before:</span>
                                                        <span className="font-bold" style={{ color: colors.textPrimary }}>
                                                            {formatCurrency(data.before)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span style={{ color: colors.textSecondary }}>After:</span>
                                                        <span className="font-bold" style={{ color: isGoodChange ? colors.successText : colors.dangerText }}>
                                                            {formatCurrency(data.after)}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Overlapping bars */}
                                                <div className="w-full relative flex flex-col items-center justify-end" style={{ height: '160px' }}>
                                                    {/* Before bar (wider, more transparent) */}
                                                    <div 
                                                        className="absolute bottom-0 rounded-t-lg"
                                                        style={{ 
                                                            height: `${beforeHeight}%`,
                                                            width: '85%',
                                                            backgroundColor: colors.border,
                                                            opacity: 0.6,
                                                            minHeight: '20px'
                                                        }}
                                                    />
                                                    {/* After bar (narrower, solid, overlapping) */}
                                                    <div 
                                                        className="absolute bottom-0 rounded-t-lg"
                                                        style={{ 
                                                            height: `${afterHeight}%`,
                                                            width: '60%',
                                                            backgroundColor: isGoodChange ? colors.successText : colors.dangerText,
                                                            minHeight: '20px',
                                                            zIndex: 10
                                                        }}
                                                    />
                                                </div>
                                                
                                                {/* Change indicator */}
                                                <div 
                                                    className="px-3 py-1 rounded-full flex items-center gap-1.5"
                                                    style={{ backgroundColor: (isGoodChange ? colors.successText : colors.dangerText) + '20' }}
                                                >
                                                    {data.change > 0 ? <TrendingUp size={12} style={{ color: isGoodChange ? colors.successText : colors.dangerText }} /> : <TrendingDown size={12} style={{ color: isGoodChange ? colors.successText : colors.dangerText }} />}
                                                    <span 
                                                        className="text-xs font-bold"
                                                        style={{ color: isGoodChange ? colors.successText : colors.dangerText }}
                                                    >
                                                        {data.change > 0 ? '+' : ''}{data.change.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Legend */}
                        <div className="flex items-center justify-center gap-6 mt-6 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-3 rounded" style={{ backgroundColor: colors.border, opacity: 0.6 }} />
                                <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>Before</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-3 rounded" style={{ backgroundColor: colors.successText }} />
                                <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>After (Improved)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-3 rounded" style={{ backgroundColor: colors.dangerText }} />
                                <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>After (Worsened)</span>
                            </div>
                        </div>
                    </div>

                    {/* Yearly Projection */}
                    <div className="p-4 sm:p-6 rounded-xl min-w-0 overflow-x-auto" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <h3 className="text-base font-bold mb-4 sm:mb-6" style={{ color: colors.textPrimary }}>
                            3-Year Projection
                        </h3>
                        <div className="flex items-end justify-between gap-1 sm:gap-2 min-w-[320px]" style={{ height: '250px', maxHeight: '300px' }}>
                            {appliedScenario.yearlyProjection.map((item: any, idx: number) => {
                                const maxValue = Math.max(...appliedScenario.yearlyProjection.map((d: any) => Math.max(d.baseline, d.projected)));
                                const baselineHeight = (item.baseline / maxValue) * 100;
                                const projectedHeight = (item.projected / maxValue) * 100;
                                const isPast = idx <= 4;
                                
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="text-center space-y-1">
                                            {!isPast && (
                                                <p className="text-xs font-bold" style={{ color: activeTab === 'natural' ? colors.primary1 : colors.secondary1 }}>
                                                    {formatCurrency(item.projected)}
                                                </p>
                                            )}
                                            <p className="text-xs font-semibold" style={{ color: isPast ? colors.textPrimary : colors.textSecondary }}>
                                                {formatCurrency(item.baseline)}
                                            </p>
                                        </div>
                                        <div className="w-full flex flex-col items-center justify-end relative" style={{ height: '220px' }}>
                                            {/* Baseline bar */}
                                            <div 
                                                className="w-full rounded-t-lg absolute bottom-0"
                                                style={{ 
                                                    height: `${baselineHeight}%`,
                                                    backgroundColor: colors.border,
                                                    opacity: 0.5,
                                                    minHeight: '20px'
                                                }}
                                            />
                                            {/* Projected bar */}
                                            {!isPast && (
                                                <div 
                                                    className="w-3/4 rounded-t-lg absolute bottom-0"
                                                    style={{ 
                                                        height: `${projectedHeight}%`,
                                                        backgroundColor: activeTab === 'natural' ? colors.primary1 : colors.secondary1,
                                                        minHeight: '20px',
                                                        zIndex: 10
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                            {item.year.split('-')[0]}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.border, opacity: 0.5 }} />
                                <span className="text-xs" style={{ color: colors.textSecondary }}>Baseline</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: activeTab === 'natural' ? colors.primary1 : colors.secondary1 }} />
                                <span className="text-xs" style={{ color: colors.textSecondary }}>With Scenario</span>
                            </div>
                        </div>
                    </div>

                    {/* Impact Breakdown - Donut/Pie Style */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                            <h3 className="text-base font-bold mb-6" style={{ color: colors.textPrimary }}>
                                Impact Breakdown
                            </h3>
                            <div className="space-y-3">
                                {appliedScenario.breakdown.map((item: any, idx: number) => {
                                    const total = appliedScenario.breakdown.reduce((sum: number, b: any) => sum + b.value, 0);
                                    const percentage = (item.value / total) * 100;
                                    const barColors = [colors.secondary1, colors.secondary2, colors.secondary3];
                                    const barColor = item.color || barColors[idx % barColors.length];
                                    return (
                                        <div key={idx}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                                    {item.label}
                                                </span>
                                                <span className="text-sm font-bold" style={{ color: barColor }}>
                                                    {formatCurrency(item.value)} ({percentage.toFixed(0)}%)
                                                </span>
                                            </div>
                                            <div 
                                                className="h-3 rounded-full overflow-hidden"
                                                style={{ backgroundColor: colors.border }}
                                            >
                                            <div 
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ 
                                                    width: `${percentage}%`,
                                                    backgroundColor: barColor
                                                }}
                                            />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="p-4 sm:p-6 rounded-xl min-w-0" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                            <h3 className="text-base font-bold mb-6" style={{ color: colors.textPrimary }}>
                                Key Performance Indicators
                            </h3>
                            <div className="space-y-4">
                                <div 
                                    className="p-4 rounded-lg"
                                    style={{ backgroundColor: colors.secondary3 + '20' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>Expected Impact</p>
                                            <p className="text-2xl font-bold" style={{ color: colors.secondary3 }}>
                                                {appliedScenario.expectedImpact}
                                            </p>
                                        </div>
                                        <DollarSign size={32} style={{ color: colors.secondary3, opacity: 0.5 }} />
                                    </div>
                                </div>
                                <div 
                                    className="p-4 rounded-lg"
                                    style={{ backgroundColor: (activeTab === 'natural' ? colors.primary1 : colors.secondary1) + '20' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>Confidence Level</p>
                                            <p className="text-2xl font-bold" style={{ color: activeTab === 'natural' ? colors.primary1 : colors.secondary1 }}>
                                                {appliedScenario.confidence}%
                                            </p>
                                        </div>
                                        <Target size={32} style={{ color: activeTab === 'natural' ? colors.primary1 : colors.secondary1, opacity: 0.5 }} />
                                    </div>
                                </div>
                                <div 
                                    className="p-4 rounded-lg"
                                    style={{ backgroundColor: colors.successText + '20' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>Category</p>
                                            <p className="text-2xl font-bold" style={{ color: colors.successText }}>
                                                {appliedScenario.category}
                                            </p>
                                        </div>
                                        <BarChart3 size={32} style={{ color: colors.successText, opacity: 0.5 }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
