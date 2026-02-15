'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import BarChartComponent from '@/components/charts/BarChart';
import LineChartComponent from '@/components/charts/LineChart';
import DonutChart from '@/components/charts/DonutChart';
import { Users, DollarSign, TrendingUp, TrendingDown, Award, Trophy, XCircle, Merge, RefreshCw, ArrowUpRight, ArrowDownRight, BarChart3, Check, AlertTriangle, Target, Minus, FileText, CheckCircle, Lightbulb, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { CheckCircle2, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { PROGRAMS_DATA, getScenarioSnapshots, getKPISummary, type ScenarioSnapshot } from '@/data/programs';
import { useColors } from '@/hooks/useColors';
import { DESIGN_TOKENS } from '@/config/design-tokens';
import API_06 from '@/data/KPIs/API-06';

const api06 = API_06 as any;

// Tab Component
type TabType = 'success' | 'scenarios' | 'analytics' | 'at-risk';

interface TabProps {
    id: TabType;
    label: string;
    isActive: boolean;
    onClick: () => void;
    colors: any;
}

function Tab({ id, label, isActive, onClick, colors }: TabProps) {
    return (
        <button
            onClick={onClick}
            className="px-6 py-3 text-sm font-medium transition-all relative"
            style={{
                color: isActive ? DESIGN_TOKENS.colors.primary[1] : colors.textSecondary,
                borderBottom: isActive ? `2px solid ${DESIGN_TOKENS.colors.primary[1]}` : '2px solid transparent',
                backgroundColor: isActive ? `${DESIGN_TOKENS.colors.primary[1]}10` : 'transparent',
            }}
        >
            {label}
        </button>
    );
}

export default function ProgramAnalytics() {
    const colors = useColors();
    const [activeTab, setActiveTab] = useState<TabType>('success');

    const tabs: { id: TabType; label: string }[] = [
        { id: 'success', label: 'Student Success & Risk' },
        { id: 'scenarios', label: 'Scenarios' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'at-risk', label: 'At-Risk Student Rate' },
    ];

    return (
        <div className="animate-fade-in">
            <Header
                title="Student Success & Risk Analytics"
                subtitle="Program analytics, scenarios, and performance insights"
            />

            <div className="rounded-xl shadow-sm border overflow-hidden mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <div className="flex border-b" style={{ borderColor: colors.border }}>
                    {tabs.map(tab => (
                        <Tab
                            key={tab.id}
                            id={tab.id}
                            label={tab.label}
                            isActive={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            colors={colors}
                        />
                    ))}
                </div>

                <div className="p-6">
                    {activeTab === 'success' && <StudentSuccessTab colors={colors} />}
                    {activeTab === 'scenarios' && <ScenariosTab colors={colors} />}
                    {activeTab === 'analytics' && <AnalyticsTab colors={colors} />}
                    {activeTab === 'at-risk' && <AtRiskStudentRateTab colors={colors} />}
                </div>
            </div>
        </div>
    );
}

// Student Success & Risk Tab
function StudentSuccessTab({ colors }: { colors: any }) {
    const kpis = getKPISummary();

    const api06Metrics = (() => {
        const pt = api06?.programTermData || [];
        const totalActive = pt.reduce((s: number, d: any) => s + (d.totalActiveStudents || 0), 0);
        const totalFlagged = pt.reduce((s: number, d: any) => s + (d.flaggedStudents || 0), 0);
        const atRiskRate = totalActive > 0 ? (totalFlagged / totalActive * 100).toFixed(1) : '0';
        const latest = pt.filter((d: any) => d.academicYear === '2023-24' && d.term === 'Spring');
        const highRisk = latest.filter((d: any) => (d.atRiskRate || 0) >= 25).sort((a: any, b: any) => (b.atRiskRate || 0) - (a.atRiskRate || 0));
        const topHighRisk = highRisk.slice(0, 3);
        return { totalActive, totalFlagged, atRiskRate, highRiskCount: highRisk.length, topHighRisk };
    })();

    const getStatusStyles = (status: string) => {
        if (colors.isDark) {
            switch (status) {
                case 'On Track': return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' };
                case 'At Risk': return { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15' };
                default: return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' };
            }
        }
        switch (status) {
            case 'On Track': return { bg: '#f0fdf4', text: '#16a34a' };
            case 'At Risk': return { bg: '#fefce8', text: '#ca8a04' };
            default: return { bg: '#fef2f2', text: '#dc2626' };
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map((kpi) => {
                    const statusStyles = getStatusStyles(kpi.status);
                    return (
                        <div key={kpi.metric} className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: colors.textSecondary }}>{kpi.metric}</p>
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: statusStyles.bg, color: statusStyles.text }}>
                                    {kpi.status}
                                </span>
                            </div>

                            <p className="text-2xl font-semibold mb-1" style={{ color: colors.textPrimary }}>{kpi.value}</p>

                            <div className="flex items-center gap-2 mb-3">
                                {kpi.trend === 'up' && <TrendingUp size={14} style={{ color: colors.successText }} />}
                                {kpi.trend === 'down' && <TrendingDown size={14} style={{ color: colors.dangerText }} />}
                                {kpi.trend === 'stable' && <Minus size={14} style={{ color: colors.textSecondary }} />}
                                <span className="text-xs" style={{ color: colors.textSecondary }}>Target: {kpi.target}</span>
                            </div>

                            <p className="text-xs p-3 rounded-lg" style={{ backgroundColor: colors.tableHeader, color: colors.textSecondary }}>
                                {kpi.insight}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <div className="flex items-center gap-2 mb-4">
                    <FileText size={16} style={{ color: colors.accent }} />
                    <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Executive Summary</h2>
                </div>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                    The academic portfolio shows strong overall performance with revenue growth of 8% year-over-year. STEM programs continue to lead in enrollment and employment outcomes. Institutional at-risk student rate is {api06Metrics.atRiskRate}% ({api06Metrics.totalFlagged.toLocaleString()} flagged of {api06Metrics.totalActive.toLocaleString()} active students), with {api06Metrics.highRiskCount} programs exceeding the 25% target in Spring 2023-24.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.successBg }}>
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={16} style={{ color: colors.successText }} />
                            <span className="text-sm font-medium" style={{ color: colors.successText }}>Strengths</span>
                        </div>
                        <ul className="text-xs space-y-1" style={{ color: colors.successText }}>
                            <li>• STEM programs showing highest growth rates</li>
                            <li>• Graduate employment outcomes improving</li>
                            <li>• Enrollment targets met for 80% of programs</li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: colors.warningBg }}>
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={16} style={{ color: colors.warningText }} />
                            <span className="text-sm font-medium" style={{ color: colors.warningText }}>Areas for Attention</span>
                        </div>
                        <ul className="text-xs space-y-1" style={{ color: colors.warningText }}>
                            <li>• At-risk rate at {api06Metrics.atRiskRate}% — {api06Metrics.highRiskCount} programs above 25% threshold</li>
                            {api06Metrics.topHighRisk.length > 0 && (
                                <li>• Highest risk: {api06Metrics.topHighRisk.map((p: any) => `${p.programName} (${p.atRiskRate?.toFixed(1)}%)`).join(', ')}</li>
                            )}
                            <li>• Cost per student rising in Healthcare</li>
                            <li>• Enrollment declining in Certificate programs</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={16} style={{ color: colors.accent }} />
                    <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Recommendations</h2>
                </div>
                <div className="space-y-3">
                    {[
                        { title: 'Review At-Risk Student Programs', desc: `${api06Metrics.highRiskCount} programs exceed 25% at-risk rate. Prioritize advising and early intervention for Data Science Program 1 (40% in Spring 23-24) and other high-flag programs.` },
                        { title: 'Expand High-Performers', desc: 'Increase capacity in Computer Science and Data Science programs.' },
                        { title: 'Strengthen Partnerships', desc: 'Develop co-op programs with top employers to improve outcomes.' },
                    ].map((rec, idx) => (
                        <div key={idx} className="flex gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.tableHeader }}>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0" style={{ backgroundColor: colors.accentBg, color: colors.accent }}>
                                {idx + 1}
                            </div>
                            <div>
                                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{rec.title}</p>
                                <p className="text-xs" style={{ color: colors.textSecondary }}>{rec.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Scenarios Tab
function ScenariosTab({ colors }: { colors: any }) {
    const scenarios = getScenarioSnapshots();
    const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

    const toggleScenario = (id: string) => {
        setSelectedScenarios(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const getTypeIcon = (type: ScenarioSnapshot['type']) => {
        switch (type) {
            case 'Closure': return <XCircle size={18} />;
            case 'Merger': return <Merge size={18} />;
            case 'Expansion': return <TrendingUp size={18} />;
            case 'Restructure': return <RefreshCw size={18} />;
        }
    };

    const getTypeStyles = (type: ScenarioSnapshot['type']) => {
        if (colors.isDark) {
            switch (type) {
                case 'Closure': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' };
                case 'Merger': return { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15' };
                case 'Expansion': return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' };
                case 'Restructure': return { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' };
            }
        }
        switch (type) {
            case 'Closure': return { bg: '#fef2f2', text: '#dc2626' };
            case 'Merger': return { bg: '#fefce8', text: '#ca8a04' };
            case 'Expansion': return { bg: '#f0fdf4', text: '#16a34a' };
            case 'Restructure': return { bg: '#eff6ff', text: '#2563eb' };
        }
    };

    const getRiskStyles = (riskLevel: string) => {
        if (colors.isDark) {
            switch (riskLevel) {
                case 'Low': return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' };
                case 'Medium': return { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15' };
                case 'High': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' };
                default: return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8' };
            }
        }
        switch (riskLevel) {
            case 'Low': return { bg: '#f0fdf4', text: '#16a34a' };
            case 'Medium': return { bg: '#fefce8', text: '#ca8a04' };
            case 'High': return { bg: '#fef2f2', text: '#dc2626' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    const selectedScenariosData = selectedScenarios.map(id => scenarios.find(s => s.id === id)!);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {scenarios.map(scenario => {
                    const isSelected = selectedScenarios.includes(scenario.id);
                    const typeStyles = getTypeStyles(scenario.type);
                    const riskStyles = getRiskStyles(scenario.riskLevel);

                    return (
                        <div
                            key={scenario.id}
                            onClick={() => toggleScenario(scenario.id)}
                            className="rounded-xl cursor-pointer transition-all duration-200"
                            style={{
                                backgroundColor: colors.cardBg,
                                border: isSelected ? `2px solid ${colors.primary1}` : `1px solid ${colors.border}`,
                                boxShadow: isSelected ? '0 4px 20px rgba(99, 102, 241, 0.25)' : undefined,
                                transform: isSelected ? 'scale(1.02)' : undefined,
                            }}
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
                                            style={{ backgroundColor: typeStyles.bg, color: typeStyles.text }}
                                        >
                                            {getTypeIcon(scenario.type)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{scenario.name}</p>
                                            <p className="text-xs" style={{ color: colors.textSecondary }}>{scenario.type}</p>
                                        </div>
                                    </div>
                                    <div
                                        className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200"
                                        style={{
                                            backgroundColor: isSelected ? colors.primary1 : 'transparent',
                                            borderColor: isSelected ? colors.primary1 : colors.border,
                                        }}
                                    >
                                        {isSelected && <Check size={12} className="text-white" />}
                                    </div>
                                </div>

                                <p className="text-xs mb-4 leading-relaxed" style={{ color: colors.textSecondary }}>{scenario.description}</p>

                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span style={{ color: colors.textSecondary }}>Savings</span>
                                        <span className="font-medium" style={{ color: scenario.projectedSavings > 0 ? colors.successText : colors.dangerText }}>
                                            {scenario.projectedSavings > 0 ? '+' : ''}${(scenario.projectedSavings / 1000).toFixed(0)}K
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span style={{ color: colors.textSecondary }}>Revenue Impact</span>
                                        <span className="font-medium" style={{ color: scenario.projectedRevenueLoss <= 0 ? colors.successText : colors.dangerText }}>
                                            {scenario.projectedRevenueLoss > 0 ? '-' : '+'}${(Math.abs(scenario.projectedRevenueLoss) / 1000).toFixed(0)}K
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2" style={{ borderTop: `1px solid ${colors.border}` }}>
                                        <span className="font-medium" style={{ color: colors.textPrimary }}>Net Impact</span>
                                        <span className="font-bold" style={{ color: scenario.netImpact >= 0 ? colors.successText : colors.dangerText }}>
                                            {scenario.netImpact >= 0 ? '+' : ''}${(scenario.netImpact / 1000).toFixed(0)}K
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2">
                                    <span
                                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                                        style={{ backgroundColor: riskStyles.bg, color: riskStyles.text }}
                                    >
                                        {scenario.riskLevel} Risk
                                    </span>
                                    <span
                                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                                        style={{ backgroundColor: colors.isDark ? 'rgba(148, 163, 184, 0.15)' : '#f1f5f9', color: colors.textSecondary }}
                                    >
                                        {scenario.affectedPrograms.length} programs
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedScenarios.length >= 2 ? (
                <div className="rounded-xl overflow-hidden animate-fade-in" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.tableHeader }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accentBg }}>
                            <BarChart3 size={16} style={{ color: colors.accent }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Scenario Comparison</h2>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>Comparing {selectedScenarios.length} scenarios</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ backgroundColor: colors.tableHeader }}>
                                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>
                                        Metric
                                    </th>
                                    {selectedScenariosData.map(scenario => {
                                        const typeStyles = getTypeStyles(scenario.type);
                                        return (
                                            <th key={scenario.id} className="text-left px-6 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                        style={{ backgroundColor: typeStyles.bg, color: typeStyles.text }}
                                                    >
                                                        {getTypeIcon(scenario.type)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{scenario.name}</p>
                                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{scenario.type}</p>
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Target size={14} style={{ color: colors.textSecondary }} />
                                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Type</span>
                                        </div>
                                    </td>
                                    {selectedScenariosData.map(scenario => {
                                        const typeStyles = getTypeStyles(scenario.type);
                                        return (
                                            <td key={scenario.id} className="px-6 py-4">
                                                <span
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5"
                                                    style={{ backgroundColor: typeStyles.bg, color: typeStyles.text }}
                                                >
                                                    {getTypeIcon(scenario.type)}
                                                    {scenario.type}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className="transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={14} style={{ color: colors.textSecondary }} />
                                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Risk Level</span>
                                        </div>
                                    </td>
                                    {selectedScenariosData.map(scenario => {
                                        const riskStyles = getRiskStyles(scenario.riskLevel);
                                        return (
                                            <td key={scenario.id} className="px-6 py-4">
                                                <span
                                                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                                                    style={{ backgroundColor: riskStyles.bg, color: riskStyles.text }}
                                                >
                                                    {scenario.riskLevel}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className="transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={14} style={{ color: colors.textSecondary }} />
                                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Projected Savings</span>
                                        </div>
                                    </td>
                                    {selectedScenariosData.map(scenario => {
                                        const isPositive = scenario.projectedSavings > 0;
                                        return (
                                            <td key={scenario.id} className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded-full flex items-center justify-center"
                                                        style={{ backgroundColor: isPositive ? colors.successBg : colors.dangerBg }}
                                                    >
                                                        {isPositive ? (
                                                            <ArrowUpRight size={12} style={{ color: colors.successText }} />
                                                        ) : (
                                                            <ArrowDownRight size={12} style={{ color: colors.dangerText }} />
                                                        )}
                                                    </div>
                                                    <span
                                                        className="text-sm font-semibold"
                                                        style={{ color: isPositive ? colors.successText : colors.dangerText }}
                                                    >
                                                        {isPositive ? '+' : ''}${(scenario.projectedSavings / 1000).toFixed(0)}K
                                                    </span>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className="transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={14} style={{ color: colors.textSecondary }} />
                                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Revenue Impact</span>
                                        </div>
                                    </td>
                                    {selectedScenariosData.map(scenario => {
                                        const isPositive = scenario.projectedRevenueLoss <= 0;
                                        return (
                                            <td key={scenario.id} className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded-full flex items-center justify-center"
                                                        style={{ backgroundColor: isPositive ? colors.successBg : colors.dangerBg }}
                                                    >
                                                        {isPositive ? (
                                                            <ArrowUpRight size={12} style={{ color: colors.successText }} />
                                                        ) : (
                                                            <ArrowDownRight size={12} style={{ color: colors.dangerText }} />
                                                        )}
                                                    </div>
                                                    <span
                                                        className="text-sm font-semibold"
                                                        style={{ color: isPositive ? colors.successText : colors.dangerText }}
                                                    >
                                                        {scenario.projectedRevenueLoss > 0 ? '-' : '+'}${(Math.abs(scenario.projectedRevenueLoss) / 1000).toFixed(0)}K
                                                    </span>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className="transition-colors" style={{ backgroundColor: colors.tableHeader }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 size={14} style={{ color: colors.textSecondary }} />
                                            <span className="text-sm font-bold" style={{ color: colors.textPrimary }}>Net Impact</span>
                                        </div>
                                    </td>
                                    {selectedScenariosData.map(scenario => {
                                        const isPositive = scenario.netImpact >= 0;
                                        return (
                                            <td key={scenario.id} className="px-6 py-4">
                                                <div
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl"
                                                    style={{ backgroundColor: isPositive ? colors.successBg : colors.dangerBg }}
                                                >
                                                    {isPositive ? (
                                                        <ArrowUpRight size={16} style={{ color: colors.successText }} />
                                                    ) : (
                                                        <ArrowDownRight size={16} style={{ color: colors.dangerText }} />
                                                    )}
                                                    <span
                                                        className="text-base font-bold"
                                                        style={{ color: isPositive ? colors.successText : colors.dangerText }}
                                                    >
                                                        {isPositive ? '+' : ''}${(scenario.netImpact / 1000).toFixed(0)}K
                                                    </span>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className="transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Minus size={14} style={{ color: colors.textSecondary }} />
                                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>Affected Programs</span>
                                        </div>
                                    </td>
                                    {selectedScenariosData.map(scenario => (
                                        <td key={scenario.id} className="px-6 py-4">
                                            <span
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                                style={{ backgroundColor: colors.infoBg, color: colors.infoText }}
                                            >
                                                {scenario.affectedPrograms.length} programs
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.border}`, backgroundColor: colors.tableHeader }}>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>
                            {selectedScenarios.length} scenarios selected for comparison
                        </p>
                        <button
                            onClick={() => setSelectedScenarios([])}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                            style={{ color: colors.accent, backgroundColor: colors.accentBg }}
                        >
                            Clear Selection
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className="rounded-xl p-12 text-center animate-fade-in"
                    style={{ backgroundColor: colors.cardBg, border: `1px dashed ${colors.border}` }}
                >
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: colors.accentBg }}
                    >
                        <BarChart3 size={28} style={{ color: colors.accent }} />
                    </div>
                    <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>Compare Scenarios</h3>
                    <p className="text-xs max-w-xs mx-auto" style={{ color: colors.textSecondary }}>
                        Select 2 or more scenarios above to see a detailed side-by-side comparison of their projected impacts.
                    </p>
                </div>
            )}
        </div>
    );
}

// At-Risk Student Rate Tab (API-06)
function getStatusColorApi06(colors: any, status: string) {
  switch (status) {
    case 'green': return colors.successText;
    case 'amber': return colors.warningText;
    case 'red': return colors.dangerText;
    default: return colors.textSecondary;
  }
}

function getStatusBgApi06(colors: any, status: string) {
  switch (status) {
    case 'green': return colors.successBg;
    case 'amber': return colors.warningBg;
    case 'red': return colors.dangerBg;
    default: return colors.cardBg;
  }
}

function getStatusIconApi06(status: string) {
  switch (status) {
    case 'green': return <CheckCircle2 size={20} />;
    case 'amber': return <AlertCircleIcon size={20} />;
    case 'red': return <XCircle size={20} />;
    default: return <AlertCircleIcon size={20} />;
  }
}

function AtRiskStudentRateTab({ colors }: { colors: any }) {
  const [granularity, setGranularity] = useState<'program-term' | 'college-term'>('program-term');
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedTerm, setSelectedTerm] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortYearOrder, setSortYearOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const colleges = useMemo(() => {
    const set = new Set<string>(api06.programTermData.map((d: any) => d.college));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const years = useMemo(() => {
    const set = new Set<string>([
      ...api06.programTermData.map((d: any) => d.academicYear),
      ...api06.collegeTermData.map((d: any) => d.academicYear),
    ]);
    return ['All', ...Array.from(set).sort()];
  }, []);

  const terms = useMemo(() => {
    const set = new Set<string>([
      ...api06.programTermData.map((d: any) => d.term),
      ...api06.collegeTermData.map((d: any) => d.term),
    ]);
    return ['All', ...Array.from(set).sort()];
  }, []);

  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'green', label: 'Green (<8%)' },
    { value: 'amber', label: 'Amber (8–25%)' },
    { value: 'red', label: 'Red (≥25%)' },
  ];

  const filteredProgramTermData = useMemo(() => {
    return (api06.programTermData || []).filter((d: any) => {
      if (selectedCollege !== 'All' && d.college !== selectedCollege) return false;
      if (selectedYear !== 'All' && d.academicYear !== selectedYear) return false;
      if (selectedTerm !== 'All' && d.term !== selectedTerm) return false;
      if (selectedStatus !== 'All' && d.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedCollege, selectedYear, selectedTerm, selectedStatus]);

  const filteredCollegeTermData = useMemo(() => {
    return (api06.collegeTermData || []).filter((d: any) => {
      if (selectedCollege !== 'All' && d.college !== selectedCollege) return false;
      if (selectedYear !== 'All' && d.academicYear !== selectedYear) return false;
      if (selectedTerm !== 'All' && d.term !== selectedTerm) return false;
      if (selectedStatus !== 'All' && d.status !== selectedStatus) return false;
      return true;
    });
  }, [selectedCollege, selectedYear, selectedTerm, selectedStatus]);

  const filteredData = granularity === 'program-term' ? filteredProgramTermData : filteredCollegeTermData;

  const filteredMetrics = useMemo(() => {
    if (filteredData.length === 0) {
      return { totalActiveStudents: 0, flaggedStudents: 0, atRiskRate: 0, status: 'amber' as const };
    }
    const total = filteredData.reduce((s: number, d: any) => s + (d.totalActiveStudents || 0), 0);
    const flagged = filteredData.reduce((s: number, d: any) => s + (d.flaggedStudents || 0), 0);
    const rate = total > 0 ? (flagged / total) * 100 : 0;
    const status = rate < 8 ? 'green' : rate >= 25 ? 'red' : 'amber';
    return { totalActiveStudents: total, flaggedStudents: flagged, atRiskRate: rate, status };
  }, [filteredData]);

  const barChartData = useMemo(() => {
    const map: Record<string, { total: number; flagged: number }> = {};
    filteredData.forEach((d: any) => {
      const key = granularity === 'program-term' ? d.programName : d.college;
      if (!map[key]) map[key] = { total: 0, flagged: 0 };
      map[key].total += d.totalActiveStudents || 0;
      map[key].flagged += d.flaggedStudents || 0;
    });
    return Object.entries(map)
      .map(([name, v]) => ({
        name: name.length > 24 ? name.slice(0, 22) + '…' : name,
        atRiskRate: v.total > 0 ? Math.round((v.flagged / v.total) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.atRiskRate - a.atRiskRate)
      .slice(0, 12);
  }, [filteredData, granularity]);

  const trendData = useMemo(() => {
    const yearTermMap: Record<string, { total: number; flagged: number }> = {};
    filteredData.forEach((d: any) => {
      const k = `${d.academicYear}-${d.term}`;
      if (!yearTermMap[k]) yearTermMap[k] = { total: 0, flagged: 0 };
      yearTermMap[k].total += d.totalActiveStudents || 0;
      yearTermMap[k].flagged += d.flaggedStudents || 0;
    });
    return Object.entries(yearTermMap)
      .map(([k, v]) => ({
        name: k,
        atRiskRate: v.total > 0 ? Math.round((v.flagged / v.total) * 1000) / 10 : 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredData]);

  const sortedData = useMemo(() => {
    const s = [...filteredData];
    s.sort((a: any, b: any) => {
      const cmp = (a.academicYear + a.term).localeCompare(b.academicYear + b.term);
      return sortYearOrder === 'desc' ? -cmp : cmp;
    });
    return s;
  }, [filteredData, sortYearOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const resetPage = () => setCurrentPage(1);

  const progressBarData = useMemo(() => {
    if (selectedCollege !== 'All' || selectedStatus !== 'All') return [];
    return barChartData;
  }, [barChartData, selectedCollege, selectedStatus]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl p-5 border mb-6" style={{ backgroundColor: colors.accentBg, borderColor: colors.accent }}>
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} style={{ color: colors.accent }} />
          <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>At-Risk Student Rate (Official KPI)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{filteredMetrics.totalActiveStudents.toLocaleString()}</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Total Active Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: colors.dangerText }}>{filteredMetrics.flaggedStudents.toLocaleString()}</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Flagged (At-Risk)</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: getStatusColorApi06(colors, filteredMetrics.status) }}>{filteredMetrics.atRiskRate.toFixed(1)}%</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>At-Risk Rate</p>
          </div>
          <div>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold"
              style={{ backgroundColor: getStatusBgApi06(colors, filteredMetrics.status), color: getStatusColorApi06(colors, filteredMetrics.status) }}
            >
              {getStatusIconApi06(filteredMetrics.status)}{filteredMetrics.status.toUpperCase()}
            </span>
            <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Target &lt;25% / &lt;15% / &lt;8%</p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>{filteredData.length} record{filteredData.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Total Students</span>
            <Users size={20} style={{ color: DESIGN_TOKENS.colors.primary[1] }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{filteredMetrics.totalActiveStudents.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Flagged</span>
            <AlertTriangle size={20} style={{ color: colors.dangerText }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: colors.dangerText }}>{filteredMetrics.flaggedStudents.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>At-Risk Rate</span>
            <div style={{ color: getStatusColorApi06(colors, filteredMetrics.status) }}>{getStatusIconApi06(filteredMetrics.status)}</div>
          </div>
          <p className="text-2xl font-bold" style={{ color: getStatusColorApi06(colors, filteredMetrics.status) }}>{filteredMetrics.atRiskRate.toFixed(1)}%</p>
        </div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Target</span>
            <Target size={20} style={{ color: colors.accent }} />
          </div>
          <p className="text-lg font-bold" style={{ color: colors.textPrimary }}>&lt;25% / &lt;15% / &lt;8%</p>
        </div>
      </div>

      <div className="p-6 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div className="flex items-center gap-4 mb-4">
          <Target size={20} style={{ color: colors.primary1 }} />
          <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Granularity</label>
            <select
              value={granularity}
              onChange={(e) => { setGranularity(e.target.value as any); resetPage(); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              <option value="program-term">Program-Term</option>
              <option value="college-term">College-Term</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>College</label>
            <select
              value={selectedCollege}
              onChange={(e) => { setSelectedCollege(e.target.value); resetPage(); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {colleges.map((c) => <option key={c} value={c}>{c === 'All' ? 'All' : c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(e.target.value); resetPage(); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {years.map((y) => <option key={y} value={y}>{y === 'All' ? 'All' : y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Term</label>
            <select
              value={selectedTerm}
              onChange={(e) => { setSelectedTerm(e.target.value); resetPage(); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {terms.map((t) => <option key={t} value={t}>{t === 'All' ? 'All' : t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); resetPage(); }}
              className="w-full px-4 py-2.5 rounded-lg border text-sm font-medium"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Info size={16} style={{ color: colors.infoText }} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            Showing {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}
            {selectedCollege !== 'All' && ` • ${selectedCollege}`}
            {selectedYear !== 'All' && ` • ${selectedYear}`}
            {selectedTerm !== 'All' && ` • ${selectedTerm}`}
            {selectedStatus !== 'All' && ` • ${selectedStatus}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            At-Risk Rate by {granularity === 'program-term' ? 'Program' : 'College'}
          </h3>
          {barChartData.length > 0 ? (
            <BarChartComponent
              data={barChartData}
              xKey="name"
              bars={[{ dataKey: 'atRiskRate', color: colors.secondary1, name: 'At-Risk %' }]}
              height={280}
            />
          ) : (
            <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data</p>
          )}
        </div>
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>At-Risk Rate Trend</h3>
          {trendData.length > 0 ? (
            <LineChartComponent
              data={trendData}
              xKey="name"
              lines={[{ dataKey: 'atRiskRate', color: colors.secondary1, name: 'At-Risk %' }]}
              height={280}
              yFormatter={(v) => v.toFixed(1) + '%'}
            />
          ) : (
            <p className="text-sm py-8" style={{ color: colors.textSecondary }}>No data</p>
          )}
        </div>
      </div>

      {progressBarData.length > 0 && (
        <div className="p-6 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: colors.textPrimary }}>
            At-Risk Rate by {granularity === 'program-term' ? 'Program' : 'College'}
          </h3>
          <div className="space-y-4">
            {progressBarData.map((row) => {
              const status = row.atRiskRate < 8 ? 'green' : row.atRiskRate >= 25 ? 'red' : 'amber';
              const pct = Math.min(100, row.atRiskRate);
              return (
                <div key={row.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{row.name}</span>
                    <span className="text-sm font-bold" style={{ color: getStatusColorApi06(colors, status) }}>{row.atRiskRate.toFixed(1)}%</span>
                  </div>
                  <div className="relative h-6 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: getStatusColorApi06(colors, status) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t" style={{ borderColor: colors.border }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.successText }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>Green: &lt;8%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.warningText }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>Amber: 8–25%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.dangerText }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>Red: ≥25%</span>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div className="p-6 border-b flex flex-wrap items-center justify-between gap-4" style={{ borderColor: colors.border }}>
          <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            {granularity === 'program-term' ? 'Program-Term' : 'College-Term'} Data
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSortYearOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              Year {sortYearOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); resetPage(); }}
              className="px-2 py-1 rounded text-xs font-medium border"
              style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
            >
              {[5, 10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: colors.border }}>
                {granularity === 'program-term' && (
                  <>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>College</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Program</th>
                  </>
                )}
                {granularity === 'college-term' && (
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>College</th>
                )}
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Year</th>
                <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Term</th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Students</th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Flagged</th>
                <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>At-Risk %</th>
                <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row: any, idx: number) => (
                <tr
                  key={idx}
                  className="border-b transition-colors"
                  style={{ borderColor: colors.border }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.tableHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {granularity === 'program-term' && (
                    <>
                      <td className="py-3 px-4 text-sm font-medium" style={{ color: colors.textPrimary }}>{row.college}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: colors.textPrimary }}>{row.programName}</td>
                    </>
                  )}
                  {granularity === 'college-term' && (
                    <td className="py-3 px-4 text-sm font-medium" style={{ color: colors.textPrimary }}>{row.college}</td>
                  )}
                  <td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{row.academicYear}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: colors.textSecondary }}>{row.term}</td>
                  <td className="py-3 px-4 text-sm text-right" style={{ color: colors.textPrimary }}>{row.totalActiveStudents?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-right" style={{ color: colors.dangerText }}>{row.flaggedStudents?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-right font-bold" style={{ color: getStatusColorApi06(colors, row.status) }}>{row.atRiskRate?.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-bold"
                      style={{ backgroundColor: getStatusBgApi06(colors, row.status), color: getStatusColorApi06(colors, row.status) }}
                    >
                      {row.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t" style={{ borderColor: colors.border }}>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1} className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>Previous</button>
            <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium border disabled:opacity-40" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}>Next</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Formula</h3>
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{api06.formula?.description}</p>
          <div className="space-y-2">
            {(api06.formula?.components || []).map((c: any, i: number) => (
              <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border }}>
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{c.name}</span>
                {c.formula && <span className="text-sm ml-2" style={{ color: colors.accent }}>= {c.formula}</span>}
                {c.description && <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>{c.description}</p>}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>Usage</h3>
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>{api06.usage?.primary}</p>
          <ul className="list-disc list-inside text-sm space-y-1" style={{ color: colors.textSecondary }}>
            {(api06.usage?.secondary || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Analytics Tab
function AnalyticsTab({ colors }: { colors: any }) {
    const totalEnrollment = PROGRAMS_DATA.reduce((sum, p) => sum + p.enrollment, 0);
    const totalRevenue = PROGRAMS_DATA.reduce((sum, p) => sum + p.revenue, 0);
    const totalCost = PROGRAMS_DATA.reduce((sum, p) => sum + p.cost, 0);
    const avgProfitMargin = PROGRAMS_DATA.reduce((sum, p) => sum + p.profitMargin, 0) / PROGRAMS_DATA.length;

    const deptStats = PROGRAMS_DATA.reduce((acc, prog) => {
        const dept = prog.department.split(' ')[0];
        if (!acc[dept]) acc[dept] = { revenue: 0, cost: 0 };
        acc[dept].revenue += prog.revenue;
        acc[dept].cost += prog.cost;
        return acc;
    }, {} as Record<string, { revenue: number; cost: number }>);

    const revenueChartData = Object.entries(deptStats).map(([name, data]) => ({
        name,
        revenue: Math.round(data.revenue / 1000000 * 10) / 10,
        cost: Math.round(data.cost / 1000000 * 10) / 10,
    }));

    const degreeData = ['Bachelor', 'Master', 'Doctorate', 'Certificate'].map(level => ({
        name: level,
        value: PROGRAMS_DATA.filter(p => p.degreeLevel === level).reduce((sum, p) => sum + p.enrollment, 0),
        color: level === 'Bachelor' ? DESIGN_TOKENS.colors.primary[1] : 
               level === 'Master' ? DESIGN_TOKENS.colors.secondary[1] : 
               level === 'Doctorate' ? DESIGN_TOKENS.colors.secondary[3] : 
               DESIGN_TOKENS.colors.secondary[2],
    }));

    const topPrograms = [...PROGRAMS_DATA].sort((a, b) => b.profitMargin - a.profitMargin).slice(0, 5);

    const getRankStyles = (idx: number) => {
        if (colors.isDark) {
            if (idx === 0) return { bg: `${DESIGN_TOKENS.colors.secondary[3]}40`, text: DESIGN_TOKENS.colors.secondary[3] };
            if (idx === 1) return { bg: 'rgba(148, 163, 184, 0.2)', text: '#cbd5e1' };
            if (idx === 2) return { bg: `${DESIGN_TOKENS.colors.secondary[1]}20`, text: DESIGN_TOKENS.colors.secondary[1] };
            return { bg: 'rgba(148, 163, 184, 0.15)', text: colors.textSecondary };
        }
        if (idx === 0) return { bg: '#fef3c7', text: DESIGN_TOKENS.colors.secondary[3] };
        if (idx === 1) return { bg: '#e2e8f0', text: '#475569' };
        if (idx === 2) return { bg: '#fed7aa', text: DESIGN_TOKENS.colors.secondary[1] };
        return { bg: '#f1f5f9', text: '#64748b' };
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Enrollment" value={totalEnrollment.toLocaleString()} change={12} icon={<Users size={20} />} changeLabel="vs last year" />
                <MetricCard title="Total Revenue" value={`$${(totalRevenue / 1000000).toFixed(1)}M`} change={8} icon={<DollarSign size={20} />} changeLabel="annual" />
                <MetricCard title="Avg Profit Margin" value={`${avgProfitMargin.toFixed(1)}%`} change={5} icon={<TrendingUp size={20} />} changeLabel="portfolio" />
                <MetricCard title="Net Profit" value={`$${((totalRevenue - totalCost) / 1000000).toFixed(1)}M`} icon={<Award size={20} />} changeLabel="after costs" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="rounded-xl p-5 shadow-sm border lg:col-span-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Revenue vs Cost by Department (in $M)</h2>
                    <BarChartComponent data={revenueChartData} xKey="name" bars={[
                        { dataKey: 'revenue', color: DESIGN_TOKENS.colors.secondary[1], name: 'Revenue' },
                        { dataKey: 'cost', color: DESIGN_TOKENS.colors.danger, name: 'Cost' },
                    ]} height={240} showLegend />
                </div>

                <div className="rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border, minHeight: '280px' }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Enrollment by Degree</h2>
                    <div className="h-[220px]">
                        <DonutChart data={degreeData} height={220} innerRadius={50} outerRadius={80} />
                    </div>
                </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.tableHeader }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${DESIGN_TOKENS.colors.primary[1]}20` }}>
                            <Trophy size={16} style={{ color: DESIGN_TOKENS.colors.primary[1] }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Top Performing Programs</h2>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>Ranked by profit margin</p>
                        </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${DESIGN_TOKENS.colors.secondary[1]}20`, color: DESIGN_TOKENS.colors.secondary[1] }}>
                        Top 5 of {PROGRAMS_DATA.length}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ backgroundColor: colors.tableHeader }}>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Rank</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Program</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Enrollment</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Revenue</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Profit Margin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topPrograms.map((prog, idx) => {
                                const rankStyles = getRankStyles(idx);
                                const maxMargin = Math.max(...topPrograms.map(p => p.profitMargin));
                                const barWidth = (prog.profitMargin / maxMargin) * 100;

                                return (
                                    <tr key={prog.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                        <td className="px-6 py-4">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: rankStyles.bg, color: rankStyles.text }}>
                                                {idx < 3 ? (idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉') : idx + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{prog.name}</p>
                                                <p className="text-xs" style={{ color: colors.textSecondary }}>{prog.department}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{prog.enrollment.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-medium" style={{ color: DESIGN_TOKENS.colors.secondary[1] }}>${(prog.revenue / 1000000).toFixed(1)}M</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 min-w-[140px]">
                                                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.isDark ? `${DESIGN_TOKENS.colors.secondary[1]}20` : `${DESIGN_TOKENS.colors.secondary[1]}30` }}>
                                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barWidth}%`, backgroundColor: DESIGN_TOKENS.colors.secondary[1] }} />
                                                </div>
                                                <span className="text-sm font-bold min-w-[45px] text-right" style={{ color: DESIGN_TOKENS.colors.secondary[1] }}>{prog.profitMargin}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
