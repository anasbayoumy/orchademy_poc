'use client';

import Header from '@/components/layout/Header';
import LineChartComponent from '@/components/charts/LineChart';
import { Star, ThumbsUp, AlertCircle } from 'lucide-react';
import { getImpactMetrics, getEmployerFeedback, EMPLOYABILITY_DATA } from '@/data/employability';

export default function ImpactDashboard() {
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
                    <div key={metric.label} className="card p-4 text-center">
                        <p className="text-xl font-semibold text-gray-900">{metric.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{metric.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="card p-5">
                    <h2 className="text-sm font-medium text-gray-900 mb-4">Employment Rate Trend</h2>
                    <LineChartComponent
                        data={trendData}
                        xKey="year"
                        lines={[{ dataKey: 'rate', color: '#22c55e', name: 'Employment Rate' }]}
                        height={200}
                    />
                </div>

                <div className="card p-5">
                    <h2 className="text-sm font-medium text-gray-900 mb-4">Employment by Program</h2>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {EMPLOYABILITY_DATA.sort((a, b) => b.employmentRate - a.employmentRate).map((prog) => (
                            <div key={prog.programId} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-medium text-gray-900">{prog.programName}</span>
                                        <span className={`text-xs font-medium ${prog.employmentRate >= 85 ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                            {prog.employmentRate}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${prog.employmentRate >= 85 ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}
                                            style={{ width: `${prog.employmentRate}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card p-5">
                <h2 className="text-sm font-medium text-gray-900 mb-4">Employer Feedback</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feedback.map((emp) => (
                        <div key={emp.employer} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                    {emp.employer.substring(0, 2)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{emp.employer}</p>
                                    <p className="text-xs text-gray-500">{emp.industry}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-medium">{emp.satisfactionScore.toFixed(1)}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{emp.hiresCount} hires</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <ThumbsUp size={12} className="text-green-500 mt-0.5" />
                                    <div className="flex flex-wrap gap-1">
                                        {emp.strengthAreas.slice(0, 2).map((s, i) => (
                                            <span key={i} className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={12} className="text-yellow-500 mt-0.5" />
                                    <div className="flex flex-wrap gap-1">
                                        {emp.improvementAreas.slice(0, 2).map((s, i) => (
                                            <span key={i} className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
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
