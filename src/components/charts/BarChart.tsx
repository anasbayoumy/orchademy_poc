'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface BarChartProps { data: Array<Record<string, string | number>>; xKey: string; bars: Array<{ dataKey: string; color: string; name?: string }>; height?: number; showLegend?: boolean; }

export default function BarChartComponent({ data, xKey, bars, height = 300, showLegend = false }: BarChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    const bgColor = isDark ? '#1e293b' : '#ffffff';

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: textColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: bgColor, border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12, color: textColor }} labelStyle={{ color: textColor }} cursor={{ fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.5 }} />
                {showLegend && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} iconType="circle" iconSize={8} />}
                {bars.map((bar) => (<Bar key={bar.dataKey} dataKey={bar.dataKey} fill={bar.color} name={bar.name || bar.dataKey} radius={[4, 4, 0, 0]} animationDuration={800} animationEasing="ease-out" />))}
            </BarChart>
        </ResponsiveContainer>
    );
}
