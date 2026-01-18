'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import BarChartComponent from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import { PROGRAMS_DATA } from '@/data/programs';

export default function ProgramAnalytics() {
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
        color: level === 'Bachelor' ? '#6366f1' : level === 'Master' ? '#22c55e' : level === 'Doctorate' ? '#eab308' : '#ef4444',
    }));

    const topPrograms = [...PROGRAMS_DATA].sort((a, b) => b.profitMargin - a.profitMargin).slice(0, 5);

    return (
        <div className="animate-fade-in">
            <Header
                title="Program Analytics Dashboard"
                subtitle="Program size, cost, revenue, and performance overview"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                    title="Total Enrollment"
                    value={totalEnrollment.toLocaleString()}
                    change={12}
                    changeLabel="vs last year"
                    icon={<Users size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title="Total Revenue"
                    value={`$${(totalRevenue / 1000000).toFixed(1)}M`}
                    change={8}
                    icon={<DollarSign size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title="Avg Profit Margin"
                    value={`${avgProfitMargin.toFixed(1)}%`}
                    change={5}
                    icon={<TrendingUp size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title="Net Profit"
                    value={`$${((totalRevenue - totalCost) / 1000000).toFixed(1)}M`}
                    icon={<Award size={20} strokeWidth={1.5} />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="card p-5 lg:col-span-2">
                    <h2 className="text-sm font-medium text-gray-900 mb-4">Revenue vs Cost by Department (in $M)</h2>
                    <BarChartComponent
                        data={revenueChartData}
                        xKey="name"
                        bars={[
                            { dataKey: 'revenue', color: '#22c55e', name: 'Revenue' },
                            { dataKey: 'cost', color: '#ef4444', name: 'Cost' },
                        ]}
                        height={240}
                        showLegend
                    />
                </div>

                <div className="card p-5">
                    <h2 className="text-sm font-medium text-gray-900 mb-4">Enrollment by Degree</h2>
                    <DonutChart data={degreeData} height={200} />
                </div>
            </div>

            <div className="card p-5">
                <h2 className="text-sm font-medium text-gray-900 mb-4">Top Performing Programs</h2>
                <div className="space-y-3">
                    {topPrograms.map((prog, idx) => (
                        <div key={prog.id} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                {idx + 1}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{prog.name}</p>
                                <p className="text-xs text-gray-500">{prog.department}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">{prog.profitMargin}%</p>
                                <p className="text-xs text-gray-500">profit margin</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
