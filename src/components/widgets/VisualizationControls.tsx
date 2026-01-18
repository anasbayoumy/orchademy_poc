import { BarChart3, LineChart, AreaChart, Settings } from 'lucide-react';

interface VisualizationControlsProps {
  chartType?: string;
  timePeriod?: string;
  aggregation?: string;
  onChartTypeChange?: (type: string) => void;
  onTimePeriodChange?: (period: string) => void;
  onAggregationChange?: (agg: string) => void;
}

const VisualizationControls = ({
  chartType,
  timePeriod,
  aggregation,
  onChartTypeChange,
  onTimePeriodChange,
  onAggregationChange,
}: VisualizationControlsProps) => {
  return (
    <div className="flex items-center gap-4 flex-wrap p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Visualization:</span>
      </div>

      {onChartTypeChange && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Chart Type:</span>
          <div className="flex gap-1 bg-white rounded-md p-1 border border-gray-200">
            <button
              onClick={() => onChartTypeChange('bar')}
              className={`p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                chartType === 'bar' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Bar Chart"
              aria-label="Switch to bar chart"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChartTypeChange('line')}
              className={`p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                chartType === 'line' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Line Chart"
              aria-label="Switch to line chart"
            >
              <LineChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChartTypeChange('area')}
              className={`p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                chartType === 'area' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Area Chart"
              aria-label="Switch to area chart"
            >
              <AreaChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChartTypeChange('scatter')}
              className={`p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                chartType === 'scatter' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Scatter Chart"
              aria-label="Switch to scatter chart"
            >
              <BarChart3 className="w-4 h-4 rotate-45" />
            </button>
          </div>
        </div>
      )}

      {onTimePeriodChange && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Period:</span>
          <select
            value={timePeriod || ''}
            onChange={(e) => onTimePeriodChange(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Default</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      )}

      {onAggregationChange && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Aggregate:</span>
          <select
            value={aggregation || ''}
            onChange={(e) => onAggregationChange(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None</option>
            <option value="sum">Sum</option>
            <option value="avg">Average</option>
            <option value="max">Max</option>
            <option value="min">Min</option>
            <option value="count">Count</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default VisualizationControls;
