'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateRoom, getRoomById } from '@/lib/api/axios';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import TenantSidebar from '../../../../../../components/Tenant_Navbar/page';

export default function EditRoomPage({
  propertyId,
  roomId,
}: {
  propertyId: number;
  roomId: number;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    qty: 1,
    capacity: 1,
    basePrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch room data by ID
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if (!roomId || Array.isArray(roomId)) return;

        const res = await getRoomById(Number(roomId));
        const room = res.data;

        setForm({
          name: room.name || '',
          description: room.description || '',
          qty: room.qty,
          capacity: room.capacity,
          basePrice: room.basePrice,
        });
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(err.response?.data?.detail || 'Gagal memuat data room');
      }
    };

    fetchRoom();
  }, [propertyId, roomId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!roomId || Array.isArray(roomId)) {
        throw new Error('Invalid room ID');
      }

      await updateRoom(propertyId, roomId, form, imageFile);
      toast.success('Room berhasil diperbarui');
      router.push(`/Tenant_Property/Manage_Rooms/${propertyId}`);
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      toast.error(err?.response?.data?.detail || 'Gagal memperbarui room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TenantSidebar />
      <main className="flex-1 px-8 py-10">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Edit Room</h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            encType="multipart/form-data"
          >
            <div>
              <label className="block font-medium mb-1">Room Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full border p-2 rounded"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="qty"
                  value={form.qty}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Base Price (Rp)</label>
              <input
                type="number"
                name="basePrice"
                value={form.basePrice}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full"
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
                {loading ? 'Memproses...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
