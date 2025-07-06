'use client';

import { format } from 'date-fns';
import { useState, useMemo } from 'react';

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

export default function SalesTable({ data }: { data: Booking[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, currentPage]);
  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto  border rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">Tgl Transaksi</th>
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginatedData.map((tx, i) => (
              <tr
                key={tx.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">{i + 1}</td>
                <td className="p-3">
                  {format(new Date(tx.createdAt), 'yyyy-MM-dd')}
                </td>
                <td className="p-3">{tx.property.name}</td>
                <td className="p-3">{tx.room.name}</td>
                <td className="p-3">
                  <div className="font-medium text-gray-800">
                    {tx.user.name}
                  </div>
                  <div className="text-sm text-gray-500">{tx.user.email}</div>
                </td>
                <td className="p-3 font-semibold text-right">
                  Rp {tx.totalPrice.toLocaleString('id-ID')}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      tx.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-700'
                        : tx.status === 'CANCELED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No transactions found for selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end text-xs mt-2 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
