'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { BarChart3, TrendingUp, TrendingDown, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight, Activity, PieChart, Wallet } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

const YEARS = ['19-20', '20-21', '21-22', '22-23', '23-24'];
const YEAR_LABELS = ['2019-20', '2020-21', '2021-22', '2022-23', '2023-24'];

// Helper Functions
const formatCurrency = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
};

// Compact formatter for chart labels (no $)
const formatCompact = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return `${num.toFixed(0)}`;
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

// Financial Data - P&L Functional (12 categories, 5 years: 19-20 → 23-24)
const FINANCIAL_DATA = {
    tuitionRevenue: [53210997, 42062036, 49823674, 49006215, 47449161],
    instructionCost: [20959493, 16934372, 20941728, 20828313, 17538533],
    scholarships: [5459023, 3585401, 3376458, 4913112, 4107891],
    grossProfitCore: [26792481, 21542263, 25505488, 23264790, 25802737],
    totalOtherRevenue: [9930793, 7926781, 10954990, 8149349, 10809068],
    research: [1968009, 1275117, 2625633, 1717236, 2941950],
    operationsMaintenance: [8692048, 5892050, 8467069, 6873943, 7221634],
    studentServices: [5896576, 4185001, 6050164, 5325047, 5689170],
    academicSupport: [8266921, 6215334, 8393543, 7878063, 7764747],
    institutionalSupport: [8704172, 6349979, 9121935, 7960093, 8509646],
    auxiliary: [1488201, 1148641, 1558985, 1401226, 1532916],
    netSurplus: [1707347, 4402922, 243149, 258531, 2951742],
};

interface CustomizableCardProps {
    category: any;
    colors: any;
    cardNumber: number;
    onSelectCategory: (idx: number) => void;
    categories: any[];
    selectedCategoryIndex: number;
}

function CustomizableCard({ category, colors, cardNumber, onSelectCategory, categories, selectedCategoryIndex }: CustomizableCardProps) {
    const categoryColors: Record<'revenue' | 'expense' | 'net', { text: string; bg: string; icon: any }> = {
        revenue: { 
            text: colors.secondary1, 
            bg: colors.secondary1 + '15', 
            icon: Wallet
        },
        expense: { 
            text: colors.primary1, 
            bg: colors.primary1 + '15',
            icon: PieChart
        },
        net: { 
            text: colors.secondary3, 
            bg: colors.secondary3 + '15',
            icon: Activity
        },
    };
    
    const style = categoryColors[category.categoryType as 'revenue' | 'expense' | 'net'];
    const Icon = style.icon;
    const growthNum = parseFloat(category.growth);
    const isPositive = growthNum >= 0;

    // --- Chart Logic ---
    const maxValue = Math.max(...category.trendData.map((d: any) => d.value));
    const minValue = Math.min(...category.trendData.map((d: any) => d.value));
    
    // Increased height to accommodate labels
    const chartHeight = 100; 
    const chartWidth = 300;
    const paddingX = 20; // Padding to keep dots away from edges
    const paddingY = 20; // Padding for labels
    
    const points = category.trendData.map((item: any, idx: number) => {
        const x = paddingX + (idx / (category.trendData.length - 1)) * (chartWidth - (paddingX * 2));
        const range = maxValue - minValue || 1;
        // Invert Y axis because SVG 0 is top
        const normalizedValue = ((item.value - minValue) / range);
        const y = (chartHeight - paddingY) - (normalizedValue * (chartHeight - (paddingY * 2)));
        return { x, y, value: item.value, year: YEARS[idx] };
    });
    
    const linePath = points.map((p: any, i: number) => 
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');

    return (
        <div 
            className="flex flex-col h-full rounded-lg border bg-white shadow-sm transition-all"
            style={{ 
                backgroundColor: colors.cardBg,
                borderColor: isPositive ? colors.successText + '40' : colors.primary1 + '40',
                borderWidth: '2px'
            }}
        >
            {/* Header: Dropdown & Icon */}
            <div className="p-4 flex items-start justify-between gap-3 border-b" style={{ 
                borderColor: isPositive ? colors.successText + '20' : colors.primary1 + '20',
                backgroundColor: isPositive ? colors.successBg + '30' : colors.primary1 + '05'
            }}>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                         <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: style.text }}>
                             {cardNumber}
                         </span>
                         <span className="text-[10px] font-bold uppercase tracking-wider opacity-50" style={{ color: colors.textSecondary }}>
                            Metric
                        </span>
                    </div>
                    
                    <div className="relative group/select">
                        <select 
                            value={selectedCategoryIndex}
                            onChange={(e) => onSelectCategory(parseInt(e.target.value))}
                            className="w-full bg-transparent text-sm font-bold appearance-none cursor-pointer pr-6 outline-none hover:opacity-70 transition-opacity truncate"
                            style={{ color: colors.textPrimary }}
                        >
                            {categories.map((cat, idx) => (
                                <option key={idx} value={idx}>{cat.title.replace(/Category \d+: /, '')}</option>
                            ))}
                        </select>
                        <ChevronDown 
                            size={14} 
                            className="absolute right-0 top-1 pointer-events-none opacity-50"
                            style={{ color: colors.textPrimary }}
                        />
                    </div>
                </div>
                <div 
                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 border"
                    style={{ 
                        backgroundColor: isPositive ? colors.successBg : colors.primary1 + '15',
                        borderColor: isPositive ? colors.successText + '40' : colors.primary1 + '40',
                        color: isPositive ? colors.successText : colors.primary1
                    }}
                >
                    <Icon size={16} strokeWidth={2.5} />
                </div>
            </div>

            {/* Main Metric */}
            <div className="p-4 pb-0">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold tracking-tight" style={{ color: colors.textPrimary }}>
                        {formatCurrency(category.value)}
                    </h2>
                    <div 
                        className="flex items-center gap-1 text-xs font-bold"
                        style={{ 
                            color: isPositive ? colors.successText : colors.dangerText
                        }}
                    >
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{Math.abs(growthNum)}%</span>
                    </div>
                </div>
                <p className="text-xs mt-1 opacity-60" style={{ color: colors.textSecondary }}>Current Year Performance</p>
            </div>

            {/* Visuals Chart */}
            <div className="mt-4 px-2 pb-2 flex-1">
                <div className="relative w-full" style={{ height: '120px' }}>
                     <svg 
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                        preserveAspectRatio="none"
                        className="w-full h-full overflow-visible"
                    >
                        {/* Grid Lines */}
                        <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke={colors.border} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                        <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke={colors.border} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

                        {/* Line */}
                        <path 
                            d={linePath} 
                            fill="none" 
                            stroke={style.text} 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        />
                        
                        {/* Data Points & Labels */}
                        {points.map((p: any, i: number) => (
                            <g key={i} className="group/point">
                                {/* Connector Line (optional, for visual guide) */}
                                <line 
                                    x1={p.x} 
                                    y1={p.y} 
                                    x2={p.x} 
                                    y2={chartHeight - paddingY} 
                                    stroke={style.text} 
                                    strokeWidth="1" 
                                    opacity="0.1" 
                                />
                                
                                {/* Point */}
                                <circle 
                                    cx={p.x} 
                                    cy={p.y} 
                                    r="3.5" 
                                    fill={colors.cardBg} 
                                    stroke={style.text} 
                                    strokeWidth="2" 
                                />

                                {/* Value Label (Visual Number) */}
                                <text 
                                    x={p.x} 
                                    y={p.y - 12} 
                                    textAnchor="middle" 
                                    fontSize="10" 
                                    fontWeight="bold"
                                    fill={style.text}
                                >
                                    {formatCompact(p.value)}
                                </text>
                                
                                {/* Year Label */}
                                <text 
                                    x={p.x} 
                                    y={chartHeight - 2} 
                                    textAnchor="middle" 
                                    fontSize="9" 
                                    fill={colors.textSecondary}
                                    className="opacity-60"
                                >
                                    {p.year}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>
            
            {/* Footer */}
            <div 
                className="px-4 py-2 text-[10px] font-medium border-t flex items-center justify-between"
                style={{ 
                    borderColor: isPositive ? colors.successText + '20' : colors.primary1 + '20',
                    backgroundColor: isPositive ? colors.successBg + '20' : colors.primary1 + '05',
                    color: colors.textSecondary 
                }}
            >
                <span>5-Year Trend</span>
                <span className="opacity-50">Visuals incl. data points</span>
            </div>
        </div>
    );
}

// ... [DetailView and rest of the file remains standard] ...
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
                style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.primary1}` }}
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
                        onClick={() => { onSelect(null); setIsOpen(false); }}
                    >
                        <p className="text-xs font-semibold text-white">View All Categories</p>
                    </div>
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            className="px-4 py-3 cursor-pointer hover:opacity-80 transition-all border-t"
                            style={{ borderColor: colors.border, backgroundColor: selectedIndex === idx ? colors.accentBg : 'transparent' }}
                            onClick={() => { onSelect(idx); setIsOpen(false); }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{cat.title.replace(/Category \d+: /, '')}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>{formatCurrency(cat.value)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function DetailView({ category, colors, yearLabel }: { category: any; colors: any; yearLabel: string }) {
    const categoryColors: Record<'revenue' | 'expense' | 'net', { solid: string; light: string }> = {
        revenue: { solid: colors.secondary1, light: colors.successBg },
        expense: { solid: colors.primary1, light: colors.accentBg },
        net: { solid: colors.secondary3, light: colors.warningBg },
    };
    const catColor = categoryColors[category.categoryType as 'revenue' | 'expense' | 'net'];
    const maxValue = Math.max(...category.trendData.map((d: any) => d.value));
    const minValue = Math.min(...category.trendData.map((d: any) => d.value));
    
    return (
        <div className="animate-fade-in space-y-6">
            <div className="relative overflow-hidden rounded-lg p-6" style={{ backgroundColor: catColor.solid }}>
                <div className="relative z-10">
                    <h2 className="text-sm font-semibold text-white opacity-90">{category.title}</h2>
                    <p className="text-4xl font-bold text-white mb-2">{formatCurrency(category.value)}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-white text-sm opacity-90">{yearLabel}</span>
                        <span className="px-3 py-1 bg-white rounded text-xs font-bold" style={{ color: catColor.solid }}>
                            {parseFloat(category.growth) >= 0 ? '+' : ''}{category.growth}% YoY
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* 5-Year Trend Bar Chart */}
                <div className="xl:col-span-2 p-6 rounded-lg border shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <h3 className="text-base font-bold mb-6" style={{ color: colors.textPrimary }}>5-Year Trend</h3>
                    <div className="relative h-64 flex items-end justify-between gap-3">
                        {category.trendData.map((item: any, idx: number) => {
                            const height = Math.max(((item.value - minValue) / (maxValue - minValue || 1)) * 100, 5);
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <div 
                                        className="w-full rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                        style={{ height: `${height * 2}px`, backgroundColor: catColor.solid }}
                                    />
                                    <p className="text-xs" style={{ color: colors.textSecondary }}>{item.year}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Key Insights */}
                <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h3 className="text-base font-bold mb-4" style={{ color: colors.textPrimary }}>
                        Key Insights
                    </h3>
                    <div className="space-y-2">
                        {(category.insights || []).map((insight: string, idx: number) => (
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
    const [selectedYearIndex, setSelectedYearIndex] = useState(4); // 2023-24
    const [card1Category, setCard1Category] = useState(0);
    const [card2Category, setCard2Category] = useState(3);
    const [card3Category, setCard3Category] = useState(11);

    const currentIndex = selectedYearIndex;
    const previousIndex = Math.max(0, selectedYearIndex - 1);

    // Compute totals for % context
    const totalRevenue = FINANCIAL_DATA.tuitionRevenue[currentIndex] + FINANCIAL_DATA.totalOtherRevenue[currentIndex];
    const totalExpenses = FINANCIAL_DATA.instructionCost[currentIndex] + FINANCIAL_DATA.scholarships[currentIndex] +
        FINANCIAL_DATA.research[currentIndex] + FINANCIAL_DATA.operationsMaintenance[currentIndex] +
        FINANCIAL_DATA.studentServices[currentIndex] + FINANCIAL_DATA.academicSupport[currentIndex] +
        FINANCIAL_DATA.institutionalSupport[currentIndex] + FINANCIAL_DATA.auxiliary[currentIndex];

    const categories = [
        {
            title: 'Category 1: Tuition Revenue',
            value: FINANCIAL_DATA.tuitionRevenue[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.tuitionRevenue[currentIndex], FINANCIAL_DATA.tuitionRevenue[previousIndex]),
            categoryType: 'revenue',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.tuitionRevenue[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.tuitionRevenue).toFixed(1)}%`,
                `Primary revenue source at ${(FINANCIAL_DATA.tuitionRevenue[currentIndex] / totalRevenue * 100).toFixed(1)}% of total revenue`,
                `Peak year was 2019-20 at ${formatCurrency(Math.max(...FINANCIAL_DATA.tuitionRevenue))}`,
                `${parseFloat(calculateGrowth(FINANCIAL_DATA.tuitionRevenue[currentIndex], FINANCIAL_DATA.tuitionRevenue[previousIndex])) >= 0 ? 'Grew' : 'Declined'} ${Math.abs(parseFloat(calculateGrowth(FINANCIAL_DATA.tuitionRevenue[currentIndex], FINANCIAL_DATA.tuitionRevenue[previousIndex])))}% YoY`,
            ],
        },
        {
            title: 'Category 2: Instruction Cost',
            value: FINANCIAL_DATA.instructionCost[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.instructionCost[currentIndex], FINANCIAL_DATA.instructionCost[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.instructionCost[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.instructionCost).toFixed(1)}%`,
                `Largest expense category at ${(FINANCIAL_DATA.instructionCost[currentIndex] / totalExpenses * 100).toFixed(1)}% of total expenses`,
                `Direct teaching and instructional delivery costs`,
                `Direct cost-to-revenue alignment for core academic mission`,
            ],
        },
        {
            title: 'Category 3: Scholarships & Aid',
            value: FINANCIAL_DATA.scholarships[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.scholarships[currentIndex], FINANCIAL_DATA.scholarships[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.scholarships[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.scholarships).toFixed(1)}%`,
                `Financial aid at ${(FINANCIAL_DATA.scholarships[currentIndex] / totalExpenses * 100).toFixed(1)}% of total expenses`,
                `Represents ${(FINANCIAL_DATA.scholarships[currentIndex] / totalRevenue * 100).toFixed(1)}% of total revenue - supports accessibility`,
                `Peak aid in 2022-23 at ${formatCurrency(Math.max(...FINANCIAL_DATA.scholarships))}`,
            ],
        },
        {
            title: 'Category 4: Gross Profit - Core',
            value: FINANCIAL_DATA.grossProfitCore[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.grossProfitCore[currentIndex], FINANCIAL_DATA.grossProfitCore[previousIndex]),
            categoryType: 'revenue',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.grossProfitCore[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.grossProfitCore).toFixed(1)}%`,
                `Core gross margin: tuition minus instruction and scholarships`,
                `At ${(FINANCIAL_DATA.grossProfitCore[currentIndex] / totalRevenue * 100).toFixed(1)}% of total revenue`,
                `Measures direct academic profitability before overhead`,
            ],
        },
        {
            title: 'Category 5: Total Other Revenue',
            value: FINANCIAL_DATA.totalOtherRevenue[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.totalOtherRevenue[currentIndex], FINANCIAL_DATA.totalOtherRevenue[previousIndex]),
            categoryType: 'revenue',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.totalOtherRevenue[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.totalOtherRevenue).toFixed(1)}%`,
                `Fees, grants, and other streams at ${(FINANCIAL_DATA.totalOtherRevenue[currentIndex] / totalRevenue * 100).toFixed(1)}% of revenue`,
                `Diversification reduces tuition dependency`,
                `YoY growth of ${calculateGrowth(FINANCIAL_DATA.totalOtherRevenue[currentIndex], FINANCIAL_DATA.totalOtherRevenue[previousIndex])}%`,
            ],
        },
        {
            title: 'Category 6: Research',
            value: FINANCIAL_DATA.research[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.research[currentIndex], FINANCIAL_DATA.research[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.research[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.research).toFixed(1)}%`,
                `Research spending at ${(FINANCIAL_DATA.research[currentIndex] / totalExpenses * 100).toFixed(1)}% of expenses`,
                `Strategic investment in research capacity`,
                `Strong growth year-over-year reflects research expansion`,
            ],
        },
        {
            title: 'Category 7: Operations & Maintenance',
            value: FINANCIAL_DATA.operationsMaintenance[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.operationsMaintenance[currentIndex], FINANCIAL_DATA.operationsMaintenance[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.operationsMaintenance[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.operationsMaintenance).toFixed(1)}%`,
                `Facilities and O&M at ${(FINANCIAL_DATA.operationsMaintenance[currentIndex] / totalExpenses * 100).toFixed(1)}% of expenses`,
                `Covers utilities, maintenance, and physical plant`,
                `Stable spend indicates efficient facilities management`,
            ],
        },
        {
            title: 'Category 8: Student Services',
            value: FINANCIAL_DATA.studentServices[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.studentServices[currentIndex], FINANCIAL_DATA.studentServices[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.studentServices[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.studentServices).toFixed(1)}%`,
                `Student support at ${(FINANCIAL_DATA.studentServices[currentIndex] / totalExpenses * 100).toFixed(1)}% of expenses`,
                `Admissions, advising, career services, and student life`,
                `Critical for retention and student success`,
            ],
        },
        {
            title: 'Category 9: Academic Support',
            value: FINANCIAL_DATA.academicSupport[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.academicSupport[currentIndex], FINANCIAL_DATA.academicSupport[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.academicSupport[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.academicSupport).toFixed(1)}%`,
                `Academic support at ${(FINANCIAL_DATA.academicSupport[currentIndex] / totalExpenses * 100).toFixed(1)}% of expenses`,
                `Libraries, IT for academics, curriculum development`,
                `Essential for teaching and learning infrastructure`,
            ],
        },
        {
            title: 'Category 10: Institutional Support',
            value: FINANCIAL_DATA.institutionalSupport[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.institutionalSupport[currentIndex], FINANCIAL_DATA.institutionalSupport[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.institutionalSupport[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.institutionalSupport).toFixed(1)}%`,
                `Administrative costs at ${(FINANCIAL_DATA.institutionalSupport[currentIndex] / totalExpenses * 100).toFixed(1)}% of expenses`,
                `Finance, HR, legal, and general administration`,
                `Second-largest expense category in functional view`,
            ],
        },
        {
            title: 'Category 11: Auxiliary / Other',
            value: FINANCIAL_DATA.auxiliary[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.auxiliary[currentIndex], FINANCIAL_DATA.auxiliary[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.auxiliary[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.auxiliary).toFixed(1)}%`,
                `Auxiliary operations at ${(FINANCIAL_DATA.auxiliary[currentIndex] / totalExpenses * 100).toFixed(1)}% of expenses`,
                `Housing, dining, bookstores, and other auxiliary enterprises`,
                `Smallest expense category in functional classification`,
            ],
        },
        {
            title: 'Category 12: Net Surplus/deficit',
            value: FINANCIAL_DATA.netSurplus[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.netSurplus[currentIndex], FINANCIAL_DATA.netSurplus[previousIndex]),
            categoryType: 'net',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.netSurplus[idx] })),
            insights: [
                `5-year CAGR: ${calculateCAGR(FINANCIAL_DATA.netSurplus).toFixed(1)}%`,
                `Operating margin: ${(FINANCIAL_DATA.netSurplus[currentIndex] / totalRevenue * 100).toFixed(1)}% of revenue`,
                `${FINANCIAL_DATA.netSurplus[currentIndex] >= 0 ? 'Surplus' : 'Deficit'} of ${formatCurrency(FINANCIAL_DATA.netSurplus[currentIndex])} in ${YEAR_LABELS[currentIndex]}`,
                `Best year: 2020-21 with ${formatCurrency(Math.max(...FINANCIAL_DATA.netSurplus))} surplus`,
            ],
        },
    ];

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title="P&L Functional Classification Analysis" 
                subtitle="5-Year Financial Performance by Functional Category (2019-20 to 2023-24)" 
            />

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>Financial Year</label>
                    <select
                        value={selectedYearIndex}
                        onChange={(e) => setSelectedYearIndex(Number(e.target.value))}
                        className="px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2"
                        style={{ backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textPrimary }}
                    >
                        {YEAR_LABELS.map((label, idx) => (
                            <option key={idx} value={idx}>{label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <CategorySelector 
                    categories={categories}
                    selectedIndex={expandedCard}
                    onSelect={setExpandedCard}
                    colors={colors}
                />
                </div>
            </div>

            {expandedCard === null && (
                <div className="mb-8">
                    <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                                Key Financial Metrics
                            </h2>
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                                Track your most important financial indicators
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CustomizableCard
                            category={categories[card1Category]}
                            colors={colors}
                            cardNumber={1}
                            onSelectCategory={setCard1Category}
                            categories={categories}
                            selectedCategoryIndex={card1Category}
                        />
                        <CustomizableCard
                            category={categories[card2Category]}
                            colors={colors}
                            cardNumber={2}
                            onSelectCategory={setCard2Category}
                            categories={categories}
                            selectedCategoryIndex={card2Category}
                        />
                        <CustomizableCard
                            category={categories[card3Category]}
                            colors={colors}
                            cardNumber={3}
                            onSelectCategory={setCard3Category}
                            categories={categories}
                            selectedCategoryIndex={card3Category}
                        />
                    </div>
                </div>
            )}

            {expandedCard === null && (
                <div className="p-6 rounded-lg mb-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                        All Categories Summary (12 Categories)
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>#</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>Category</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>Type</th>
                                    {YEAR_LABELS.map((label, colIdx) => (
                                        <th 
                                            key={colIdx} 
                                            className="text-right py-3 px-4 text-xs font-semibold uppercase" 
                                            style={{ 
                                                color: colors.textSecondary,
                                                backgroundColor: colIdx === selectedYearIndex ? colors.accentBg : 'transparent'
                                            }}
                                        >
                                            {label}
                                        </th>
                                    ))}
                                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>YoY Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, idx) => {
                                    const catColor = cat.categoryType === 'revenue' ? colors.secondary1 : 
                                                     cat.categoryType === 'expense' ? colors.primary1 : colors.secondary3;
                                    const values = [
                                        FINANCIAL_DATA.tuitionRevenue,
                                        FINANCIAL_DATA.instructionCost,
                                        FINANCIAL_DATA.scholarships,
                                        FINANCIAL_DATA.grossProfitCore,
                                        FINANCIAL_DATA.totalOtherRevenue,
                                        FINANCIAL_DATA.research,
                                        FINANCIAL_DATA.operationsMaintenance,
                                        FINANCIAL_DATA.studentServices,
                                        FINANCIAL_DATA.academicSupport,
                                        FINANCIAL_DATA.institutionalSupport,
                                        FINANCIAL_DATA.auxiliary,
                                        FINANCIAL_DATA.netSurplus,
                                    ][idx];
                                    const isGrossProfit = idx === 3; // Gross Profit - Core row
                                    
                                    return (
                                        <tr 
                                            key={idx}
                                            className="transition-all hover:opacity-80 cursor-pointer"
                                            onClick={() => setExpandedCard(idx)}
                                            style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: isGrossProfit ? (colors.isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.12)') : undefined }}
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
                                                    style={{ backgroundColor: catColor + '20', color: catColor }}
                                                >
                                                    {cat.categoryType === 'revenue' ? 'Rev' : 
                                                     cat.categoryType === 'expense' ? 'Exp' : 'Net'}
                                                </span>
                                            </td>
                                            {values.map((val, colIdx) => (
                                                <td 
                                                    key={colIdx} 
                                                    className="text-right py-3 px-4"
                                                    style={{ 
                                                        backgroundColor: colIdx === selectedYearIndex ? colors.accentBg : 'transparent',
                                                        color: colors.textPrimary,
                                                        fontWeight: colIdx === selectedYearIndex ? 600 : 400
                                                    }}
                                                >
                                                    {formatCurrency(val)}
                                                </td>
                                            ))}
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
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {expandedCard !== null && (
                <DetailView category={categories[expandedCard]} colors={colors} yearLabel={YEAR_LABELS[selectedYearIndex]} />
            )}
        </div>
    );
}