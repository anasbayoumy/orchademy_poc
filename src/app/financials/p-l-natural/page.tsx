'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import LineChart from '@/components/charts/LineChart';
import { TrendingUp, TrendingDown, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

// Historical Financial Data (5 years)
const FINANCIAL_DATA = {
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

const YEARS = ['2019-20', '2020-21', '2021-22', '2022-23', '2023-24'];

// Compute totals
const computeTotals = () => {
    const totalOtherRevenue = YEARS.map((_, i) =>
        FINANCIAL_DATA.revenue.fees[i] + FINANCIAL_DATA.revenue.grants[i] + FINANCIAL_DATA.revenue.other[i]
    );
    const totalRevenue = YEARS.map((_, i) =>
        FINANCIAL_DATA.revenue.tuition[i] + totalOtherRevenue[i]
    );
    const totalSalaries = YEARS.map((_, i) =>
        FINANCIAL_DATA.expenses.facultySalaries[i] + FINANCIAL_DATA.expenses.staffSalaries[i] + FINANCIAL_DATA.expenses.benefits[i]
    );
    const totalOperating = YEARS.map((_, i) =>
        FINANCIAL_DATA.expenses.academicSupplies[i] + FINANCIAL_DATA.expenses.facilities[i] +
        FINANCIAL_DATA.expenses.itSystems[i] + FINANCIAL_DATA.expenses.marketing[i] + FINANCIAL_DATA.expenses.professionalServices[i]
    );
    const totalExpenses = YEARS.map((_, i) =>
        totalSalaries[i] + FINANCIAL_DATA.expenses.scholarships[i] + totalOperating[i] + FINANCIAL_DATA.expenses.depreciation[i]
    );
    const netSurplus = YEARS.map((_, i) => totalRevenue[i] - totalExpenses[i]);

    return { totalOtherRevenue, totalRevenue, totalSalaries, totalOperating, totalExpenses, netSurplus };
};

const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(2)}M`;
};

const calculateGrowth = (values: number[]) => {
    const current = values[values.length - 1];
    const previous = values[values.length - 2];
    return ((current - previous) / previous * 100).toFixed(1);
};

const calculateCAGR = (values: number[]) => {
    const start = values[0];
    const end = values[values.length - 1];
    const years = values.length - 1;
    return (Math.pow(end / start, 1 / years) - 1) * 100;
};

// Category Selector Dropdown Component
interface CategorySelectorProps {
    categories: any[];
    selectedIndex: number | null;
    onSelect: (index: number | null) => void;
    colors: any;
}

function CategorySelector({ categories, selectedIndex, onSelect, colors }: CategorySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedCategory = selectedIndex !== null ? categories[selectedIndex] : null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 rounded-lg flex items-center justify-between transition-all hover:shadow-md"
                style={{
                    backgroundColor: colors.cardBg,
                    border: `2px solid ${colors.primary1}`,
                }}
            >
                <div className="flex items-center gap-3">
                    <BarChart3 size={20} style={{ color: colors.primary1 }} />
                    <div className="text-left">
                        <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                            {selectedCategory ? 'Selected Category' : 'Select a category for detailed analysis'}
                        </p>
                        {selectedCategory && (
                            <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                                {selectedCategory.title.replace(/Category \d+: /, '')}
                            </p>
                        )}
                    </div>
                </div>
                {isOpen ? <ChevronUp size={20} style={{ color: colors.primary1 }} /> : <ChevronDown size={20} style={{ color: colors.primary1 }} />}
            </button>

            {isOpen && (
                <div
                    className="absolute top-full mt-2 left-0 right-0 rounded-lg overflow-hidden shadow-xl z-50 max-h-96 overflow-y-auto"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    <div
                        className="px-4 py-2 cursor-pointer hover:opacity-80 transition-all"
                        style={{ backgroundColor: colors.primary1 }}
                        onClick={() => {
                            onSelect(null);
                            setIsOpen(false);
                        }}
                    >
                        <p className="text-sm font-semibold text-white">View All Categories</p>
                    </div>
                    {categories.map((cat, idx) => {
                        const isSelected = selectedIndex === idx;
                        const catColor = cat.categoryType === 'revenue' ? colors.success : cat.categoryType === 'expense' ? colors.danger : colors.info;

                        return (
                            <button
                                key={idx}
                                onClick={() => {
                                    onSelect(idx);
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left transition-all hover:opacity-90"
                                style={{
                                    backgroundColor: isSelected ? colors.primary1 + '20' : 'transparent',
                                    borderBottom: `1px solid ${colors.border}`,
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                                            Category {idx + 1}
                                        </p>
                                        <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                                            {cat.title.replace(/Category \d+: /, '')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                                            {formatCurrency(cat.value)}
                                        </p>
                                        <div
                                            className="px-2 py-1 rounded text-xs font-bold"
                                            style={{
                                                backgroundColor: parseFloat(cat.growth) >= 0 ? colors.successBg : colors.dangerBg,
                                                color: parseFloat(cat.growth) >= 0 ? colors.successText : colors.dangerText
                                            }}
                                        >
                                            {parseFloat(cat.growth) >= 0 ? '+' : ''}{cat.growth}%
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

interface DetailViewProps {
    category: any;
    colors: any;
}

function DetailView({ category, colors }: DetailViewProps) {
    const categoryColors: Record<'revenue' | 'expense' | 'net', { solid: string; light: string }> = {
        revenue: {
            solid: colors.secondary1,
            light: colors.successBg
        },
        expense: {
            solid: colors.primary1,
            light: colors.accentBg
        },
        net: {
            solid: colors.secondary2,
            light: colors.infoBg
        },
    };

    const catColor = categoryColors[category.categoryType as 'revenue' | 'expense' | 'net'];
    const maxValue = Math.max(...category.trendData.map((d: any) => d.value));
    const minValue = Math.min(...category.trendData.map((d: any) => d.value));

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header Banner */}
            <div
                className="relative overflow-hidden rounded-xl p-6"
                style={{ backgroundColor: catColor.solid }}
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 size={20} className="text-white" />
                        <h2 className="text-sm font-semibold text-white opacity-90">
                            {category.title}
                        </h2>
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">
                        {formatCurrency(category.value)}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-white text-sm opacity-90">2023-24</span>
                        <span className="px-3 py-1 bg-white rounded text-xs font-bold" style={{ color: catColor.solid }}>
                            {parseFloat(category.growth) >= 0 ? '+' : ''}{category.growth}% YoY
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* 5-Year Trend Chart */}
                <div className="xl:col-span-2 p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold mb-1" style={{ color: colors.textPrimary }}>
                                5-Year Trend Analysis
                            </h3>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>
                                {YEARS[0]} to {YEARS[YEARS.length - 1]}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs" style={{ color: colors.textSecondary }}>CAGR</p>
                            <p className="text-lg font-bold" style={{ color: catColor.solid }}>
                                {calculateCAGR(category.trendData.map((d: any) => d.value)).toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    <div className="relative h-64 flex items-end justify-between gap-3 px-2">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-full border-t"
                                    style={{ borderColor: colors.border, opacity: 0.5 }}
                                />
                            ))}
                        </div>

                        {/* Bars */}
                        {category.trendData.map((item: any, idx: number) => {
                            const percentage = ((item.value - minValue) / (maxValue - minValue)) * 100;
                            const height = Math.max(percentage, 5);
                            const isCurrent = idx === category.trendData.length - 1;

                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 relative z-10">
                                    <div className="text-center">
                                        <p className="text-xs font-bold" style={{ color: isCurrent ? catColor.solid : colors.textPrimary }}>
                                            {formatCurrency(item.value)}
                                        </p>
                                    </div>
                                    <div className="w-full flex flex-col items-center">
                                        <div
                                            className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                                            style={{
                                                height: `${height * 2}px`,
                                                backgroundColor: isCurrent ? catColor.solid : colors.primary1,
                                                opacity: isCurrent ? 1 : 0.4,
                                                minHeight: '20px',
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs font-medium mt-1" style={{ color: colors.textSecondary }}>
                                        {item.year}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: catColor.light }}>
                            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>Peak</p>
                            <p className="text-base font-bold" style={{ color: catColor.solid }}>
                                {formatCurrency(maxValue)}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: catColor.light }}>
                            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>Low</p>
                            <p className="text-base font-bold" style={{ color: catColor.solid }}>
                                {formatCurrency(minValue)}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: catColor.light }}>
                            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>Avg</p>
                            <p className="text-base font-bold" style={{ color: catColor.solid }}>
                                {formatCurrency(category.trendData.reduce((sum: number, d: any) => sum + d.value, 0) / category.trendData.length)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h3 className="text-base font-bold mb-4" style={{ color: colors.textPrimary }}>
                        Key Insights
                    </h3>
                    <div className="space-y-2">
                        {category.insights.map((insight: string, idx: number) => (
                            <div
                                key={idx}
                                className="p-2.5 rounded-lg border-l-2"
                                style={{
                                    backgroundColor: colors.isDark ? '#1e293b' : '#f8fafc',
                                    borderLeftColor: catColor.solid
                                }}
                            >
                                <p className="text-xs leading-relaxed" style={{ color: colors.textPrimary }}>
                                    {insight}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Component Breakdown */}
            {category.details && category.details.length > 0 && (
                <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h3 className="text-base font-bold mb-4" style={{ color: colors.textPrimary }}>
                        Component Breakdown - 5-Year History
                    </h3>
                    <div className="space-y-6">
                        {category.details.map((detail: any, idx: number) => {
                            const currentVal = detail.values[detail.values.length - 1];
                            const previousVal = detail.values[detail.values.length - 2];
                            const detailGrowth = ((currentVal - previousVal) / previousVal * 100).toFixed(1);
                            const percentOfTotal = (currentVal / category.value * 100).toFixed(1);
                            const isPositive = parseFloat(detailGrowth) >= 0;
                            const maxDetailVal = Math.max(...detail.values);
                            const minDetailVal = Math.min(...detail.values);
                            const detailCAGR = calculateCAGR(detail.values).toFixed(1);

                            return (
                                <div
                                    key={idx}
                                    className="p-5 rounded-lg"
                                    style={{ backgroundColor: colors.isDark ? '#1e293b' : '#f8fafc', border: `1px solid ${colors.border}` }}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold mb-1" style={{ color: colors.textPrimary }}>
                                                {detail.label}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs" style={{ color: colors.textSecondary }}>
                                                <span>{percentOfTotal}% of total</span>
                                                <span>•</span>
                                                <span>CAGR: {detailCAGR}%</span>
                                            </div>
                                        </div>
                                        <div
                                            className="px-2 py-1 rounded text-xs font-bold flex items-center gap-1"
                                            style={{
                                                backgroundColor: isPositive ? colors.successBg : colors.dangerBg,
                                                color: isPositive ? colors.successText : colors.dangerText
                                            }}
                                        >
                                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {isPositive ? '+' : ''}{detailGrowth}%
                                        </div>
                                    </div>

                                    {/* 5-Year Data Table */}

                                    {/* Trend Line Chart */}
                                    <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: colors.isDark ? '#0f172a' : '#f1f5f9' }}>
                                        <div className="h-32">
                                            <LineChart
                                                data={detail.values.map((v: number, i: number) => ({ year: YEARS[i], value: v }))}
                                                xKey="year"
                                                lines={[{ dataKey: 'value', color: catColor.solid }]}
                                                height={120}
                                                showLegend={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PLNaturalPage() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

    const totals = computeTotals();

    // Prepare category data
    const categories = [
        {
            title: 'Category 1: Tuition Revenue',
            value: FINANCIAL_DATA.revenue.tuition[4],
            growth: calculateGrowth(FINANCIAL_DATA.revenue.tuition),
            trendData: YEARS.map((year, i) => ({ year, value: FINANCIAL_DATA.revenue.tuition[i] })),
            categoryType: 'revenue' as const,
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.revenue.tuition).toFixed(1)}%`,
                `Peak year was 2019-20 at ${formatCurrency(Math.max(...FINANCIAL_DATA.revenue.tuition))}`,
                `Represents ${(FINANCIAL_DATA.revenue.tuition[4] / totals.totalRevenue[4] * 100).toFixed(1)}% of total revenue in 2023-24`,
                `Declined ${Math.abs(parseFloat(calculateGrowth(FINANCIAL_DATA.revenue.tuition)))}% from prior year due to enrollment shifts`,
            ],
        },
        {
            title: 'Category 2: Total Other Revenue',
            value: totals.totalOtherRevenue[4],
            growth: calculateGrowth(totals.totalOtherRevenue),
            trendData: YEARS.map((year, i) => ({ year, value: totals.totalOtherRevenue[i] })),
            details: [
                { label: 'Fees Revenue', values: FINANCIAL_DATA.revenue.fees },
                { label: 'Grants Revenue', values: FINANCIAL_DATA.revenue.grants },
                { label: 'Other Revenue', values: FINANCIAL_DATA.revenue.other },
            ],
            categoryType: 'revenue' as const,
            insights: [
                `Grants revenue grew ${calculateGrowth(FINANCIAL_DATA.revenue.grants)}% YoY, strongest component`,
                `Fees revenue recovered to ${formatCurrency(FINANCIAL_DATA.revenue.fees[4])} in 2023-24`,
                `Other revenue streams remain stable at ~${(FINANCIAL_DATA.revenue.other[4] / totals.totalRevenue[4] * 100).toFixed(1)}% of total`,
                `Diversification provides ${(totals.totalOtherRevenue[4] / totals.totalRevenue[4] * 100).toFixed(1)}% revenue stability`,
            ],
        },
        {
            title: 'Category 3: Total Revenue',
            value: totals.totalRevenue[4],
            growth: calculateGrowth(totals.totalRevenue),
            trendData: YEARS.map((year, i) => ({ year, value: totals.totalRevenue[i] })),
            details: [
                { label: 'Tuition Revenue', values: FINANCIAL_DATA.revenue.tuition },
                { label: 'Other Revenue', values: totals.totalOtherRevenue },
            ],
            categoryType: 'revenue' as const,
            insights: [
                `Revenue trending upward with ${calculateGrowth(totals.totalRevenue)}% YoY growth`,
                `Approaching 2019-20 levels after COVID-19 recovery`,
                `Average annual revenue over 5 years: ${formatCurrency(totals.totalRevenue.reduce((a, b) => a + b) / 5)}`,
                `Revenue stability improved with ${(Math.min(...totals.totalRevenue) / Math.max(...totals.totalRevenue) * 100).toFixed(1)}% consistency`,
            ],
        },
        {
            title: 'Category 4: Total Salaries & Benefits',
            value: totals.totalSalaries[4],
            growth: calculateGrowth(totals.totalSalaries),
            trendData: YEARS.map((year, i) => ({ year, value: totals.totalSalaries[i] })),
            details: [
                { label: 'Faculty Salaries', values: FINANCIAL_DATA.expenses.facultySalaries },
                { label: 'Staff Salaries', values: FINANCIAL_DATA.expenses.staffSalaries },
                { label: 'Benefits', values: FINANCIAL_DATA.expenses.benefits },
            ],
            categoryType: 'expense' as const,
            insights: [
                `Personnel costs represent ${(totals.totalSalaries[4] / totals.totalRevenue[4] * 100).toFixed(1)}% of revenue`,
                `Faculty salaries decreased ${Math.abs(parseFloat(calculateGrowth(FINANCIAL_DATA.expenses.facultySalaries)))}% YoY`,
                `Benefits as % of salaries: ${(FINANCIAL_DATA.expenses.benefits[4] / (FINANCIAL_DATA.expenses.facultySalaries[4] + FINANCIAL_DATA.expenses.staffSalaries[4]) * 100).toFixed(1)}%`,
                `Staff efficiency improved with lower salary burden`,
            ],
        },
        {
            title: 'Category 5: Scholarships & Financial Aid',
            value: FINANCIAL_DATA.expenses.scholarships[4],
            growth: calculateGrowth(FINANCIAL_DATA.expenses.scholarships),
            trendData: YEARS.map((year, i) => ({ year, value: FINANCIAL_DATA.expenses.scholarships[i] })),
            categoryType: 'expense' as const,
            insights: [
                `Aid represents ${(FINANCIAL_DATA.expenses.scholarships[4] / totals.totalRevenue[4] * 100).toFixed(1)}% of total revenue`,
                `Decreased ${Math.abs(parseFloat(calculateGrowth(FINANCIAL_DATA.expenses.scholarships)))}% YoY after 2022-23 spike`,
                `Average aid per student maintains accessibility goals`,
                `5-year trend shows strategic investment in student support`,
            ],
        },
        {
            title: 'Category 6: Total Operating Expenses',
            value: totals.totalOperating[4],
            growth: calculateGrowth(totals.totalOperating),
            trendData: YEARS.map((year, i) => ({ year, value: totals.totalOperating[i] })),
            details: [
                { label: 'Academic Supplies', values: FINANCIAL_DATA.expenses.academicSupplies },
                { label: 'Facilities & Utilities', values: FINANCIAL_DATA.expenses.facilities },
                { label: 'IT & Systems', values: FINANCIAL_DATA.expenses.itSystems },
                { label: 'Marketing & Recruitment', values: FINANCIAL_DATA.expenses.marketing },
                { label: 'Professional Services', values: FINANCIAL_DATA.expenses.professionalServices },
            ],
            categoryType: 'expense' as const,
            insights: [
                `Operating expenses at ${(totals.totalOperating[4] / totals.totalRevenue[4] * 100).toFixed(1)}% of revenue - well managed`,
                `IT systems costs stable, reflecting digital transformation completion`,
                `Facilities costs ${calculateGrowth(FINANCIAL_DATA.expenses.facilities)}% YoY growth`,
                `Professional services increased ${calculateGrowth(FINANCIAL_DATA.expenses.professionalServices)}% for strategic initiatives`,
            ],
        },
        {
            title: 'Category 7: Depreciation',
            value: FINANCIAL_DATA.expenses.depreciation[4],
            growth: calculateGrowth(FINANCIAL_DATA.expenses.depreciation),
            trendData: YEARS.map((year, i) => ({ year, value: FINANCIAL_DATA.expenses.depreciation[i] })),
            categoryType: 'expense' as const,
            insights: [
                `Depreciation growing ${calculateGrowth(FINANCIAL_DATA.expenses.depreciation)}% YoY`,
                `Reflects ongoing capital investment in infrastructure`,
                `${(FINANCIAL_DATA.expenses.depreciation[4] / totals.totalRevenue[4] * 100).toFixed(1)}% of revenue - standard for sector`,
                `Steady increase indicates asset base expansion`,
            ],
        },
        {
            title: 'Category 8: Total Expenses',
            value: totals.totalExpenses[4],
            growth: calculateGrowth(totals.totalExpenses),
            trendData: YEARS.map((year, i) => ({ year, value: totals.totalExpenses[i] })),
            details: [
                { label: 'Total Salaries', values: totals.totalSalaries },
                { label: 'Scholarships', values: FINANCIAL_DATA.expenses.scholarships },
                { label: 'Operating Expenses', values: totals.totalOperating },
                { label: 'Depreciation', values: FINANCIAL_DATA.expenses.depreciation },
            ],
            categoryType: 'expense' as const,
            insights: [
                `Expense ratio: ${(totals.totalExpenses[4] / totals.totalRevenue[4] * 100).toFixed(1)}% of revenue`,
                `Efficient cost management with ${calculateGrowth(totals.totalExpenses)}% YoY decrease`,
                `Operating margin improved significantly year-over-year`,
                `Cost structure optimization yielding positive results`,
            ],
        },
        {
            title: 'Category 9: Net Surplus / (Deficit)',
            value: totals.netSurplus[4],
            growth: calculateGrowth(totals.netSurplus),
            trendData: YEARS.map((year, i) => ({ year, value: totals.netSurplus[i] })),
            categoryType: 'net' as const,
            insights: [
                `Strong surplus of ${formatCurrency(totals.netSurplus[4])} in 2023-24`,
                `Operating margin: ${(totals.netSurplus[4] / totals.totalRevenue[4] * 100).toFixed(1)}% - healthy performance`,
                `Best performance since 2020-21's ${formatCurrency(Math.max(...totals.netSurplus))} peak`,
                `Financial sustainability improved with positive 5-year trend`,
            ],
        },
    ];

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header
                title="P&L Natural Account Analysis"
                subtitle="5-Year Financial Performance by Natural Classification (2019-20 to 2023-24)"
            />

            {/* Category Selector */}
            <div className="mb-6">
                <CategorySelector
                    categories={categories}
                    selectedIndex={expandedCard}
                    onSelect={setExpandedCard}
                    colors={colors}
                />
            </div>

            {/* Summary Table - Show when no category selected */}
            {expandedCard === null && (
                <div className="p-6 rounded-xl mb-6" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                        All Categories Summary
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>#</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>Category</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>Type</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>2023-24 Value</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>YoY Change</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>5-Yr CAGR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, idx) => {
                                    const cagr = calculateCAGR(cat.trendData.map((d: any) => d.value)).toFixed(1);
                                    const catColor = cat.categoryType === 'revenue' ? colors.secondary1 : cat.categoryType === 'expense' ? colors.primary1 : colors.secondary2;

                                    return (
                                        <tr
                                            key={idx}
                                            className="transition-all hover:opacity-80 cursor-pointer"
                                            onClick={() => setExpandedCard(idx)}
                                            style={{ borderBottom: `1px solid ${colors.border}` }}
                                        >
                                            <td className="py-3 px-4">
                                                <div
                                                    className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                                                    style={{ backgroundColor: catColor + '20', color: catColor }}
                                                >
                                                    {idx + 1}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                                                    {cat.title.replace(/Category \d+: /, '')}
                                                </p>
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                <span
                                                    className="text-xs font-medium px-2 py-1 rounded"
                                                    style={{
                                                        backgroundColor: catColor + '20',
                                                        color: catColor
                                                    }}
                                                >
                                                    {cat.categoryType === 'revenue' ? 'Revenue' : cat.categoryType === 'expense' ? 'Expense' : 'Net'}
                                                </span>
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                <p className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                                                    {formatCurrency(cat.value)}
                                                </p>
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    {parseFloat(cat.growth) >= 0 ? <TrendingUp size={14} style={{ color: colors.successText }} /> : <TrendingDown size={14} style={{ color: colors.dangerText }} />}
                                                    <span
                                                        className="text-sm font-bold"
                                                        style={{ color: parseFloat(cat.growth) >= 0 ? colors.successText : colors.dangerText }}
                                                    >
                                                        {parseFloat(cat.growth) >= 0 ? '+' : ''}{cat.growth}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                                    {cagr}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail View - Show when category selected */}
            {expandedCard !== null && (
                <DetailView
                    category={categories[expandedCard]}
                    colors={colors}
                />
            )}
        </div>
    );
}
