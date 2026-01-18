'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import DataTable from '@/components/ui/DataTable';
import BarChartComponent from '@/components/charts/BarChart';
import { Briefcase, DollarSign, Users, Star } from 'lucide-react';
import { EMPLOYABILITY_DATA, type EmployabilityMetric } from '@/data/employability';

export default function EmployabilityScorecard() {
    const avgEmploymentRate = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.employmentRate, 0) / EMPLOYABILITY_DATA.length;
    const avgSalary = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.avgStartingSalary, 0) / EMPLOYABILITY_DATA.length;
    const totalGraduates = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.graduateCount, 0);
    const avgSatisfaction = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.employerSatisfaction, 0) / EMPLOYABILITY_DATA.length;

    const chartData = EMPLOYABILITY_DATA.map(e => ({
        name: e.programName.split(' ')[0],
        rate: e.employmentRate,
    }));

    const columns = [
        { key: 'programName', header: 'Program' },
        { key: 'department', header: 'Dept' },
        {
            key: 'employmentRate',
            header: 'Employment',
            render: (item: EmployabilityMetric) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${item.employmentRate >= 85 ? 'bg-green-500' : item.employmentRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${item.employmentRate}%` }}
                        />
                    </div>
                    <span className="text-xs">{item.employmentRate}%</span>
                </div>
            )
        },
        {
            key: 'avgTimeToEmployment',
            header: 'Time to Employ',
            render: (item: EmployabilityMetric) => `${item.avgTimeToEmployment} mo`
        },
        {
            key: 'avgStartingSalary',
            header: 'Avg Salary',
            render: (item: EmployabilityMetric) => `$${(item.avgStartingSalary / 1000).toFixed(0)}K`
        },
        {
            key: 'employerSatisfaction',
            header: 'Rating',
            render: (item: EmployabilityMetric) => (
                <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span>{item.employerSatisfaction.toFixed(1)}</span>
                </div>
            )
        },
        { key: 'graduateCount', header: 'Graduates' },
    ];

    return (
        <div className="animate-fade-in">
            <Header
                title="Employability Scorecard"
                subtitle="Graduate outcomes per program"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                    title="Avg Employment Rate"
                    value={`${avgEmploymentRate.toFixed(0)}%`}
                    change={4}
                    changeLabel="vs last year"
                    icon={<Briefcase size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title="Avg Starting Salary"
                    value={`$${(avgSalary / 1000).toFixed(0)}K`}
                    change={8}
                    icon={<DollarSign size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title="Total Graduates"
                    value={totalGraduates}
                    change={12}
                    icon={<Users size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title="Employer Rating"
                    value={`${avgSatisfaction.toFixed(1)}/5`}
                    change={3}
                    icon={<Star size={20} strokeWidth={1.5} />}
                />
            </div>

            <div className="card p-5 mb-6">
                <h2 className="text-sm font-medium text-gray-900 mb-4">Employment Rate by Program</h2>
                <BarChartComponent
                    data={chartData}
                    xKey="name"
                    bars={[{ dataKey: 'rate', color: '#6366f1', name: 'Employment Rate' }]}
                    height={200}
                />
            </div>

            <div>
                <div>
                    <h2 className="text-sm font-medium text-gray-900 mb-3">Program Scorecard</h2>
                    <DataTable<EmployabilityMetric>
                        data={EMPLOYABILITY_DATA}
                        columns={columns}
                        searchPlaceholder="Search programs..."
                        pageSize={10}
                    />
                </div>
            </div>
        </div>
    );
}
