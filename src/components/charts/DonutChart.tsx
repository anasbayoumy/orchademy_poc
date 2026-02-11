'use client';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface DonutChartProps {
    data: Array<{ name: string; value: number }>;
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
    showLegend?: boolean;
}

export default function DonutChart({
    data,
    height = 250,
    innerRadius = 60,
    outerRadius = 90,
    showLegend = true
}: DonutChartProps) {

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const brandColors = [
        '#57b6a2',  // success
        '#2493a2',  // info
        '#d4af37',  // warning
        '#ef4444'   // danger
    ];

    const textColor = isDark ? '#cbd5e1' : '#475569';
    const bgColor = isDark ? '#1e293b' : '#ffffff';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={800}
                    animationEasing="ease-out"
                >
                    {data.map((_, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={brandColors[index % brandColors.length]}
                            stroke={bgColor}
                            strokeWidth={2}
                        />
                    ))}
                </Pie>

                <Tooltip
                    contentStyle={{
                        background: bgColor,
                        border: `1px solid ${gridColor}`,
                        borderRadius: 8,
                        fontSize: 12,
                        color: textColor,
                        fontFamily: 'Inter, sans-serif'
                    }}
                    formatter={(value, name) => [
                        `${Number(value).toLocaleString()} students`,
                        name
                    ]}
                    labelStyle={{
                        color: textColor,
                        fontWeight: 600,
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
                            fontSize: 11,
                            color: textColor,
                            paddingTop: 8,
                            fontFamily: 'Inter, sans-serif'
                        }}
                        iconType="circle"
                        iconSize={8}
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                    />
                )}
            </PieChart>
        </ResponsiveContainer>
    );
}
