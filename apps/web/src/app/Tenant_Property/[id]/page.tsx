'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthRole } from '@/app/utils/hook/useAuthRole';
import TenantSidebar from '@/app/../components/Tenant_Navbar/page';
import {
  getAllCities,
  getAllPropertyCategories,
  updateProperty,
  getPropertyById,
} from '@/lib/api/axios';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function TenantEditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const authorized = useAuthRole(['TENANT']);

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );

  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    description: '',
    address: '',
    cityId: '',
  });
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllPropertyCategories();
        setCategories(data); // pastikan response pakai .data
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(
          err.response?.data?.detail || 'Gagal memuat kategori properti',
        );
      }
    };
    fetchCategories();
  }, []);

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getAllCities();
        setCities(data); // pastikan response pakai .data
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(err.response?.data?.detail || 'Gagal memuat data kota');
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!id || Array.isArray(id)) return;

        const res = await getPropertyById(Number(id));
        const property = res.data;

        setForm({
          name: property.name || '',
          categoryId: String(property.categoryId || ''),
          description: property.description || '',
          address: property.address || '',
          cityId: String(property.cityId || ''),
        });
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(err.response?.data?.detail || 'Gagal memuat data properti');
      }
    };

    fetchProperty();
  }, [id]);

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

    try {
      if (!id || Array.isArray(id)) {
        throw new Error('Invalid property ID');
      }

      await updateProperty(Number(id), form, mainImage, galleryImages);
      toast.success('Property berhasil diperbarui');
      router.push('/Tenant_Property');
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      toast.error(err?.response?.data?.detail || 'Gagal memperbarui property');
    } finally {
      setLoading(false);
    }
  };
  if (!authorized) return null;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TenantSidebar />

      <main className="flex-1 px-8 py-10">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Edit Property</h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            encType="multipart/form-data"
          >
            <div>
              <label className="block font-medium mb-1">Nama Properti *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Kategori *</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Pilih kategori</option>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Kota *</label>
              <select
                name="cityId"
                value={form.cityId}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Pilih kota</option>
                {Array.isArray(cities) &&
                  cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Alamat *</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Deskripsi</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border p-2 rounded"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium mb-1">Main Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMainImage(e.target.files?.[0] || null)}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Gallery Images (multiple)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setGalleryImages(e.target.files)}
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
