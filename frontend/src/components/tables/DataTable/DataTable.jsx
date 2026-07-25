import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import EmptyState from '../../feedback/EmptyState';
import Skeleton from '../../common/Skeleton';
import Input from '../../forms/Input';
import Button from '../../common/Button';

// A lightweight DataTable component 
// For production, consider @tanstack/react-table, but this serves Phase 2 requirements well.

const DataTable = ({
  columns,
  data,
  loading = false,
  pagination = false,
  pageSize = 10,
  searchable = false,
  emptyMessage = 'No data available.',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle Sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter Data
  const filteredData = React.useMemo(() => {
    if (!searchable || !searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  }, [data, searchTerm, searchable]);

  // Sort Data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate Data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton variant="table" />
        <Skeleton variant="table" />
        <Skeleton variant="table" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {searchable && (
        <div className="flex justify-between items-center">
          <div className="w-64">
            <Input 
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
              fullWidth={true}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-[var(--border-color)] rounded-[var(--radius-md)] bg-[var(--bg-primary)]">
        <table className="min-w-full divide-y divide-[var(--border-color)]">
          <thead className="bg-[var(--bg-secondary)]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  scope="col"
                  className={`px-4 py-2.5 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {col.sortable && sortConfig.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-[var(--bg-surface)] transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-2.5 whitespace-nowrap text-sm text-[var(--text-primary)]">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8">
                  <EmptyState description={emptyMessage} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
