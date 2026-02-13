'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { Leaf, Globe, TrendingUp, Award } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function SustainabilityDashboard() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.sustainability.title')} 
                subtitle="Sustainable development goals compliance and environmental impact tracking" 
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'SDGs Aligned', value: '14/17', change: 16, label: 'vs last year', icon: <Globe size={20} strokeWidth={1.5} /> },
                    { title: 'Sustainability Score', value: '82%', change: 11, label: 'improvement', icon: <Leaf size={20} strokeWidth={1.5} /> },
                    { title: 'Green Initiatives', value: '23', change: 35, label: 'new projects', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                    { title: 'Impact Rating', value: 'A+', change: 0, label: 'certified', icon: <Award size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Sustainability Engine
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Track institutional progress towards UN Sustainable Development Goals and monitor environmental impact initiatives.
                </p>
            </div>
        </div>
    );
}
