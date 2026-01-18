'use client';

import Header from '@/components/layout/Header';
import BarChartComponent from '@/components/charts/BarChart';
import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { getSkillAlignmentData } from '@/data/employability';

export default function SkillsMap() {
    const skillsData = getSkillAlignmentData();

    const alignedSkills = skillsData.filter(s => Math.abs(s.gap) <= 10);
    const gapSkills = skillsData.filter(s => s.gap < -10);
    const highDemandSkills = skillsData.filter(s => s.marketDemand === 'High');

    const chartData = skillsData.slice(0, 8).map(s => ({
        name: s.skill.split(' ')[0],
        coverage: s.curriculumCoverage,
    }));

    return (
        <div className="animate-fade-in">
            <Header
                title="Skills-Outcome Alignment Map"
                subtitle="Curriculum to market-demanded skills mapping"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="card p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-gray-900">{alignedSkills.length}</p>
                        <p className="text-xs text-gray-500">Well-Aligned</p>
                    </div>
                </div>
                <div className="card p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <AlertTriangle size={20} className="text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-gray-900">{gapSkills.length}</p>
                        <p className="text-xs text-gray-500">Skills Gaps</p>
                    </div>
                </div>
                <div className="card p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <TrendingUp size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-gray-900">{highDemandSkills.length}</p>
                        <p className="text-xs text-gray-500">High Demand</p>
                    </div>
                </div>
            </div>

            <div className="card p-5 mb-6">
                <h2 className="text-sm font-medium text-gray-900 mb-4">Curriculum Coverage by Skill</h2>
                <BarChartComponent
                    data={chartData}
                    xKey="name"
                    bars={[{ dataKey: 'coverage', color: '#6366f1', name: 'Coverage %' }]}
                    height={220}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-medium text-gray-900">Skills to Strengthen</h2>
                        <span className="badge badge-danger">{gapSkills.length}</span>
                    </div>
                    <div className="p-5 space-y-3">
                        {gapSkills.length === 0 ? (
                            <p className="text-sm text-gray-500">No significant gaps</p>
                        ) : (
                            gapSkills.map(skill => (
                                <div key={skill.skill} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{skill.skill}</p>
                                        <p className="text-xs text-gray-500">{skill.curriculumCoverage}% coverage</p>
                                    </div>
                                    <span className="text-sm text-red-600 font-medium">{skill.gap}%</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-medium text-gray-900">Well-Aligned Skills</h2>
                        <span className="badge badge-success">{alignedSkills.length}</span>
                    </div>
                    <div className="p-5 space-y-3">
                        {alignedSkills.slice(0, 5).map(skill => (
                            <div key={skill.skill} className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{skill.skill}</p>
                                    <span className={`badge text-xs ${skill.marketDemand === 'High' ? 'badge-success' :
                                            skill.marketDemand === 'Medium' ? 'badge-warning' : 'badge-neutral'
                                        }`}>
                                        {skill.marketDemand}
                                    </span>
                                </div>
                                <span className="text-sm text-green-600 font-medium">{skill.curriculumCoverage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
