'use client';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { DollarSign, TrendingUp, Award, Target, CheckCircle2 } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function SustainabilityInvestmentPage() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.sustainability.investment')} 
                subtitle="Green capex ratio, sustainability spend ROI, and payback periods (ESG-05, ESG-06, ESG-07)"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Green Capex Ratio', value: '18%', change: 15, label: 'of total capex', icon: <DollarSign size={20} strokeWidth={1.5} /> },
                    { title: 'Sustainability Spend ROI', value: '2.8x', change: 22, label: 'return', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                    { title: 'Avg Payback Period', value: '4.2 years', change: -8, label: 'improvement', icon: <Target size={20} strokeWidth={1.5} /> },
                    { title: 'Investment Rating', value: 'Strong', change: 0, label: 'performance', icon: <Award size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>Sustainability Investment Discipline</h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Monitor green capital expenditure ratios, sustainability spend ROI, and payback periods to ensure effective allocation of sustainability investments.
                </p>
            </div>

            {/* Expected KPIs */}
            <div className="mt-6 rounded-xl p-5 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: colors.accent }}>
                    Expected KPIs for Sustainability Investment Discipline
                </p>
                <ul className="space-y-2">
                    {['Green Capex Ratio', 'Sustainability Spend ROI', 'Payback Period (Green Capex)'].map((kpi, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                            <CheckCircle2 size={15} strokeWidth={2} style={{ color: colors.secondary1, flexShrink: 0 }} />
                            <span className="text-sm" style={{ color: colors.textSecondary }}>{kpi}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
