'use client';

import Header from '@/components/layout/Header';
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Minus, FileText, Lightbulb } from 'lucide-react';
import { getKPISummary } from '@/data/programs';
import { useColors } from '@/hooks/useColors';

export default function KPIReport() {
    const colors = useColors();
    const kpis = getKPISummary();

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
        <div className="animate-fade-in">
            <Header
                title="KPI Summary Report"
                subtitle="Automated narrative insights of program performance"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {kpis.map((kpi) => {
                    const statusStyles = getStatusStyles(kpi.status);
                    return (
                        <div
                            key={kpi.metric}
                            className="rounded-xl p-5"
                            style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: colors.textSecondary }}>{kpi.metric}</p>
                                <span
                                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                                    style={{ backgroundColor: statusStyles.bg, color: statusStyles.text }}
                                >
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

                            <p
                                className="text-xs p-3 rounded-lg"
                                style={{ backgroundColor: colors.tableHeader, color: colors.textSecondary }}
                            >
                                {kpi.insight}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div
                className="rounded-xl p-5 mb-6"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <FileText size={16} style={{ color: colors.accent }} />
                    <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Executive Summary</h2>
                </div>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                    The academic portfolio shows strong overall performance with revenue growth of 8% year-over-year.
                    STEM programs continue to lead in enrollment and employment outcomes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: colors.successBg }}
                    >
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

                    <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: colors.warningBg }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={16} style={{ color: colors.warningText }} />
                            <span className="text-sm font-medium" style={{ color: colors.warningText }}>Areas for Attention</span>
                        </div>
                        <ul className="text-xs space-y-1" style={{ color: colors.warningText }}>
                            <li>• Several Arts & Humanities programs at risk</li>
                            <li>• Cost per student rising in Healthcare</li>
                            <li>• Enrollment declining in Certificate programs</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div
                className="rounded-xl p-5"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
            >
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={16} style={{ color: colors.accent }} />
                    <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Recommendations</h2>
                </div>
                <div className="space-y-3">
                    {[
                        { title: 'Review At-Risk Programs', desc: 'Conduct strategic review of programs with viability scores below 40.' },
                        { title: 'Expand High-Performers', desc: 'Increase capacity in Computer Science and Data Science programs.' },
                        { title: 'Strengthen Partnerships', desc: 'Develop co-op programs with top employers to improve outcomes.' },
                    ].map((rec, idx) => (
                        <div
                            key={idx}
                            className="flex gap-3 p-3 rounded-lg"
                            style={{ backgroundColor: colors.tableHeader }}
                        >
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                                style={{ backgroundColor: colors.accentBg, color: colors.accent }}
                            >
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
