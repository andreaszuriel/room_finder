'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getRoomById, setPeakSeasonRate } from '@/lib/api/axios';
import { useAuthRole } from '@/app/utils/hook/useAuthRole';
import TenantSidebar from '@/components/Tenant_Navbar/page';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function CreatePeakSeasonPage() {
  const authorized = useAuthRole(['TENANT']);
  const router = useRouter();
  const { propertyId, roomId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priceModifierType, setPriceModifierType] = useState<
    'PERCENTAGE' | 'NOMINAL'
  >('PERCENTAGE');
  const [priceModifierValue, setPriceModifierValue] = useState('');

  useEffect(() => {
    const fetchRoomName = async () => {
      try {
        if (!roomId) return;
        const parsedRoomId = Array.isArray(roomId) ? roomId[0] : roomId;
        const room = await getRoomById(Number(parsedRoomId));
        setRoomName(room.data.name);
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(err.response?.data?.detail || 'Gagal memuat nama kamar');
      }
    };

    fetchRoomName();
  }, [roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!roomId) {
        toast.error('Room ID tidak ditemukan');
        return;
      }

      const payload = {
        startDate, // pastikan format ISO string (ex: "2025-07-01")
        endDate,
        priceModifierType,
        priceModifierValue: Number(priceModifierValue),
      };

      await setPeakSeasonRate(Number(roomId), payload);
      toast.success('Peak season berhasil ditambahkan');
      router.push(
        `/Tenant_Property/Manage_Rooms/${propertyId}/Peak_Season/${roomId}`,
      );
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      toast.error(
        err?.response?.data?.detail || 'Gagal menambahkan peak season',
      );
      setLoading(false);
    }
  };
  if (!authorized) return null;
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <TenantSidebar />

      {/* Content */}
      <main className="flex-1 px-8 py-10">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Add Peak Season to{' '}
            {roomName ? `${roomName}` : `Property #${roomName}`}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="priceModifierType"
                value={priceModifierType}
                onChange={(e) =>
                  setPriceModifierType(
                    e.target.value as 'PERCENTAGE' | 'NOMINAL',
                  )
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="PERCENTAGE">PERCENTAGE</option>
                <option value="FIXED">NOMINAL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="number"
                name="priceModifierValue"
                value={priceModifierValue}
                onChange={(e) => setPriceModifierValue(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white px-6 py-2 rounded ${
                  loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                }`}
              >
                {loading ? 'Memproses...' : 'Tambah'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
