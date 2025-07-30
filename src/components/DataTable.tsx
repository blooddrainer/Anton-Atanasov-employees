import React, { useState, useMemo, JSX } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

// Types
import { Column, SortConfig } from '@/types/DataTable';

// Styles
import * as styles from './DataTable.module.less';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  className
}: DataTableProps<T>): JSX.Element {
  const { t } = useTranslation();
  const [sort, setSort] = useState<SortConfig>({ field: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sort.field) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sort]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / pageSize);

  // Handle sort
  const handleSort = (field: keyof T) => {
    setSort(prevSort => ({
      field: field as string,
      direction: prevSort.field === field && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={clsx(styles.tableContainer, className)}>
      <table className={styles.table}>
        <thead>
        <tr>
          {columns.map(column => (
            <th
              key={String(column.field)}
              className={clsx(styles.th, {
                [styles.sortable]: column.sortable,
                [styles.sorted]: sort.field === column.field
              })}
              onClick={() => column.sortable && handleSort(column.field)}
            >
              {column.header}
              {column.sortable && (
                <span className={clsx(styles.sortIcon, {
                  [styles.asc]: sort.field === column.field && sort.direction === 'asc',
                  [styles.desc]: sort.field === column.field && sort.direction === 'desc'
                })}>
                    ⇅
                  </span>
              )}
            </th>
          ))}
        </tr>
        </thead>
        <tbody>
        {paginatedData.map((row, index) => (
          <tr key={index} className={styles.tr}>
            {columns.map(column => (
              <td key={String(column.field)} className={styles.td}>
                {column.render
                  ? column.render(row[column.field], row)
                  : row[column.field]}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            {t('datatable.pagination.previous')}
          </button>

          <span className={styles.pageInfo}>
            {t('datatable.pagination.label', {
              current: currentPage,
              total: totalPages
            })}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            {t('datatable.pagination.next')}
          </button>
        </div>
      )}
    </div>
  );
}
