'use client';
import { useParams, useRouter } from 'next/navigation';
import { setRoomAvailability } from '@/lib/api/axios';
import { useState } from 'react';
import TenantSidebar from '@/components/Tenant_Navbar/page';
import { AxiosError } from 'axios';

export default function SetAvailabilityPage() {
  const { propertyId, roomId } = useParams();
  const router = useRouter();

  const [date, setDate] = useState('');
  const [available, setAvailable] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await setRoomAvailability({
        propertyId: Number(propertyId),
        roomId: Number(roomId),
        date,
        available: Number(available),
      });

      router.push(
        `/Tenant_Property/Manage_Rooms/${propertyId}/Room/${roomId}/Availability`,
      );
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      setErrorMsg(err.response?.data?.detail || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TenantSidebar />

      <main className="flex-1 px-8 py-10">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Set Room Availability
          </h2>

          {errorMsg && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ketersediaan
              </label>
              <input
                type="number"
                name="available"
                value={available}
                onChange={(e) => setAvailable(e.target.value)}
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
