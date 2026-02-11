'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface LineChartProps {
    data: Array<Record<string, string | number>>;
    xKey: string;
    lines: Array<{ dataKey: string; name?: string }>;
    height?: number;
    showLegend?: boolean;
}

export default function LineChartComponent({
    data,
    xKey,
    lines,
    height = 300,
    showLegend = false
}: LineChartProps) {

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const brandColors = [
        '#2493a2',  // primary trend
        '#57b6a2',  // secondary
        '#d4af37',  // warning
        '#ef4444'   // danger
    ];

    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    const bgColor = isDark ? '#1e293b' : '#ffffff';

    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={gridColor}
                    vertical={false}
                />

                <XAxis
                    dataKey={xKey}
                    tick={{
                        fontSize: 11,
                        fill: textColor,
                        fontFamily: 'Inter, sans-serif'
                    }}
                    axisLine={{ stroke: gridColor }}
                    tickLine={false}
                />

                <YAxis
                    tick={{
                        fontSize: 11,
                        fill: textColor,
                        fontFamily: 'Inter, sans-serif'
                    }}
                    axisLine={false}
                    tickLine={false}
                />

                <Tooltip
                    contentStyle={{
                        background: bgColor,
                        border: `1px solid ${gridColor}`,
                        borderRadius: 8,
                        fontSize: 12,
                        color: textColor,
                        fontFamily: 'Inter, sans-serif'
                    }}
                    labelStyle={{
                        color: textColor,
                        fontFamily: 'Inter, sans-serif'
                    }}
                    itemStyle={{
                        color: textColor,
                        fontFamily: 'Inter, sans-serif'
                    }}
                />

                {showLegend && (
                    <Legend
                        wrapperStyle={{
                            fontSize: 12,
                            paddingTop: 16,
                            fontFamily: 'Inter, sans-serif'
                        }}
                        iconType="circle"
                        iconSize={8}
                    />
                )}

                {lines.map((line, index) => {
                    const color = brandColors[index % brandColors.length];

                    return (
                        <Line
                            key={line.dataKey}
                            type="monotone"
                            dataKey={line.dataKey}
                            stroke={color}
                            name={line.name || line.dataKey}
                            strokeWidth={2}
                            dot={{
                                r: 4,
                                fill: color,
                                strokeWidth: 2
                            }}
                            activeDot={{
                                r: 6,
                                fill: color,
                                stroke: bgColor,
                                strokeWidth: 2
                            }}
                            animationDuration={800}
                        />
                    );
                })}
            </LineChart>
        </ResponsiveContainer>
    );
}
