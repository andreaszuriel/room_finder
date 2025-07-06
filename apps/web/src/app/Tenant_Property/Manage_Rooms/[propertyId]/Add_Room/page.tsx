'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createRoom, getPropertyById } from '@/lib/api/axios';
import { useAuthRole } from '@/app/utils/hook/useAuthRole';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import TenantSidebar from '@/components/Tenant_Navbar/page';

export default function TenantAddRoomPage() {
  const authorized = useAuthRole(['TENANT']);
  const router = useRouter();
  const params = useParams();
  const propertyId = params.propertyId as string;
  const [propertyName, setPropertyName] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    qty: '',
    basePrice: '',
    capacity: '',
  });

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPropertyName = async () => {
      if (!propertyId) return;

      const numericId = Number(propertyId);
      if (isNaN(numericId)) return;

      try {
        const res = await getPropertyById(numericId);
        setPropertyName(res.data.name);
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(err.response?.data?.detail || 'Gagal memuat nama properti');
      }
    };

    fetchPropertyName();
  }, [propertyId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('qty', form.qty);
    formData.append('basePrice', form.basePrice);
    formData.append('capacity', form.capacity);
    if (form.description) formData.append('description', form.description);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (!propertyId) {
        toast.error('Property ID tidak ditemukan.');
        setLoading(false);
        return;
      }

      const numericPropertyId = Number(propertyId);
      if (isNaN(numericPropertyId)) {
        toast.error('Property ID tidak valid.');
        setLoading(false);
        return;
      }
      await createRoom(numericPropertyId, formData);
      toast.success('Berhasil menambahkan kamar');
      router.push(`/Tenant_Property/Manage_Rooms/${propertyId}`);
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      toast.error(err.response?.data?.detail || 'Gagal menambahkan kamar');
      setLoading(false);
    }
  };
  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TenantSidebar />
      <main className="flex-1 px-8 py-10">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">
            Add Room to{' '}
            {propertyName ? `${propertyName}` : `Property #${propertyId}`}
          </h2>

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
                {loading ? 'Memproses...' : 'Tambah Room'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
