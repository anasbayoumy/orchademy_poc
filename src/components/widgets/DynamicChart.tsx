import { useState } from 'react';
import type { WidgetConfig } from '../../config/dashboardStructure';
import { getDataByPath, applyFilters, aggregateData } from '../../utils/dataAccess';
import { useFilters } from '../../contexts/FilterContext';
import VisualizationControls from './VisualizationControls';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DynamicChartProps {
  widget: WidgetConfig;
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DynamicChart = ({ widget }: DynamicChartProps) => {
  const { type, props } = widget;
  const { title, dataPath, dataKey, xKey = 'month', yKey, dataKeys } = props;
  const { filters } = useFilters();
  const [chartType, setChartType] = useState<string>(type.toLowerCase().replace('chart', ''));
  
  const rawData = dataPath ? getDataByPath(dataPath) : [];
  
  // Apply filters
  let processedData = Array.isArray(rawData) ? applyFilters(rawData, filters) : rawData;
  
  // Apply aggregation if specified
  if (filters.aggregation && dataKey) {
    processedData = aggregateData(processedData, filters.aggregation, dataKey);
  }
  
  if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
    return (
      <section 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in"
        aria-label={title || 'Chart'}
      >
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-gray-500">No data available</p>
        </div>
      </section>
    );
  }

  // Handle scenarios data (object with arrays)
  let data: any[] = [];
  if (Array.isArray(processedData)) {
    data = processedData;
  } else if (typeof processedData === 'object' && dataKeys) {
    // Transform scenarios object into array format
    const keys = Object.keys(processedData);
    const maxLength = Math.max(...keys.map(k => {
      const val = (processedData as any)[k];
      return Array.isArray(val) ? val.length : 0;
    }));
    data = Array.from({ length: maxLength }, (_, i) => {
      const point: any = { year: 2020 + i };
      keys.forEach(key => {
        const val = (processedData as any)[key];
        if (Array.isArray(val) && val[i] !== undefined) {
          point[key] = val[i];
        }
      });
      return point;
    });
  }

  const renderChart = () => {
    const effectiveType = chartType || type.toLowerCase().replace('chart', '');
    const chartTypeToRender = effectiveType === 'bar' ? 'BarChart' : 
                              effectiveType === 'line' ? 'LineChart' :
                              effectiveType === 'area' ? 'AreaChart' :
                              effectiveType === 'scatter' ? 'ScatterChart' : type;
    
    switch (chartTypeToRender) {
      case 'BarChart':
        if (dataKeys && Array.isArray(dataKeys)) {
          // Multiple bars
          return (
            <BarChart data={data} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={xKey} 
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                animationDuration={200}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={COLORS[index % COLORS.length]} 
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              ))}
            </BarChart>
          );
        } else {
          // Single or grouped bars
          return (
            <BarChart data={data} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={xKey} 
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                animationDuration={200}
              />
              <Legend />
              <Bar 
                dataKey={dataKey || 'value'} 
                fill="#0ea5e9" 
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
              {props.secondaryDataKey && (
                <Bar 
                  dataKey={props.secondaryDataKey} 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              )}
            </BarChart>
          );
        }

      case 'LineChart':
        if (dataKeys && Array.isArray(dataKeys)) {
          // Multiple lines
          return (
            <LineChart data={data} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={xKey} 
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                animationDuration={200}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[index % COLORS.length], r: 4 }}
                  animationDuration={800}
                />
              ))}
            </LineChart>
          );
        } else {
          return (
            <LineChart data={data} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={xKey} 
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                animationDuration={200}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey || 'value'}
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', r: 4 }}
                animationDuration={800}
              />
            </LineChart>
          );
        }

      case 'AreaChart':
        return (
          <AreaChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={xKey} 
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              animationDuration={200}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey={dataKey || 'value'}
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.3}
              animationDuration={800}
            />
          </AreaChart>
        );

      case 'ScatterChart':
        return (
          <ScatterChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey={xKey || 'enrollment'}
              name={xKey || 'Enrollment'}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey={yKey || 'employability'}
              name={yKey || 'Employability'}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              animationDuration={200}
            />
            <Scatter name="Programs" data={data} fill="#0ea5e9">
              {data.map((entry: any, index: number) => {
                const color = entry.category === 'Growth' ? '#10b981' : 
                             entry.category === 'At Risk' ? '#ef4444' : '#f59e0b';
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Scatter>
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  const currentChartType = chartType || type.toLowerCase().replace('chart', '');

  return (
    <section 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 animate-fade-in card-hover"
      aria-label={title || 'Chart visualization'}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900" id={`chart-title-${widget.id}`}>
            {title}
          </h3>
        )}
        <VisualizationControls
          chartType={currentChartType}
          timePeriod={filters.timePeriod}
          aggregation={filters.aggregation}
          onChartTypeChange={setChartType}
        />
      </div>
      <div className="w-full" style={{ minHeight: '400px' }}>
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default DynamicChart;
