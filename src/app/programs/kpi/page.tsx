'use client';

import Header from '@/components/layout/Header';
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getKPISummary } from '@/data/programs';

export default function KPIReport() {
    const kpis = getKPISummary();

    return (
        <div className="animate-fade-in">
            <Header
                title="KPI Summary Report"
                subtitle="Automated narrative insights of program performance"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {kpis.map((kpi) => (
                    <div key={kpi.metric} className="card p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{kpi.metric}</p>
                            <span className={`badge ${kpi.status === 'On Track' ? 'badge-success' :
                                    kpi.status === 'At Risk' ? 'badge-warning' : 'badge-danger'
                                }`}>
                                {kpi.status}
                            </span>
                        </div>

                        <p className="text-2xl font-semibold text-gray-900 mb-1">{kpi.value}</p>

                        <div className="flex items-center gap-2 mb-3">
                            {kpi.trend === 'up' && <TrendingUp size={14} className="text-green-600" />}
                            {kpi.trend === 'down' && <TrendingDown size={14} className="text-red-600" />}
                            {kpi.trend === 'stable' && <Minus size={14} className="text-gray-400" />}
                            <span className="text-xs text-gray-500">Target: {kpi.target}</span>
                        </div>

                        <p className="text-xs text-gray-600 p-3 bg-gray-50 rounded">{kpi.insight}</p>
                    </div>
                ))}
            </div>

            <div className="card p-5 mb-6">
                <h2 className="text-sm font-medium text-gray-900 mb-4">Executive Summary</h2>
                <p className="text-sm text-gray-600 mb-4">
                    The academic portfolio shows strong overall performance with revenue growth of 8% year-over-year.
                    STEM programs continue to lead in enrollment and employment outcomes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={16} className="text-green-600" />
                            <span className="text-sm font-medium text-green-900">Strengths</span>
                        </div>
                        <ul className="text-xs text-green-800 space-y-1">
                            <li>• STEM programs showing highest growth rates</li>
                            <li>• Graduate employment outcomes improving</li>
                            <li>• Enrollment targets met for 80% of programs</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={16} className="text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-900">Areas for Attention</span>
                        </div>
                        <ul className="text-xs text-yellow-800 space-y-1">
                            <li>• Several Arts & Humanities programs at risk</li>
                            <li>• Cost per student rising in Healthcare</li>
                            <li>• Enrollment declining in Certificate programs</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="card p-5">
                <h2 className="text-sm font-medium text-gray-900 mb-4">Recommendations</h2>
                <div className="space-y-3">
                    {[
                        { title: 'Review At-Risk Programs', desc: 'Conduct strategic review of programs with viability scores below 40.' },
                        { title: 'Expand High-Performers', desc: 'Increase capacity in Computer Science and Data Science programs.' },
                        { title: 'Strengthen Partnerships', desc: 'Develop co-op programs with top employers to improve outcomes.' },
                    ].map((rec, idx) => (
                        <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                                {idx + 1}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                                <p className="text-xs text-gray-600">{rec.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
