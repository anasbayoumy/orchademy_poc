'use client';

import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { Rocket, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonProps {
    title?: string;
    description?: string;
    showBackButton?: boolean;
}

export default function ComingSoon({ 
    title, 
    description,
    showBackButton = true 
}: ComingSoonProps) {
    const colors = useColors();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.pageBg }}>
            <div className="text-center max-w-md animate-fade-in">
                <div 
                    className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: colors.accentBg }}
                >
                    <Rocket size={48} style={{ color: colors.accent }} />
                </div>
                
                <h1 className="text-3xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                    {title || t('common.comingSoon')}
                </h1>
                
                <p className="text-base mb-8" style={{ color: colors.textSecondary }}>
                    {description || t('common.underDevelopment')}
                </p>

                {showBackButton && (
                    <Link href="/">
                        <button
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                            style={{ 
                                backgroundColor: colors.accent, 
                                color: '#ffffff',
                                boxShadow: '0 4px 12px rgba(48, 74, 120, 0.3)'
                            }}
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}
