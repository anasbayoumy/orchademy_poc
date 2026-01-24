'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { XCircle, Merge, TrendingUp, RefreshCw, Check, BarChart3, AlertTriangle, DollarSign, Target, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { getScenarioSnapshots, type ScenarioSnapshot } from '@/data/programs';
import { useColors } from '@/hooks/useColors';

export default function ProgramScenarios() {
    const colors = useColors();
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
        <div className="animate-fade-in">
            <Header
                title="Portfolio Scenario Snapshots"
                subtitle="What-if simulations for program portfolio decisions"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
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
                                border: isSelected ? '2px solid #6366f1' : `1px solid ${colors.border}`,
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
                                            backgroundColor: isSelected ? '#6366f1' : 'transparent',
                                            borderColor: isSelected ? '#6366f1' : colors.border,
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
                    {/* Header */}
                    <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.tableHeader }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accentBg }}>
                            <BarChart3 size={16} style={{ color: colors.accent }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Scenario Comparison</h2>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>Comparing {selectedScenarios.length} scenarios</p>
                        </div>
                    </div>

                    {/* Comparison Table */}
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
                                {/* Type Row */}
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

                                {/* Risk Level Row */}
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

                                {/* Projected Savings Row */}
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

                                {/* Revenue Impact Row */}
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

                                {/* Net Impact Row */}
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

                                {/* Affected Programs Row */}
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

                    {/* Footer Summary */}
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
