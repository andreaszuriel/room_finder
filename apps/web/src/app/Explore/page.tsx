'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCatalogProperties, getAllCities } from '@/lib/api/axios';
import { toast } from 'sonner';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import SearchFormExplore from '@/components/SearchFormExplore';
import LoadingScreen from '@/components/LoadingScreen';

type Property = {
  id: number;
  name: string;
  image: string;
  address: string;
  categoryId: number;
  minPrice: number;
  category?: { name: string };
};

type City = {
  id: number | string;
  name: string;
};

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const cityId = searchParams.get('cityId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = Number(searchParams.get('guests') || '1');
  const router = useRouter();

  const [cityName, setCityName] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'name'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCityName = async () => {
      try {
        const cities = await getAllCities();
        const found = cities.find((c: City) => String(c.id) === String(cityId));
        const name = found?.name || '';
        setCityName(name);
      } catch {
        toast.error('Gagal memuat nama kota');
      }
    };
    if (cityId) fetchCityName();
  }, [cityId]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!cityId || !checkIn || !checkOut) return;

      setLoading(true);
      try {
        const cities = await getAllCities();
        const found = cities.find((c: City) => String(c.id) === String(cityId));
        const name = found?.name || '';
        setCityName(name);

        const res = await getCatalogProperties({
          search: name,
          sortBy,
          sortOrder,
          page,
          pageSize: 6,
          capacity: guests,
          startDate: new Date(checkIn),
          endDate: new Date(checkOut),
        });

        setProperties(res.data);
        setTotalPages(res.totalPages || 1);
      } catch {
        toast.error('Gagal memuat properti');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [cityId, checkIn, checkOut, guests, sortBy, sortOrder, page]);

  if (loading) return <LoadingScreen message="Memuat hasil..." />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="px-4 md:px-16 py-8">
        <section className="container mx-auto px-4 pt-8 pb-12">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-4xl mx-auto">
            <SearchFormExplore />
          </div>
        </section>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">
            Menampilkan hasil di {cityName || '...'} untuk {guests} tamu
          </h1>

          <select
            value={`${sortBy}_${sortOrder}`}
            onChange={(e) => {
              setPage(1);
              const [by, order] = e.target.value.split('_');
              setSortBy(by as 'price' | 'name');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="price_asc">Harga Termurah</option>
            <option value="price_desc">Harga Tertinggi</option>
            <option value="name_asc">Nama (A-Z)</option>
            <option value="name_desc">Nama (Z-A)</option>
          </select>
        </div>

        {properties.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-2xl">Tidak ada properti yang ditemukan.</p>
            <p className="text-lg">Coba ubah filter pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="border rounded-xl shadow-md p-4 bg-white flex flex-col md:flex-row gap-4"
              >
                <div className="w-full md:w-1/3 h-[200px] rounded-lg overflow-hidden">
                  <Image
                    src={property.image || '/default-room.jpg'}
                    alt={property.name}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      {property.name}
                    </h2>
                    <p className="text-gray-600 mb-1">{property.address}</p>
                    <p className="text-sm text-amber-500 font-medium">
                      {property.category?.name || 'Tidak diketahui'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">
                        Rp {property.minPrice.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-500">
                        per malam (termurah)
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        router.push(
                          `/Explore/${property.id}?cityId=${cityId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
                        )
                      }
                      className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600"
                    >
                      Pilih Kamar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {properties.length > 0 && (
          <div className="flex justify-center mt-8 gap-4 items-center">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 rounded border disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">
              Halaman {page} dari {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 rounded border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
