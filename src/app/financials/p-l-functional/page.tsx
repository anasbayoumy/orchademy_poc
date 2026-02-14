'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { BarChart3, TrendingUp, TrendingDown, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight, Activity, PieChart, Wallet } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

const YEARS = ['19-20', '20-21', '21-22', '22-23', '23-24']; // Shortened for chart labels

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

// Financial Data
const FINANCIAL_DATA = {
    tuitionRevenue: [53210997, 42062036, 49823674, 49006215, 47449161],
    feesRevenue: [3837373, 2605082, 4903966, 3115160, 4497736],
    grantsRevenue: [3960077, 3362637, 3970317, 3763630, 4978918],
    otherRevenue: [2133343, 1959062, 2080707, 1270559, 1332414],
    totalOtherRevenue: [9930793, 7926781, 10954990, 8149349, 10809068],
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
    grossProfitCore: [26792481, 21542263, 25505488, 23264790, 25802737],
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

function DetailView({ category, colors }: { category: any; colors: any }) {
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
                        <span className="text-white text-sm opacity-90">2023-24</span>
                        <span className="px-3 py-1 bg-white rounded text-xs font-bold" style={{ color: catColor.solid }}>
                            {parseFloat(category.growth) >= 0 ? '+' : ''}{category.growth}% YoY
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-6 rounded-lg border shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h3 className="text-base font-bold mb-6" style={{ color: colors.textPrimary }}>5-Year Trend</h3>
                <div className="relative h-64 flex items-end justify-between gap-3">
                    {category.trendData.map((item: any, idx: number) => {
                        const height = Math.max(((item.value - minValue) / (maxValue - minValue)) * 100, 5);
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                <div 
                                    className="w-full rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                    style={{ height: `${height * 2}px`, backgroundColor: catColor.solid }}
                                />
                                <p className="text-xs" style={{ color: colors.textSecondary }}>{item.year.split('-')[0]}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default function PLFunctionalPage() {
    const colors = useColors();
    const { isRTL } = useLanguage();
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const [card1Category, setCard1Category] = useState(0); 
    const [card2Category, setCard2Category] = useState(3); 
    const [card3Category, setCard3Category] = useState(11); 
    const currentIndex = 4;
    const previousIndex = 3;

    const categories = [
        {
            title: 'Category 1: Tuition Revenue',
            value: FINANCIAL_DATA.tuitionRevenue[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.tuitionRevenue[currentIndex], FINANCIAL_DATA.tuitionRevenue[previousIndex]),
            categoryType: 'revenue',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.tuitionRevenue[idx] })),
            insights: ['Primary revenue source showing -3.2% decline from prior year'],
        },
        {
            title: 'Category 2: Total Other Revenue',
            value: FINANCIAL_DATA.totalOtherRevenue[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.totalOtherRevenue[currentIndex], FINANCIAL_DATA.totalOtherRevenue[previousIndex]),
            categoryType: 'revenue',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.totalOtherRevenue[idx] })),
            insights: ['Includes fees, grants, and other revenue streams totaling $10.8M'],
        },
        {
            title: 'Category 3: Total Revenue',
            value: FINANCIAL_DATA.totalRevenue[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.totalRevenue[currentIndex], FINANCIAL_DATA.totalRevenue[previousIndex]),
            categoryType: 'revenue',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.totalRevenue[idx] })),
            insights: ['Combined revenue of $58.3M showing 1.9% growth'],
        },
        {
            title: 'Category 4: Instruction Cost',
            value: FINANCIAL_DATA.instructionCost[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.instructionCost[currentIndex], FINANCIAL_DATA.instructionCost[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.instructionCost[idx] })),
            insights: ['Direct teaching costs decreased 15.8% year-over-year'],
        },
        {
            title: 'Category 5: Scholarships & Financial Aid',
            value: FINANCIAL_DATA.scholarships[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.scholarships[currentIndex], FINANCIAL_DATA.scholarships[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.scholarships[idx] })),
            insights: ['Financial aid decreased 16.4%, impacting affordability'],
        },
        {
            title: 'Category 6: Research',
            value: FINANCIAL_DATA.research[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.research[currentIndex], FINANCIAL_DATA.research[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.research[idx] })),
            insights: ['Research spending surged 71.3% demonstrating increased focus'],
        },
        {
            title: 'Category 7: Operations & Maintenance',
            value: FINANCIAL_DATA.operationsMaintenance[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.operationsMaintenance[currentIndex], FINANCIAL_DATA.operationsMaintenance[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.operationsMaintenance[idx] })),
            insights: ['Facilities costs increased 5.1% with campus expansion'],
        },
        {
            title: 'Category 8: Student Services',
            value: FINANCIAL_DATA.studentServices[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.studentServices[currentIndex], FINANCIAL_DATA.studentServices[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.studentServices[idx] })),
            insights: ['Student support services rose 6.8% enhancing experience'],
        },
        {
            title: 'Category 9: Academic Support',
            value: FINANCIAL_DATA.academicSupport[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.academicSupport[currentIndex], FINANCIAL_DATA.academicSupport[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.academicSupport[idx] })),
            insights: ['Academic support declined 1.4% through efficiency gains'],
        },
        {
            title: 'Category 10: Institutional Support',
            value: FINANCIAL_DATA.institutionalSupport[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.institutionalSupport[currentIndex], FINANCIAL_DATA.institutionalSupport[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.institutionalSupport[idx] })),
            insights: ['Administrative costs grew 6.9% with regulatory compliance'],
        },
        {
            title: 'Category 11: Auxiliary & Other Services',
            value: FINANCIAL_DATA.auxiliary[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.auxiliary[currentIndex], FINANCIAL_DATA.auxiliary[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.auxiliary[idx] })),
            insights: ['Auxiliary operations increased 9.4% with service expansion'],
        },
        {
            title: 'Category 12: Total Expenses',
            value: FINANCIAL_DATA.totalExpenses[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.totalExpenses[currentIndex], FINANCIAL_DATA.totalExpenses[previousIndex]),
            categoryType: 'expense',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.totalExpenses[idx] })),
            insights: ['Total operating expenses of $55.3M decreased 2.8%'],
        },
        {
            title: 'Category 13: Net Surplus / Deficit',
            value: FINANCIAL_DATA.netSurplus[currentIndex],
            growth: calculateGrowth(FINANCIAL_DATA.netSurplus[currentIndex], FINANCIAL_DATA.netSurplus[previousIndex]),
            categoryType: 'net',
            trendData: YEARS.map((year, idx) => ({ year, value: FINANCIAL_DATA.netSurplus[idx] })),
            insights: ['Net result dramatically improved 1041% to positive surplus'],
        },
    ];

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title="P&L Functional Classification Analysis" 
                subtitle="5-Year Financial Performance by Functional Category (2019-20 to 2023-24)" 
            />

            <div className="mb-6">
                <CategorySelector 
                    categories={categories}
                    selectedIndex={expandedCard}
                    onSelect={setExpandedCard}
                    colors={colors}
                />
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
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, idx) => {
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
                                                    {cat.categoryType === 'revenue' ? 'Rev' : 
                                                     cat.categoryType === 'expense' ? 'Exp' : 'Net'}
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
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {expandedCard !== null && (
                <DetailView category={categories[expandedCard]} colors={colors} />
            )}
        </div>
    );
}