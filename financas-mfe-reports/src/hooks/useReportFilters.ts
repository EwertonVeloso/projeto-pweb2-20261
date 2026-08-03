import { useState } from 'react';

export interface ReportFilters {
  month: string; // "01" - "12" or "all"
  year: string;  // e.g. "2026" or "all"
  categoryId: number | '';
  type: 'INCOME' | 'EXPENSE' | '';
}

export function useReportFilters() {
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = String(now.getFullYear());

  const [filters, setFilters] = useState<ReportFilters>({
    month: currentMonth,
    year: currentYear,
    categoryId: '',
    type: '',
  });

  const setMonth = (month: string) => {
    setFilters((prev) => ({ ...prev, month }));
  };

  const setYear = (year: string) => {
    setFilters((prev) => ({ ...prev, year }));
  };

  const setCategoryId = (categoryId: number | '') => {
    setFilters((prev) => ({ ...prev, categoryId }));
  };

  const setType = (type: 'INCOME' | 'EXPENSE' | '') => {
    setFilters((prev) => ({ ...prev, type }));
  };

  const clearFilters = () => {
    setFilters({
      month: currentMonth,
      year: currentYear,
      categoryId: '',
      type: '',
    });
  };

  return {
    filters,
    setMonth,
    setYear,
    setCategoryId,
    setType,
    clearFilters,
  };
}
