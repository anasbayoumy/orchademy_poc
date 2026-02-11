'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Users, ClipboardList, Scale, Settings2,
    GraduationCap, Grid3X3, GitBranch, BarChart3, Target,
    Briefcase, Map, TrendingUp, ChevronDown, Search,
    LogOut, Settings, X
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import SettingsModal from '@/components/ui/SettingsModal';

interface MenuItem {
    labelKey: string;
    href: string;
    icon: React.ReactNode;
    children?: MenuItem[];
}

const getMenuItems = (): MenuItem[] => [
    { labelKey: 'sidebar.dashboard', href: '/', icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
    {
        labelKey: 'sidebar.faculty',
        href: '/faculty',
        icon: <Users size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.loadSummary', href: '/faculty', icon: <ClipboardList size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.workloadGap', href: '/faculty/workload', icon: <Scale size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.smartAllocation', href: '/faculty/allocation', icon: <Settings2 size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.simulation', href: '/faculty/simulation', icon: <GitBranch size={16} strokeWidth={1.5} /> },
        ],
    },
    {
        labelKey: 'sidebar.programs',
        href: '/programs',
        icon: <GraduationCap size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.viabilityMatrix', href: '/programs', icon: <Grid3X3 size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.scenarios', href: '/programs/scenarios', icon: <GitBranch size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.analytics', href: '/programs/analytics', icon: <BarChart3 size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.kpiReport', href: '/programs/kpi', icon: <Target size={16} strokeWidth={1.5} /> },
        ],
    },
    {
        labelKey: 'sidebar.employability',
        href: '/employability',
        icon: <Briefcase size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.scorecard', href: '/employability', icon: <ClipboardList size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.skillsMap', href: '/employability/skills', icon: <Map size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.impact', href: '/employability/impact', icon: <TrendingUp size={16} strokeWidth={1.5} /> },
        ],
    },
];

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {

    const pathname = usePathname();
    const { theme } = useTheme();
    const { t, isRTL } = useLanguage();
    const isDark = theme === 'dark';

    const [expandedItems, setExpandedItems] = useState<string[]>([
        'sidebar.faculty',
        'sidebar.programs',
        'sidebar.employability'
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const menuItems = getMenuItems();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const colors = {
        sidebarBg: '#0b1c3d',
        border: 'rgba(255,255,255,0.08)',
        textPrimary: '#ffffff',
        textSecondary: '#cbd5e1',
        inputBg: '#2c3259',
        hoverBg: '#2c3259',
        activeBg: '#304a78',
        activeHoverBg: '#2c3259',
        activeText: '#ffffff',
    };

    const toggleExpand = (labelKey: string) => {
        setExpandedItems(prev =>
            prev.includes(labelKey)
                ? prev.filter(i => i !== labelKey)
                : [...prev, labelKey]
        );
    };

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <>
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={onToggle}
                />
            )}

            <aside
                className="fixed top-0 h-screen flex flex-col z-50 transition-all duration-300"
                style={{
                    width: isMobile ? 280 : (isOpen ? 240 : 0),
                    background: 'linear-gradient(180deg, #0b1c3d 0%, #2c3259 100%)',
                    borderRight: `1px solid ${colors.border}`,
                    left: isRTL ? 'auto' : 0,
                    right: isRTL ? 0 : 'auto',

                    // 👇 APPLY INTER TO ENTIRE SIDEBAR
                    fontFamily: 'var(--font-body), sans-serif'
                }}
            >
                {/* Header */}
                <div
                    className="px-5 py-4 flex items-center justify-between"
                    style={{ borderBottom: `1px solid ${colors.border}` }}
                >
                    <span
                        className="text-lg tracking-tight"
                        style={{
                            color: colors.textPrimary,

                            // 👇 APPLY LIBRE ONLY TO BRAND
                            fontFamily: 'var(--font-heading), serif'
                        }}
                    >
                        EcliptixAI
                    </span>

                    {isMobile && (
                        <button onClick={onToggle}>
                            <X size={20} color={colors.textSecondary} />
                        </button>
                    )}
                </div>

                {/* Search */}
                <div className="px-4 py-3">
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{ color: colors.textSecondary, left: 12 }}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('common.search')}
                            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                            style={{
                                backgroundColor: colors.inputBg,
                                border: `1px solid ${colors.border}`,
                                color: colors.textPrimary,
                                paddingLeft: 36,
                            }}
                        />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-2">
                    {menuItems.map((item) => (
                        <div key={item.labelKey} className="mb-1">
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => toggleExpand(item.labelKey)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm"
                                        style={{
                                            backgroundColor: isActive(item.href)
                                                ? colors.activeHoverBg
                                                : 'transparent',
                                            color: colors.textSecondary,
                                        }}
                                    >
                                        <span className="flex items-center gap-3">
                                            {item.icon}
                                            {t(item.labelKey)}
                                        </span>
                                        <ChevronDown size={14} />
                                    </button>

                                    {expandedItems.includes(item.labelKey) && (
                                        <div className="pl-4 mt-1 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                                                    style={{
                                                        backgroundColor:
                                                            pathname === child.href
                                                                ? colors.activeBg
                                                                : 'transparent',
                                                        color:
                                                            pathname === child.href
                                                                ? '#ffffff'
                                                                : colors.textSecondary,
                                                    }}
                                                >
                                                    {child.icon}
                                                    {t(child.labelKey)}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                                    style={{
                                        backgroundColor: isActive(item.href)
                                            ? colors.activeBg
                                            : 'transparent',
                                        color: isActive(item.href)
                                            ? '#ffffff'
                                            : colors.textSecondary,
                                    }}
                                >
                                    {item.icon}
                                    {t(item.labelKey)}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div
                    className="p-4"
                    style={{ borderTop: `1px solid ${colors.border}` }}
                >
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm"
                        style={{ color: colors.textSecondary }}
                    >
                        <Settings size={18} />
                        {t('sidebar.settings')}
                    </button>
                </div>
            </aside>

            <SettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
            />
        </>
    );
}
