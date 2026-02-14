'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface LineChartProps {
    data: Array<Record<string, string | number>>;
    xKey: string;
    lines: Array<{ dataKey: string; color: string; name?: string }>;
    height?: number;
    showLegend?: boolean;
    /** optional formatter for y-axis values (receives number) */
    yFormatter?: (value: number) => string;
}

export default function LineChartComponent({ data, xKey, lines, height = 300, showLegend = false, yFormatter }: LineChartProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.08)';
    const bgColor = isDark ? '#0b1220' : '#ffffff';

    const defaultYFormatter = (val: number) => {
        const n = Number(val || 0);
        const abs = Math.abs(n);
        if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
        if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
        return String(n);
    };

    const formatY = (v: any) => {
        const num = typeof v === 'number' ? v : Number(v);
        return (yFormatter || defaultYFormatter)(num);
    };

    const formatX = (val: any) => {
        if (typeof val === 'string' && val.includes('-')) return val.split('-')[0];
        return String(val);
    };

    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 6, right: 8, left: -6, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: textColor }} axisLine={{ stroke: 'transparent' }} tickLine={false} tickFormatter={formatX} />
                <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} tickFormatter={formatY} />
                <Tooltip
                    contentStyle={{ background: bgColor, border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12, color: textColor }}
                    labelStyle={{ color: textColor }}
                    itemStyle={{ color: textColor }}
                    formatter={(value: any) => [formatY(value as number), '']}
                />
                {showLegend && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} iconType="circle" iconSize={8} />}
                {lines.map((line) => (
                    <Line
                        key={line.dataKey}
                        type="monotone"
                        dataKey={line.dataKey}
                        stroke={line.color}
                        name={line.name || line.dataKey}
                        strokeWidth={3}
                        dot={{ r: 3, fill: line.color, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: line.color, stroke: bgColor, strokeWidth: 2 }}
                        animationDuration={800}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
