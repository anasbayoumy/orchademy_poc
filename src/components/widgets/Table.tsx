import type { WidgetConfig } from '../../config/dashboardStructure';
import { getDataByPath, applyFilters } from '../../utils/dataAccess';
import { useFilters } from '../../contexts/FilterContext';

interface TableProps {
  widget: WidgetConfig;
}

const Table = ({ widget }: TableProps) => {
  const { title, dataPath, columns } = widget.props;
  const { filters } = useFilters();
  const rawData = dataPath ? getDataByPath(dataPath) : [];
  const data = Array.isArray(rawData) ? applyFilters(rawData, filters) : [];

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <section 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in"
        aria-label={title || 'Data table'}
      >
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-500">No data available</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 animate-fade-in card-hover overflow-hidden"
      aria-label={title || 'Data table'}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4" id={`table-title-${widget.id}`}>
          {title}
        </h3>
      )}
      <div className="overflow-x-auto -mx-4 lg:-mx-6 px-4 lg:px-6">
        <table 
          className="min-w-full divide-y divide-gray-200"
          role="table"
          aria-labelledby={title ? `table-title-${widget.id}` : undefined}
        >
          <thead className="bg-gray-50">
            <tr>
              {columns?.map((col, index) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`
                    px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${index === 0 ? 'sticky left-0 bg-gray-50 z-10' : ''}
                  `}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row: any, index: number) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 transition-colors duration-150"
                role="row"
              >
                {columns?.map((col, colIndex) => (
                  <td 
                    key={col.key} 
                    className={`
                      px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900
                      ${colIndex === 0 ? 'sticky left-0 bg-white z-10 font-medium' : ''}
                    `}
                    role="cell"
                  >
                    {row[col.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Table;
