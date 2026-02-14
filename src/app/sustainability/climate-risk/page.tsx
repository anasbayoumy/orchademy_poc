'use client';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { AlertTriangle, TrendingDown, Building, DollarSign } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function ClimateRiskPage() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.sustainability.climateRisk')} 
                subtitle="Climate risk financial impact and asset vulnerability assessment (ESG-08, ESG-09)"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Expected Financial Impact', value: '$2.8M', change: -12, label: 'reduction', icon: <DollarSign size={20} strokeWidth={1.5} /> },
                    { title: 'Asset Vulnerability', value: 'Low', change: -15, label: 'improvement', icon: <Building size={20} strokeWidth={1.5} /> },
                    { title: 'Risk Mitigation', value: '78%', change: 18, label: 'coverage', icon: <TrendingDown size={20} strokeWidth={1.5} /> },
                    { title: 'Climate Resilience', value: 'High', change: 0, label: 'rating', icon: <AlertTriangle size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>Climate Risk & Asset Exposure</h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Assess climate risk expected financial impact and asset climate vulnerability to proactively manage environmental risks and protect institutional assets.
                </p>
            </div>
        </div>
    );
}
