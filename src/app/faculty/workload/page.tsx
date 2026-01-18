'use client';

import Header from '@/components/layout/Header';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { FACULTY_DATA, WORKLOAD_RULES } from '@/data/faculty';
import { useColors } from '@/hooks/useColors';
import { useDateFilter, getDateAdjustments } from '@/context/DateFilterContext';
import { useLanguage } from '@/context/LanguageContext';

export default function WorkloadGapReport() {
    const colors = useColors();
    const { dateRange } = useDateFilter();
    const adjustments = getDateAdjustments(dateRange);
    const { t, isRTL } = useLanguage();

    const overloadedFaculty = FACULTY_DATA.filter(f => f.status === 'Overloaded');
    const underloadedFaculty = FACULTY_DATA.filter(f => f.status === 'Underloaded');

    const overloadedCount = Math.round(overloadedFaculty.length * adjustments.value);
    const underloadedCount = Math.round(underloadedFaculty.length * adjustments.variation);
    const balancedCount = Math.round((FACULTY_DATA.length - overloadedFaculty.length - underloadedFaculty.length) * adjustments.value);

    const getGapAmount = (faculty: typeof FACULTY_DATA[0]) => {
        const rule = WORKLOAD_RULES.find(r => r.rank === faculty.rank);
        return rule ? Math.round((faculty.teachingLoad - rule.expectedCreditHours) * adjustments.value) : 0;
    };

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header title={t('faculty.workloadTitle')} subtitle={t('faculty.workloadSubtitle')} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {[
                    { icon: <AlertTriangle size={20} />, value: overloadedCount, label: t('faculty.overloaded'), bg: colors.dangerBg, color: colors.dangerIcon },
                    { icon: <AlertCircle size={20} />, value: underloadedCount, label: t('faculty.underloaded'), bg: colors.infoBg, color: colors.infoText },
                    { icon: <CheckCircle size={20} />, value: balancedCount, label: t('faculty.optimal'), bg: colors.successBg, color: colors.successIcon },
                ].map((item, i) => (
                    <div key={i} className="p-4 sm:p-5 flex items-center gap-4 rounded-xl card-hover" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.bg }}><span style={{ color: item.color }}>{item.icon}</span></div>
                        <div><p className="text-2xl font-semibold" style={{ color: colors.textPrimary }}>{item.value}</p><p className="text-xs" style={{ color: colors.textSecondary }}>{item.label}</p></div>
                    </div>
                ))}
            </div>

            <div className="p-4 sm:p-5 mb-6 rounded-xl card-hover" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>
                    {t('faculty.workloadRules')}
                    <span className="text-xs font-normal" style={{ color: colors.textSecondary, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>({dateRange})</span>
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead><tr style={{ backgroundColor: colors.tableHeader }}>
                            {[t('faculty.rank'), t('faculty.expectedHours'), t('faculty.overloadThreshold'), t('faculty.releaseHours')].map(h => (
                                <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}`, textAlign: isRTL ? 'right' : 'left' }}>{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {WORKLOAD_RULES.map((rule) => (
                                <tr key={rule.rank} className="transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.tableHover}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td className="px-4 py-3 text-sm font-medium" style={{ color: colors.textPrimary }}>{rule.rank}</td>
                                    <td className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{rule.expectedCreditHours} {t('common.hrs')}</td>
                                    <td className="px-4 py-3 text-sm" style={{ color: colors.dangerText }}>{rule.overloadThreshold} {t('common.hrs')}</td>
                                    <td className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{rule.releaseHours} {t('common.hrs')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[
                    { title: t('faculty.overloadedFaculty'), data: overloadedFaculty.slice(0, Math.round(overloadedFaculty.length * adjustments.value)), badge: colors.dangerBg, badgeText: colors.dangerText, cols: [t('faculty.name'), t('faculty.dept'), t('faculty.load'), t('faculty.excess')], isExcess: true },
                    { title: t('faculty.underloadedFaculty'), data: underloadedFaculty.slice(0, Math.round(underloadedFaculty.length * adjustments.variation)), badge: colors.infoBg, badgeText: colors.infoText, cols: [t('faculty.name'), t('faculty.dept'), t('faculty.load'), t('faculty.available')], isExcess: false },
                ].map((section) => (
                    <div key={section.title} className="overflow-hidden rounded-xl card-hover" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                        <div className="px-4 sm:px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.border}` }}>
                            <h2 className="text-sm font-medium" style={{ color: colors.textPrimary }}>{section.title}</h2>
                            <span className="text-xs px-2 py-1 rounded-md font-medium" style={{ backgroundColor: section.badge, color: section.badgeText }}>{section.data.length}</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            <table className="w-full">
                                <thead style={{ backgroundColor: colors.tableHeader }}><tr>
                                    {section.cols.map(h => (<th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide sticky top-0" style={{ color: colors.textSecondary, backgroundColor: colors.tableHeader, borderBottom: `1px solid ${colors.border}`, textAlign: isRTL ? 'right' : 'left' }}>{h}</th>))}
                                </tr></thead>
                                <tbody>
                                    {section.data.map((faculty) => (
                                        <tr key={faculty.id} className="transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.tableHover}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <td className="px-4 py-3 text-sm font-medium" style={{ color: colors.textPrimary }}>{faculty.name}</td>
                                            <td className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{faculty.department.split(' ')[0]}</td>
                                            <td className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{Math.round(faculty.teachingLoad * adjustments.value)} {t('common.hrs')}</td>
                                            <td className="px-4 py-3 text-sm font-medium" style={{ color: section.isExcess ? colors.dangerText : colors.infoText }}>{section.isExcess ? '+' : ''}{Math.abs(getGapAmount(faculty))} {t('common.hrs')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
