import type { WidgetConfig } from '../../config/dashboardStructure';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getDataByPath } from '../../utils/dataAccess';

interface StatCardProps {
  widget: WidgetConfig;
}

const StatCard = ({ widget }: StatCardProps) => {
  const { title, value, dataPath, suffix = '', unit = '', trend } = widget.props;
  
  let displayValue: string | number = 'N/A';
  
  // If value is a dot-notation path, resolve it
  if (typeof value === 'string' && value.includes('.')) {
    const fullPath = dataPath ? `${dataPath}.${value.split('.').pop()}` : value;
    const resolved = getDataByPath(fullPath);
    if (resolved !== null && resolved !== undefined) {
      displayValue = resolved;
    }
  } 
  // If dataPath is provided and value is a simple key
  else if (dataPath && typeof value === 'string') {
    const data = getDataByPath(dataPath);
    if (data && typeof data === 'object' && value in data) {
      displayValue = (data as any)[value];
    }
  }
  // If value is provided directly
  else if (value !== undefined) {
    displayValue = value;
  }
  
  // Format the value
  const formattedValue = typeof displayValue === 'number' 
    ? displayValue.toLocaleString(undefined, { maximumFractionDigits: 1 }) 
    : displayValue;
  
  const finalValue = `${formattedValue}${unit}${suffix}`;
  
  // Get trend value if provided
  let trendValue: number | null = null;
  if (trend && typeof trend === 'string') {
    if (trend.includes('.')) {
      const fullTrendPath = dataPath ? `${dataPath}.${trend.split('.').pop()}` : trend;
      const resolvedTrend = getDataByPath(fullTrendPath);
      if (resolvedTrend !== null && resolvedTrend !== undefined) {
        trendValue = resolvedTrend;
      }
    } else if (dataPath) {
      const data = getDataByPath(dataPath);
      if (data && typeof data === 'object' && trend in data) {
        trendValue = (data as any)[trend];
      }
    }
  }
  
  return (
    <article
      className="
        bg-white rounded-lg shadow-sm border border-gray-200 p-6
        card-hover
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
      "
      aria-label={`${title}: ${finalValue}`}
      tabIndex={0}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1" aria-hidden="true">
            {title}
          </p>
          <p 
            className="text-2xl lg:text-3xl font-bold text-gray-900 transition-all duration-200"
            aria-live="polite"
          >
            {finalValue}
          </p>
          {trendValue !== null && (
            <div 
              className={`
                flex items-center gap-1 mt-2 text-sm font-medium
                transition-colors duration-200
                ${trendValue >= 0 ? 'text-green-600' : 'text-red-600'}
              `}
              role="status"
              aria-label={`Trend: ${trendValue >= 0 ? 'up' : 'down'} ${Math.abs(trendValue).toFixed(1)}%`}
            >
              {trendValue >= 0 ? (
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{Math.abs(trendValue).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div 
          className="p-3 bg-blue-50 rounded-full flex-shrink-0 ml-4 transition-transform duration-200 hover:scale-110"
          aria-hidden="true"
        >
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </article>
  );
};

export default StatCard;
