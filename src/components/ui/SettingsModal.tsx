'use client';

import { useState } from 'react';
import { X, Sun, Moon, Bell, Lock, Database, Palette, Globe, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface SettingsModalProps { isOpen: boolean; onClose: () => void; }

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { theme, setTheme } = useTheme();
    const [activeSection, setActiveSection] = useState('appearance');
    const [notifications, setNotifications] = useState(true);
    const isDark = theme === 'dark';

    const colors = {
        modalBg: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '#334155' : '#e2e8f0',
        textPrimary: isDark ? '#f1f5f9' : '#0f172a',
        textSecondary: isDark ? '#94a3b8' : '#64748b',
        hoverBg: isDark ? '#334155' : '#f1f5f9',
        itemBg: isDark ? '#0f172a' : '#f8fafc',
    };

    if (!isOpen) return null;

    const sections = [
        { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'data', label: 'Data & Export', icon: <Database size={18} /> },
        { id: 'security', label: 'Security', icon: <Lock size={18} /> },
        { id: 'language', label: 'Language', icon: <Globe size={18} /> },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-2xl mx-4 rounded-xl shadow-2xl overflow-hidden animate-modal-in" style={{ backgroundColor: colors.modalBg }} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Settings</h2>
                    <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: colors.textSecondary }}><X size={20} /></button>
                </div>
                <div className="flex min-h-[400px]">
                    <div className="w-48 p-3" style={{ borderRight: `1px solid ${colors.border}` }}>
                        {sections.map(section => (
                            <button key={section.id} onClick={() => setActiveSection(section.id)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                                style={{ backgroundColor: activeSection === section.id ? '#6366f1' : 'transparent', color: activeSection === section.id ? '#ffffff' : colors.textSecondary }}>
                                {section.icon}{section.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 p-6">
                        {activeSection === 'appearance' && (
                            <div className="animate-fade-in">
                                <h3 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Theme</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setTheme('light')} className="p-4 rounded-xl transition-all"
                                        style={{ border: `2px solid ${theme === 'light' ? '#6366f1' : colors.border}`, backgroundColor: theme === 'light' ? (isDark ? 'rgba(99, 102, 241, 0.1)' : '#eef2ff') : 'transparent' }}>
                                        <Sun size={24} style={{ color: theme === 'light' ? '#6366f1' : colors.textSecondary }} />
                                        <p className="mt-2 text-sm font-medium" style={{ color: colors.textPrimary }}>Light</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>Clean and bright</p>
                                    </button>
                                    <button onClick={() => setTheme('dark')} className="p-4 rounded-xl transition-all"
                                        style={{ border: `2px solid ${theme === 'dark' ? '#6366f1' : colors.border}`, backgroundColor: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'transparent' }}>
                                        <Moon size={24} style={{ color: theme === 'dark' ? '#6366f1' : colors.textSecondary }} />
                                        <p className="mt-2 text-sm font-medium" style={{ color: colors.textPrimary }}>Dark</p>
                                        <p className="text-xs" style={{ color: colors.textSecondary }}>Easy on the eyes</p>
                                    </button>
                                </div>
                            </div>
                        )}
                        {activeSection === 'notifications' && (
                            <div className="animate-fade-in space-y-4">
                                <h3 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>Notification Preferences</h3>
                                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.itemBg }}>
                                    <div><p className="text-sm font-medium" style={{ color: colors.textPrimary }}>Email Notifications</p><p className="text-xs" style={{ color: colors.textSecondary }}>Receive updates via email</p></div>
                                    <button onClick={() => setNotifications(!notifications)} className="relative w-11 h-6 rounded-full transition-colors" style={{ backgroundColor: notifications ? '#6366f1' : colors.border }}>
                                        <span className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow" style={{ left: notifications ? '24px' : '4px' }} />
                                    </button>
                                </div>
                            </div>
                        )}
                        {(activeSection === 'data' || activeSection === 'security' || activeSection === 'language') && (
                            <div className="animate-fade-in space-y-4">
                                <h3 className="text-sm font-medium mb-4" style={{ color: colors.textPrimary }}>{sections.find(s => s.id === activeSection)?.label}</h3>
                                <button className="w-full flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.itemBg }}>
                                    <div><p className="text-sm font-medium" style={{ color: colors.textPrimary }}>Coming Soon</p><p className="text-xs" style={{ color: colors.textSecondary }}>This feature is under development</p></div>
                                    <ChevronRight size={18} style={{ color: colors.textSecondary }} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ border: `1px solid ${colors.border}`, color: colors.textPrimary }}>Cancel</button>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#6366f1', color: '#ffffff' }}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}
