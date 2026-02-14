'use client';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { Clock, CheckCircle, Users, AlertCircle } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function ServiceDeliveryPage() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.efficiency.serviceDelivery')} 
                subtitle="Process cycle time, SLA compliance, and service load metrics (EFF-07, EFF-08, EFF-09)"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Avg Process Cycle Time', value: '4.2 days', change: -12, label: 'improvement', icon: <Clock size={20} strokeWidth={1.5} /> },
                    { title: 'SLA Compliance Rate', value: '94%', change: 6, label: 'vs target', icon: <CheckCircle size={20} strokeWidth={1.5} /> },
                    { title: 'Cases per Staff', value: '38', change: -5, label: 'optimized', icon: <Users size={20} strokeWidth={1.5} /> },
                    { title: 'Service Excellence', value: 'High', change: 0, label: 'rating', icon: <AlertCircle size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="rounded-xl p-6 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>Service Delivery & Process Performance</h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Monitor process cycle times, SLA compliance rates, and student services load per staff member to ensure efficient service delivery.
                </p>
            </div>
        </div>
    );
}
