'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ClipboardList, Scale, Settings2, GraduationCap, Grid3X3, GitBranch, BarChart3, Target, Briefcase, Map, TrendingUp, ChevronDown, Search, LogOut, Settings, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import SettingsModal from '@/components/ui/SettingsModal';

interface MenuItem { labelKey: string; href: string; icon: React.ReactNode; children?: MenuItem[]; }

const getMenuItems = (): MenuItem[] => [
    { labelKey: 'sidebar.dashboard', href: '/', icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
    {
        labelKey: 'sidebar.faculty', href: '/faculty', icon: <Users size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.loadSummary', href: '/faculty', icon: <ClipboardList size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.workloadGap', href: '/faculty/workload', icon: <Scale size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.smartAllocation', href: '/faculty/allocation', icon: <Settings2 size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.simulation', href: '/faculty/simulation', icon: <GitBranch size={16} strokeWidth={1.5} /> },
        ],
    },
    {
        labelKey: 'sidebar.programs', href: '/programs', icon: <GraduationCap size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.viabilityMatrix', href: '/programs', icon: <Grid3X3 size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.scenarios', href: '/programs/scenarios', icon: <GitBranch size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.analytics', href: '/programs/analytics', icon: <BarChart3 size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.kpiReport', href: '/programs/kpi', icon: <Target size={16} strokeWidth={1.5} /> },
        ],
    },
    {
        labelKey: 'sidebar.employability', href: '/employability', icon: <Briefcase size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.scorecard', href: '/employability', icon: <ClipboardList size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.skillsMap', href: '/employability/skills', icon: <Map size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.impact', href: '/employability/impact', icon: <TrendingUp size={16} strokeWidth={1.5} /> },
        ],
    },
];

interface SidebarProps { isOpen: boolean; onToggle: () => void; }

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const { theme } = useTheme();
    const { t, isRTL } = useLanguage();
    const [expandedItems, setExpandedItems] = useState<string[]>(['sidebar.faculty', 'sidebar.programs', 'sidebar.employability']);
    const [searchQuery, setSearchQuery] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const isDark = theme === 'dark';

    const menuItems = getMenuItems();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const colors = {
        sidebarBg: isDark ? '#1e293b' : '#f8fafc',
        border: isDark ? '#334155' : '#e2e8f0',
        textPrimary: isDark ? '#f1f5f9' : '#1e293b',
        textSecondary: isDark ? '#94a3b8' : '#64748b',
        inputBg: isDark ? '#334155' : '#ffffff',
        hoverBg: isDark ? '#334155' : '#e2e8f0',
        activeBg: '#6366f1',
        activeHoverBg: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
        activeText: isDark ? '#a5b4fc' : '#4f46e5',
    };

    const toggleExpand = (labelKey: string) => setExpandedItems(prev => prev.includes(labelKey) ? prev.filter(i => i !== labelKey) : [...prev, labelKey]);
    const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);
    const filteredMenuItems = menuItems.filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return t(item.labelKey).toLowerCase().includes(q) || item.children?.some(c => t(c.labelKey).toLowerCase().includes(q));
    });

    return (
        <>
            {isMobile && isOpen && (
                <div className="fixed inset-0 z-40 animate-fade-in" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }} onClick={onToggle} />
            )}
            <aside
                className="fixed top-0 h-screen flex flex-col z-50 transition-all duration-300 ease-out"
                style={{
                    width: isMobile ? 280 : (isOpen ? 240 : 0),
                    backgroundColor: colors.sidebarBg,
                    borderRight: isOpen && !isRTL ? `1px solid ${colors.border}` : 'none',
                    borderLeft: isOpen && isRTL ? `1px solid ${colors.border}` : 'none',
                    transform: isMobile ? (isOpen ? 'translateX(0)' : (isRTL ? 'translateX(100%)' : 'translateX(-100%)')) : 'translateX(0)',
                    boxShadow: isMobile && isOpen ? '4px 0 20px rgba(0, 0, 0, 0.1)' : 'none',
                    left: isRTL ? 'auto' : 0,
                    right: isRTL ? 0 : 'auto',
                }}
            >
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <span className="font-bold text-lg tracking-tight" style={{ color: colors.textPrimary, opacity: isOpen ? 1 : 0 }}>EcliptixAI</span>
                    {isMobile && <button onClick={onToggle} className="p-2 rounded-lg" style={{ color: colors.textSecondary }}><X size={20} /></button>}
                </div>

                <div className="px-4 py-3" style={{ opacity: isOpen ? 1 : 0 }}>
                    <div className="relative">
                        <Search size={14} className="absolute top-1/2 -translate-y-1/2" style={{ color: colors.textSecondary, left: isRTL ? 'auto' : 12, right: isRTL ? 12 : 'auto' }} />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('common.search')}
                            className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-all focus-ring"
                            style={{ backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`, color: colors.textPrimary, paddingLeft: isRTL ? 12 : 36, paddingRight: isRTL ? 36 : 12 }}
                        />
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-2" style={{ opacity: isOpen ? 1 : 0 }}>
                    {filteredMenuItems.map((item, index) => (
                        <div key={item.labelKey} className="mb-0.5 animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
                            {item.children ? (
                                <>
                                    <button onClick={() => toggleExpand(item.labelKey)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                                        style={{ backgroundColor: isActive(item.href) ? colors.activeHoverBg : 'transparent', color: isActive(item.href) ? colors.activeText : colors.textSecondary }}
                                    >
                                        <span className="flex items-center gap-3">{item.icon}{t(item.labelKey)}</span>
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${expandedItems.includes(item.labelKey) ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedItems.includes(item.labelKey) ? '400px' : '0', opacity: expandedItems.includes(item.labelKey) ? 1 : 0 }}>
                                        <div className="mt-0.5 space-y-0.5 pl-3" style={{ borderLeft: isRTL ? 'none' : `1px solid ${colors.border}`, borderRight: isRTL ? `1px solid ${colors.border}` : 'none', marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }}>
                                            {item.children.map((child) => (
                                                <Link key={child.href} href={child.href}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200"
                                                    style={{ backgroundColor: pathname === child.href ? colors.activeBg : 'transparent', color: pathname === child.href ? '#ffffff' : colors.textSecondary, boxShadow: pathname === child.href ? '0 4px 6px -1px rgba(99, 102, 241, 0.3)' : 'none' }}
                                                >{child.icon}{t(child.labelKey)}</Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                                    style={{ backgroundColor: isActive(item.href) ? colors.activeBg : 'transparent', color: isActive(item.href) ? '#ffffff' : colors.textSecondary, boxShadow: isActive(item.href) ? '0 4px 6px -1px rgba(99, 102, 241, 0.3)' : 'none' }}
                                >{item.icon}{t(item.labelKey)}</Link>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="p-4 space-y-3" style={{ borderTop: `1px solid ${colors.border}`, opacity: isOpen ? 1 : 0 }}>
                    <button onClick={() => setSettingsOpen(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
                        style={{ color: colors.textSecondary }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hoverBg}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Settings size={18} strokeWidth={1.5} />{t('sidebar.settings')}
                    </button>
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{ backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)', color: colors.activeText }}>DS</div>
                            <div><p className="text-sm font-medium" style={{ color: colors.textPrimary }}>D. Steward</p><p className="text-xs" style={{ color: colors.textSecondary }}>{t('common.admin')}</p></div>
                        </div>
                        <button className="p-1.5 rounded" style={{ color: colors.textSecondary }}><LogOut size={16} strokeWidth={1.5} /></button>
                    </div>
                </div>
            </aside>
            <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </>
    );
}
