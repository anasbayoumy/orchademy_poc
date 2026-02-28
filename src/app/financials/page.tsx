'use client';

import { useState } from 'react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { 
    DollarSign, 
    TrendingUp, 
    TrendingDown,
    PieChart, 
    Briefcase,
    Layers,
    Sparkles,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    BarChart3,
    LineChart,
    Zap,
    Settings2,
    Check
} from 'lucide-react';
import Link from 'next/link';

// Real Financial Data from P&L Pages
const FINANCIAL_DATA = {
    natural: {
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
    },
    functional: {
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
    }
};

const FINANCIAL_YEARS = ['2019-20', '2020-21', '2021-22', '2022-23', '2023-24'];

// Format currency
const formatCurrency = (value: number, decimals = 1): string => {
    return `$${(value / 1000000).toFixed(decimals)}M`;
};

// Format percentage
const formatPercent = (value: number, decimals = 1): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

// Simulation opportunities: 4 natural + 4 functional (user selects which 4 to display)
const SIMULATION_INSIGHTS = [
    // Natural classification
    { id: 'tuition-opt', title: 'Tuition Optimization', impact: '+$2.8M', confidence: 92, type: 'natural' as const, description: '3.5% tuition increase + 2% enrollment growth' },
    { id: 'operational-eff', title: 'Operational Efficiency', impact: '+$1.9M', confidence: 88, type: 'natural' as const, description: '8% reduction in administrative overhead' },
    { id: 'revenue-diversification', title: 'Revenue Diversification', impact: '+$1.2M', confidence: 85, type: 'natural' as const, description: 'Expand non-tuition revenue streams' },
    { id: 'cost-rationalization', title: 'Cost Rationalization', impact: '+$2.1M', confidence: 86, type: 'natural' as const, description: 'Strategic procurement and vendor consolidation' },
    // Functional classification
    { id: 'campus-sustainability', title: 'Campus Sustainability', impact: '+$1.5M', confidence: 91, type: 'functional' as const, description: 'Energy-efficient systems & carbon reduction' },
    { id: 'program-rationalization', title: 'Program Rationalization', impact: '+$3.2M', confidence: 84, type: 'functional' as const, description: 'Consolidate underperforming programs' },
    { id: 'instructional-efficiency', title: 'Instructional Efficiency', impact: '+$1.8M', confidence: 82, type: 'functional' as const, description: 'Optimize student-faculty ratios and section sizing' },
    { id: 'support-streamlining', title: 'Support Streamlining', impact: '+$0.9M', confidence: 79, type: 'functional' as const, description: 'Consolidate administrative support functions' }
];

export default function FinancialsDashboard() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();
    const [selectedYearIndex, setSelectedYearIndex] = useState(4); // 2023-24 default
    const [customizeOpen, setCustomizeOpen] = useState(false);
    const [selectedInsightIds, setSelectedInsightIds] = useState<string[]>(
        () => SIMULATION_INSIGHTS.slice(0, 4).map(i => i.id)
    );

    const displayedInsights = SIMULATION_INSIGHTS.filter(i => selectedInsightIds.includes(i.id));

    const toggleInsight = (id: string) => {
        setSelectedInsightIds(prev => {
            if (prev.includes(id)) {
                if (prev.length <= 1) return prev;
                return prev.filter(x => x !== id);
            }
            if (prev.length >= 4) return prev;
            return [...prev, id];
        });
    };

    const currentRevenue = FINANCIAL_DATA.functional.totalRevenue[selectedYearIndex];
    const previousRevenue = selectedYearIndex > 0 ? FINANCIAL_DATA.functional.totalRevenue[selectedYearIndex - 1] : currentRevenue;
    const currentExpenses = FINANCIAL_DATA.functional.totalExpenses[selectedYearIndex];
    const previousExpenses = selectedYearIndex > 0 ? FINANCIAL_DATA.functional.totalExpenses[selectedYearIndex - 1] : currentExpenses;
    const currentSurplus = FINANCIAL_DATA.functional.netSurplus[selectedYearIndex];
    const previousSurplus = selectedYearIndex > 0 ? FINANCIAL_DATA.functional.netSurplus[selectedYearIndex - 1] : currentSurplus;

    const revenueChange = selectedYearIndex > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const expenseChange = selectedYearIndex > 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 0;
    const surplusChange = selectedYearIndex > 0 && previousSurplus !== 0 ? ((currentSurplus - previousSurplus) / Math.abs(previousSurplus)) * 100 : 0;
    const margin = (currentSurplus / currentRevenue) * 100;
    const prevMargin = selectedYearIndex > 0 ? (previousSurplus / previousRevenue) * 100 : margin;
    const marginChange = margin - prevMargin;
    const hasYearComparison = selectedYearIndex > 0;

    return (
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto min-w-0 overflow-x-hidden" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            {/* Header */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <DollarSign className="flex-shrink-0" size={28} style={{ color: colors.secondary3 }} />
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate" style={{ color: colors.textPrimary }}>
                            Financial Overview
                        </h1>
                        <p className="text-xs sm:text-sm" style={{ color: colors.textSecondary }}>
                            Comprehensive financial dashboard for FY {FINANCIAL_YEARS[selectedYearIndex]}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="text-xs sm:text-sm font-medium shrink-0" style={{ color: colors.textSecondary }}>
                        Financial Year:
                    </label>
                    <select
                        value={selectedYearIndex}
                        onChange={(e) => setSelectedYearIndex(Number(e.target.value))}
                        className="px-3 sm:px-4 py-2 rounded-lg border text-sm font-medium w-full sm:w-auto min-w-0"
                        style={{
                            backgroundColor: colors.surfaceBg,
                            borderColor: colors.border,
                            color: colors.textPrimary,
                            maxWidth: '180px'
                        }}
                    >
                        {FINANCIAL_YEARS.map((year, idx) => (
                            <option key={year} value={idx}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Total Revenue */}
                <div 
                    className="p-4 sm:p-5 rounded-xl min-w-0"
                    style={{ 
                        backgroundColor: colors.cardBg, 
                        border: `2px solid ${colors.secondary1}` 
                    }}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-xs font-semibold uppercase mb-1" style={{ color: colors.textSecondary }}>
                                Total Revenue
                            </p>
                            <p className="text-xl sm:text-2xl font-bold break-words" style={{ color: colors.textPrimary }}>
                                {formatCurrency(currentRevenue)}
                            </p>
                        </div>
                        <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: colors.secondary1 + '20' }}
                        >
                            <TrendingUp size={20} style={{ color: colors.secondary1 }} />
                        </div>
                    </div>
                    {hasYearComparison ? (
                        <div 
                            className="px-2 py-1 rounded-lg inline-flex items-center gap-1"
                            style={{ backgroundColor: (revenueChange >= 0 ? colors.successText : colors.dangerText) + '20' }}
                        >
                            {revenueChange >= 0 ? <ArrowUpRight size={12} style={{ color: colors.successText }} /> : <ArrowDownRight size={12} style={{ color: colors.dangerText }} />}
                            <span className="text-xs font-bold" style={{ color: revenueChange >= 0 ? colors.successText : colors.dangerText }}>
                                {formatPercent(revenueChange)} vs {FINANCIAL_YEARS[selectedYearIndex - 1]}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs" style={{ color: colors.textSecondary }}>Base year</span>
                    )}
                </div>

                {/* Total Expenses */}
                <div 
                    className="p-4 sm:p-5 rounded-xl min-w-0"
                    style={{ 
                        backgroundColor: colors.cardBg, 
                        border: `2px solid ${colors.primary1}` 
                    }}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-xs font-semibold uppercase mb-1" style={{ color: colors.textSecondary }}>
                                Total Expenses
                            </p>
                            <p className="text-xl sm:text-2xl font-bold break-words" style={{ color: colors.textPrimary }}>
                                {formatCurrency(currentExpenses)}
                            </p>
                        </div>
                        <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: colors.primary1 + '20' }}
                        >
                            <TrendingDown size={20} style={{ color: colors.primary1 }} />
                        </div>
                    </div>
                    {hasYearComparison ? (
                        <div 
                            className="px-2 py-1 rounded-lg inline-flex items-center gap-1"
                            style={{ backgroundColor: (expenseChange <= 0 ? colors.successText : colors.dangerText) + '20' }}
                        >
                            {expenseChange <= 0 ? <ArrowUpRight size={12} style={{ color: colors.successText }} /> : <ArrowDownRight size={12} style={{ color: colors.dangerText }} />}
                            <span className="text-xs font-bold" style={{ color: expenseChange <= 0 ? colors.successText : colors.dangerText }}>
                                {formatPercent(expenseChange)} vs {FINANCIAL_YEARS[selectedYearIndex - 1]}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs" style={{ color: colors.textSecondary }}>Base year</span>
                    )}
                </div>

                {/* Net Surplus */}
                <div 
                    className="p-4 sm:p-5 rounded-xl min-w-0"
                    style={{ 
                        backgroundColor: colors.cardBg, 
                        border: `2px solid ${colors.secondary3}` 
                    }}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-xs font-semibold uppercase mb-1" style={{ color: colors.textSecondary }}>
                                Net Surplus
                            </p>
                            <p className="text-xl sm:text-2xl font-bold break-words" style={{ color: colors.textPrimary }}>
                                {formatCurrency(currentSurplus)}
                            </p>
                        </div>
                        <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: colors.secondary3 + '20' }}
                        >
                            <Target size={20} style={{ color: colors.secondary3 }} />
                        </div>
                    </div>
                    {hasYearComparison ? (
                        <div 
                            className="px-2 py-1 rounded-lg inline-flex items-center gap-1"
                            style={{ backgroundColor: (surplusChange >= 0 ? colors.successText : colors.dangerText) + '20' }}
                        >
                            {surplusChange >= 0 ? <ArrowUpRight size={12} style={{ color: colors.successText }} /> : <ArrowDownRight size={12} style={{ color: colors.dangerText }} />}
                            <span className="text-xs font-bold" style={{ color: surplusChange >= 0 ? colors.successText : colors.dangerText }}>
                                {formatPercent(surplusChange)} vs {FINANCIAL_YEARS[selectedYearIndex - 1]}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs" style={{ color: colors.textSecondary }}>Base year</span>
                    )}
                </div>

                {/* Profit Margin */}
                <div 
                    className="p-4 sm:p-5 rounded-xl min-w-0"
                    style={{ 
                        backgroundColor: colors.cardBg, 
                        border: `2px solid ${colors.secondary2}` 
                    }}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-xs font-semibold uppercase mb-1" style={{ color: colors.textSecondary }}>
                                Profit Margin
                            </p>
                            <p className="text-xl sm:text-2xl font-bold break-words" style={{ color: colors.textPrimary }}>
                                {margin.toFixed(1)}%
                            </p>
                        </div>
                        <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: colors.secondary2 + '20' }}
                        >
                            <PieChart size={20} style={{ color: colors.secondary2 }} />
                        </div>
                    </div>
                    {hasYearComparison ? (
                        <div 
                            className="px-2 py-1 rounded-lg inline-flex items-center gap-1"
                            style={{ backgroundColor: (marginChange >= 0 ? colors.successText : colors.dangerText) + '20' }}
                        >
                            {marginChange >= 0 ? <ArrowUpRight size={12} style={{ color: colors.successText }} /> : <ArrowDownRight size={12} style={{ color: colors.dangerText }} />}
                            <span className="text-xs font-bold" style={{ color: marginChange >= 0 ? colors.successText : colors.dangerText }}>
                                {formatPercent(marginChange, 2)} vs {FINANCIAL_YEARS[selectedYearIndex - 1]}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs" style={{ color: colors.textSecondary }}>Base year</span>
                    )}
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 items-stretch">
                <Link href="/financials/p-l-natural" className="h-full min-h-0 flex">
                    <div 
                        className="p-4 sm:p-6 rounded-xl cursor-pointer transition-all hover:scale-[1.01] sm:hover:scale-[1.02] min-w-0 w-full flex flex-col"
                        style={{ 
                            backgroundColor: colors.cardBg, 
                            border: `1px solid ${colors.border}`,
                            boxShadow: colors.isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div 
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: colors.primary1 + '20' }}
                            >
                                <Layers size={24} style={{ color: colors.primary1 }} />
                            </div>
                            <ArrowUpRight size={20} style={{ color: colors.textSecondary }} />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                            Natural Classification
                        </h3>
                        <p className="text-xs sm:text-sm mb-3" style={{ color: colors.textSecondary }}>
                            Account-based P&L analysis by expense type
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>Total Salaries</p>
                                <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                                    {formatCurrency(
                                        FINANCIAL_DATA.natural.expenses.facultySalaries[selectedYearIndex] +
                                        FINANCIAL_DATA.natural.expenses.staffSalaries[selectedYearIndex] +
                                        FINANCIAL_DATA.natural.expenses.benefits[selectedYearIndex]
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>Total Operating Expense</p>
                                <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                                    {formatCurrency(
                                        FINANCIAL_DATA.natural.expenses.facilities[selectedYearIndex] +
                                        FINANCIAL_DATA.natural.expenses.itSystems[selectedYearIndex] +
                                        FINANCIAL_DATA.natural.expenses.marketing[selectedYearIndex] +
                                        FINANCIAL_DATA.natural.expenses.professionalServices[selectedYearIndex] +
                                        FINANCIAL_DATA.natural.expenses.depreciation[selectedYearIndex]
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/financials/p-l-functional" className="h-full min-h-0 flex">
                    <div 
                        className="p-4 sm:p-6 rounded-xl cursor-pointer transition-all hover:scale-[1.01] sm:hover:scale-[1.02] min-w-0 w-full flex flex-col"
                        style={{ 
                            backgroundColor: colors.cardBg, 
                            border: `1px solid ${colors.border}`,
                            boxShadow: colors.isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div 
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: colors.secondary1 + '20' }}
                            >
                                <Briefcase size={24} style={{ color: colors.secondary1 }} />
                            </div>
                            <ArrowUpRight size={20} style={{ color: colors.textSecondary }} />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                            Functional Classification
                        </h3>
                        <p className="text-xs sm:text-sm mb-3" style={{ color: colors.textSecondary }}>
                            Activity-based P&L analysis by function
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>Instructional Cost</p>
                                <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                                    {formatCurrency(FINANCIAL_DATA.functional.instructionCost[selectedYearIndex])}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>Student Services</p>
                                <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                                    {formatCurrency(FINANCIAL_DATA.functional.studentServices[selectedYearIndex])}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/financials/simulations" className="h-full min-h-0 flex">
                    <div 
                        className="p-4 sm:p-6 rounded-xl cursor-pointer transition-all hover:scale-[1.01] sm:hover:scale-[1.02] min-w-0 w-full flex flex-col"
                        style={{ 
                            backgroundColor: colors.cardBg, 
                            border: `1px solid ${colors.border}`,
                            boxShadow: colors.isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div 
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: colors.secondary3 + '20' }}
                            >
                                <Sparkles size={24} style={{ color: colors.secondary3 }} />
                            </div>
                            <ArrowUpRight size={20} style={{ color: colors.textSecondary }} />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                            AI Simulations
                        </h3>
                        <p className="text-xs sm:text-sm mb-3" style={{ color: colors.textSecondary }}>
                            Scenario planning and optimization insights
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>Scenarios</p>
                                <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                                    8 Available
                                </p>
                            </div>
                            <div>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>Potential</p>
                                <p className="text-sm font-bold" style={{ color: colors.secondary3 }}>
                                    +$9.4M
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div 
                    className="p-4 sm:p-6 rounded-xl min-w-0 overflow-hidden"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-base sm:text-lg font-bold truncate pr-2" style={{ color: colors.textPrimary }}>
                            Revenue Sources ({FINANCIAL_YEARS[selectedYearIndex]})
                        </h3>
                        <BarChart3 size={20} style={{ color: colors.textSecondary }} />
                    </div>
                    <div className="space-y-4">
                        {[
                            { 
                                label: 'Tuition', 
                                value: FINANCIAL_DATA.natural.revenue.tuition[selectedYearIndex],
                                percentage: (FINANCIAL_DATA.natural.revenue.tuition[selectedYearIndex] / currentRevenue) * 100,
                                color: colors.secondary1
                            },
                            { 
                                label: 'Grants', 
                                value: FINANCIAL_DATA.natural.revenue.grants[selectedYearIndex],
                                percentage: (FINANCIAL_DATA.natural.revenue.grants[selectedYearIndex] / currentRevenue) * 100,
                                color: colors.secondary2
                            },
                            { 
                                label: 'Fees', 
                                value: FINANCIAL_DATA.natural.revenue.fees[selectedYearIndex],
                                percentage: (FINANCIAL_DATA.natural.revenue.fees[selectedYearIndex] / currentRevenue) * 100,
                                color: colors.secondary3
                            },
                            { 
                                label: 'Other', 
                                value: FINANCIAL_DATA.natural.revenue.other[selectedYearIndex],
                                percentage: (FINANCIAL_DATA.natural.revenue.other[selectedYearIndex] / currentRevenue) * 100,
                                color: colors.primary1
                            }
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                        {item.label}
                                    </span>
                                    <span className="text-sm font-bold" style={{ color: item.color }}>
                                        {formatCurrency(item.value)} ({item.percentage.toFixed(1)}%)
                                    </span>
                                </div>
                                <div 
                                    className="h-3 rounded-full overflow-hidden"
                                    style={{ backgroundColor: colors.border }}
                                >
                                    <div 
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ 
                                            width: `${item.percentage}%`,
                                            backgroundColor: item.color
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div 
                    className="p-4 sm:p-6 rounded-xl min-w-0 overflow-hidden"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-base sm:text-lg font-bold truncate pr-2" style={{ color: colors.textPrimary }}>
                            Functional Expenses ({FINANCIAL_YEARS[selectedYearIndex]})
                        </h3>
                        <PieChart size={20} style={{ color: colors.textSecondary }} />
                    </div>
                    <div className="space-y-4">
                        {[
                            { 
                                label: 'Instructional Cost', 
                                value: FINANCIAL_DATA.functional.instructionCost[selectedYearIndex],
                                percentage: (FINANCIAL_DATA.functional.instructionCost[selectedYearIndex] / currentExpenses) * 100,
                                color: colors.primary1
                            },
                            { 
                                label: 'Institutional Support', 
                                value: FINANCIAL_DATA.functional.institutionalSupport[selectedYearIndex],
                                percentage: (FINANCIAL_DATA.functional.institutionalSupport[selectedYearIndex] / currentExpenses) * 100,
                                color: colors.secondary1
                            },
                            { 
                                label: 'Academic Support', 
                                value: FINANCIAL_DATA.functional.academicSupport[selectedYearIndex],
                                percentage: (FINANCIAL_DATA.functional.academicSupport[selectedYearIndex] / currentExpenses) * 100,
                                color: colors.secondary2
                            },
                            { 
                                label: 'Operations & maintenance', 
                                value: FINANCIAL_DATA.functional.operationsMaintenance[selectedYearIndex],
                                percentage: (FINANCIAL_DATA.functional.operationsMaintenance[selectedYearIndex] / currentExpenses) * 100,
                                color: colors.secondary3
                            }
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                        {item.label}
                                    </span>
                                    <span className="text-sm font-bold" style={{ color: item.color }}>
                                        {formatCurrency(item.value)} ({item.percentage.toFixed(1)}%)
                                    </span>
                                </div>
                                <div 
                                    className="h-3 rounded-full overflow-hidden"
                                    style={{ backgroundColor: colors.border }}
                                >
                                    <div 
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ 
                                            width: `${item.percentage}%`,
                                            backgroundColor: item.color
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5-Year Trend */}
            <div 
                className="p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 min-w-0 overflow-x-auto"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-bold" style={{ color: colors.textPrimary }}>
                        5-Year Financial Trend (Net Surplus/deficit)
                    </h3>
                    <LineChart size={20} style={{ color: colors.textSecondary }} />
                </div>
                <div className="flex items-end justify-between gap-1 sm:gap-2 min-w-[280px] h-[200px] sm:h-[250px] lg:h-[300px]">
                    {FINANCIAL_YEARS.map((year, idx) => {
                        const revenue = FINANCIAL_DATA.functional.totalRevenue[idx];
                        const expenses = FINANCIAL_DATA.functional.totalExpenses[idx];
                        const surplus = FINANCIAL_DATA.functional.netSurplus[idx];
                        const maxValue = Math.max(...FINANCIAL_DATA.functional.totalRevenue);
                        const isSelected = idx === selectedYearIndex;

                        return (
                            <button
                                key={year}
                                type="button"
                                onClick={() => setSelectedYearIndex(idx)}
                                className="flex-1 flex flex-col items-center gap-3 cursor-pointer transition-opacity hover:opacity-90"
                            >
                                <div 
                                    className="w-full relative rounded-lg p-1 h-[180px] sm:h-[220px] lg:h-[240px]"
                                    style={{ 
                                        outline: isSelected ? `2px solid ${colors.accent}` : 'none',
                                        outlineOffset: 2,
                                        backgroundColor: isSelected ? colors.accentBg : 'transparent'
                                    }}
                                >
                                    {/* Revenue bar */}
                                    <div 
                                        className="absolute bottom-0 w-full rounded-t-lg"
                                        style={{ 
                                            height: `${(revenue / maxValue) * 100}%`,
                                            backgroundColor: colors.secondary1,
                                            opacity: isSelected ? 0.5 : 0.3,
                                            minHeight: '20px'
                                        }}
                                    />
                                    {/* Expenses bar */}
                                    <div 
                                        className="absolute bottom-0 w-3/4 left-1/2 -translate-x-1/2 rounded-t-lg"
                                        style={{ 
                                            height: `${(expenses / maxValue) * 100}%`,
                                            backgroundColor: colors.primary1,
                                            minHeight: '20px',
                                            zIndex: 10
                                        }}
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold mb-1" style={{ color: surplus > 0 ? colors.successText : colors.dangerText }}>
                                        {formatCurrency(surplus, 2)}
                                    </p>
                                    <p className="text-xs font-medium" style={{ color: isSelected ? colors.accent : colors.textSecondary }}>
                                        {year}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.secondary1, opacity: 0.3 }} />
                        <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.primary1 }} />
                        <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>Expenses</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.successText }} />
                        <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>Surplus</span>
                    </div>
                </div>
            </div>
            {/* AI Simulation Insights */}
            <div 
                className="p-6 rounded-xl"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Sparkles size={24} style={{ color: colors.secondary3 }} />
                        <div>
                            <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                                AI-Powered Optimization Opportunities
                            </h3>
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                                Potential improvements identified through scenario analysis • Select which to display (max 4)
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setCustomizeOpen(!customizeOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors hover:opacity-90"
                            style={{
                                backgroundColor: customizeOpen ? colors.primary1 + '15' : colors.surfaceBg,
                                borderColor: customizeOpen ? colors.primary1 : colors.border,
                                color: colors.textPrimary
                            }}
                        >
                            <Settings2 size={16} />
                            Customize ({selectedInsightIds.length}/4)
                        </button>
                        {customizeOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setCustomizeOpen(false)} aria-hidden="true" />
                                <div
                                    className="absolute right-0 top-full mt-2 z-50 w-[340px] sm:w-[400px] p-4 rounded-xl shadow-xl"
                                    style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.border}` }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                                            Choose 4 cards to display
                                        </p>
                                        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: colors.primary1 + '20', color: colors.primary1 }}>
                                            {selectedInsightIds.length}/4
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedInsightIds(SIMULATION_INSIGHTS.filter(i => i.type === 'natural').map(i => i.id))}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                            style={{ backgroundColor: colors.primary1 + '20', color: colors.primary1 }}
                                        >
                                            All Natural
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedInsightIds(SIMULATION_INSIGHTS.filter(i => i.type === 'functional').map(i => i.id))}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                            style={{ backgroundColor: colors.secondary1 + '20', color: colors.secondary1 }}
                                        >
                                            All Functional
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedInsightIds([
                                                ...SIMULATION_INSIGHTS.filter(i => i.type === 'natural').slice(0, 2).map(i => i.id),
                                                ...SIMULATION_INSIGHTS.filter(i => i.type === 'functional').slice(0, 2).map(i => i.id)
                                            ])}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                            style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                                        >
                                            Mixed
                                        </button>
                                    </div>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.primary1 }}>Natural (4)</p>
                                            {SIMULATION_INSIGHTS.filter(i => i.type === 'natural').map(insight => {
                                                const isSelected = selectedInsightIds.includes(insight.id);
                                                const canToggle = isSelected ? selectedInsightIds.length > 1 : selectedInsightIds.length < 4;
                                                return (
                                                    <button key={insight.id} type="button" onClick={() => canToggle && toggleInsight(insight.id)}
                                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-1"
                                                        style={{ backgroundColor: isSelected ? colors.primary1 + '15' : 'transparent', border: `1px solid ${isSelected ? colors.primary1 + '40' : colors.border}` }}>
                                                        <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isSelected ? colors.primary1 : colors.surfaceBg, border: `2px solid ${isSelected ? colors.primary1 : colors.border}` }}>
                                                            {isSelected && <Check size={12} style={{ color: '#fff' }} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>{insight.title}</p></div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.secondary1 }}>Functional (4)</p>
                                            {SIMULATION_INSIGHTS.filter(i => i.type === 'functional').map(insight => {
                                                const isSelected = selectedInsightIds.includes(insight.id);
                                                const canToggle = isSelected ? selectedInsightIds.length > 1 : selectedInsightIds.length < 4;
                                                return (
                                                    <button key={insight.id} type="button" onClick={() => canToggle && toggleInsight(insight.id)}
                                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-1"
                                                        style={{ backgroundColor: isSelected ? colors.secondary1 + '15' : 'transparent', border: `1px solid ${isSelected ? colors.secondary1 + '40' : colors.border}` }}>
                                                        <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isSelected ? colors.secondary1 : colors.surfaceBg, border: `2px solid ${isSelected ? colors.secondary1 : colors.border}` }}>
                                                            {isSelected && <Check size={12} style={{ color: '#fff' }} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>{insight.title}</p></div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayedInsights.map((insight) => (
                        <div 
                            key={insight.id}
                            className="p-4 rounded-lg"
                            style={{ 
                                backgroundColor: colors.isDark ? '#1e293b' : '#f8fafc',
                                border: `1px solid ${colors.border}`
                            }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <span 
                                    className="text-xs px-2 py-1 rounded-full font-semibold"
                                    style={{ 
                                        backgroundColor: (insight.type === 'natural' ? colors.primary1 : colors.secondary1) + '20',
                                        color: insight.type === 'natural' ? colors.primary1 : colors.secondary1
                                    }}
                                >
                                    {insight.type === 'natural' ? 'Natural' : 'Functional'}
                                </span>
                                <Zap size={16} style={{ color: colors.secondary3 }} />
                            </div>
                            <h4 className="text-sm font-bold mb-2" style={{ color: colors.textPrimary }}>
                                {insight.title}
                            </h4>
                            <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>
                                {insight.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold" style={{ color: colors.successText }}>
                                    {insight.impact}
                                </span>
                                <span className="text-xs" style={{ color: colors.textSecondary }}>
                                    {insight.confidence}% confidence
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}