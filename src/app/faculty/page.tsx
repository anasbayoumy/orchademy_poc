'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import DataTable from '@/components/ui/DataTable';
import BarChartComponent from '@/components/charts/BarChart';
import { Users, UserCheck, AlertTriangle, TrendingDown } from 'lucide-react';
import { FACULTY_DATA, getDepartmentSummary, type Faculty } from '@/data/faculty';
import { useColors } from '@/hooks/useColors';
import { useDateFilter, getDateAdjustments } from '@/context/DateFilterContext';

export default function FacultyLoadSummary() {
    const colors = useColors();
    const { dateRange } = useDateFilter();
    const adjustments = getDateAdjustments(dateRange);

    const deptSummary = getDepartmentSummary();

    const totalFaculty = Math.round(FACULTY_DATA.length * adjustments.value);
    const overloaded = Math.round(FACULTY_DATA.filter(f => f.status === 'Overloaded').length * adjustments.value);
    const underloaded = Math.round(FACULTY_DATA.filter(f => f.status === 'Underloaded').length * adjustments.variation);
    const totalFTE = Math.round(FACULTY_DATA.reduce((sum, f) => sum + (f.ftePercentage / 100), 0) * adjustments.value * 10) / 10;

    const workloadChartData = deptSummary.map(d => ({
        name: d.department.split(' ')[0],
        overloaded: Math.round(d.overloaded * adjustments.value),
        balanced: Math.round(d.balanced * adjustments.value),
        underloaded: Math.round(d.underloaded * adjustments.variation),
    }));

    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'rank', header: 'Rank' },
        { key: 'department', header: 'Department' },
        { key: 'contractType', header: 'Contract' },
        { key: 'ftePercentage', header: 'FTE', render: (item: Faculty) => `${item.ftePercentage}%` },
        {
            key: 'teachingLoad', header: 'Load',
            render: (item: Faculty) => (
                <span style={{ color: item.teachingLoad > item.maxTeachingLoad + 3 ? colors.dangerText : item.teachingLoad < item.maxTeachingLoad - 3 ? colors.infoText : colors.textPrimary, fontWeight: item.teachingLoad !== item.maxTeachingLoad ? 500 : 400 }}>
                    {Math.round(item.teachingLoad * adjustments.value)} / {item.maxTeachingLoad} hrs
                </span>
            )
        },
        {
            key: 'status', header: 'Status',
            render: (item: Faculty) => {
                const style = item.status === 'Balanced' ? { bg: colors.successBg, color: colors.successText }
                    : item.status === 'Overloaded' ? { bg: colors.dangerBg, color: colors.dangerText }
                        : { bg: colors.infoBg, color: colors.infoText };
                return <span className="text-xs px-2 py-1 rounded-md font-medium" style={{ backgroundColor: style.bg, color: style.color }}>{item.status}</span>;
            }
        },
    ];

    return (
        <div className="animate-fade-in">
            <Header title="Faculty Load Summary" subtitle="Current vs. required FTEs per program" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <MetricCard title="Total Faculty" value={totalFaculty} icon={<Users size={20} strokeWidth={1.5} />} change={Math.round(adjustments.growth * 0.5)} changeLabel="vs last term" />
                <MetricCard title="Total FTE" value={totalFTE} change={Math.round(adjustments.growth * 0.4)} changeLabel="vs required" icon={<UserCheck size={20} strokeWidth={1.5} />} />
                <MetricCard title="Overloaded" value={overloaded} change={Math.round(-adjustments.growth)} changeLabel="vs last term" icon={<AlertTriangle size={20} strokeWidth={1.5} />} />
                <MetricCard title="Underloaded" value={underloaded} icon={<TrendingDown size={20} strokeWidth={1.5} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 sm:p-5 lg:col-span-2 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>
                        Workload Distribution by Department
                        <span className="text-xs ml-2 font-normal" style={{ color: colors.textSecondary }}>({dateRange})</span>
                    </h2>
                    <BarChartComponent data={workloadChartData} xKey="name" bars={[
                        { dataKey: 'overloaded', color: '#ef4444', name: 'Overloaded' },
                        { dataKey: 'balanced', color: '#22c55e', name: 'Balanced' },
                        { dataKey: 'underloaded', color: '#3b82f6', name: 'Underloaded' },
                    ]} height={240} showLegend />
                </div>

                <div className="p-4 sm:p-5 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Department Summary</h2>
                    <div className="space-y-3">
                        {deptSummary.map((dept) => {
                            const adjustedFTE = Math.round(dept.currentFTE * adjustments.value * 10) / 10;
                            const gap = Math.round((adjustedFTE - dept.requiredFTE) * 10) / 10;
                            return (
                                <div key={dept.department} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{dept.department.split(' ')[0]}</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{Math.round(dept.totalFaculty * adjustments.value)} faculty</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{adjustedFTE} FTE</p>
                                        <p className="text-xs" style={{ color: gap >= 0 ? colors.successText : colors.dangerText }}>{gap >= 0 ? '+' : ''}{gap} gap</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>All Faculty</h2>
                <DataTable data={FACULTY_DATA} columns={columns} searchPlaceholder="Search faculty..." pageSize={10} />
            </div>
        </div>
    );
}
