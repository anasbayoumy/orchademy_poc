'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useColors } from '@/hooks/useColors';
import { useLanguage } from '@/context/LanguageContext';
import { X, Send, Bot, Sparkles } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────
interface Message {
    id: string;
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

// ─── Suggestion chips shown after welcome ────────────────────────
const SUGGESTION_CHIPS = [
    'Summarize workload balance',
    'Student to faculty ratio',
    'Program viability overview',
    'Financial highlights',
    'At-risk student analysis',
];

// ─── Mock response engine ────────────────────────────────────────
function getBotResponse(input: string): string {
    const lower = input.toLowerCase();

    if (lower.includes('workload') || lower.includes('overload') || lower.includes('balance')) {
        return "Based on the latest data, the institutional overload rate is approximately 14.3%. Several departments show faculty overload concerns:\n\n• Computer Science — 3 faculty members overloaded\n• Business Administration — 2 faculty members overloaded\n\nThe overall workload balance suggests a need for strategic resource reallocation to maintain teaching quality.";
    }

    if (lower.includes('student') && (lower.includes('faculty') || lower.includes('ratio'))) {
        return "The current institution-wide student-to-faculty ratio stands at 18.2:1. With approximately 4,500 active students and 247 total faculty members, the ratio is within target but varies by department:\n\n• Engineering: 22.1:1 (above target)\n• Arts & Sciences: 15.3:1\n• Business: 19.8:1";
    }

    if (lower.includes('program') || lower.includes('viability') || lower.includes('viable')) {
        return "The viability analysis reveals:\n\n✅ 12 programs rated as Viable\n⚠️ 5 programs rated as Marginal\n❌ 3 programs rated as At-Risk\n\nAt-risk programs should be reviewed for potential restructuring or phase-out. Marginal programs may benefit from enrollment strategies or curriculum updates.";
    }

    if (lower.includes('financial') || lower.includes('revenue') || lower.includes('budget') || lower.includes('cost') || lower.includes('profit')) {
        return "Key financial highlights for the current period:\n\n• Total Revenue: SAR 245M\n• Gross Profit (Core): SAR 89M (36.3% margin)\n• Net Surplus: SAR 23M\n• Cost per Student: SAR 42,800\n\nThe institution shows healthy financial performance with opportunities for improved cost efficiency in support services.";
    }

    if (lower.includes('at-risk') || lower.includes('at risk') || lower.includes('flagged') || lower.includes('risk')) {
        return "The at-risk student analysis shows approximately 22.4% of active students are flagged for academic risk indicators. Key patterns:\n\n• Low GPA: 45% of flagged students\n• Attendance concerns: 32%\n• Course withdrawal patterns: 23%\n\nEarly intervention programs are recommended for these cohorts.";
    }

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('مرحبا')) {
        return "Hello! 👋 I'm OrchaBot, your AI assistant for Orchademy. I can help you explore data about faculty workload, student performance, program viability, financial health, and more.\n\nWhat would you like to know?";
    }

    if (lower.includes('governance') || lower.includes('strategy')) {
        return "The Strategy Execution Index currently sits at 62.4, indicating moderate alignment between strategic priorities and operational outcomes.\n\n• Board meeting compliance: 87%\n• Policy documentation coverage: 74%\n• Strategic initiative completion rate: 58%\n\nGovernance improvements should focus on closing the strategy-execution gap.";
    }

    return "I can help you explore institutional data across several areas:\n\n📊 Performance Analytics & KPIs\n👥 Faculty Workload & Staffing\n🎓 Student Success & Risk Analysis\n💰 Financial Health & Budgeting\n📈 Program Viability & Enrollment\n🏛️ Governance & Strategy\n\nTry asking about a specific topic, or use the suggestion chips!";
}

// ─── Component ───────────────────────────────────────────────────
export default function OrchaBotChatPopup({ onClose }: { onClose: () => void }) {
    const colors = useColors();
    const { isRTL } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'bot',
            content: "Welcome to OrchaBot! 👋\n\nI'm your AI-powered assistant for Orchademy institutional analytics. Ask me anything about performance data, faculty workload, student outcomes, financial health, or program viability.\n\nHow can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);
    useEffect(() => { inputRef.current?.focus(); }, []);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const sendMessage = useCallback((text: string) => {
        if (!text.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text.trim(),
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                content: getBotResponse(text),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000 + Math.random() * 800);
    }, [isTyping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const showSuggestions = messages.length === 1 && !isTyping;

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-fade-in"
                style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    maxHeight: '85vh',
                    direction: isRTL ? 'rtl' : 'ltr',
                }}
            >
                {/* ────── Header ────── */}
                <div
                    className="px-5 py-4 flex items-center gap-3 shrink-0"
                    style={{ background: `linear-gradient(135deg, ${colors.primary3}, ${colors.primary1})` }}
                >
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)' }}
                    >
                        <Bot size={20} color="#fff" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white">OrchaBot</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.secondary1 }} />
                            <span className="text-xs text-white/70">AI Assistant — Online</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/20 shrink-0"
                        title="Close"
                    >
                        <X size={18} color="#fff" />
                    </button>
                </div>

                {/* ────── Messages ────── */}
                <div
                    className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4"
                    style={{ backgroundColor: colors.isDark ? colors.pageBg : '#f8fafc' }}
                >
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-[85%]">
                                {msg.role === 'bot' && (
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Sparkles size={12} style={{ color: colors.secondary1 }} />
                                        <span className="text-xs font-medium" style={{ color: colors.secondary1 }}>OrchaBot</span>
                                    </div>
                                )}
                                <div
                                    className="rounded-2xl px-4 py-3"
                                    style={{
                                        backgroundColor: msg.role === 'user' ? colors.primary1 : colors.cardBg,
                                        color: msg.role === 'user' ? '#ffffff' : colors.textPrimary,
                                        border: msg.role === 'bot' ? `1px solid ${colors.border}` : 'none',
                                        borderTopRightRadius: msg.role === 'user' ? 4 : undefined,
                                        borderTopLeftRadius: msg.role === 'bot' ? 4 : undefined,
                                    }}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                                </div>
                                <p
                                    className="text-[10px] mt-1 px-1"
                                    style={{
                                        color: colors.textSecondary,
                                        textAlign: msg.role === 'user' ? (isRTL ? 'left' : 'right') : (isRTL ? 'right' : 'left'),
                                    }}
                                >
                                    {formatTime(msg.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%]">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Sparkles size={12} style={{ color: colors.secondary1 }} />
                                    <span className="text-xs font-medium" style={{ color: colors.secondary1 }}>OrchaBot</span>
                                </div>
                                <div
                                    className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5"
                                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                                >
                                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.textSecondary, animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.textSecondary, animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.textSecondary, animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Suggestion chips */}
                    {showSuggestions && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {SUGGESTION_CHIPS.map((chip) => (
                                <button
                                    key={chip}
                                    onClick={() => sendMessage(chip)}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95"
                                    style={{
                                        backgroundColor: colors.accentBg,
                                        color: colors.accentText,
                                        border: `1px solid ${colors.isDark ? 'rgba(48,74,120,0.4)' : 'rgba(48,74,120,0.2)'}`,
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* ────── Input ────── */}
                <form
                    onSubmit={handleSubmit}
                    className="px-4 py-3 flex items-center gap-2 shrink-0"
                    style={{ borderTop: `1px solid ${colors.border}`, backgroundColor: colors.cardBg }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask OrchaBot anything..."
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
                        style={{
                            backgroundColor: colors.inputBg,
                            color: colors.textPrimary,
                            border: `1px solid ${colors.border}`,
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = colors.primary1)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = colors.border)}
                        disabled={isTyping}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 shrink-0"
                        style={{ backgroundColor: colors.primary1, color: '#ffffff' }}
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
