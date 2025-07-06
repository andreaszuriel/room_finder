// app/Tenant_Report/components/SalesFilter.tsx
'use client';

import { DateRange } from 'react-date-range';
import { Range } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface SalesFilterProps {
  dateRange: Range[];
  setDateRange: (range: Range[]) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export default function SalesFilter({
  dateRange,
  setDateRange,
  sortOrder,
  setSortOrder,
}: SalesFilterProps) {
  return (
    <div>
      <label className="font-medium text-gray-600">Filter by Date</label>
      <DateRange
        editableDateInputs
        onChange={(item) => {
          const { startDate, endDate, key } = item.selection;
          setDateRange([
            {
              startDate: startDate ?? new Date(),
              endDate: endDate ?? new Date(),
              key: key ?? 'selection',
            },
          ]);
        }}
        moveRangeOnFirstSelection={false}
        ranges={dateRange}
      />

      <label className="font-medium text-gray-600 mt-4 block">Sort by</label>
      <select
        className="mt-1 block w-full p-2 border rounded"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
      >
        <option value="desc">Total Price (High to Low)</option>
        <option value="asc">Total Price (Low to High)</option>
      </select>
    </div>
  );
}
