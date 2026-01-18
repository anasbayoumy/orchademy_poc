import type { ComponentType } from 'react';
import StatCard from './StatCard';
import DynamicChart from './DynamicChart';
import RadarSkillChart from './RadarSkillChart';
import Table from './Table';
import type { WidgetConfig } from '../../config/dashboardStructure';

export type WidgetComponent = ComponentType<{ widget: WidgetConfig }>;

export const WIDGET_REGISTRY: Record<string, WidgetComponent> = {
  StatCard,
  BarChart: DynamicChart,
  LineChart: DynamicChart,
  AreaChart: DynamicChart,
  ScatterChart: DynamicChart,
  RadarChart: RadarSkillChart,
  Table,
};

export const getWidgetComponent = (type: string): WidgetComponent => {
  return WIDGET_REGISTRY[type] || StatCard;
};
