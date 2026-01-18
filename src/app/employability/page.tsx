'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import DataTable from '@/components/ui/DataTable';
import BarChartComponent from '@/components/charts/BarChart';
import { Briefcase, DollarSign, Users, Star } from 'lucide-react';
import { EMPLOYABILITY_DATA, type EmployabilityMetric } from '@/data/employability';
import { useLanguage } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';

export default function EmployabilityScorecard() {
    const { t, isRTL } = useLanguage();
    const colors = useColors();

    const avgEmploymentRate = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.employmentRate, 0) / EMPLOYABILITY_DATA.length;
    const avgSalary = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.avgStartingSalary, 0) / EMPLOYABILITY_DATA.length;
    const totalGraduates = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.graduateCount, 0);
    const avgSatisfaction = EMPLOYABILITY_DATA.reduce((sum, e) => sum + e.employerSatisfaction, 0) / EMPLOYABILITY_DATA.length;

    const chartData = EMPLOYABILITY_DATA.map(e => ({
        name: e.programName.split(' ')[0],
        rate: e.employmentRate,
    }));

    const columns = [
        { key: 'programName', header: t('programs.programName') },
        { key: 'department', header: t('faculty.dept') },
        {
            key: 'employmentRate',
            header: t('programs.employment'),
            render: (item: EmployabilityMetric) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.isDark ? '#334155' : '#e2e8f0' }}>
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
            header: t('employability.timeToEmploy'),
            render: (item: EmployabilityMetric) => `${item.avgTimeToEmployment} mo`
        },
        {
            key: 'avgStartingSalary',
            header: t('employability.avgSalary'),
            render: (item: EmployabilityMetric) => `$${(item.avgStartingSalary / 1000).toFixed(0)}K`
        },
        {
            key: 'employerSatisfaction',
            header: t('employability.rating'),
            render: (item: EmployabilityMetric) => (
                <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span>{item.employerSatisfaction.toFixed(1)}</span>
                </div>
            )
        },
        { key: 'graduateCount', header: t('employability.totalGraduates') },
    ];

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header
                title={t('employability.scorecardTitle')}
                subtitle={t('employability.scorecardSubtitle')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                    title={t('employability.employmentRate')}
                    value={`${avgEmploymentRate.toFixed(0)}%`}
                    change={4}
                    changeLabel={t('common.vsLastYear')}
                    icon={<Briefcase size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title={t('employability.avgSalary')}
                    value={`$${(avgSalary / 1000).toFixed(0)}K`}
                    change={8}
                    icon={<DollarSign size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title={t('employability.totalGraduates')}
                    value={totalGraduates}
                    change={12}
                    icon={<Users size={20} strokeWidth={1.5} />}
                />
                <MetricCard
                    title={t('employability.employerRating')}
                    value={`${avgSatisfaction.toFixed(1)}/5`}
                    change={3}
                    icon={<Star size={20} strokeWidth={1.5} />}
                />
            </div>

            <div className="p-5 mb-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>{t('employability.employmentRateByProgram')}</h2>
                <BarChartComponent
                    data={chartData}
                    xKey="name"
                    bars={[{ dataKey: 'rate', color: '#6366f1', name: t('dashboard.employmentRate') }]}
                    height={200}
                />
            </div>

            <div>
                <div>
                    <h2 className="text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>{t('employability.programScorecard')}</h2>
                    <DataTable<EmployabilityMetric>
                        data={EMPLOYABILITY_DATA}
                        columns={columns}
                        searchPlaceholder={t('common.search')}
                        pageSize={10}
                    />
                </div>
            </div>
        </div>
    );
}
