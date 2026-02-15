'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Sun, Moon, Bell, Lock, Database, Palette, Globe, ChevronRight, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage, Language } from '@/context/LanguageContext';
import { useColors } from '@/hooks/useColors';

interface SettingsModalProps { isOpen: boolean; onClose: () => void; }

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { theme, setTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const colors = useColors();
    const [activeSection, setActiveSection] = useState('appearance');
    const [notifications, setNotifications] = useState(true);
    const isDark = theme === 'dark';

    // Store initial values when modal opens
    const initialTheme = useRef(theme);
    const initialLanguage = useRef(language);
    const initialNotifications = useRef(notifications);
    const [showSaveToast, setShowSaveToast] = useState(false);

    useEffect(() => {
        if (isOpen) {
            initialTheme.current = theme;
            initialLanguage.current = language;
            initialNotifications.current = notifications;
            setShowSaveToast(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCancel = () => {
        // Revert all changes
        if (theme !== initialTheme.current) setTheme(initialTheme.current);
        if (language !== initialLanguage.current) setLanguage(initialLanguage.current);
        if (notifications !== initialNotifications.current) setNotifications(initialNotifications.current);
        onClose();
    };

    const handleSave = () => {
        // Keep current values (they're already applied via context)
        setShowSaveToast(true);
        setTimeout(() => {
            setShowSaveToast(false);
            onClose();
        }, 800);
    };

    const sections = [
        { id: 'appearance', label: t('settings.appearance'), icon: <Palette size={18} /> },
        { id: 'notifications', label: t('settings.notifications'), icon: <Bell size={18} /> },
        { id: 'language', label: t('settings.language'), icon: <Globe size={18} /> },
        { id: 'data', label: t('settings.dataExport'), icon: <Database size={18} /> },
        { id: 'security', label: t('settings.security'), icon: <Lock size={18} /> },
    ];

    const languages: { code: Language; name: string; nativeName: string }[] = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    ];

    const hasChanges = theme !== initialTheme.current || language !== initialLanguage.current || notifications !== initialNotifications.current;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && handleCancel()}>
            <div className="w-full max-w-2xl mx-4 rounded-xl shadow-2xl overflow-hidden animate-modal-in" style={{ backgroundColor: colors.modalBg }} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>{t('common.settings')}</h2>
                    <button onClick={handleCancel} className="p-2 rounded-lg transition-colors hover:opacity-70" style={{ color: colors.textSecondary }}><X size={20} /></button>
                </div>

                {/* Body */}
                <div className="flex min-h-[400px]">
                    {/* Section Tabs */}
                    <div className="w-48 p-3" style={{ borderRight: `1px solid ${colors.border}` }}>
                        {sections.map((section, index) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                                style={{
                                    backgroundColor: activeSection === section.id ? colors.primary1 : 'transparent',
                                    color: activeSection === section.id ? '#ffffff' : colors.textSecondary,
                                    animationDelay: `${index * 50}ms`,
                                }}
                            >
                                {section.icon}
                                <span className="truncate">{section.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Section Content */}
                    <div className="flex-1 p-6">
                        {activeSection === 'appearance' && (
                            <div className="animate-fade-in">
                                <h3 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>{t('settings.theme')}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setTheme('light')}
                                        className="p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                                        style={{ border: `2px solid ${theme === 'light' ? colors.primary1 : colors.border}`, backgroundColor: theme === 'light' ? (isDark ? colors.accentBg : '#eef2ff') : 'transparent' }}>
                                        <Sun size={24} style={{ color: theme === 'light' ? colors.primary1 : colors.textSecondary }} />
                                        <p className="mt-2 text-sm font-medium" style={{ color: colors.textPrimary }}>{t('settings.light')}</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{t('settings.cleanAndBright')}</p>
                                    </button>
                                    <button onClick={() => setTheme('dark')}
                                        className="p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                                        style={{ border: `2px solid ${theme === 'dark' ? colors.primary1 : colors.border}`, backgroundColor: theme === 'dark' ? colors.accentBg : 'transparent' }}>
                                        <Moon size={24} style={{ color: theme === 'dark' ? colors.primary1 : colors.textSecondary }} />
                                        <p className="mt-2 text-sm font-medium" style={{ color: colors.textPrimary }}>{t('settings.dark')}</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{t('settings.easyOnEyes')}</p>
                                    </button>
                                </div>
                            </div>
                        )}
                        {activeSection === 'notifications' && (
                            <div className="animate-fade-in space-y-4">
                                <h3 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>{t('settings.notificationPreferences')}</h3>
                                <div className="flex items-center justify-between p-4 rounded-lg transition-all duration-200" style={{ backgroundColor: colors.itemBg }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{t('settings.emailNotifications')}</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{t('settings.receiveUpdates')}</p>
                                    </div>
                                    <button onClick={() => setNotifications(!notifications)}
                                        className="relative w-11 h-6 rounded-full transition-colors duration-300"
                                        style={{ backgroundColor: notifications ? colors.primary1 : colors.border }}>
                                        <span className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                                            style={{ left: notifications ? '24px' : '4px' }} />
                                    </button>
                                </div>
                            </div>
                        )}
                        {activeSection === 'language' && (
                            <div className="animate-fade-in">
                                <h3 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>{t('settings.selectLanguage')}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => setLanguage(lang.code)}
                                            className="p-4 rounded-xl transition-all duration-200 text-left hover:scale-[1.02]"
                                            style={{
                                                border: `2px solid ${language === lang.code ? colors.primary1 : colors.border}`,
                                                backgroundColor: language === lang.code ? (isDark ? colors.accentBg : '#eef2ff') : 'transparent'
                                            }}
                                        >
                                            <Globe size={24} style={{ color: language === lang.code ? colors.primary1 : colors.textSecondary }} />
                                            <p className="mt-2 text-sm font-medium" style={{ color: colors.textPrimary }}>{lang.nativeName}</p>
                                            <p className="text-xs" style={{ color: colors.textSecondary }}>{lang.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {(activeSection === 'data' || activeSection === 'security') && (
                            <div className="animate-fade-in space-y-4">
                                <h3 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>{sections.find(s => s.id === activeSection)?.label}</h3>
                                <div className="w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200" style={{ backgroundColor: colors.itemBg }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{t('common.comingSoon')}</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>{t('common.underDevelopment')}</p>
                                    </div>
                                    <ChevronRight size={18} style={{ color: colors.textSecondary }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                    {/* Change indicator */}
                    <div className="flex items-center gap-2">
                        {hasChanges && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full animate-fade-in" style={{ backgroundColor: colors.warningBg, color: colors.warningText }}>
                                {t('settings.unsavedChanges')}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleCancel}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80"
                            style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }}>
                            {t('common.cancel')}
                        </button>
                        <button onClick={handleSave}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90 flex items-center gap-2"
                            style={{ backgroundColor: colors.primary1, color: '#ffffff', opacity: hasChanges ? 1 : 0.6 }}>
                            {showSaveToast ? <><Check size={16} /> {t('common.saved')}</> : t('common.saveChanges')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
