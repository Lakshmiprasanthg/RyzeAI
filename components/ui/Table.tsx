import React from 'react';

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

export interface TableRow {
  [key: string]: string | number | React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  striped = false,
  hoverable = true,
  bordered = true,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${bordered ? 'border border-gray-200' : ''}`}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                ${hoverable ? 'hover:bg-gray-100 transition-colors duration-150' : ''}
              `}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
