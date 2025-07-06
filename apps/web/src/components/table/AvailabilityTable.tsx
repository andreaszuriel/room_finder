import { useEffect, useState } from 'react';
import { getRoomAvailability } from '@/lib/api/axios';

type Data = {
  id: number;
  date: string;
  available: number;
};

export default function RoomAvailabilityTable({
  roomId,
  propertyId,
}: {
  roomId: number;
  propertyId: number;
}) {
  const [data, setData] = useState<Data[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [month, setMonth] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getRoomAvailability(
          roomId,
          propertyId,
          month,
          page,
          pageSize,
          sortOrder,
        );
        setData(res.data);
        setTotalPages(res.meta.totalPages);
      } catch (err) {
        console.error('Failed to fetch availability:', err);
      }
    }
    fetchData();
  }, [roomId, propertyId, month, page, pageSize, sortOrder]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="border px-3 py-2 rounded"
        >
          <option value="asc">Terbaru</option>
          <option value="desc">Terlama</option>
        </select>
      </div>

      <table className="w-full table-auto mb-4">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-4">Tanggal</th>
            <th className="p-4">Ketersediaan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50 h-10">
              <td className="p-4">
                {new Date(item.date).toLocaleDateString()}
              </td>
              <td className="p-4 font-semibold">{item.available}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={2} className="p-4 text-center text-gray-500">
                Tidak ada data ketersediaan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
