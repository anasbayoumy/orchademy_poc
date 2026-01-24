'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface LineChartProps { data: Array<Record<string, string | number>>; xKey: string; lines: Array<{ dataKey: string; color: string; name?: string }>; height?: number; showLegend?: boolean; }

export default function LineChartComponent({ data, xKey, lines, height = 300, showLegend = false }: LineChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    const bgColor = isDark ? '#1e293b' : '#ffffff';

    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: textColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: bgColor, border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12, color: textColor }} labelStyle={{ color: textColor }} itemStyle={{ color: textColor }} />
                {showLegend && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} iconType="circle" iconSize={8} />}
                {lines.map((line) => (<Line key={line.dataKey} type="monotone" dataKey={line.dataKey} stroke={line.color} name={line.name || line.dataKey} strokeWidth={2} dot={{ r: 4, fill: line.color, strokeWidth: 2 }} activeDot={{ r: 6, fill: line.color, stroke: bgColor, strokeWidth: 2 }} animationDuration={800} />))}
            </LineChart>
        </ResponsiveContainer>
    );
}
