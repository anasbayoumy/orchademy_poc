'use client';

import Header from '@/components/layout/Header';
import { Lightbulb, UserPlus, RefreshCw, UserMinus, ArrowRight } from 'lucide-react';
import { getSmartSuggestions, type AllocationSuggestion } from '@/data/faculty';

export default function SmartAllocation() {
    const suggestions = getSmartSuggestions();

    const getTypeIcon = (type: AllocationSuggestion['type']) => {
        switch (type) {
            case 'Hire': return <UserPlus size={18} />;
            case 'Rebalance': return <RefreshCw size={18} />;
            case 'Release': return <UserMinus size={18} />;
            case 'Reassign': return <RefreshCw size={18} />;
        }
    };

    const getPriorityStyle = (priority: AllocationSuggestion['priority']) => {
        switch (priority) {
            case 'High': return 'border-l-red-500 bg-red-50';
            case 'Medium': return 'border-l-yellow-500 bg-yellow-50';
            case 'Low': return 'border-l-green-500 bg-green-50';
        }
    };

    const totalSavings = suggestions.filter(s => (s.savings || 0) > 0).reduce((sum, s) => sum + (s.savings || 0), 0);

    return (
        <div className="animate-fade-in">
            <Header
                title="Smart Allocation Suggestions"
                subtitle="AI-generated rebalancing proposals"
            />

            <div className="card p-4 mb-6 flex items-center gap-4 bg-indigo-50 border-indigo-100">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Lightbulb size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-900">AI-Powered Recommendations</p>
                    <p className="text-xs text-indigo-700">Based on current workload data and historical patterns</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-indigo-900">${(totalSavings / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-indigo-600">Potential savings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="card p-4 text-center">
                    <p className="text-2xl font-semibold text-gray-900">{suggestions.length}</p>
                    <p className="text-xs text-gray-500">Total Suggestions</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-semibold text-red-600">{suggestions.filter(s => s.priority === 'High').length}</p>
                    <p className="text-xs text-gray-500">High Priority</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-semibold text-yellow-600">{suggestions.filter(s => s.priority === 'Medium').length}</p>
                    <p className="text-xs text-gray-500">Medium Priority</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-semibold text-green-600">{suggestions.filter(s => s.priority === 'Low').length}</p>
                    <p className="text-xs text-gray-500">Low Priority</p>
                </div>
            </div>

            <div className="space-y-3">
                {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className={`card border-l-4 ${getPriorityStyle(suggestion.priority)} overflow-hidden`}>
                        <div className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-600 border border-gray-200">
                                    {getTypeIcon(suggestion.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-900">{suggestion.type}</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500">{suggestion.department}</span>
                                        <span className={`badge text-xs ${suggestion.priority === 'High' ? 'badge-danger' :
                                                suggestion.priority === 'Medium' ? 'badge-warning' : 'badge-success'
                                            }`}>
                                            {suggestion.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                                    <p className="text-xs text-gray-500">{suggestion.impact}</p>
                                </div>
                                <div className="text-right">
                                    {suggestion.savings !== undefined && (
                                        <p className={`text-sm font-semibold ${suggestion.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {suggestion.savings >= 0 ? '+' : ''}${(suggestion.savings / 1000).toFixed(0)}K
                                        </p>
                                    )}
                                    <div className="flex gap-2 mt-2">
                                        <button className="btn btn-primary text-xs py-1.5">
                                            Apply
                                            <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
