'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search, LayoutDashboard, Users, Target, GraduationCap, TrendingUp,
    Activity, Leaf, DollarSign, Layers, Command, CornerDownLeft, ArrowUp, ArrowDown
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { DESIGN_TOKENS } from '@/config/design-tokens';

interface SearchItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    section?: string;
}

function getAllSearchItems(t: (key: string) => string): SearchItem[] {
    return [
        { label: t('sidebar.dashboard'), href: '/', icon: <LayoutDashboard size={18} />, section: t('common.navigation') },
        { label: t('sidebar.strategy.title'), href: '/strategy', icon: <Target size={18} />, section: t('common.navigation') },
        { label: t('sidebar.strategy.alignment'), href: '/strategy/alignment', icon: <Target size={16} />, section: t('sidebar.strategy.title') },
        { label: t('sidebar.strategy.priorities'), href: '/strategy/priorities', icon: <Target size={16} />, section: t('sidebar.strategy.title') },
        { label: t('sidebar.strategy.kpi'), href: '/strategy/kpi', icon: <Target size={16} />, section: t('sidebar.strategy.title') },
        { label: t('sidebar.strategy.mission'), href: '/strategy/mission', icon: <Target size={16} />, section: t('sidebar.strategy.title') },
        { label: t('sidebar.strategy.compliance'), href: '/strategy/compliance', icon: <Target size={16} />, section: t('sidebar.strategy.title') },
        { label: t('sidebar.workload.title'), href: '/workload', icon: <Users size={18} />, section: t('common.navigation') },
        { label: t('sidebar.workload.requirements'), href: '/workload/requirements', icon: <Users size={16} />, section: t('sidebar.workload.title') },
        { label: t('sidebar.workload.credentials'), href: '/workload/credentials', icon: <Users size={16} />, section: t('sidebar.workload.title') },
        { label: t('sidebar.workload.optimization'), href: '/workload/optimization', icon: <Users size={16} />, section: t('sidebar.workload.title') },
        { label: t('sidebar.workload.balancing'), href: '/workload/balancing', icon: <Users size={16} />, section: t('sidebar.workload.title') },
        { label: t('sidebar.programs.title'), href: '/programs', icon: <GraduationCap size={18} />, section: t('common.navigation') },
        { label: t('sidebar.programs.advising'), href: '/programs/advising', icon: <GraduationCap size={16} />, section: t('sidebar.programs.title') },
        { label: t('sidebar.programs.analytics'), href: '/programs/analytics', icon: <GraduationCap size={16} />, section: t('sidebar.programs.title') },
        { label: t('sidebar.programs.sentiment'), href: '/programs/sentiment', icon: <GraduationCap size={16} />, section: t('sidebar.programs.title') },
        { label: t('sidebar.programs.kpi'), href: '/programs/kpi', icon: <GraduationCap size={16} />, section: t('sidebar.programs.title') },
        { label: t('sidebar.programs.demand'), href: '/programs/demand', icon: <GraduationCap size={16} />, section: t('sidebar.programs.title') },
        { label: t('sidebar.roi.title'), href: '/roi', icon: <TrendingUp size={18} />, section: t('common.navigation') },
        { label: t('sidebar.roi.cost'), href: '/roi/cost', icon: <TrendingUp size={16} />, section: t('sidebar.roi.title') },
        { label: t('sidebar.roi.analytics'), href: '/roi/analytics', icon: <TrendingUp size={16} />, section: t('sidebar.roi.title') },
        { label: t('sidebar.roi.employability'), href: '/roi/employability', icon: <TrendingUp size={16} />, section: t('sidebar.roi.title') },
        { label: t('sidebar.roi.grants'), href: '/roi/grants', icon: <TrendingUp size={16} />, section: t('sidebar.roi.title') },
        { label: t('sidebar.roi.research'), href: '/roi/research', icon: <TrendingUp size={16} />, section: t('sidebar.roi.title') },
        { label: t('sidebar.efficiency.title'), href: '/efficiency', icon: <Activity size={18} />, section: t('common.navigation') },
        { label: t('sidebar.efficiency.costStructure'), href: '/efficiency/benchmarking', icon: <Activity size={16} />, section: t('sidebar.efficiency.title') },
        { label: t('sidebar.efficiency.productivity'), href: '/efficiency/resource', icon: <Activity size={16} />, section: t('sidebar.efficiency.title') },
        { label: t('sidebar.efficiency.serviceDelivery'), href: '/efficiency/service-delivery', icon: <Activity size={16} />, section: t('sidebar.efficiency.title') },
        { label: t('sidebar.efficiency.capacityUtilization'), href: '/efficiency/capacity', icon: <Activity size={16} />, section: t('sidebar.efficiency.title') },
        { label: t('sidebar.efficiency.workforceRatios'), href: '/efficiency/workforce', icon: <Activity size={16} />, section: t('sidebar.efficiency.title') },
        { label: t('sidebar.efficiency.normativeTargets'), href: '/efficiency/targets', icon: <Activity size={16} />, section: t('sidebar.efficiency.title') },
        { label: t('sidebar.efficiency.growthPressure'), href: '/efficiency/growth', icon: <Activity size={16} />, section: t('sidebar.efficiency.title') },
        { label: t('sidebar.sustainability.title'), href: '/sustainability', icon: <Leaf size={18} />, section: t('common.navigation') },
        { label: t('sidebar.sustainability.energyCarbon'), href: '/sustainability/sdgs', icon: <Leaf size={16} />, section: t('sidebar.sustainability.title') },
        { label: t('sidebar.sustainability.investment'), href: '/sustainability/investment', icon: <Leaf size={16} />, section: t('sidebar.sustainability.title') },
        { label: t('sidebar.sustainability.climateRisk'), href: '/sustainability/climate-risk', icon: <Leaf size={16} />, section: t('sidebar.sustainability.title') },
        { label: t('sidebar.financials.title'), href: '/financials', icon: <DollarSign size={18} />, section: t('common.navigation') },
        { label: t('sidebar.financials.plNatural'), href: '/financials/p-l-natural', icon: <DollarSign size={16} />, section: t('sidebar.financials.title') },
        { label: t('sidebar.financials.plFunctional'), href: '/financials/p-l-functional', icon: <DollarSign size={16} />, section: t('sidebar.financials.title') },
        { label: t('sidebar.financials.simulations'), href: '/financials/simulations', icon: <DollarSign size={16} />, section: t('sidebar.financials.title') },
        { label: t('sidebar.services'), href: '/services', icon: <Layers size={18} />, section: t('common.navigation') },
    ];
}

interface SpotlightSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SpotlightSearch({ isOpen, onClose }: SpotlightSearchProps) {
    const router = useRouter();
    const { theme } = useTheme();
    const { t, isRTL } = useLanguage();
    const isDark = theme === 'dark';
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const allItems = getAllSearchItems(t);

    const filteredItems = query.trim()
        ? allItems.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            (item.section && item.section.toLowerCase().includes(query.toLowerCase()))
        )
        : allItems.filter(item => item.section === t('common.navigation'));

    const colors = {
        backdropBg: 'rgba(0, 0, 0, 0.5)',
        modalBg: isDark ? '#1a2332' : '#ffffff',
        inputBg: isDark ? '#0f172a' : '#f8fafc',
        border: isDark ? '#2a3647' : '#e2e8f0',
        textPrimary: isDark ? '#f1f5f9' : '#0f172a',
        textSecondary: isDark ? '#94a3b8' : '#64748b',
        textTertiary: isDark ? '#64748b' : '#94a3b8',
        hoverBg: isDark ? '#2a3647' : '#f1f5f9',
        selectedBg: isDark ? 'rgba(48, 74, 120, 0.3)' : 'rgba(48, 74, 120, 0.08)',
        selectedBorder: DESIGN_TOKENS.colors.primary[1],
        kbdBg: isDark ? '#2a3647' : '#f1f5f9',
        kbdBorder: isDark ? '#374151' : '#d1d5db',
        footerBg: isDark ? '#0f172a' : '#f8fafc',
    };

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current) {
            const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [selectedIndex]);

    const handleNavigate = useCallback((href: string) => {
        router.push(href);
        onClose();
    }, [router, onClose]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
            e.preventDefault();
            handleNavigate(filteredItems[selectedIndex].href);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    }, [filteredItems, selectedIndex, handleNavigate, onClose]);

    if (!isOpen) return null;

    const isMac = typeof navigator !== 'undefined' && navigator.platform?.toLowerCase().includes('mac');

    return (
        <div
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] spotlight-backdrop"
            style={{ backgroundColor: colors.backdropBg, backdropFilter: 'blur(8px)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full max-w-xl mx-4 rounded-2xl shadow-2xl overflow-hidden spotlight-modal"
                style={{
                    backgroundColor: colors.modalBg,
                    border: `1px solid ${colors.border}`,
                    boxShadow: isDark
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)'
                        : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <Search size={20} style={{ color: colors.textTertiary, flexShrink: 0 }} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('spotlight.placeholder')}
                        className="flex-1 bg-transparent text-base outline-none placeholder-current"
                        style={{
                            color: colors.textPrimary,
                            direction: isRTL ? 'rtl' : 'ltr',
                        }}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <kbd
                        className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                            backgroundColor: colors.kbdBg,
                            border: `1px solid ${colors.kbdBorder}`,
                            color: colors.textTertiary,
                        }}
                    >
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div
                    ref={listRef}
                    className="max-h-[340px] overflow-y-auto custom-scrollbar py-2"
                >
                    {filteredItems.length === 0 ? (
                        <div className="px-5 py-8 text-center spotlight-no-results">
                            <Search size={32} style={{ color: colors.textTertiary, margin: '0 auto 12px' }} />
                            <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                                {t('spotlight.noResults')}
                            </p>
                            <p className="text-xs mt-1" style={{ color: colors.textTertiary }}>
                                {t('spotlight.tryDifferent')}
                            </p>
                        </div>
                    ) : (
                        filteredItems.map((item, index) => (
                            <button
                                key={item.href}
                                data-index={index}
                                onClick={() => handleNavigate(item.href)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors duration-100"
                                style={{
                                    backgroundColor: selectedIndex === index ? colors.selectedBg : 'transparent',
                                    borderLeft: !isRTL && selectedIndex === index ? `2px solid ${colors.selectedBorder}` : '2px solid transparent',
                                    borderRight: isRTL && selectedIndex === index ? `2px solid ${colors.selectedBorder}` : '2px solid transparent',
                                    direction: isRTL ? 'rtl' : 'ltr',
                                }}
                            >
                                <span
                                    className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                                    style={{
                                        backgroundColor: selectedIndex === index
                                            ? (isDark ? 'rgba(48, 74, 120, 0.4)' : 'rgba(48, 74, 120, 0.12)')
                                            : (isDark ? '#2a3647' : '#f1f5f9'),
                                        color: selectedIndex === index ? DESIGN_TOKENS.colors.primary[1] : colors.textSecondary,
                                    }}
                                >
                                    {item.icon}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>
                                        {item.label}
                                    </p>
                                    {item.section && item.section !== t('common.navigation') && (
                                        <p className="text-xs truncate" style={{ color: colors.textTertiary }}>
                                            {item.section}
                                        </p>
                                    )}
                                </div>
                                {selectedIndex === index && (
                                    <CornerDownLeft size={14} style={{ color: colors.textTertiary, flexShrink: 0 }} />
                                )}
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div
                    className="flex items-center gap-4 px-5 py-3 text-xs"
                    style={{
                        borderTop: `1px solid ${colors.border}`,
                        backgroundColor: colors.footerBg,
                        color: colors.textTertiary,
                    }}
                >
                    <span className="flex items-center gap-1.5">
                        <span className="flex gap-0.5">
                            <kbd className="inline-flex items-center justify-center w-5 h-5 rounded" style={{ backgroundColor: colors.kbdBg, border: `1px solid ${colors.kbdBorder}` }}>
                                <ArrowUp size={10} />
                            </kbd>
                            <kbd className="inline-flex items-center justify-center w-5 h-5 rounded" style={{ backgroundColor: colors.kbdBg, border: `1px solid ${colors.kbdBorder}` }}>
                                <ArrowDown size={10} />
                            </kbd>
                        </span>
                        {t('spotlight.navigate')}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <kbd className="inline-flex items-center justify-center h-5 px-1.5 rounded text-[10px]" style={{ backgroundColor: colors.kbdBg, border: `1px solid ${colors.kbdBorder}` }}>
                            <CornerDownLeft size={10} />
                        </kbd>
                        {t('spotlight.open')}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <kbd className="inline-flex items-center justify-center h-5 px-1.5 rounded text-[10px]" style={{ backgroundColor: colors.kbdBg, border: `1px solid ${colors.kbdBorder}` }}>
                            ESC
                        </kbd>
                        {t('spotlight.close')}
                    </span>
                </div>
            </div>
        </div>
    );
}
