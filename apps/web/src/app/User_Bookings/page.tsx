'use client';

import { useEffect, useState } from 'react';
import { useAuthRole } from '../utils/hook/useAuthRole';
import SideNavbar from '@/components/User_Navbar/page';
import api from '@/lib/api/axios';

interface Booking {
  id: number;
  checkinDate: string;
  checkoutDate: string;
  guests?: number;
  status: string;
  property?: {
    name?: string;
    address?: string;
    city?: {
      name: string;
    };
  };
  room?: {
    name?: string;
  };
}

export default function BookingsPage() {
  const authorized = useAuthRole(['USER']);

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/api/bookings');

        setBookings(res.data.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, []);
  if (!authorized) return null;
  return (
    <div className="flex">
      <SideNavbar />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="border p-4 rounded-lg bg-white shadow-sm"
              >
                <h2 className="font-semibold">
                  {b.property?.name ?? 'Unknown Property'} -{' '}
                  {b.property?.city?.name ?? 'Unknown City'}
                </h2>
                <p className="text-sm text-gray-600">
                  Date: {new Date(b.checkinDate).toLocaleDateString()} to{' '}
                  {new Date(b.checkoutDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Room: {b.room?.name ?? 'Unknown Room'}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    b.status === 'CONFIRMED'
                      ? 'text-green-600'
                      : b.status === 'WAITING_CONFIRMATION'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  Status: {b.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
