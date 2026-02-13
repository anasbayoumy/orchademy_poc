'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { Layers, Users, Clock, TrendingUp } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';

export default function ServicesDashboard() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header 
                title={t('sidebar.services')} 
                subtitle="Student services, support systems, and institutional resources" 
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                    { title: 'Active Services', value: '42', change: 15, label: 'expanded', icon: <Layers size={20} strokeWidth={1.5} /> },
                    { title: 'Students Served', value: '8,450', change: 12, label: 'vs last term', icon: <Users size={20} strokeWidth={1.5} /> },
                    { title: 'Avg Response Time', value: '2.3hrs', change: -25, label: 'faster', icon: <Clock size={20} strokeWidth={1.5} /> },
                    { title: 'Satisfaction Rate', value: '92%', change: 8, label: 'improvement', icon: <TrendingUp size={20} strokeWidth={1.5} /> },
                ].map((m, i) => (
                    <div key={m.title} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <MetricCard title={m.title} value={m.value} change={m.change} changeLabel={m.label} icon={m.icon} />
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Institutional Services
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Manage and monitor student services, academic support, career counseling, library resources, IT services, and facility management.
                </p>
            </div>
        </div>
    );
}
