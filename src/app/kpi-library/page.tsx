'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { KPI_CATALOG } from '@/data/KPIs/kpi-catalog';
import {
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    BookOpen,
} from 'lucide-react';

const CLASSIFICATIONS = ['All', 'Performance', 'Outcome', 'Normative'];
const DOMAINS = ['All', 'Student Success', 'Section Planning', 'Unit Economics', 'Research', 'Workload'];

export default function KPILibraryPage() {
    const colors = useColors();
    const { t, isRTL } = useLanguage();
    const [filtersOpen, setFiltersOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [classificationFilter, setClassificationFilter] = useState<string>('All');
    const [domainFilter, setDomainFilter] = useState<string>('All');

    const filteredKPIs = useMemo(() => {
        return KPI_CATALOG.filter((kpi) => {
            const q = searchQuery.toLowerCase().trim();
            if (q) {
                const matchesSearch =
                    kpi.code.toLowerCase().includes(q) ||
                    kpi.name.toLowerCase().includes(q) ||
                    (kpi.domain?.toLowerCase().includes(q) ?? false) ||
                    kpi.description.toLowerCase().includes(q);
                if (!matchesSearch) return false;
            }
            if (classificationFilter !== 'All' && kpi.category !== classificationFilter) return false;
            if (domainFilter !== 'All' && kpi.domain !== domainFilter) return false;
            return true;
        });
    }, [searchQuery, classificationFilter, domainFilter]);

    const domainOptions = useMemo(() => {
        const domains = new Set<string>(['All']);
        KPI_CATALOG.forEach((k) => k.domain && domains.add(k.domain));
        return Array.from(domains).sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)));
    }, []);

    const resetFilters = () => {
        setSearchQuery('');
        setClassificationFilter('All');
        setDomainFilter('All');
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Performance': return { bg: colors.accentBg, text: colors.accent };
            case 'Outcome': return { bg: colors.successBg, text: colors.successText };
            case 'Normative': return { bg: colors.infoBg, text: colors.infoText };
            default: return { bg: colors.surfaceBg, text: colors.textSecondary };
        }
    };

    return (
        <div className="animate-fade-in max-w-[1200px]" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <Header
                title={t('sidebar.kpiLibrary')}
                subtitle="Browse and filter institutional KPIs with data"
            />

            {/* Filters */}
            <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'transparent' }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary1 + '20' }}>
                            <Filter size={18} style={{ color: colors.primary1 }} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>Filters</h3>
                            <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                                {searchQuery && `Search: "${searchQuery}" • `}
                                {classificationFilter !== 'All' && `${classificationFilter} • `}
                                {domainFilter !== 'All' && `${domainFilter}`}
                                {(!searchQuery && classificationFilter === 'All' && domainFilter === 'All') && 'All classifications and domains'}
                            </p>
                        </div>
                    </div>
                    {filtersOpen ? <ChevronUp size={20} style={{ color: colors.textSecondary }} /> : <ChevronDown size={20} style={{ color: colors.textSecondary }} />}
                </button>
                {filtersOpen && (
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 border-t" style={{ borderColor: colors.border }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>Search by name or code</label>
                                <div className="relative">
                                    <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: colors.textSecondary }} />
                                    <input
                                        type="text"
                                        placeholder="e.g. API-06, At-Risk, margin..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full ps-9 pe-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                                        style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>Classification</label>
                                <select
                                    value={classificationFilter}
                                    onChange={(e) => setClassificationFilter(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
                                >
                                    {CLASSIFICATIONS.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>Domain</label>
                                <select
                                    value={domainFilter}
                                    onChange={(e) => setDomainFilter(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: colors.surfaceBg, borderColor: colors.border, color: colors.textPrimary }}
                                >
                                    {domainOptions.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                                style={{ backgroundColor: colors.surfaceBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
                            >
                                Reset filters
                            </button>
                            <span className="text-xs font-medium" style={{ color: colors.primary1 }}>
                                {filteredKPIs.length} of {KPI_CATALOG.length} KPIs
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredKPIs.map((kpi) => {
                    const categoryStyle = getCategoryColor(kpi.category);
                    return (
                        <Link
                            key={kpi.code}
                            href={kpi.usagePage}
                            className="block p-5 rounded-xl transition-all hover:shadow-md"
                            style={{
                                backgroundColor: colors.cardBg,
                                border: `1px solid ${colors.border}`,
                                borderLeft: `4px solid ${colors.primary1}`,
                                boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
                            }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <span className="text-xs font-mono font-semibold" style={{ color: colors.primary1 }}>{kpi.code}</span>
                                <span
                                    className="px-2 py-0.5 rounded text-xs font-medium"
                                    style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.text }}
                                >
                                    {kpi.category}
                                </span>
                            </div>
                            <h3 className="text-base font-semibold mb-1.5" style={{ color: colors.textPrimary }}>{kpi.name}</h3>
                            {kpi.domain && (
                                <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>{kpi.domain}</p>
                            )}
                            <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: colors.textSecondary }}>
                                {kpi.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2 flex-wrap">
                                    {kpi.unit && (
                                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: colors.surfaceBg, color: colors.textSecondary }}>
                                            {kpi.unit}
                                        </span>
                                    )}
                                    {kpi.frequency && (
                                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: colors.surfaceBg, color: colors.textSecondary }}>
                                            {kpi.frequency}
                                        </span>
                                    )}
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: colors.primary1 }}>
                                    View <ArrowRight size={14} />
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {filteredKPIs.length === 0 && (
                <div className="p-12 rounded-xl text-center" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                    <BookOpen size={40} className="mx-auto mb-3 opacity-50" style={{ color: colors.textSecondary }} />
                    <p className="text-base font-medium mb-1" style={{ color: colors.textPrimary }}>No KPIs match your filters</p>
                    <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>Try adjusting your search or filter criteria</p>
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: colors.primary1, color: '#fff' }}
                    >
                        Reset filters
                    </button>
                </div>
            )}
        </div>
    );
}
