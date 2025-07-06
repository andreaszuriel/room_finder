'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TenantSidebar from '../../../components/Tenant_Navbar/page';

export default function TenantAddRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId'); // misalnya: ?propertyId=2

  const [form, setForm] = useState({
    name: '',
    description: '',
    qty: '',
    basePrice: '',
    capacity: '',
  });

  const [image, setImage] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (image) {
      data.append('image', image);
    }

    try {
      const res = await fetch(`http://localhost:8000/api/property/${propertyId}/rooms`, {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Failed to create room');

      alert('Room created successfully!');
      router.push('/Tenant_Property');
    } catch (err) {
      alert('Failed to create room');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TenantSidebar />
      <main className="flex-1 px-8 py-10">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Add Room to Property #{propertyId}</h2>

          <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
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
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Add Room
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
