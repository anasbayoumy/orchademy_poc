'use client';

import { useState } from 'react';
import { Mic } from 'lucide-react';
import { useColors } from '@/hooks/useColors';
import OrchaBotChatPopup from './OrchaBotChatPopup';

export default function OrchaBotWidget() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const colors = useColors();

    // Theme-aware palette
    const cardBg = colors.isDark ? '#1a2332' : '#ffffff';
    const bubbleBg = colors.isDark ? '#243044' : '#f1f5f9';
    const textMain = colors.isDark ? '#e2e8f0' : '#1e293b';
    const textMuted = colors.isDark ? '#64748b' : '#94a3b8';
    const botLabel = colors.secondary1;

    return (
        <>
            <button
                onClick={() => setIsChatOpen(true)}
                className="w-full text-left rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.01] flex flex-col relative"
                style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${colors.border}`,
                    maxHeight: 340,
                }}
            >
                <div className="flex flex-col gap-4 p-5 sm:p-6 overflow-hidden flex-1">

                    {/* ── Bot greeting ── left-aligned, no bubble */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold tracking-wide" style={{ color: botLabel }}>OrchaBOT</span>
                        <p className="text-sm leading-relaxed" style={{ color: textMain }}>
                            Good morning! How can I help you today?
                        </p>
                    </div>

                    {/* ── User message 1 ── right-aligned bubble */}
                    <div className="flex justify-end">
                        <div className="flex flex-col items-end gap-1">
                            <div
                                className="px-4 py-2.5 max-w-[85%]"
                                style={{
                                    backgroundColor: bubbleBg,
                                    borderRadius: '18px 4px 18px 18px',
                                }}
                            >
                                <p className="text-sm italic leading-relaxed" style={{ color: textMain }}>
                                    How many faculty members are overloaded?
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 pr-1">
                                <Mic size={10} color={textMuted} />
                                <span className="text-[10px] tabular-nums" style={{ color: textMuted }}>00:03</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Bot response 1 ── left-aligned, no bubble */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold tracking-wide" style={{ color: botLabel }}>OrchaBOT</span>
                        <p className="text-sm leading-relaxed" style={{ color: textMain }}>
                            Currently, <span className="font-semibold">5 faculty members</span> are overloaded across 2 departments. The institutional overload rate stands at 14.3%.
                        </p>
                    </div>

                    {/* ── User message 2 ── right-aligned bubble (same color) */}
                    <div className="flex justify-end">
                        <div className="flex flex-col items-end gap-1">
                            <div
                                className="px-4 py-2.5 max-w-[85%]"
                                style={{
                                    backgroundColor: bubbleBg,
                                    borderRadius: '18px 4px 18px 18px',
                                }}
                            >
                                <p className="text-sm italic leading-relaxed" style={{ color: textMain }}>
                                    Summarize the workload balance
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 pr-1">
                                <Mic size={10} color={textMuted} />
                                <span className="text-[10px] tabular-nums" style={{ color: textMuted }}>00:01</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Bot response 2 (truncated — invites click) ── */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold tracking-wide" style={{ color: botLabel }}>OrchaBOT</span>
                        <p className="text-sm leading-relaxed" style={{ color: textMain }}>
                            The total workload balance for now is....
                        </p>
                    </div>

                    {/* ── Typing dots ── */}
                    <div className="flex items-center gap-1 pl-0.5">
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: textMuted, animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: textMuted, animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: textMuted, animationDelay: '300ms' }} />
                    </div>
                </div>

                {/* ── Fade-away gradient overlay at the bottom ── */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none flex items-end justify-end px-6 pb-4"
                    style={{
                        background: `linear-gradient(to bottom, transparent 0%, ${cardBg} 70%)`,
                    }}
                >
                    <span className="text-base font-bold tracking-wide select-none" style={{ color: textMain, opacity: 0.25 }}>
                        OrchaBOT
                    </span>
                </div>
            </button>

            {isChatOpen && <OrchaBotChatPopup onClose={() => setIsChatOpen(false)} />}
        </>
    );
}
