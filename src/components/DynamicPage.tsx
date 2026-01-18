import { useLocation } from 'react-router-dom';
import { DASHBOARD_CONFIG } from '../config/dashboardStructure';
import { getWidgetComponent } from './widgets/WidgetRegistry';
import FilterBar from './filters/FilterBar';

const DynamicPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Find the page layout configuration
  const pageLayout = DASHBOARD_CONFIG.pageLayouts[currentPath];

  if (!pageLayout) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] animate-fade-in">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600">No configuration found for path: {currentPath}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="mb-6 animate-slide-down">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{pageLayout.title}</h1>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Layout Rows */}
      {pageLayout.layout.map((row, rowIndex) => {
        const columns = row.columns || row.widgets.length;

        return (
          <div
            key={rowIndex}
            className="mb-6 animate-slide-up"
            style={{ animationDelay: `${rowIndex * 100}ms` }}
          >
            <div
              className="grid gap-4 lg:gap-6"
              style={{
                gridTemplateColumns: `
                  repeat(auto-fit, minmax(min(100%, ${columns > 1 ? '300px' : '100%'}), 1fr))
                `,
              }}
            >
              {row.widgets.map((widget, widgetIndex) => {
                const WidgetComponent = getWidgetComponent(widget.type);
                return (
                  <div
                    key={widget.id}
                    className="animate-scale-in"
                    style={{ 
                      animationDelay: `${(rowIndex * 100) + (widgetIndex * 50)}ms`,
                      gridColumn: columns === 1 ? 'span 1' : undefined
                    }}
                  >
                    <WidgetComponent widget={widget} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DynamicPage;
