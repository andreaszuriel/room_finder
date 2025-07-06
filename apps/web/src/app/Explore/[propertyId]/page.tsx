'use client';

import Navbar from '@/components/Navbar/Navbar';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { getPropertyDetail } from '@/lib/api/axios';
import StickySearchBar from '@/components/StickySearchBar/StickySearchBar';
import GallerySection from '@/components/Gallery/Gallery';
import RoomList from '@/components/RoomList/RoomList';
import Reviews from '@/components/Reviews/Reviews';
import SidebarProperty from '@/components/SidebarProperty/SidebarProperty';
import type { Property } from '@/types/property';

export default function PropertyDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const propertyId = Number(params?.propertyId);

  const [property, setProperty] = useState<Property | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');

    const startDate = checkInParam ? new Date(checkInParam) : undefined;
    const endDate = checkOutParam ? new Date(checkOutParam) : undefined;

    if (checkInParam) setCheckIn(checkInParam);
    if (checkOutParam) setCheckOut(checkOutParam);
    if (guestsParam) setGuests(Number(guestsParam));

    if (isNaN(propertyId)) return;

    const fetchData = async () => {
      try {
        const data = await getPropertyDetail(propertyId, startDate, endDate);
        setProperty(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching property detail:', err.message);
        } else {
          console.error('Unknown error:', err);
        }
        toast.error('Gagal mengambil detail properti');
      }
    };

    fetchData();
  }, [propertyId, searchParams]);

  const handleCheckAvailability = async (
    checkIn: string,
    checkOut: string,
    guests: number,
  ) => {
    if (!checkIn || !checkOut) return;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    try {
      // Update URL query params
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set('checkIn', startDate.toISOString());
      currentParams.set('checkOut', endDate.toISOString());
      currentParams.set('guests', guests.toString());

      router.replace(`?${currentParams.toString()}`, { scroll: false });

      // Fetch data berdasarkan tanggal baru
      const data = await getPropertyDetail(propertyId, startDate, endDate);
      setProperty(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error fetching property detail:', err.message);
      } else {
        console.error('Unknown error:', err);
      }
      toast.error('Failed to fetch availability');
    }
  };

  if (!property) return <p className="text-center py-10">Loading...</p>;

  return (
    <>
      <Navbar />

      {/* Sticky Search Bar */}
      <StickySearchBar
        propertyName={property.name}
        propertyLocation={property.city}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        setGuests={setGuests}
        onCheckAvailability={handleCheckAvailability}
      />

      <div className="max-w-screen-xl mx-auto px-4 pt-24 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <GallerySection property={property} />

          {/* Room Types */}
          <RoomList rooms={property.rooms} propertyId={property.id} />

          {/* Location */}
          <section>
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

          {/* Reviews */}
          <Reviews reviews={property.reviews} />
        </div>

        {/* Sidebar */}
        <SidebarProperty
          effectivePrice={Math.min(
            ...(property.rooms ?? []).map((r) => r.effectivePrice),
          )}
          description={property.description}
        />
      </div>
    </>
  );
}
