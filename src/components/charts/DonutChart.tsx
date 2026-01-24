'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface DonutChartProps { data: Array<{ name: string; value: number; color: string }>; height?: number; innerRadius?: number; outerRadius?: number; showLegend?: boolean; }

export default function DonutChart({ data, height = 250, innerRadius = 60, outerRadius = 90, showLegend = true }: DonutChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const bgColor = isDark ? '#1e293b' : '#ffffff';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={3} dataKey="value" animationDuration={800} animationEasing="ease-out">
                    {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke={bgColor} strokeWidth={2} />))}
                </Pie>
                <Tooltip
                    contentStyle={{ background: bgColor, border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12, color: textColor }}
                    formatter={(value, name) => [`${Number(value).toLocaleString()} students`, name]}
                    labelStyle={{ color: textColor, fontWeight: 600 }}
                    itemStyle={{ color: textColor }}
                />
                {showLegend && <Legend wrapperStyle={{ fontSize: 11, color: textColor, paddingTop: 8 }} iconType="circle" iconSize={8} layout="horizontal" verticalAlign="bottom" align="center" />}
            </PieChart>
        </ResponsiveContainer>
    );
}
