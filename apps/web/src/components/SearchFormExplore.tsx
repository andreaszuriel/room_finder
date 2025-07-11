'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import { getAllCities } from '@/lib/api/axios';
import { toast } from 'sonner';
import 'react-datepicker/dist/react-datepicker.css';
import { AxiosError } from 'axios';

export default function SearchFormExplore() {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>('');

  const searchParams = useSearchParams();
  const cityId = searchParams.get('cityId');
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const guestsParam = searchParams.get('guests');

  const router = useRouter();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getAllCities();
        setCities(data);
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(err.response?.data?.detail || 'Gagal memuat data kota');
      }
    };
    fetchCities();
  }, []);

  function toISOStringWithOffset(date: Date) {
    const adjusted = new Date(date);
    adjusted.setHours(12, 0, 0, 0);
    return adjusted.toISOString();
  }

  useEffect(() => {
    if (checkInParam) setCheckInDate(new Date(checkInParam));
    if (checkOutParam) setCheckOutDate(new Date(checkOutParam));
    if (cityId) setSelectedCityId(cityId);
    if (guestsParam) setGuests(Number(guestsParam));
  }, [checkInParam, checkOutParam, cityId, guestsParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate || !selectedCityId) return;

    const params = new URLSearchParams({
      cityId: selectedCityId,
      checkIn: toISOStringWithOffset(checkInDate),
      checkOut: toISOStringWithOffset(checkOutDate),
      guests: String(guests),
    });
    router.push(`/Explore?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.preventDefault(); // ⛔ Cegah reload di semua input
      }}
      className="space-y-4 mt-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Destination */}
        <div className="relative">
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Destination
          </label>
          <select
            id="cityId"
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Choose City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            selectsStart
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={new Date()}
            placeholderText="Choose Date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            selectsEnd
            startDate={checkInDate}
            endDate={checkOutDate}
            minDate={checkInDate || new Date()}
            placeholderText="Choose Date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Guests */}
        <div>
          <label
            htmlFor="guests"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Guest
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
              className="px-3 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              -
            </button>
            <input
              type="number"
              id="guests"
              value={guests}
              readOnly
              className="w-full px-4 py-3 text-center focus:outline-none"
              min="1"
              max="10"
            />
            <button
              type="button"
              onClick={() => setGuests((prev) => Math.min(10, prev + 1))}
              className="px-3 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Cari
          </button>
        </div>
      </div>
    </form>
  );
}
