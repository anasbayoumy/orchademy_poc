import { useState } from 'react';
import { X, Calendar, TrendingUp, BarChart3, Download, Share2 } from 'lucide-react';
import { useFilters } from '../../contexts/FilterContext';

interface AdvancedFilterPanelProps {
  onClose: () => void;
}

const AdvancedFilterPanel = ({ onClose }: AdvancedFilterPanelProps) => {
  const { filters, updateFilter, exportFilters } = useFilters();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key: string, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    Object.keys(localFilters).forEach((key) => {
      updateFilter(key, localFilters[key as keyof typeof localFilters]);
    });
  };

  const handleExport = () => {
    const filterString = exportFilters();
    navigator.clipboard.writeText(filterString);
    alert('Filters copied to clipboard!');
  };

  const handleShare = () => {
    const filterString = exportFilters();
    const url = new URL(window.location.href);
    url.searchParams.set('filters', btoa(filterString));
    navigator.clipboard.writeText(url.toString());
    alert('Shareable link copied to clipboard!');
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-lg border border-gray-200 p-6 animate-slide-down">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Export filters"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Share filters"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close advanced filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date Range
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={localFilters.dateRange?.start || ''}
              onChange={(e) =>
                handleChange('dateRange', {
                  ...localFilters.dateRange,
                  start: e.target.value,
                  end: localFilters.dateRange?.end || '',
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={localFilters.dateRange?.end || ''}
              onChange={(e) =>
                handleChange('dateRange', {
                  ...localFilters.dateRange,
                  start: localFilters.dateRange?.start || '',
                  end: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            value={localFilters.year || ''}
            onChange={(e) => handleChange('year', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Years</option>
            {[2023, 2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Time Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Time Period
          </label>
          <select
            value={localFilters.timePeriod || ''}
            onChange={(e) => handleChange('timePeriod', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Default</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Aggregation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <BarChart3 className="w-4 h-4 inline mr-1" />
            Aggregation
          </label>
          <select
            value={localFilters.aggregation || ''}
            onChange={(e) => handleChange('aggregation', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None</option>
            <option value="sum">Sum</option>
            <option value="avg">Average</option>
            <option value="max">Maximum</option>
            <option value="min">Minimum</option>
            <option value="count">Count</option>
          </select>
        </div>

        {/* Enrollment Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enrollment Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.enrollmentRange?.min || ''}
              onChange={(e) =>
                handleChange('enrollmentRange', {
                  ...localFilters.enrollmentRange,
                  min: e.target.value ? parseInt(e.target.value) : undefined,
                  max: localFilters.enrollmentRange?.max,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={localFilters.enrollmentRange?.max || ''}
              onChange={(e) =>
                handleChange('enrollmentRange', {
                  ...localFilters.enrollmentRange,
                  min: localFilters.enrollmentRange?.min,
                  max: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Employability Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employability Range (%)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              min="0"
              max="100"
              value={localFilters.employabilityRange?.min || ''}
              onChange={(e) =>
                handleChange('employabilityRange', {
                  ...localFilters.employabilityRange,
                  min: e.target.value ? parseInt(e.target.value) : undefined,
                  max: localFilters.employabilityRange?.max,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              min="0"
              max="100"
              value={localFilters.employabilityRange?.max || ''}
              onChange={(e) =>
                handleChange('employabilityRange', {
                  ...localFilters.employabilityRange,
                  min: localFilters.employabilityRange?.min,
                  max: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            applyFilters();
            onClose();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;
