'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNavbar from '@/components/Tenant_Navbar/page'; // pastikan path ini benar

export default function CreatePeakSeasonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId'); // misal: /tenant/rooms/peak-season?roomId=8

  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    priceModifierType: 'PERCENTAGE',
    priceModifierValue: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8000/api/room/${roomId}/peak-season`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          priceModifierValue: Number(form.priceModifierValue),
        }),
      });

      if (!res.ok) throw new Error('Failed to create peak season');

      alert('Peak season created successfully!');
      router.push('/Tenant_Rooms');
    } catch (err) {
      console.error(err);
      alert('Failed to create peak season');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SideNavbar />

      {/* Content */}
      <main className="flex-1 px-8 py-10">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Add Peak Season for Room #{roomId}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
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
                value={form.endDate}
                onChange={handleChange}
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
                value={form.priceModifierType}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="PERCENTAGE">PERCENTAGE</option>
                <option value="FIXED">FIXED</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                 Value
              </label>
              <input
                type="number"
                name="priceModifierValue"
                value={form.priceModifierValue}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Add Peak Season
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
