'use client';

import Header from '@/components/layout/Header';
import LineChartComponent from '@/components/charts/LineChart';
import { Star, ThumbsUp, AlertCircle } from 'lucide-react';
import { getImpactMetrics, getEmployerFeedback, EMPLOYABILITY_DATA } from '@/data/employability';
import { useColors } from '@/hooks/useColors';

export default function ImpactDashboard() {
    const colors = useColors();
    const metrics = getImpactMetrics();
    const feedback = getEmployerFeedback();

    const trendData = [
        { year: '2021', rate: 78 },
        { year: '2022', rate: 81 },
        { year: '2023', rate: 84 },
        { year: '2024', rate: 87 },
    ];

    return (
        <div className="animate-fade-in">
            <Header
                title="Impact Dashboard"
                subtitle="Employment tracking and employer feedback"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="rounded-xl p-4 text-center"
                        style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                    >
                        <p className="text-xl font-semibold" style={{ color: colors.textPrimary }}>{metric.value}</p>
                        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>{metric.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div
                    className="rounded-xl p-5"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Employment Rate Trend</h2>
                    <LineChartComponent
                        data={trendData}
                        xKey="year"
                        lines={[{ dataKey: 'rate', color: '#22c55e', name: 'Employment Rate' }]}
                        height={200}
                    />
                </div>

                <div
                    className="rounded-xl p-5"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Employment by Program</h2>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {EMPLOYABILITY_DATA.sort((a, b) => b.employmentRate - a.employmentRate).map((prog) => (
                            <div key={prog.programId} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>{prog.programName}</span>
                                        <span
                                            className="text-xs font-medium"
                                            style={{ color: prog.employmentRate >= 85 ? colors.successText : colors.warningText }}
                                        >
                                            {prog.employmentRate}%
                                        </span>
                                    </div>
                                    <div
                                        className="h-1.5 rounded-full overflow-hidden"
                                        style={{ backgroundColor: colors.isDark ? 'rgba(148, 163, 184, 0.2)' : '#e5e7eb' }}
                                    >
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${prog.employmentRate}%`,
                                                backgroundColor: prog.employmentRate >= 85 ? colors.successIcon : colors.warningText
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="rounded-xl p-5"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
            >
                <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Employer Feedback</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feedback.map((emp) => (
                        <div
                            key={emp.employer}
                            className="p-4 rounded-lg"
                            style={{ backgroundColor: colors.tableHeader }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium"
                                    style={{ backgroundColor: colors.accentBg, color: colors.accent }}
                                >
                                    {emp.employer.substring(0, 2)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{emp.employer}</p>
                                    <p className="text-xs" style={{ color: colors.textSecondary }}>{emp.industry}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <Star size={12} className="fill-yellow-500" style={{ color: '#eab308' }} />
                                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{emp.satisfactionScore.toFixed(1)}</span>
                                <span style={{ color: colors.textSecondary }}>•</span>
                                <span className="text-xs" style={{ color: colors.textSecondary }}>{emp.hiresCount} hires</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <ThumbsUp size={12} className="mt-0.5" style={{ color: colors.successText }} />
                                    <div className="flex flex-wrap gap-1">
                                        {emp.strengthAreas.slice(0, 2).map((s, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-1.5 py-0.5 rounded"
                                                style={{ backgroundColor: colors.successBg, color: colors.successText }}
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={12} className="mt-0.5" style={{ color: colors.warningText }} />
                                    <div className="flex flex-wrap gap-1">
                                        {emp.improvementAreas.slice(0, 2).map((s, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-1.5 py-0.5 rounded"
                                                style={{ backgroundColor: colors.warningBg, color: colors.warningText }}
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
