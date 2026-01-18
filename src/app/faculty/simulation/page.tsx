'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import LineChartComponent from '@/components/charts/LineChart';
import { RotateCcw, Save, GitCompare, Check } from 'lucide-react';
import { FACULTY_DATA, getDepartmentSummary } from '@/data/faculty';
import { useColors } from '@/hooks/useColors';
import { useDateFilter, getDateAdjustments } from '@/context/DateFilterContext';

export default function FacultySimulation() {
    const colors = useColors();
    const { dateRange } = useDateFilter();
    const adjustments = getDateAdjustments(dateRange);

    const [courseLoadChange, setCourseLoadChange] = useState(0);
    const [newHires, setNewHires] = useState(0);
    const [selectedDept, setSelectedDept] = useState('All Departments');
    const [saved, setSaved] = useState(false);
    const [comparing, setComparing] = useState(false);

    const deptSummary = getDepartmentSummary();
    const departments = ['All Departments', ...deptSummary.map(d => d.department)];

    const facultyInDept = selectedDept === 'All Departments' ? FACULTY_DATA : FACULTY_DATA.filter(f => f.department === selectedDept);
    const adjustedFacultyCount = Math.round(facultyInDept.length * adjustments.value);
    const currentOverloaded = Math.round(facultyInDept.filter(f => f.status === 'Overloaded').length * adjustments.value);
    const avgLoad = (facultyInDept.reduce((sum, f) => sum + f.teachingLoad, 0) / facultyInDept.length) + adjustments.growth * 0.1;

    const simulatedAvgLoad = avgLoad + courseLoadChange - (newHires * 12 / facultyInDept.length);
    const simulatedOverloaded = Math.max(0, currentOverloaded - Math.floor(newHires * 2) + Math.floor(courseLoadChange / 3));
    const projectedCost = newHires * 75000;

    const trendData = [
        { month: 'Current', overloaded: currentOverloaded, avgLoad: Math.round(avgLoad * 10) / 10 },
        { month: '+1 mo', overloaded: Math.round(currentOverloaded * 0.95), avgLoad: Math.round((avgLoad - 0.2) * 10) / 10 },
        { month: '+3 mo', overloaded: Math.round(simulatedOverloaded * 1.1), avgLoad: Math.round((simulatedAvgLoad + 0.3) * 10) / 10 },
        { month: '+6 mo', overloaded: simulatedOverloaded, avgLoad: Math.round(simulatedAvgLoad * 10) / 10 },
    ];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleCompare = () => {
        setComparing(true);
        setTimeout(() => setComparing(false), 2000);
    };

    const handleReset = () => {
        setCourseLoadChange(0);
        setNewHires(0);
    };

    return (
        <div className="animate-fade-in">
            <Header title="Faculty Planning Simulation" subtitle="Test changes in course loads or hiring plans" />

            <div className="p-4 sm:p-5 mb-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>
                    Simulation Parameters
                    <span className="text-xs ml-2 font-normal" style={{ color: colors.textSecondary }}>({dateRange})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: colors.textSecondary }}>Department</label>
                        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm focus-ring"
                            style={{ backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}>
                            {departments.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: colors.textSecondary }}>Course Load Change</label>
                        <div className="flex items-center gap-3">
                            <input type="range" min="-6" max="6" value={courseLoadChange} onChange={(e) => setCourseLoadChange(Number(e.target.value))}
                                className="flex-1" style={{ accentColor: '#6366f1' }} />
                            <span className="w-12 text-right text-sm font-medium" style={{ color: courseLoadChange > 0 ? colors.dangerText : courseLoadChange < 0 ? colors.successText : colors.textSecondary }}>
                                {courseLoadChange > 0 ? '+' : ''}{courseLoadChange}h
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: colors.textSecondary }}>New Hires</label>
                        <div className="flex items-center gap-3">
                            <input type="range" min="0" max="10" value={newHires} onChange={(e) => setNewHires(Number(e.target.value))}
                                className="flex-1" style={{ accentColor: '#6366f1' }} />
                            <span className="w-12 text-right text-sm font-medium" style={{ color: colors.accentText }}>+{newHires}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="p-4 sm:p-5 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <h3 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Current State</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Total Faculty', value: adjustedFacultyCount },
                            { label: 'Avg Teaching Load', value: `${avgLoad.toFixed(1)} hrs` },
                            { label: 'Overloaded', value: currentOverloaded, color: colors.dangerText },
                            { label: 'Annual Cost', value: `$${(adjustedFacultyCount * 75 / 1000).toFixed(1)}M`, noBorder: true },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between py-2" style={{ borderBottom: item.noBorder ? 'none' : `1px solid ${colors.border}` }}>
                                <span className="text-sm" style={{ color: colors.textSecondary }}>{item.label}</span>
                                <span className="text-sm font-medium" style={{ color: item.color || colors.textPrimary }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl" style={{ backgroundColor: colors.accentBg, border: `1px solid ${colors.accent}40` }}>
                    <h3 className="text-sm font-medium mb-4" style={{ color: colors.accentText }}>Projected State</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${colors.accent}30` }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>Total Faculty</span>
                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                {adjustedFacultyCount + newHires}
                                {newHires > 0 && <span className="ml-1" style={{ color: colors.successText }}>(+{newHires})</span>}
                            </span>
                        </div>
                        <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${colors.accent}30` }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>Avg Teaching Load</span>
                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{simulatedAvgLoad.toFixed(1)} hrs</span>
                        </div>
                        <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${colors.accent}30` }}>
                            <span className="text-sm" style={{ color: colors.textSecondary }}>Overloaded</span>
                            <span className="text-sm font-medium" style={{ color: simulatedOverloaded < currentOverloaded ? colors.successText : colors.dangerText }}>{simulatedOverloaded}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-sm" style={{ color: colors.textSecondary }}>Additional Cost</span>
                            <span className="text-sm font-medium" style={{ color: projectedCost > 0 ? colors.dangerText : colors.textPrimary }}>
                                {projectedCost > 0 ? `+$${(projectedCost / 1000).toFixed(0)}K` : '$0'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-5 mb-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h3 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Projected Trend</h3>
                <LineChartComponent data={trendData} xKey="month" lines={[
                    { dataKey: 'overloaded', color: '#ef4444', name: 'Overloaded' },
                    { dataKey: 'avgLoad', color: '#6366f1', name: 'Avg Load' },
                ]} height={200} showLegend />
            </div>

            <div className="flex flex-wrap gap-3">
                <button onClick={handleSave}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: saved ? colors.successBg : '#6366f1', color: saved ? colors.successText : '#ffffff', boxShadow: saved ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                    {saved ? <Check size={16} /> : <Save size={16} />}
                    {saved ? 'Saved!' : 'Save Scenario'}
                </button>
                <button onClick={handleCompare}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: comparing ? colors.infoBg : 'transparent', color: comparing ? colors.infoText : colors.textPrimary, border: `1px solid ${colors.border}` }}>
                    <GitCompare size={16} />
                    {comparing ? 'Opening...' : 'Compare'}
                </button>
                <button onClick={handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: 'transparent', color: colors.textPrimary, border: `1px solid ${colors.border}` }}>
                    <RotateCcw size={16} />
                    Reset
                </button>
            </div>
        </div>
    );
}
