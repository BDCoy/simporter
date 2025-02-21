import React, { useState } from 'react';
import { Table, Edit2, Save, X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { DataSource } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DataTableProps {
  dataSource: DataSource;
  onDataChange: (newData: any) => void;
  canEdit: boolean;
}

export function DataTable({ dataSource, onDataChange, canEdit }: DataTableProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilter = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value,
    }));
  };

  const filteredData = dataSource.data.filter((row: any) =>
    Object.entries(filters).every(([key, value]) =>
      String(row[key]).toLowerCase().includes(value.toLowerCase())
    )
  );

  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredData;

  const columns = Object.keys(dataSource.metadata.schema || {});

  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map(column => (
              <th
                key={column}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSort(column)}
                    className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <span>{column}</span>
                    {sortConfig?.key === column && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => handleFilter(column, '')}
                      className="hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                    {filters[column] && (
                      <input
                        type="text"
                        value={filters[column]}
                        onChange={e => handleFilter(column, e.target.value)}
                        className="absolute top-6 left-0 w-32 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg"
                      />
                    )}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedData.map((row: any, rowIndex: number) => (
            <tr key={rowIndex}>
              {columns.map(column => (
                <td
                  key={column}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                >
                  {editingCell?.row === rowIndex && editingCell?.col === column ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={row[column]}
                        onChange={e => {
                          const newData = [...dataSource.data];
                          newData[rowIndex] = {
                            ...newData[rowIndex],
                            [column]: e.target.value,
                          };
                          onDataChange(newData);
                        }}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                      />
                      <button
                        onClick={() => setEditingCell(null)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCell(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group">
                      <span>{row[column]}</span>
                      {canEdit && (
                        <button
                          onClick={() => setEditingCell({ row: rowIndex, col: column })}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}