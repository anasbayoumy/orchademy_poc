'use client';

import Header from '@/components/layout/Header';
import { Lightbulb, UserPlus, RefreshCw, UserMinus, ArrowRight } from 'lucide-react';
import { getSmartSuggestions, type AllocationSuggestion } from '@/data/faculty';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function SmartAllocation() {
    const suggestions = getSmartSuggestions();
    const colors = useColors();
    const { t, isRTL } = useLanguage();

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
            case 'High': return { border: colors.dangerText, bg: colors.dangerBg };
            case 'Medium': return { border: colors.warningText, bg: colors.warningBg };
            case 'Low': return { border: colors.successText, bg: colors.successBg };
        }
    };

    const totalSavings = suggestions.filter(s => (s.savings || 0) > 0).reduce((sum, s) => sum + (s.savings || 0), 0);

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header
                title={t('faculty.allocationTitle')}
                subtitle={t('faculty.allocationSubtitle')}
            />

            <div className="p-4 mb-6 flex items-center gap-4 rounded-xl" style={{ backgroundColor: colors.accentBg, border: `1px solid ${colors.accent}40` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.accent}20` }}>
                    <Lightbulb size={20} style={{ color: colors.accentText }} />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{t('faculty.aiRecommendations')}</p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>{t('faculty.basedOnData')}</p>
                </div>
                <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                    <p className="text-lg font-semibold" style={{ color: colors.accentText }}>${(totalSavings / 1000).toFixed(0)}K</p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>{t('common.potentialSavings')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 text-center rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>{suggestions.length}</p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>{t('common.totalSuggestions')}</p>
                </div>
                <div className="p-4 text-center rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <p className="text-2xl font-semibold" style={{ color: colors.dangerText }}>{suggestions.filter(s => s.priority === 'High').length}</p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>{t('common.highPriority')}</p>
                </div>
                <div className="p-4 text-center rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <p className="text-2xl font-semibold" style={{ color: colors.warningText }}>{suggestions.filter(s => s.priority === 'Medium').length}</p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>{t('common.mediumPriority')}</p>
                </div>
                <div className="p-4 text-center rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <p className="text-2xl font-semibold" style={{ color: colors.successText }}>{suggestions.filter(s => s.priority === 'Low').length}</p>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>{t('common.lowPriority')}</p>
                </div>
            </div>

            <div className="space-y-3">
                {suggestions.map((suggestion) => {
                    const priorityStyle = getPriorityStyle(suggestion.priority);
                    return (
                        <div key={suggestion.id} className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderLeftWidth: isRTL ? 1 : 4, borderRightWidth: isRTL ? 4 : 1, borderLeftColor: isRTL ? colors.border : priorityStyle.border, borderRightColor: isRTL ? priorityStyle.border : colors.border }}>
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, color: colors.textSecondary }}>
                                        {getTypeIcon(suggestion.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{suggestion.type}</span>
                                            <span className="text-xs" style={{ color: colors.textSecondary }}>•</span>
                                            <span className="text-xs" style={{ color: colors.textSecondary }}>{suggestion.department}</span>
                                            <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.border }}>
                                                {suggestion.priority}
                                            </span>
                                        </div>
                                        <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{suggestion.description}</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{suggestion.impact}</p>
                                    </div>
                                    <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                                        {suggestion.savings !== undefined && (
                                            <p className="text-sm font-semibold" style={{ color: suggestion.savings >= 0 ? colors.successText : colors.dangerText }}>
                                                {suggestion.savings >= 0 ? '+' : ''}${(suggestion.savings / 1000).toFixed(0)}K
                                            </p>
                                        )}
                                        <div className="flex gap-2 mt-2">
                                            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: colors.accent, color: '#ffffff' }}>
                                                {t('common.apply')}
                                                <ArrowRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
