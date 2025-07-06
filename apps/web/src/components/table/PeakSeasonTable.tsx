'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPeakSeasonsByRoomId } from '@/lib/api/axios';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
type PeakSeason = {
  id: number;
  startDate: string;
  endDate: string;
  priceModifierType: string;
  priceModifierValue: number;
};

export default function PeakSeasonTable() {
  const { roomId } = useParams();
  const [peakSeasons, setPeakSeasons] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPeakSeasonsByRoomId(Number(roomId), page, 5);
        setPeakSeasons(res.data);
        setTotalPages(res.totalPages);
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(
          err.response?.data?.detail || 'Gagal memuat data peak season',
        );
      }
    };
    if (roomId) fetchData();
  }, [roomId, page]);

  return (
    <div>
      <table className="w-full table-auto mb-4">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-4">Start Date</th>
            <th className="p-4">End Date</th>
            <th className="p-4">Type</th>
            <th className="p-4">Value</th>
          </tr>
        </thead>
        <tbody>
          {peakSeasons.map((peak: PeakSeason) => (
            <tr key={peak.id} className="border-b hover:bg-gray-50 h-24">
              <td className="p-4">
                {new Date(peak.startDate).toLocaleDateString()}
              </td>
              <td className="p-4">
                {new Date(peak.endDate).toLocaleDateString()}
              </td>
              <td className="p-4 font-semibold">{peak.priceModifierType}</td>
              <td className="p-4">{peak.priceModifierValue}</td>
            </tr>
          ))}
          {peakSeasons.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No Peak Season found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end gap-2 mb-4 mr-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="self-center">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
