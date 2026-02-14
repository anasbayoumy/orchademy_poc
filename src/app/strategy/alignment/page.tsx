'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { Target, TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import GOV_00 from '@/data/KPIs/GOV-00';

export default function InstitutionalAlignment() {
    const colors = useColors();
    const { isRTL } = useLanguage();
    const [activeTab, setActiveTab] = useState('GOV-00');

    const tabs = [
        { id: 'GOV-00', label: 'Overall Strategy Performance Index', data: GOV_00 }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'green': return colors.successText;
            case 'amber': return colors.warningText;
            case 'red': return colors.dangerText;
            default: return colors.textSecondary;
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'green': return colors.successBg;
            case 'amber': return colors.warningBg;
            case 'red': return colors.dangerBg;
            default: return colors.cardBg;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'green': return <CheckCircle size={20} />;
            case 'amber': return <AlertCircle size={20} />;
            case 'red': return <XCircle size={20} />;
            default: return <AlertCircle size={20} />;
        }
    };

    const activeKPI = tabs.find(tab => tab.id === activeTab)?.data;
    const latestYear = activeKPI?.yearlyData[activeKPI.yearlyData.length - 1];
    const previousYear = activeKPI?.yearlyData[activeKPI.yearlyData.length - 2];
    const yearOverYearChange = latestYear && previousYear 
        ? ((latestYear.value - previousYear.value) / previousYear.value * 100).toFixed(2)
        : '0';

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title="Institutional Alignment" 
                subtitle="Strategic performance and alignment tracking" 
            />

            {/* Tabs */}
            <div className="mb-6">
                <div 
                    className="flex gap-2 p-1 rounded-lg"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all"
                            style={{
                                backgroundColor: activeTab === tab.id ? colors.primary1 : 'transparent',
                                color: activeTab === tab.id ? '#ffffff' : colors.textPrimary,
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeKPI && (
                <>
                    {/* KPI Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Current Score */}
                        <div 
                            className="p-5 rounded-lg border"
                            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                                    Current Score
                                </span>
                                <div style={{ color: getStatusColor(latestYear?.status || 'amber') }}>
                                    {getStatusIcon(latestYear?.status || 'amber')}
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <h3 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                                    {latestYear?.value.toFixed(2)}
                                </h3>
                                <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>/ 100</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-semibold">
                                {parseFloat(yearOverYearChange) >= 0 ? 
                                    <TrendingUp size={14} style={{ color: colors.successText }} /> : 
                                    <TrendingDown size={14} style={{ color: colors.dangerText }} />
                                }
                                <span style={{ color: parseFloat(yearOverYearChange) >= 0 ? colors.successText : colors.dangerText }}>
                                    {parseFloat(yearOverYearChange) >= 0 ? '+' : ''}{yearOverYearChange}%
                                </span>
                                <span style={{ color: colors.textSecondary }}>YoY</span>
                            </div>
                        </div>

                        {/* Target Score */}
                        <div 
                            className="p-5 rounded-lg border"
                            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                                    Board Target
                                </span>
                                <Target size={20} style={{ color: colors.primary1 }} />
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <h3 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                                    {activeKPI.targets.boardApproved}
                                </h3>
                                <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>/ 100</span>
                            </div>
                            <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                Gap: {(activeKPI.targets.boardApproved - (latestYear?.value || 0)).toFixed(2)} points
                            </p>
                        </div>

                        {/* Status */}
                        <div 
                            className="p-5 rounded-lg border"
                            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                                    Status
                                </span>
                            </div>
                            <div 
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold mb-2"
                                style={{ 
                                    backgroundColor: getStatusBg(latestYear?.status || 'amber'),
                                    color: getStatusColor(latestYear?.status || 'amber')
                                }}
                            >
                                {getStatusIcon(latestYear?.status || 'amber')}
                                <span className="capitalize">{latestYear?.status}</span>
                            </div>
                            <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                {activeKPI.thresholds[latestYear?.status as keyof typeof activeKPI.thresholds]?.label}
                            </p>
                        </div>

                        {/* Benchmark */}
                        <div 
                            className="p-5 rounded-lg border"
                            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                                    Industry Average
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <h3 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                                    {activeKPI.benchmark.industry.average}
                                </h3>
                                <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>/ 100</span>
                            </div>
                            <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                {activeKPI.benchmark.sector}
                            </p>
                        </div>
                    </div>

                    {/* 5-Year Trend Chart */}
                    <div 
                        className="p-6 rounded-lg border mb-6"
                        style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                    >
                        <h3 className="text-lg font-bold mb-6" style={{ color: colors.textPrimary }}>
                            5-Year Trend Analysis
                        </h3>
                        
                        <div className="relative h-64">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs font-medium" style={{ color: colors.textSecondary }}>
                                <span>100</span>
                                <span>80</span>
                                <span>60</span>
                                <span>40</span>
                                <span>20</span>
                                <span>0</span>
                            </div>

                            {/* Chart area */}
                            <div className="ml-8 h-full flex items-end justify-between gap-2">
                                {activeKPI.yearlyData.map((year, idx) => {
                                    const height = (year.value / 100) * 100;
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                            {/* Bar */}
                                            <div className="relative w-full flex flex-col items-center">
                                                <span 
                                                    className="text-xs font-bold mb-1"
                                                    style={{ color: getStatusColor(year.status) }}
                                                >
                                                    {year.value.toFixed(2)}
                                                </span>
                                                <div 
                                                    className="w-full rounded-t opacity-80 hover:opacity-100 transition-opacity relative"
                                                    style={{ 
                                                        height: `${height * 2}px`,
                                                        backgroundColor: getStatusColor(year.status),
                                                        minHeight: '20px'
                                                    }}
                                                >
                                                    {/* Target line indicator */}
                                                    {activeKPI.targets.boardApproved >= year.value && (
                                                        <div 
                                                            className="absolute left-0 right-0 border-t-2 border-dashed"
                                                            style={{ 
                                                                top: `${100 - ((activeKPI.targets.boardApproved / 100) * 100)}%`,
                                                                borderColor: colors.primary1 + '80',
                                                                opacity: 0.5
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Year label */}
                                            <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                                {year.fiscalYear.split('-')[0].slice(2)}-{year.fiscalYear.split('-')[1].slice(2)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Target line label */}
                            <div 
                                className="absolute right-0 text-xs font-semibold px-2 py-1 rounded"
                                style={{ 
                                    top: `${100 - ((activeKPI.targets.boardApproved / 100) * 80)}%`,
                                    backgroundColor: colors.primary1 + '20',
                                    color: colors.primary1
                                }}
                            >
                                Target: {activeKPI.targets.boardApproved}
                            </div>
                        </div>
                    </div>

                    {/* Components Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Formula Components */}
                        <div 
                            className="p-6 rounded-lg border"
                            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                        >
                            <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                                Index Components
                            </h3>
                            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                                {activeKPI.formula.description}
                            </p>
                            <div className="space-y-3">
                                {activeKPI.formula.components.map((component, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                            {component.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                                                <div 
                                                    className="h-full rounded-full"
                                                    style={{ 
                                                        width: `${component.weight * 100}%`,
                                                        backgroundColor: colors.primary1
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold w-12 text-right" style={{ color: colors.textPrimary }}>
                                                {(component.weight * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Insights */}
                        <div 
                            className="p-6 rounded-lg border"
                            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                        >
                            <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                                Key Insights
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.secondary1 }}>
                                        Trend Analysis
                                    </h4>
                                    <p className="text-sm leading-relaxed" style={{ color: colors.textPrimary }}>
                                        {activeKPI.insights.trend}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.dangerText }}>
                                        Concern
                                    </h4>
                                    <p className="text-sm leading-relaxed" style={{ color: colors.textPrimary }}>
                                        {activeKPI.insights.concern}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.primary1 }}>
                                        Recommendation
                                    </h4>
                                    <p className="text-sm leading-relaxed" style={{ color: colors.textPrimary }}>
                                        {activeKPI.insights.recommendation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thresholds & Usage */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Performance Thresholds */}
                        <div 
                            className="p-6 rounded-lg border"
                            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                        >
                            <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                                Performance Thresholds
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: getStatusBg('green') + '40' }}>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle size={20} style={{ color: colors.successText }} />
                                        <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Green</span>
                                    </div>
                                    <span className="text-sm font-bold" style={{ color: colors.successText }}>
                                        ≥ {activeKPI.thresholds.green.min}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: getStatusBg('amber') + '40' }}>
                                    <div className="flex items-center gap-3">
                                        <AlertCircle size={20} style={{ color: colors.warningText }} />
                                        <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Amber</span>
                                    </div>
                                    <span className="text-sm font-bold" style={{ color: colors.warningText }}>
                                        {activeKPI.thresholds.amber.min} - {activeKPI.thresholds.amber.max}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: getStatusBg('red') + '40' }}>
                                    <div className="flex items-center gap-3">
                                        <XCircle size={20} style={{ color: colors.dangerText }} />
                                        <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Red</span>
                                    </div>
                                    <span className="text-sm font-bold" style={{ color: colors.dangerText }}>
                                        &lt; {activeKPI.thresholds.red.max}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Usage */}
                        <div 
                            className="p-6 rounded-lg border"
                            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                        >
                            <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                                KPI Usage
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.primary1 }}>
                                        Primary Use
                                    </h4>
                                    <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                        {activeKPI.usage.primary}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.secondary1 }}>
                                        Secondary Uses
                                    </h4>
                                    <ul className="space-y-2">
                                        {activeKPI.usage.secondary.map((use, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-xs mt-0.5" style={{ color: colors.primary1 }}>•</span>
                                                <span className="text-sm" style={{ color: colors.textPrimary }}>{use}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
