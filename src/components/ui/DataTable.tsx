'use client';

import { useState } from 'react';
import { Search, Download, Columns, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { useColors } from '@/hooks/useColors';

interface Column<T> { key: keyof T | string; header: string; render?: (item: T) => React.ReactNode; sortable?: boolean; }
interface DataTableProps<T extends Record<string, unknown>> { data: T[]; columns: Column<T>[]; searchable?: boolean; searchPlaceholder?: string; pageSize?: number; exportFileName?: string; showExport?: boolean; }

export default function DataTable<T extends Record<string, unknown>>({ data, columns: initialColumns, searchable = true, searchPlaceholder = 'Search...', pageSize = 10, exportFileName = 'data-export', showExport = true }: DataTableProps<T>) {
    const colors = useColors();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [visibleColumns, setVisibleColumns] = useState<string[]>(initialColumns.map(c => String(c.key)));
    const [showColumnManager, setShowColumnManager] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const columns = initialColumns.filter(c => visibleColumns.includes(String(c.key)));
    const filteredData = data.filter((item) => Object.values(item as object).some((val) => String(val).toLowerCase().includes(search.toLowerCase())));
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = (a as Record<string, unknown>)[sortKey];
        const bVal = (b as Record<string, unknown>)[sortKey];
        if (typeof aVal === 'number' && typeof bVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSort = (key: string) => { if (sortKey === key) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); } };
    const handleExport = (format: 'csv' | 'json') => {
        const content = format === 'csv' ? [columns.map(c => c.header).join(','), ...sortedData.map(item => columns.map(c => String((item as Record<string, unknown>)[String(c.key)] ?? '')).join(','))].join('\n') : JSON.stringify(sortedData, null, 2);
        const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${exportFileName}.${format}`; a.click();
        setShowNotification(true); setTimeout(() => setShowNotification(false), 3000);
    };

    return (
        <div className="overflow-hidden animate-fade-in rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
            <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
                {searchable && (
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textSecondary }} />
                        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder={searchPlaceholder}
                            className="w-full sm:w-56 px-3 py-1.5 pl-9 rounded-lg text-sm transition-all" style={{ backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }} />
                    </div>
                )}
                <div className="flex items-center gap-2 relative">
                    <button onClick={() => setShowColumnManager(!showColumnManager)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}><Columns size={14} />Columns</button>
                    {showColumnManager && (
                        <div className="absolute right-20 top-full mt-2 z-10 p-3 min-w-48 rounded-lg shadow-lg animate-scale-in" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                            <div className="flex items-center justify-between mb-2 pb-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>Toggle Columns</span>
                                <button onClick={() => setShowColumnManager(false)}><X size={14} style={{ color: colors.textSecondary }} /></button>
                            </div>
                            {initialColumns.map(col => (
                                <label key={String(col.key)} className="flex items-center gap-2 py-1.5 cursor-pointer">
                                    <input type="checkbox" checked={visibleColumns.includes(String(col.key))} onChange={() => setVisibleColumns(prev => prev.includes(String(col.key)) ? prev.filter(k => k !== String(col.key)) : [...prev, String(col.key)])} className="rounded" style={{ borderColor: colors.border }} />
                                    <span className="text-sm" style={{ color: colors.textSecondary }}>{col.header}</span>
                                </label>
                            ))}
                        </div>
                    )}
                    {showExport && (
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: colors.inputBg, border: `1px solid ${colors.border}`, color: colors.textPrimary }}><Download size={14} />Export</button>
                            <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-10 rounded-lg shadow-lg overflow-hidden min-w-32 animate-scale-in" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
                                <button onClick={() => handleExport('csv')} className="w-full px-4 py-2 text-left text-sm transition-colors" style={{ color: colors.textPrimary }}>Export as CSV</button>
                                <button onClick={() => handleExport('json')} className="w-full px-4 py-2 text-left text-sm transition-colors" style={{ color: colors.textPrimary }}>Export as JSON</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead><tr style={{ backgroundColor: colors.tableHeader }}>
                        {columns.map((col) => (
                            <th key={String(col.key)} onClick={() => col.sortable !== false && handleSort(String(col.key))} className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide ${col.sortable !== false ? 'cursor-pointer' : ''}`} style={{ color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>
                                <div className="flex items-center gap-1">{col.header}{col.sortable !== false && sortKey === col.key && <span style={{ color: colors.primary1 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}</div>
                            </th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {paginatedData.map((item, idx) => (
                            <tr key={String(item.id ?? idx)} className="transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.tableHover} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                {columns.map((col) => (<td key={String(col.key)} className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>{col.render ? col.render(item) : String((item as Record<string, unknown>)[String(col.key)] ?? '')}</td>))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: `1px solid ${colors.border}` }}>
                <p className="text-xs" style={{ color: colors.textSecondary }}>{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}</p>
                <div className="flex items-center gap-1">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded disabled:opacity-40" style={{ color: colors.textSecondary }}><ChevronLeft size={16} /></button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => setCurrentPage(page)} className="w-7 h-7 rounded text-xs font-medium" style={{ backgroundColor: currentPage === page ? colors.primary1 : 'transparent', color: currentPage === page ? '#ffffff' : colors.textSecondary }}>{page}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded disabled:opacity-40" style={{ color: colors.textSecondary }}><ChevronRight size={16} /></button>
                </div>
            </div>
            {showNotification && (
                <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg" style={{ backgroundColor: colors.successBg, border: `1px solid ${colors.successText}` }}>
                        <Check size={16} style={{ color: colors.successText }} />
                        <span className="text-sm" style={{ color: colors.successText }}>Data exported successfully!</span>
                    </div>
                </div>
            )}
        </div>
    );
}
