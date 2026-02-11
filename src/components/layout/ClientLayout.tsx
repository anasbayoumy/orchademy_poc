'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { DateFilterProvider } from '@/context/DateFilterContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

function MainContent({
    children,
    sidebarOpen,
    onToggleSidebar
}: {
    children: ReactNode;
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
}) {

    const { theme } = useTheme();
    const { isRTL } = useLanguage();
    const isDark = theme === 'dark';
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const sidebarWidth = isMobile ? 0 : (sidebarOpen ? 240 : 0);

    return (
        <main
            className="flex-1 p-4 md:p-6 transition-all duration-300 ease-out min-h-screen"
            style={{
                marginLeft: isRTL ? 0 : sidebarWidth,
                marginRight: isRTL ? sidebarWidth : 0,
                backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                color: isDark ? '#f1f5f9' : '#0f172a',
                fontFamily: 'Inter, sans-serif'
            }}
        >

            {/* Mobile Header */}
            <div
                className="lg:hidden flex items-center gap-4 mb-4 -mt-2 -mx-2 px-4 py-3 sticky top-0 z-30"
                style={{
                    backgroundColor: '#0b1c3d',   // brand primary
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    marginLeft: -16,
                    marginRight: -16,
                    width: 'calc(100% + 32px)',
                }}
            >
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg transition-colors"
                    style={{
                        backgroundColor: '#2493a2',  // secondary aqua
                        color: '#ffffff'
                    }}
                >
                    <Menu size={20} />
                </button>

                <span
                    className="text-lg"
                    style={{
                        fontFamily: 'Libre Baskerville, serif',
                        color: '#ffffff'
                    }}
                >
                    EcliptixAI
                </span>
            </div>

            {/* Floating Sidebar Toggle (Desktop) */}
            {!isMobile && !sidebarOpen && (
                <button
                    onClick={onToggleSidebar}
                    className="fixed z-30 p-2 rounded-lg transition-all duration-200 animate-fade-in"
                    style={{
                        left: isRTL ? 'auto' : 16,
                        right: isRTL ? 16 : 'auto',
                        top: 16,
                        backgroundColor: '#2493a2', // secondary
                        border: 'none',
                        color: '#ffffff',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    }}
                >
                    <Menu size={20} />
                </button>
            )}

            {children}
        </main>
    );
}

function AppLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="flex min-h-screen">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(prev => !prev)}
            />
            <MainContent
                sidebarOpen={sidebarOpen}
                onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            >
                {children}
            </MainContent>
        </div>
    );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <DateFilterProvider>
                    <AppLayout>{children}</AppLayout>
                </DateFilterProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}
