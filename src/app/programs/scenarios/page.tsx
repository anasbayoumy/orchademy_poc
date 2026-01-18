'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { XCircle, Merge, TrendingUp, RefreshCw, Check } from 'lucide-react';
import { getScenarioSnapshots, type ScenarioSnapshot } from '@/data/programs';

export default function ProgramScenarios() {
    const scenarios = getScenarioSnapshots();
    const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

    const toggleScenario = (id: string) => {
        setSelectedScenarios(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const getTypeIcon = (type: ScenarioSnapshot['type']) => {
        switch (type) {
            case 'Closure': return <XCircle size={18} />;
            case 'Merger': return <Merge size={18} />;
            case 'Expansion': return <TrendingUp size={18} />;
            case 'Restructure': return <RefreshCw size={18} />;
        }
    };

    return (
        <div className="animate-fade-in">
            <Header
                title="Portfolio Scenario Snapshots"
                subtitle="What-if simulations for program portfolio decisions"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {scenarios.map(scenario => (
                    <div
                        key={scenario.id}
                        onClick={() => toggleScenario(scenario.id)}
                        className={`card cursor-pointer transition-all ${selectedScenarios.includes(scenario.id)
                                ? 'ring-2 ring-indigo-500'
                                : 'hover:border-gray-300'
                            }`}
                    >
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${scenario.type === 'Closure' ? 'bg-red-50 text-red-600' :
                                            scenario.type === 'Merger' ? 'bg-yellow-50 text-yellow-600' :
                                                scenario.type === 'Expansion' ? 'bg-green-50 text-green-600' :
                                                    'bg-blue-50 text-blue-600'
                                        }`}>
                                        {getTypeIcon(scenario.type)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{scenario.name}</p>
                                        <p className="text-xs text-gray-500">{scenario.type}</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedScenarios.includes(scenario.id)
                                        ? 'bg-indigo-600 border-indigo-600'
                                        : 'border-gray-300'
                                    }`}>
                                    {selectedScenarios.includes(scenario.id) && <Check size={12} className="text-white" />}
                                </div>
                            </div>

                            <p className="text-xs text-gray-600 mb-4">{scenario.description}</p>

                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Savings</span>
                                    <span className={scenario.projectedSavings > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                        {scenario.projectedSavings > 0 ? '+' : ''}${(scenario.projectedSavings / 1000).toFixed(0)}K
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Revenue Impact</span>
                                    <span className={scenario.projectedRevenueLoss <= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                        {scenario.projectedRevenueLoss > 0 ? '-' : '+'}${(Math.abs(scenario.projectedRevenueLoss) / 1000).toFixed(0)}K
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-100">
                                    <span className="text-gray-700 font-medium">Net Impact</span>
                                    <span className={`font-semibold ${scenario.netImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {scenario.netImpact >= 0 ? '+' : ''}${(scenario.netImpact / 1000).toFixed(0)}K
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <span className={`badge ${scenario.riskLevel === 'Low' ? 'badge-success' :
                                        scenario.riskLevel === 'Medium' ? 'badge-warning' : 'badge-danger'
                                    }`}>
                                    {scenario.riskLevel} Risk
                                </span>
                                <span className="badge badge-neutral">{scenario.affectedPrograms.length} programs</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedScenarios.length >= 2 ? (
                <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-medium text-gray-900">Scenario Comparison</h2>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                {selectedScenarios.map(id => {
                                    const scenario = scenarios.find(s => s.id === id)!;
                                    return <th key={id}>{scenario.name}</th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="font-medium text-gray-900">Type</td>
                                {selectedScenarios.map(id => (
                                    <td key={id}>{scenarios.find(s => s.id === id)!.type}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="font-medium text-gray-900">Risk Level</td>
                                {selectedScenarios.map(id => {
                                    const s = scenarios.find(s => s.id === id)!;
                                    return <td key={id}>
                                        <span className={`badge ${s.riskLevel === 'Low' ? 'badge-success' :
                                                s.riskLevel === 'Medium' ? 'badge-warning' : 'badge-danger'
                                            }`}>{s.riskLevel}</span>
                                    </td>;
                                })}
                            </tr>
                            <tr>
                                <td className="font-medium text-gray-900">Savings</td>
                                {selectedScenarios.map(id => {
                                    const s = scenarios.find(s => s.id === id)!;
                                    return <td key={id} className={s.projectedSavings >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        ${(s.projectedSavings / 1000).toFixed(0)}K
                                    </td>;
                                })}
                            </tr>
                            <tr>
                                <td className="font-medium text-gray-900">Net Impact</td>
                                {selectedScenarios.map(id => {
                                    const s = scenarios.find(s => s.id === id)!;
                                    return <td key={id} className={`font-semibold ${s.netImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${(s.netImpact / 1000).toFixed(0)}K
                                    </td>;
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card p-8 text-center">
                    <p className="text-sm text-gray-500">Select 2 or more scenarios to compare</p>
                </div>
            )}
        </div>
    );
}
