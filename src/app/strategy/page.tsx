'use client';

import Header from '@/components/layout/Header';
import MetricCard from '@/components/ui/MetricCard';
import { Target, TrendingUp, Award, CheckCircle, Network, ListOrdered, BarChart3, FileText, Shield, GraduationCap } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import GOV_00 from '@/data/KPIs/GOV-00';

export default function StrategyDashboard() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();

    const latestYear = GOV_00.yearlyData[GOV_00.yearlyData.length - 1];
    const previousYear = GOV_00.yearlyData[GOV_00.yearlyData.length - 2];
    const alignmentYoY = latestYear && previousYear
        ? ((latestYear.value - previousYear.value) / previousYear.value * 100)
        : 0;

    const submodules = [
        {
            href: '/strategy/alignment',
            labelKey: 'sidebar.strategy.alignment',
            icon: <Network size={24} strokeWidth={1.5} />,
            description: 'Overall Strategy Performance Index – KPI health, initiative delivery, spend alignment, risk exposure',
            metric: `${latestYear?.value.toFixed(1)}/100`,
            status: latestYear?.status || 'red'
        },
        {
            href: '/strategy/priorities',
            labelKey: 'sidebar.strategy.priorities',
            icon: <ListOrdered size={24} strokeWidth={1.5} />,
            description: 'Priority management and execution discipline tracking',
            metric: '—',
            status: null
        },
        {
            href: '/strategy/kpi',
            labelKey: 'sidebar.strategy.kpi',
            icon: <BarChart3 size={24} strokeWidth={1.5} />,
            description: 'Board-level KPI tracking and governance structure',
            metric: '24 KPIs',
            status: null
        },
        {
            href: '/strategy/mission',
            labelKey: 'sidebar.strategy.mission',
            icon: <FileText size={24} strokeWidth={1.5} />,
            description: 'Mission alignment, strategy economics, and risk exposure',
            metric: '—',
            status: null
        },
        {
            href: '/strategy/compliance',
            labelKey: 'sidebar.strategy.compliance',
            icon: <Shield size={24} strokeWidth={1.5} />,
            description: 'Compliance monitoring and external regulatory signals',
            metric: '—',
            status: null
        },
        {
            href: '/strategy/accreditation',
            labelKey: 'sidebar.strategy.accreditation',
            icon: <GraduationCap size={24} strokeWidth={1.5} />,
            description: 'Accreditation status and program-level certification tracking',
            metric: 'Active',
            status: null
        }
    ];

    const getStatusColor = (status: string | null) => {
        if (!status) return colors.textSecondary;
        switch (status) {
            case 'green': return colors.successText;
            case 'amber': return colors.warningText;
            case 'red': return colors.dangerText;
            default: return colors.textSecondary;
        }
    };

    return (
        <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header
                title={t('sidebar.strategy.title')}
                subtitle="Strategic alignment, governance, and institutional compliance overview"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 items-stretch">
                <div className="animate-fade-in h-full min-h-0" style={{ animationDelay: '0ms' }}>
                    <MetricCard
                        className="h-full"
                        title="Strategic KPIs Tracked"
                        value="24"
                        change={12}
                        changeLabel="vs last quarter"
                        icon={<Target size={20} strokeWidth={1.5} />}
                    />
                </div>
                <div className="animate-fade-in h-full min-h-0" style={{ animationDelay: '50ms' }}>
                    <MetricCard
                        className="h-full"
                        title={GOV_00.name}
                        value={`${latestYear?.value.toFixed(2)}`}
                        change={Math.round(alignmentYoY)}
                        changeLabel="YoY"
                        icon={<TrendingUp size={20} strokeWidth={1.5} />}
                    />
                </div>
                <div className="animate-fade-in h-full min-h-0" style={{ animationDelay: '100ms' }}>
                    <MetricCard
                        className="h-full"
                        title="Compliance Rate"
                        value="95%"
                        change={3}
                        changeLabel="vs last year"
                        icon={<CheckCircle size={20} strokeWidth={1.5} />}
                    />
                </div>
                <div className="animate-fade-in h-full min-h-0" style={{ animationDelay: '150ms' }}>
                    <MetricCard
                        className="h-full"
                        title="Accreditation Status"
                        value="Active"
                        change={0}
                        changeLabel="all programs"
                        icon={<Award size={20} strokeWidth={1.5} />}
                    />
                </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl mb-6" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Strategy & Governance Hub
                </h2>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                    Navigate through the submodules below to access institutional alignment, strategic KPIs, mission scorecard, compliance monitoring, and accreditation tracking.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {submodules.map((mod) => (
                    <Link key={mod.href} href={mod.href}>
                        <div
                            className="p-4 sm:p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.01] h-full"
                            style={{
                                backgroundColor: colors.cardBg,
                                border: `1px solid ${colors.border}`,
                                boxShadow: colors.isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: colors.primary1 + '20' }}
                                >
                                    <span style={{ color: colors.primary1 }}>{mod.icon}</span>
                                </div>
                                {mod.metric !== '—' && (
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: mod.status ? getStatusColor(mod.status) : colors.textPrimary }}
                                    >
                                        {mod.metric}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-base font-bold mb-2" style={{ color: colors.textPrimary }}>
                                {t(mod.labelKey)}
                            </h3>
                            <p className="text-xs sm:text-sm" style={{ color: colors.textSecondary }}>
                                {mod.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}