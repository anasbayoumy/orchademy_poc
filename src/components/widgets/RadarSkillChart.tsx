import type { WidgetConfig } from '../../config/dashboardStructure';
import { getDataByPath } from '../../utils/dataAccess';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RadarSkillChartProps {
  widget: WidgetConfig;
}

const RadarSkillChart = ({ widget }: RadarSkillChartProps) => {
  const { props } = widget;
  const { title, dataPath, categoryKey = 'subject', dataKeys = ['demand', 'curriculum'] } = props;
  const data = dataPath ? getDataByPath(dataPath) : [];

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <section 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in"
        aria-label={title || 'Radar chart'}
      >
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-gray-500">No data available</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 animate-fade-in card-hover"
      aria-label={title || 'Radar chart visualization'}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4" id={`radar-title-${widget.id}`}>
          {title}
        </h3>
      )}
      <div className="w-full" style={{ minHeight: '400px' }}>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data} accessibilityLayer>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey={categoryKey}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
            />
            {dataKeys.map((key: string, index: number) => (
              <Radar
                key={key}
                name={key === 'demand' ? 'Market Demand' : key === 'curriculum' ? 'Curriculum Coverage' : key}
                dataKey={key}
                stroke={index === 0 ? '#0ea5e9' : '#10b981'}
                fill={index === 0 ? '#0ea5e9' : '#10b981'}
                fillOpacity={index === 0 ? 0.6 : 0.3}
                animationDuration={800}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default RadarSkillChart;
