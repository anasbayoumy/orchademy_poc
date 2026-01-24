'use client';

import Header from '@/components/layout/Header';
import BarChartComponent from '@/components/charts/BarChart';
import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { getSkillAlignmentData } from '@/data/employability';
import { useColors } from '@/hooks/useColors';

export default function SkillsMap() {
    const colors = useColors();
    const skillsData = getSkillAlignmentData();

    const alignedSkills = skillsData.filter(s => Math.abs(s.gap) <= 10);
    const gapSkills = skillsData.filter(s => s.gap < -10);
    const highDemandSkills = skillsData.filter(s => s.marketDemand === 'High');

    const chartData = skillsData.slice(0, 8).map(s => ({
        name: s.skill.split(' ')[0],
        coverage: s.curriculumCoverage,
    }));

    const getDemandStyles = (demand: string) => {
        if (colors.isDark) {
            switch (demand) {
                case 'High': return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' };
                case 'Medium': return { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15' };
                default: return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8' };
            }
        }
        switch (demand) {
            case 'High': return { bg: '#f0fdf4', text: '#16a34a' };
            case 'Medium': return { bg: '#fefce8', text: '#ca8a04' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    return (
        <div className="animate-fade-in">
            <Header
                title="Skills-Outcome Alignment Map"
                subtitle="Curriculum to market-demanded skills mapping"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div
                    className="rounded-xl p-5 flex items-center gap-4"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: colors.successBg }}
                    >
                        <CheckCircle size={20} style={{ color: colors.successText }} />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>{alignedSkills.length}</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Well-Aligned</p>
                    </div>
                </div>
                <div
                    className="rounded-xl p-5 flex items-center gap-4"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: colors.dangerBg }}
                    >
                        <AlertTriangle size={20} style={{ color: colors.dangerText }} />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>{gapSkills.length}</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Skills Gaps</p>
                    </div>
                </div>
                <div
                    className="rounded-xl p-5 flex items-center gap-4"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: colors.accentBg }}
                    >
                        <TrendingUp size={20} style={{ color: colors.accent }} />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>{highDemandSkills.length}</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>High Demand</p>
                    </div>
                </div>
            </div>

            <div
                className="rounded-xl p-5 mb-6"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
            >
                <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Curriculum Coverage by Skill</h2>
                <BarChartComponent
                    data={chartData}
                    xKey="name"
                    bars={[{ dataKey: 'coverage', color: '#6366f1', name: 'Coverage %' }]}
                    height={220}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div
                    className="rounded-xl overflow-hidden"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    <div
                        className="px-5 py-4 flex items-center justify-between"
                        style={{ borderBottom: `1px solid ${colors.border}` }}
                    >
                        <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Skills to Strengthen</h2>
                        <span
                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: colors.dangerBg, color: colors.dangerText }}
                        >
                            {gapSkills.length}
                        </span>
                    </div>
                    <div className="p-5 space-y-3">
                        {gapSkills.length === 0 ? (
                            <p className="text-sm" style={{ color: colors.textSecondary }}>No significant gaps</p>
                        ) : (
                            gapSkills.map(skill => (
                                <div
                                    key={skill.skill}
                                    className="flex items-center justify-between py-2"
                                    style={{ borderBottom: `1px solid ${colors.border}` }}
                                >
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{skill.skill}</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{skill.curriculumCoverage}% coverage</p>
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: colors.dangerText }}>{skill.gap}%</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div
                    className="rounded-xl overflow-hidden"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                >
                    <div
                        className="px-5 py-4 flex items-center justify-between"
                        style={{ borderBottom: `1px solid ${colors.border}` }}
                    >
                        <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Well-Aligned Skills</h2>
                        <span
                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: colors.successBg, color: colors.successText }}
                        >
                            {alignedSkills.length}
                        </span>
                    </div>
                    <div className="p-5 space-y-3">
                        {alignedSkills.slice(0, 5).map(skill => {
                            const demandStyles = getDemandStyles(skill.marketDemand);
                            return (
                                <div
                                    key={skill.skill}
                                    className="flex items-center justify-between py-2"
                                    style={{ borderBottom: `1px solid ${colors.border}` }}
                                >
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{skill.skill}</p>
                                        <span
                                            className="px-2 py-0.5 rounded text-xs font-medium"
                                            style={{ backgroundColor: demandStyles.bg, color: demandStyles.text }}
                                        >
                                            {skill.marketDemand}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: colors.successText }}>{skill.curriculumCoverage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
