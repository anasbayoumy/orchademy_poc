'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { BarChart3, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

const YEARS = ['2019-20', '2020-21', '2021-22', '2022-23', '2023-24'];

// Helper Functions
const formatCurrency = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
};

const calculateGrowth = (current: number, previous: number): string => {
    return (((current - previous) / previous) * 100).toFixed(1);
};

const calculateCAGR = (values: number[]): number => {
    const start = values[0];
    const end = values[values.length - 1];
    const years = values.length - 1;
    return ((Math.pow(end / start, 1 / years) - 1) * 100);
};

// Financial Data
const FINANCIAL_DATA = {
    // Revenue Components
    tuitionRevenue: [53210997, 42062036, 49823674, 49006215, 47449161],
    feesRevenue: [3837373, 2605082, 4903966, 3115160, 4497736],
    grantsRevenue: [3960077, 3362637, 3970317, 3763630, 4978918],
    otherRevenue: [2133343, 1959062, 2080707, 1270559, 1332414],
    totalOtherRevenue: [9930793, 7926781, 10954990, 8149349, 10809068],
    totalRevenue: [63141790, 49988817, 60778664, 57155564, 58258229],
    
    // Expense Components
    instructionCost: [20959493, 16934372, 20941728, 20828313, 17538533],
    scholarships: [5459023, 3585401, 3376458, 4913112, 4107891],
    research: [1968009, 1275117, 2625633, 1717236, 2941950],
    operationsMaintenance: [8692048, 5892050, 8467069, 6873943, 7221634],
    studentServices: [5896576, 4185001, 6050164, 5325047, 5689170],
    academicSupport: [8266921, 6215334, 8393543, 7878063, 7764747],
    institutionalSupport: [8704172, 6349979, 9121935, 7960093, 8509646],
    auxiliary: [1488201, 1148641, 1558985, 1401226, 1532916],
    totalExpenses: [61434443, 45585895, 60535515, 56897033, 55306487],
    
    // Calculated Fields
    grossProfitCore: [26792481, 21542263, 25505488, 23264790, 25802737],
    netSurplus: [1707347, 4402922, 243149, 258531, 2951742],
};

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
                        <p className="text-xs font-semibold text-white">View All Categories</p>
                    </div>
                    
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            className="px-4 py-3 cursor-pointer hover:opacity-80 transition-all border-t"
                            style={{ 
                                borderColor: colors.border,
                                backgroundColor: selectedIndex === idx ? colors.accentBg : 'transparent'
                            }}
                            onClick={() => {
                                onSelect(idx);
                                setIsOpen(false);
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                    {cat.title.replace(/Category \d+: /, '')}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                                        {formatCurrency(cat.value)}
                                    </span>
                                    <span 
                                        className="text-xs px-2 py-0.5 rounded"
                                        style={{ 
                                            backgroundColor: parseFloat(cat.growth) >= 0 ? colors.successBg : colors.dangerBg,
                                            color: parseFloat(cat.growth) >= 0 ? colors.successText : colors.dangerText
                                        }}
                                    >
                                        {parseFloat(cat.growth) >= 0 ? '+' : ''}{cat.growth}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
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
            solid: colors.secondary3, 
            light: colors.warningBg 
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
        </div>
    );
}

export default function PLFunctionalPage() {
    const colors = useColors();
    const { isRTL } = useLanguage();
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const [expandedRevenue, setExpandedRevenue] = useState(false);
    const [expandedExpenses, setExpandedExpenses] = useState(false);
    const [expandedNetSurplus, setExpandedNetSurplus] = useState(false);

    // Calculate current year values (2023-24, last index)
    const currentIndex = 4;
    const previousIndex = 3;

    const categories = [
        {
            title: 'Category 1: Tuition Revenue',
            value: FINANCIAL_DATA.tuitionRevenue[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.tuitionRevenue[currentIndex], FINANCIAL_DATA.tuitionRevenue[previousIndex]),
            categoryType: 'revenue',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.tuitionRevenue[idx] })),
            insights: [
                'Primary revenue source showing -3.2% decline from prior year',
                'Enrollment trends directly impact tuition revenue performance',
                'Competitive pricing strategies needed to maintain market position'
            ],
        },
        {
            title: 'Category 2: Total Other Revenue',
            value: FINANCIAL_DATA.totalOtherRevenue[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.totalOtherRevenue[currentIndex], FINANCIAL_DATA.totalOtherRevenue[previousIndex]),
            categoryType: 'revenue',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.totalOtherRevenue[idx] })),
            insights: [
                'Includes fees, grants, and other revenue streams totaling $10.8M',
                'Strong 32.6% growth diversifying institutional income',
                'Reduced dependency on tuition through multiple revenue channels'
            ],
        },
        {
            title: 'Category 3: Total Revenue',
            value: FINANCIAL_DATA.totalRevenue[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.totalRevenue[currentIndex], FINANCIAL_DATA.totalRevenue[previousIndex]),
            categoryType: 'revenue',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.totalRevenue[idx] })),
            insights: [
                'Combined revenue of $58.3M showing 1.9% growth',
                'Balanced revenue mix with 81% tuition and 19% other sources',
                'Steady revenue trajectory supporting operational stability'
            ],
        },
        {
            title: 'Category 4: Instruction Cost',
            value: FINANCIAL_DATA.instructionCost[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.instructionCost[currentIndex], FINANCIAL_DATA.instructionCost[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.instructionCost[idx] })),
            insights: [
                'Direct teaching costs decreased 15.8% year-over-year',
                'Faculty optimization and digital learning integration driving efficiency',
                'Maintaining quality while reducing cost per student'
            ],
        },
        {
            title: 'Category 5: Scholarships & Financial Aid',
            value: FINANCIAL_DATA.scholarships[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.scholarships[currentIndex], FINANCIAL_DATA.scholarships[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.scholarships[idx] })),
            insights: [
                'Financial aid decreased 16.4%, impacting affordability',
                'Merit and need-based aid mix requires strategic review',
                'Scholarship strategy affects enrollment and student diversity'
            ],
        },
        {
            title: 'Category 6: Research',
            value: FINANCIAL_DATA.research[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.research[currentIndex], FINANCIAL_DATA.research[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.research[idx] })),
            insights: [
                'Research spending surged 71.3% demonstrating increased focus',
                'Grant-funded research activity expanded significantly',
                'Building research capacity for institutional reputation'
            ],
        },
        {
            title: 'Category 7: Operations & Maintenance',
            value: FINANCIAL_DATA.operationsMaintenance[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.operationsMaintenance[currentIndex], FINANCIAL_DATA.operationsMaintenance[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.operationsMaintenance[idx] })),
            insights: [
                'Facilities costs increased 5.1% with campus expansion',
                'Energy efficiency and deferred maintenance need attention',
                'Balancing infrastructure investment with operational costs'
            ],
        },
        {
            title: 'Category 8: Student Services',
            value: FINANCIAL_DATA.studentServices[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.studentServices[currentIndex], FINANCIAL_DATA.studentServices[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.studentServices[idx] })),
            insights: [
                'Student support services rose 6.8% enhancing experience',
                'Counseling, career services, and wellness programs expanded',
                'Student retention linked to comprehensive support services'
            ],
        },
        {
            title: 'Category 9: Academic Support',
            value: FINANCIAL_DATA.academicSupport[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.academicSupport[currentIndex], FINANCIAL_DATA.academicSupport[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.academicSupport[idx] })),
            insights: [
                'Academic support declined 1.4% through efficiency gains',
                'Library, IT, and tutoring services optimized digitally',
                'Technology investments reducing per-student support costs'
            ],
        },
        {
            title: 'Category 10: Institutional Support',
            value: FINANCIAL_DATA.institutionalSupport[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.institutionalSupport[currentIndex], FINANCIAL_DATA.institutionalSupport[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.institutionalSupport[idx] })),
            insights: [
                'Administrative costs grew 6.9% with regulatory compliance',
                'Finance, HR, and governance functions expanded moderately',
                'Administrative efficiency benchmarking against peer institutions'
            ],
        },
        {
            title: 'Category 11: Auxiliary & Other Services',
            value: FINANCIAL_DATA.auxiliary[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.auxiliary[currentIndex], FINANCIAL_DATA.auxiliary[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.auxiliary[idx] })),
            insights: [
                'Auxiliary operations increased 9.4% with service expansion',
                'Bookstore, dining, and housing services self-sustaining',
                'Ancillary services contribute to student satisfaction'
            ],
        },
        {
            title: 'Category 12: Total Expenses',
            value: FINANCIAL_DATA.totalExpenses[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.totalExpenses[currentIndex], FINANCIAL_DATA.totalExpenses[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.totalExpenses[idx] })),
            insights: [
                'Total operating expenses of $55.3M decreased 2.8%',
                'Cost control initiatives delivering measurable results',
                'Improved efficiency across all functional areas'
            ],
        },
        {
            title: 'Category 13: Net Surplus / Deficit',
            value: FINANCIAL_DATA.netSurplus[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.netSurplus[currentIndex], FINANCIAL_DATA.netSurplus[previousIndex]),
            categoryType: 'net',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.netSurplus[idx] })),
            insights: [
                'Net result dramatically improved 1041% to positive surplus',
                'Financial turnaround driven by revenue growth and cost control',
                'Sustainable operating model established for future investment'
            ],
        },
    ];

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title="P&L Functional Classification Analysis" 
                subtitle="5-Year Financial Performance by Functional Category (2019-20 to 2023-24)" 
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

            {/* Detailed P&L Breakdown */}
            {expandedCard === null && (
                <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Section */}
                    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.secondary1}` }}>
                        <button
                            onClick={() => setExpandedRevenue(!expandedRevenue)}
                            className="w-full p-6 flex items-center justify-between transition-all hover:opacity-80"
                            style={{ borderBottom: expandedRevenue ? `1px solid ${colors.border}` : 'none' }}
                        >
                            <div className="flex items-center gap-3">
                                <TrendingUp size={24} style={{ color: colors.secondary1 }} />
                                <div className="text-left">
                                    <h3 className="text-lg font-bold" style={{ color: colors.secondary1 }}>
                                        Total Revenue
                                    </h3>
                                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                                        2023-24 Performance
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                                        {formatCurrency(FINANCIAL_DATA.totalRevenue[4])}
                                    </p>
                                    <span 
                                        className="text-xs px-2 py-1 rounded font-semibold inline-block mt-1"
                                        style={{ 
                                            backgroundColor: colors.successBg,
                                            color: colors.successText
                                        }}
                                    >
                                        +{calculateGrowth(FINANCIAL_DATA.totalRevenue[4], FINANCIAL_DATA.totalRevenue[3])}% YoY
                                    </span>
                                </div>
                                {expandedRevenue ? <ChevronUp size={20} style={{ color: colors.secondary1 }} /> : <ChevronDown size={20} style={{ color: colors.secondary1 }} />}
                            </div>
                        </button>
                        
                        {expandedRevenue && (
                            <div className="p-6 pt-4 space-y-3">
                                {[
                                    { label: 'Tuition Revenue', values: FINANCIAL_DATA.tuitionRevenue, primary: true },
                                    { label: 'Fees Revenue', values: FINANCIAL_DATA.feesRevenue },
                                    { label: 'Grants Revenue', values: FINANCIAL_DATA.grantsRevenue },
                                    { label: 'Other Revenue', values: FINANCIAL_DATA.otherRevenue },
                                    { label: 'Total Other Revenue', values: FINANCIAL_DATA.totalOtherRevenue, subtotal: true },
                                ].map((item, idx) => {
                                    const current = item.values[4];
                                    const previous = item.values[3];
                                    const growth = ((current - previous) / previous * 100).toFixed(1);
                                    const isPositive = parseFloat(growth) >= 0;
                                    
                                    return (
                                        <div 
                                            key={idx}
                                            className="p-3 rounded-lg transition-all hover:shadow-sm"
                                            style={{ 
                                                backgroundColor: item.subtotal ? colors.isDark ? '#1e293b' : '#f1f5f9' : colors.isDark ? '#0f172a' : '#f8fafc',
                                                borderLeft: item.primary ? `4px solid ${colors.secondary1}` : 'none'
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span 
                                                    className="text-sm font-semibold" 
                                                    style={{ color: colors.textPrimary }}
                                                >
                                                    {item.label}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span 
                                                        className="text-sm font-bold" 
                                                        style={{ color: colors.textPrimary }}
                                                    >
                                                        {formatCurrency(current)}
                                                    </span>
                                                    <span 
                                                        className="text-xs px-1.5 py-0.5 rounded font-semibold"
                                                        style={{ 
                                                            backgroundColor: isPositive ? colors.successBg : colors.dangerBg,
                                                            color: isPositive ? colors.successText : colors.dangerText
                                                        }}
                                                    >
                                                        {isPositive ? '+' : ''}{growth}%
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* 5-Year Mini Chart */}
                                            <div className="flex items-end gap-1 h-12">
                                                {item.values.map((val, vIdx) => {
                                                    const maxVal = Math.max(...item.values);
                                                    const minVal = Math.min(...item.values);
                                                    const height = ((val - minVal) / (maxVal - minVal)) * 100;
                                                    const isCurrent = vIdx === 4;
                                                    
                                                    return (
                                                        <div key={vIdx} className="flex-1 flex flex-col items-center justify-end">
                                                            <div 
                                                                className="w-full rounded-t transition-all"
                                                                style={{ 
                                                                    height: `${Math.max(height, 10)}%`,
                                                                    backgroundColor: isCurrent ? colors.secondary1 : colors.border,
                                                                    opacity: isCurrent ? 1 : 0.4
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Expenses Section */}
                    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.primary1}` }}>
                        <button
                            onClick={() => setExpandedExpenses(!expandedExpenses)}
                            className="w-full p-6 flex items-center justify-between transition-all hover:opacity-80"
                            style={{ borderBottom: expandedExpenses ? `1px solid ${colors.border}` : 'none' }}
                        >
                            <div className="flex items-center gap-3">
                                <TrendingDown size={24} style={{ color: colors.primary1 }} />
                                <div className="text-left">
                                    <h3 className="text-lg font-bold" style={{ color: colors.primary1 }}>
                                        Total Expenses
                                    </h3>
                                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                                        2023-24 Performance
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                                        {formatCurrency(FINANCIAL_DATA.totalExpenses[4])}
                                    </p>
                                    <span 
                                        className="text-xs px-2 py-1 rounded font-semibold inline-block mt-1"
                                        style={{ 
                                            backgroundColor: colors.successBg,
                                            color: colors.successText
                                        }}
                                    >
                                        {calculateGrowth(FINANCIAL_DATA.totalExpenses[4], FINANCIAL_DATA.totalExpenses[3])}% YoY
                                    </span>
                                </div>
                                {expandedExpenses ? <ChevronUp size={20} style={{ color: colors.primary1 }} /> : <ChevronDown size={20} style={{ color: colors.primary1 }} />}
                            </div>
                        </button>
                        
                        {expandedExpenses && (
                            <div className="p-6 pt-4 space-y-3">
                                {[
                                    { label: 'Instruction Cost', values: FINANCIAL_DATA.instructionCost, primary: true },
                                    { label: 'Scholarships & Aid', values: FINANCIAL_DATA.scholarships },
                                    { label: 'Research', values: FINANCIAL_DATA.research },
                                    { label: 'Operations & Maintenance', values: FINANCIAL_DATA.operationsMaintenance },
                                    { label: 'Student Services', values: FINANCIAL_DATA.studentServices },
                                    { label: 'Academic Support', values: FINANCIAL_DATA.academicSupport },
                                    { label: 'Institutional Support', values: FINANCIAL_DATA.institutionalSupport },
                                    { label: 'Auxiliary / Other', values: FINANCIAL_DATA.auxiliary },
                                ].map((item, idx) => {
                                    const current = item.values[4];
                                    const previous = item.values[3];
                                    const growth = ((current - previous) / previous * 100).toFixed(1);
                                    const isPositive = parseFloat(growth) >= 0;
                                    
                                    return (
                                        <div 
                                            key={idx}
                                            className="p-3 rounded-lg transition-all hover:shadow-sm"
                                            style={{ 
                                                backgroundColor: colors.isDark ? '#0f172a' : '#f8fafc',
                                                borderLeft: item.primary ? `4px solid ${colors.primary1}` : 'none'
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span 
                                                    className="text-sm font-semibold" 
                                                    style={{ color: colors.textPrimary }}
                                                >
                                                    {item.label}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span 
                                                        className="text-sm font-bold" 
                                                        style={{ color: colors.textPrimary }}
                                                    >
                                                        {formatCurrency(current)}
                                                    </span>
                                                    <span 
                                                        className="text-xs px-1.5 py-0.5 rounded font-semibold"
                                                        style={{ 
                                                            backgroundColor: isPositive ? colors.dangerBg : colors.successBg,
                                                            color: isPositive ? colors.dangerText : colors.successText
                                                        }}
                                                    >
                                                        {isPositive ? '+' : ''}{growth}%
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* 5-Year Mini Chart */}
                                            <div className="flex items-end gap-1 h-12">
                                                {item.values.map((val, vIdx) => {
                                                    const maxVal = Math.max(...item.values);
                                                    const minVal = Math.min(...item.values);
                                                    const height = ((val - minVal) / (maxVal - minVal)) * 100;
                                                    const isCurrent = vIdx === 4;
                                                    
                                                    return (
                                                        <div key={vIdx} className="flex-1 flex flex-col items-center justify-end">
                                                            <div 
                                                                className="w-full rounded-t transition-all"
                                                                style={{ 
                                                                    height: `${Math.max(height, 10)}%`,
                                                                    backgroundColor: isCurrent ? colors.primary1 : colors.border,
                                                                    opacity: isCurrent ? 1 : 0.4
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Net Surplus/Deficit Banner */}
            {expandedCard === null && (
                <div 
                    className="rounded-xl mb-6 overflow-hidden"
                    style={{ 
                        backgroundColor: colors.cardBg,
                        border: `2px solid ${colors.secondary3}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                >
                    <button
                        onClick={() => setExpandedNetSurplus(!expandedNetSurplus)}
                        className="w-full p-8 flex items-center justify-between transition-all hover:opacity-80"
                        style={{ 
                            backgroundColor: colors.secondary3,
                            borderBottom: expandedNetSurplus ? `1px solid ${colors.border}` : 'none'
                        }}
                    >
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-white mb-2">
                                Net Surplus / Deficit (2023-24)
                            </p>
                            <p className="text-5xl font-bold text-white mb-2">
                                {formatCurrency(FINANCIAL_DATA.netSurplus[4])}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white opacity-75">
                                    +{calculateGrowth(FINANCIAL_DATA.netSurplus[4], FINANCIAL_DATA.netSurplus[3])}% YoY
                                </span>
                                <span className="text-xs text-white opacity-50">•</span>
                                <span className="text-xs text-white opacity-75">
                                    {calculateCAGR(FINANCIAL_DATA.netSurplus).toFixed(1)}% CAGR
                                </span>
                            </div>
                        </div>
                        {expandedNetSurplus ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
                    </button>
                    
                    {expandedNetSurplus && (
                        <div className="p-8" style={{ backgroundColor: colors.cardBg }}>
                            <div className="grid grid-cols-5 gap-4 mb-6">
                                {FINANCIAL_DATA.netSurplus.map((val, idx) => {
                                    const prevVal = idx > 0 ? FINANCIAL_DATA.netSurplus[idx - 1] : val;
                                    const growth = idx > 0 ? ((val - prevVal) / prevVal * 100).toFixed(1) : '0';
                                    const isCurrent = idx === 4;
                                    
                                    return (
                                        <div 
                                            key={idx}
                                            className="p-4 rounded-lg"
                                            style={{ 
                                                backgroundColor: isCurrent ? colors.secondary3 + '20' : colors.isDark ? '#0f172a' : '#f8fafc',
                                                border: isCurrent ? `2px solid ${colors.secondary3}` : `1px solid ${colors.border}`
                                            }}
                                        >
                                            <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                                                {YEARS[idx]}
                                            </p>
                                            <p 
                                                className="text-lg font-bold mb-1" 
                                                style={{ color: isCurrent ? colors.secondary3 : colors.textPrimary }}
                                            >
                                                {formatCurrency(val)}
                                            </p>
                                            {idx > 0 && (
                                                <div className="flex items-center gap-1">
                                                    {parseFloat(growth) >= 0 ? <TrendingUp size={12} style={{ color: colors.successText }} /> : <TrendingDown size={12} style={{ color: colors.dangerText }} />}
                                                    <span 
                                                        className="text-xs font-semibold"
                                                        style={{ color: parseFloat(growth) >= 0 ? colors.successText : colors.dangerText }}
                                                    >
                                                        {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Visual Bar Chart */}
                            <div className="p-6 rounded-lg" style={{ backgroundColor: colors.isDark ? '#0f172a' : '#f8fafc' }}>
                                <p className="text-sm font-semibold mb-4" style={{ color: colors.textPrimary }}>
                                    5-Year Trend
                                </p>
                                <div className="flex items-end justify-between gap-3 relative" style={{ height: '250px' }}>
                                    {FINANCIAL_DATA.netSurplus.map((val, idx) => {
                                        const maxVal = Math.max(...FINANCIAL_DATA.netSurplus);
                                        const minVal = Math.min(...FINANCIAL_DATA.netSurplus);
                                        const percentage = ((val - minVal) / (maxVal - minVal)) * 100;
                                        const height = Math.max(percentage * 1.8, 30);
                                        const isCurrent = idx === 4;
                                        
                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                                <div className="text-center mb-1">
                                                    <p className="text-xs font-bold" style={{ color: isCurrent ? colors.secondary3 : colors.textPrimary }}>
                                                        {formatCurrency(val)}
                                                    </p>
                                                </div>
                                                <div className="w-full flex flex-col items-center justify-end" style={{ height: '180px' }}>
                                                    <div 
                                                        className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                                                        style={{ 
                                                            height: `${height}px`,
                                                            backgroundColor: isCurrent ? colors.secondary3 : colors.secondary3,
                                                            opacity: isCurrent ? 1 : 0.4,
                                                            minHeight: '30px'
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-xs font-medium mt-1" style={{ color: colors.textSecondary }}>
                                                    {YEARS[idx]}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

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
                                    const catColor = cat.categoryType === 'revenue' ? colors.secondary1 : 
                                                     cat.categoryType === 'expense' ? colors.primary1 : colors.secondary3;
                                    
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
                                                    {cat.categoryType === 'revenue' ? 'Revenue' : 
                                                     cat.categoryType === 'expense' ? 'Expense' : 'Net'}
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
