'use client';

import SalesFilter from './components/SalesFilter';
import SalesTable from './components/SalesTable';
import RevenueSummary from './components/RevenueSummary';
import { useState, useMemo, useEffect } from 'react';
import { getMonthlyIncomeReport } from '@/lib/api/axios';
import TenantSidebar from '../../components/Tenant_Navbar/page';
import { Range } from 'react-date-range';

export interface Booking {
  id: number;
  orderNumber: string;
  totalPrice: number;
  checkinDate: string;
  checkoutDate: string;
  status:
    | 'WAITING_PAYMENT'
    | 'WAITING_CONFIRMATION'
    | 'CANCELED'
    | 'CONFIRMED'
    | 'DONE'
    | 'REJECTED'
    | 'EXPIRED';
  createdAt: string;
  property: {
    name: string;
  };
  user: {
    name: string;
    email: string;
  };
  room: {
    name: string;
  };
}

export default function TenantReportPage() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<Range[]>(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return [
      {
        startDate: firstDay,
        endDate: lastDay,
        key: 'selection',
      },
    ];
  });

  const [salesReports, setSalesReports] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchedMonth, setFetchedMonth] = useState<string>('');

  useEffect(() => {
    const start = dateRange[0]?.startDate;
    if (!start) return;

    const year = start.getFullYear();
    const month = start.getMonth() + 1;
    const key = `${year}-${month}`;

    if (key !== fetchedMonth) {
      const fetchReports = async () => {
        try {
          setLoading(true);
          const res = await getMonthlyIncomeReport(year, month);
          setSalesReports(res.detail.bookings);
          setFetchedMonth(key);
        } catch (err) {
          console.error('Gagal fetch laporan:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchReports();
    }
  }, [dateRange, fetchedMonth]);

  const filteredReports = useMemo(() => {
    const from = dateRange[0].startDate;
    const to = dateRange[0].endDate;
    if (!from || !to) return [];

    return salesReports
      .filter((tx) => {
        const txDate = new Date(tx.createdAt);
        return txDate >= from && txDate <= to;
      })
      .sort((a, b) =>
        sortOrder === 'asc'
          ? a.totalPrice - b.totalPrice
          : b.totalPrice - a.totalPrice,
      );
  }, [salesReports, sortOrder, dateRange]);

  const totalRevenue = filteredReports
    .filter((tx) => tx.status === 'CONFIRMED')
    .reduce((acc, tx) => acc + tx.totalPrice, 0);

  return (
    <div className="flex">
      <TenantSidebar />
      <div className="w-full p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales & Report</h1>

        {/* Flexbox layout dengan alignment stretch */}
        <div className="flex gap-5">
          <div className="flex flex-col md:gap-4 items-stretch">
            <SalesFilter
              dateRange={dateRange}
              setDateRange={setDateRange}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <RevenueSummary totalRevenue={totalRevenue} />
          </div>

          {loading ? (
            <div className="text-center w-full text-gray-500">
              Loading laporan...
            </div>
          ) : (
            <SalesTable data={filteredReports} />
          )}
        </div>
      </div>
    </div>
  );
}
