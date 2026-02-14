'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Users, ClipboardList, Scale, Settings2, GraduationCap,
    Grid3X3, GitBranch, BarChart3, Target, Briefcase, Map, TrendingUp,
    ChevronDown, Search, LogOut, Settings, X, FileCheck, PieChart,
    Landmark, Leaf, Layers, DollarSign, Activity, ScrollText, Network, Globe, Sparkles,
    CheckCircle, FileText, Zap, AlertTriangle
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import SettingsModal from '@/components/ui/SettingsModal';
import { DESIGN_TOKENS } from '@/config/design-tokens';
import Image from 'next/image';

interface MenuItem { labelKey: string; href: string; icon: React.ReactNode; children?: MenuItem[]; }

const getMenuItems = (): MenuItem[] => [
    // 1. Dashboard
    {
        labelKey: 'sidebar.dashboard',
        href: '/',
        icon: <LayoutDashboard size={18} strokeWidth={1.5} />
    },

    // 2. Strategic Alignment & Governance Hub
    {
        labelKey: 'sidebar.strategy.title',
        href: '/strategy',
        icon: <Target size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.strategy.dashboard', href: '/strategy', icon: <LayoutDashboard size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.strategy.alignment', href: '/strategy/alignment', icon: <Network size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.strategy.priorities', href: '/strategy/priorities', icon: <Landmark size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.strategy.kpi', href: '/strategy/kpi', icon: <Target size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.strategy.mission', href: '/strategy/mission', icon: <ScrollText size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.strategy.compliance', href: '/strategy/compliance', icon: <FileCheck size={16} strokeWidth={1.5} /> },
        ],
    },

    // 3. Academic Workload Management
    {
        labelKey: 'sidebar.workload.title',
        href: '/workload',
        icon: <Users size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.workload.dashboard', href: '/workload', icon: <LayoutDashboard size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.workload.requirements', href: '/workload/requirements', icon: <ClipboardList size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.workload.credentials', href: '/workload/credentials', icon: <FileCheck size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.workload.optimization', href: '/workload/optimization', icon: <Scale size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.workload.balancing', href: '/workload/balancing', icon: <GitBranch size={16} strokeWidth={1.5} /> },
        ],
    },

    // 4. Academic Program Intelligence
    {
        labelKey: 'sidebar.programs.title',
        href: '/programs',
        icon: <GraduationCap size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.programs.dashboard', href: '/programs', icon: <LayoutDashboard size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.programs.advising', href: '/programs/advising', icon: <Users size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.programs.analytics', href: '/programs/analytics', icon: <BarChart3 size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.programs.sentiment', href: '/programs/sentiment', icon: <PieChart size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.programs.kpi', href: '/programs/kpi', icon: <Target size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.programs.demand', href: '/programs/demand', icon: <TrendingUp size={16} strokeWidth={1.5} /> },
        ],
    },

    // 5. ROI & Impact Matrix
    {
        labelKey: 'sidebar.roi.title',
        href: '/roi',
        icon: <TrendingUp size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.roi.dashboard', href: '/roi', icon: <LayoutDashboard size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.roi.cost', href: '/roi/cost', icon: <DollarSign size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.roi.analytics', href: '/roi/analytics', icon: <BarChart3 size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.roi.employability', href: '/roi/employability', icon: <Briefcase size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.roi.grants', href: '/roi/grants', icon: <FileCheck size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.roi.research', href: '/roi/research', icon: <Search size={16} strokeWidth={1.5} /> },
        ],
    },

    // 6. Efficiency Monitor
    {
        labelKey: 'sidebar.efficiency.title',
        href: '/efficiency',
        icon: <Activity size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.efficiency.dashboard', href: '/efficiency', icon: <LayoutDashboard size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.efficiency.costStructure', href: '/efficiency/benchmarking', icon: <DollarSign size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.efficiency.productivity', href: '/efficiency/resource', icon: <TrendingUp size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.efficiency.serviceDelivery', href: '/efficiency/service-delivery', icon: <Layers size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.efficiency.capacityUtilization', href: '/efficiency/capacity', icon: <Activity size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.efficiency.workforceRatios', href: '/efficiency/workforce', icon: <Users size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.efficiency.normativeTargets', href: '/efficiency/targets', icon: <Target size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.efficiency.growthPressure', href: '/efficiency/growth', icon: <TrendingUp size={16} strokeWidth={1.5} /> },
        ],
    },

    // 7. Sustainability Engine
    {
        labelKey: 'sidebar.sustainability.title',
        href: '/sustainability',
        icon: <Leaf size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.sustainability.dashboard', href: '/sustainability', icon: <LayoutDashboard size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.sustainability.energyCarbon', href: '/sustainability/sdgs', icon: <Zap size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.sustainability.investment', href: '/sustainability/investment', icon: <DollarSign size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.sustainability.climateRisk', href: '/sustainability/climate-risk', icon: <AlertTriangle size={16} strokeWidth={1.5} /> },
        ],
    },

    // 8. Financials
    {
        labelKey: 'sidebar.financials.title',
        href: '/financials',
        icon: <DollarSign size={18} strokeWidth={1.5} />,
        children: [
            { labelKey: 'sidebar.financials.dashboard', href: '/financials', icon: <LayoutDashboard size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.financials.plNatural', href: '/financials/p-l-natural', icon: <BarChart3 size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.financials.plFunctional', href: '/financials/p-l-functional', icon: <PieChart size={16} strokeWidth={1.5} /> },
            { labelKey: 'sidebar.financials.simulations', href: '/financials/simulations', icon: <Sparkles size={16} strokeWidth={1.5} /> },
        ],
    },

    // 9. Services
    {
        labelKey: 'sidebar.services',
        href: '/services',
        icon: <Layers size={18} strokeWidth={1.5} />
    },
];

interface SidebarProps { isOpen: boolean; onToggle: () => void; }

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const { theme } = useTheme();
    const { t, isRTL } = useLanguage();
    // All dropdowns closed by default - click to expand
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
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
        sidebarBg: isDark ? DESIGN_TOKENS.colors.primary[3] : '#f8fafc',
        border: isDark ? '#2a3647' : '#e2e8f0',
        textPrimary: isDark ? '#f1f5f9' : '#1e293b',
        textSecondary: isDark ? '#94a3b8' : '#64748b',
        inputBg: isDark ? '#2a3647' : '#ffffff',
        hoverBg: isDark ? '#2a3647' : '#e2e8f0',
        activeBg: DESIGN_TOKENS.colors.primary[1],
        activeHoverBg: isDark ? 'rgba(48, 74, 120, 0.2)' : 'rgba(48, 74, 120, 0.1)',
        activeText: isDark ? '#5a7eb3' : DESIGN_TOKENS.colors.primary[1],
    };

    const toggleExpand = (labelKey: string) => setExpandedItems(prev => prev.includes(labelKey) ? prev.filter(i => i !== labelKey) : [...prev, labelKey]);

    // Improved active state checking for nested routes
    const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

    const filteredMenuItems = menuItems.filter(item => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        // Fallback to labelKey if translation fails during dev
        const itemLabel = t(item.labelKey) !== item.labelKey ? t(item.labelKey) : item.labelKey.split('.').pop() || '';

        return itemLabel.toLowerCase().includes(q) || item.children?.some(c => {
            const childLabel = t(c.labelKey) !== c.labelKey ? t(c.labelKey) : c.labelKey.split('.').pop() || '';
            return childLabel.toLowerCase().includes(q);
        });
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
                <div className="px-5 py-4 flex items-center justify-center relative" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    {isMobile && (
                        <button 
                            onClick={onToggle} 
                            className="absolute p-2 rounded-lg" 
                            style={{ 
                                color: colors.textSecondary,
                                left: isRTL ? 'auto' : 12,
                                right: isRTL ? 12 : 'auto'
                            }}
                        >
                            <X size={20} />
                        </button>
                    )}
                    <Link href="/" className="flex items-center justify-center">
                        <Image
                            src={isDark ? "/logo_dark.png" : "/logo_light.png"}
                            alt="Orchademy Logo"
                            width={150}
                            height={42}
                            priority
                            style={{
                                objectFit: "contain",
                            }}
                        />
                    </Link>
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

                <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar" style={{ opacity: isOpen ? 1 : 0 }}>
                    {filteredMenuItems.map((item, index) => (
                        <div key={item.labelKey} className="mb-0.5 animate-slide-in" style={{ animationDelay: `${index * 30}ms` }}>
                            {item.children ? (
                                <>
                                    <button onClick={() => toggleExpand(item.labelKey)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                                        style={{ backgroundColor: isActive(item.href) ? colors.activeHoverBg : 'transparent', color: isActive(item.href) ? colors.activeText : colors.textSecondary }}
                                    >
                                        <span className="flex items-center gap-3">{item.icon}
                                            <span className="truncate">{t(item.labelKey)}</span></span>
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${expandedItems.includes(item.labelKey) ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: expandedItems.includes(item.labelKey) ? '800px' : '0', opacity: expandedItems.includes(item.labelKey) ? 1 : 0 }}>
                                        <div className="mt-0.5 space-y-0.5 pl-3" style={{ borderLeft: isRTL ? 'none' : `1px solid ${colors.border}`, borderRight: isRTL ? `1px solid ${colors.border}` : 'none', marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }}>
                                            {item.children.map((child) => (
                                                <Link key={child.href} href={child.href}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-200"
                                                    style={{ backgroundColor: pathname === child.href ? colors.activeBg : 'transparent', color: pathname === child.href ? '#ffffff' : colors.textSecondary, boxShadow: pathname === child.href ? '0 4px 6px -1px rgba(99, 102, 241, 0.3)' : 'none' }}
                                                >{child.icon}<span className="truncate">{t(child.labelKey)}</span></Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                                    style={{ backgroundColor: isActive(item.href) ? colors.activeBg : 'transparent', color: isActive(item.href) ? '#ffffff' : colors.textSecondary, boxShadow: isActive(item.href) ? '0 4px 6px -1px rgba(99, 102, 241, 0.3)' : 'none' }}
                                >{item.icon}<span>{t(item.labelKey)}</span></Link>
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
                        <Settings size={18} strokeWidth={1.5} />
                        <span>{t('sidebar.settings')}</span>
                    </button>
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{ backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)', color: colors.activeText }}>SM</div>
                            <div><p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{t('common.userName')}</p><p className="text-xs" style={{ color: colors.textSecondary }}>{t('common.admin')}</p></div>
                        </div>
                        <button className="p-1.5 rounded" style={{ color: colors.textSecondary }} title={t('common.logout')}><LogOut size={16} strokeWidth={1.5} /></button>
                    </div>
                </div>
            </aside>
            <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </>
    );
}
