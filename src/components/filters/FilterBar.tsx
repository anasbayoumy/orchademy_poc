import { useState } from 'react';
import { Filter, X, ChevronDown, Calendar, Building2, GraduationCap, SlidersHorizontal } from 'lucide-react';
import { useFilters } from '../../contexts/FilterContext';
import AdvancedFilterPanel from './AdvancedFilterPanel';

const FilterBar = () => {
  const { filters, clearFilters, hasActiveFilters, getActiveFilterCount, updateFilter } = useFilters();
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);

  const departments = ['Computer Science', 'Business Admin', 'Electrical Eng', 'Liberal Arts', 'Health Sciences'];

  const handleQuickFilter = (type: string, value: string) => {
    const currentValues = filters[type] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    updateFilter(type, newValues.length > 0 ? newValues : null);
  };

  const removeFilter = (key: string, value?: string) => {
    if (value) {
      const currentValues = filters[key] || [];
      const newValues = currentValues.filter((v: string) => v !== value);
      updateFilter(key, newValues.length > 0 ? newValues : null);
    } else {
      updateFilter(key, null);
    }
  };

  if (!hasActiveFilters() && !showAdvancedPanel) {
    return (
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">No active filters</span>
        </div>
        <button
          onClick={() => setShowAdvancedPanel(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Advanced Filters</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">
              Active Filters ({getActiveFilterCount()})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Advanced</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedPanel ? 'rotate-180' : ''}`} />
            </button>
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap gap-2">
            {filters.departments?.map((dept) => (
              <span
                key={`dept-${dept}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                <Building2 className="w-3 h-3" />
                {dept}
                <button
                  onClick={() => removeFilter('departments', dept)}
                  className="ml-1 hover:text-blue-900 focus:outline-none"
                  aria-label={`Remove ${dept} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.programs?.map((program) => (
              <span
                key={`prog-${program}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
              >
                <GraduationCap className="w-3 h-3" />
                {program}
                <button
                  onClick={() => removeFilter('programs', program)}
                  className="ml-1 hover:text-green-900 focus:outline-none"
                  aria-label={`Remove ${program} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.categories?.map((cat) => (
              <span
                key={`cat-${cat}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
              >
                {cat}
                <button
                  onClick={() => removeFilter('categories', cat)}
                  className="ml-1 hover:text-purple-900 focus:outline-none"
                  aria-label={`Remove ${cat} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.sectors?.map((sector) => (
              <span
                key={`sector-${sector}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
              >
                {sector}
                <button
                  onClick={() => removeFilter('sectors', sector)}
                  className="ml-1 hover:text-orange-900 focus:outline-none"
                  aria-label={`Remove ${sector} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.year && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                <Calendar className="w-3 h-3" />
                Year: {filters.year}
                <button
                  onClick={() => removeFilter('year')}
                  className="ml-1 hover:text-gray-900 focus:outline-none"
                  aria-label="Remove year filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.dateRange && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                <Calendar className="w-3 h-3" />
                {filters.dateRange.start} - {filters.dateRange.end}
                <button
                  onClick={() => removeFilter('dateRange')}
                  className="ml-1 hover:text-gray-900 focus:outline-none"
                  aria-label="Remove date range filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Quick Filter Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 font-medium">Departments:</span>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => handleQuickFilter('departments', dept)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    filters.departments?.includes(dept)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {showAdvancedPanel && (
        <AdvancedFilterPanel onClose={() => setShowAdvancedPanel(false)} />
      )}
    </>
  );
};

export default FilterBar;
