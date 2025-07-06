'use client';

import Navbar from '@/components/Navbar/Navbar';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  description: string;
  images: string[];
  amenities: string[];
  mapEmbedUrl?: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
}

export default function PropertyDetail({ property }: { property: Property }) {
  const router = useRouter();

  /* ------------ state ------------ */
  const [mainImage, setMainImage] = useState(property.images[0]);
  const [counts, setCounts] = useState({ Adults: 0, Children: 0, Pets: 0 });
  const [openDropdown, setOpenDropdown] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ------------ dummy reviews ------------ */
  const reviews: Review[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      rating: 5,
      comment: 'Amazing place! Very clean and close to all attractions.',
      avatarUrl: 'https://i.pravatar.cc/40?img=1',
    },
    {
      id: '2',
      name: 'Bob Smith',
      rating: 4,
      comment: 'Comfortable stay but the Wi-Fi was a bit slow.',
      avatarUrl: 'https://i.pravatar.cc/40?img=2',
    },
    {
      id: '3',
      name: 'Carol Lee',
      rating: 5,
      comment: 'Host was very helpful and the amenities were excellent.',
      avatarUrl: 'https://i.pravatar.cc/40?img=3',
    },
  ];

  /* ------------ guest counter helpers ------------ */
  const handleIncrement = (key: keyof typeof counts) =>
    setCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }));

  const handleDecrement = (key: keyof typeof counts) =>
    setCounts((prev) => ({ ...prev, [key]: prev[key] ? prev[key] - 1 : 0 }));

  const handleResetGuests = () => setCounts({ Adults: 0, Children: 0, Pets: 0 });

  const totalGuests = counts.Adults + counts.Children;
  const totalPets = counts.Pets;

  /* ------------ close dropdown on outside click ------------ */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    if (openDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  /* ------------ navigate to reservation page ------------ */
  const handleReservation = () => {
    if (!checkIn || !checkOut || totalGuests === 0) {
      alert('Please select check-in / check-out dates and at least one guest.');
      return;
    }

    const query = new URLSearchParams({
      id: property.id,
      name: property.name,
      loc: property.location,
      in: checkIn,
      out: checkOut,
      guests: String(totalGuests),
      price: String(property.price),
      propertyId: property.id, // nice to have for callback
    });

    router.push(`/Reservation?${query.toString()}`);
  };

  /* ------------ render ------------ */
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ========= Left content ========= */}
        <div className="lg:col-span-2">
          {/* gallery */}
          <div className="grid grid-cols-1 gap-4">
            <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden">
              <Image src={mainImage} alt="Main" fill className="object-cover" />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {property.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className="relative h-20 cursor-pointer rounded-lg overflow-hidden border"
                >
                  <Image src={img} alt={`Image ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <h1 className="text-2xl font-bold mt-6">{property.name}</h1>
          <p className="text-gray-600 mt-1">📍 {property.location}</p>
          <p className="mt-2 text-yellow-500">
            {'★'.repeat(Math.floor(property.rating))}
            <span className="text-sm text-gray-500 ml-2">({property.rating})</span>
          </p>

          {/* description */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{property.description}</p>
          </section>

          {/* amenities */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-700">
              {property.amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  ✅ {item}
                </div>
              ))}
            </div>
          </section>

          {/* map */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            {property.mapEmbedUrl ? (
              <iframe
                src={property.mapEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded-xl"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-xl text-gray-600 text-sm">
                Google Maps Placeholder
              </div>
            )}
          </section>

          {/* reviews */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4 mb-2">
                    {review.avatarUrl && (
                      <img
                        src={review.avatarUrl}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-yellow-500">{'★'.repeat(review.rating)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ========= Sidebar ========= */}
        <aside className="p-6 border rounded-xl shadow-sm space-y-6 sticky top-24 h-fit">
          <div className="text-xl font-bold">
            Rp. {property.price.toLocaleString('id-ID')}{' '}
            <span className="text-sm text-gray-500">/night</span>
          </div>

          <div className="space-y-4">
            {/* dates */}
            <div>
              <label htmlFor="checkin" className="block text-sm font-medium text-gray-700 mb-1">
                Check-In
              </label>
              <input
                id="checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="checkout" className="block text-sm font-medium text-gray-700 mb-1">
                Check-Out
              </label>
              <input
                id="checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* guest picker */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Who’s coming?</label>
              <button
                type="button"
                onClick={() => setOpenDropdown((o) => !o)}
                className="w-full border rounded-lg px-4 py-2 text-left flex justify-between items-center"
              >
                <span>
                  {totalGuests
                    ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}`
                    : 'Add guests'}
                  {totalPets > 0 && `, ${totalPets} pet${totalPets > 1 ? 's' : ''}`}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    openDropdown ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown && (
                <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-md p-4 space-y-4">
                  {(['Adults', 'Children', 'Pets'] as const).map((label) => (
                    <div key={label} className="flex justify-between items-center">
                      <span>{label}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDecrement(label)}
                          disabled={!counts[label]}
                          className="w-8 h-8 border rounded-full flex items-center justify-center disabled:opacity-30"
                        >
                          −
                        </button>
                        <span>{counts[label]}</span>
                        <button
                          onClick={() => handleIncrement(label)}
                          className="w-8 h-8 border rounded-full flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {(totalGuests > 0 || totalPets > 0) && (
                    <button
                      onClick={handleResetGuests}
                      className="text-sm text-red-500 underline hover:text-red-700"
                    >
                      Clear guest info
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleReservation}
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-black transition"
          >
            Make reservation
          </button>
        </aside>
      </div>
    </>
  );
}
