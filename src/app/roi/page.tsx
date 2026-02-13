'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { TrendingUp, Briefcase, Award, DollarSign } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function ROIDashboard() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.roi.title')} 
                subtitle="Return on investment analysis and institutional impact measurement" 
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Overall ROI', value: '3.2x', change: 18, label: 'vs last year', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                    { title: 'Employment Rate', value: '87%', change: 5, label: 'improvement', icon: <Briefcase size={20} strokeWidth={1.5} /> },
                    { title: 'Research Grants', value: '$12.5M', change: 22, label: 'increase', icon: <DollarSign size={20} strokeWidth={1.5} /> },
                    { title: 'Impact Score', value: '8.4/10', change: 8, label: 'vs benchmark', icon: <Award size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    ROI & Impact Matrix
                </h2>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                    Access comprehensive impact analytics through the submenu:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { label: 'Program Impact', desc: 'Employability outcomes and graduate success metrics' },
                        { label: 'Cost Per Student', desc: 'Financial efficiency and cost analysis per program' },
                        { label: 'Research Impact', desc: 'Research output and citation impact assessment' },
                        { label: 'Grant Tracking', desc: 'Research funding and grant success monitoring' },
                        { label: 'Alumni ROI', desc: 'Long-term career outcomes and earning potential' },
                        { label: 'Social Impact', desc: 'Community engagement and societal contribution' },
                    ].map((item, i) => (
                        <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: colors.isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${colors.border}` }}>
                            <p className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>{item.label}</p>
                            <p className="text-xs" style={{ color: colors.textSecondary }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
