'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthRole } from '@/app/utils/hook/useAuthRole';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TenantSidebar from '@/components/Tenant_Navbar/page';
import PeakSeasonTable from '@/components/table/PeakSeasonTable';
import { getPeakSeasonsByRoomId } from '@/lib/api/axios';
import { toast } from 'sonner';
import { PeakSeasonType } from '@/types/property';
import { AxiosError } from 'axios';

export default function TenantMyRoomPage() {
  const authorized = useAuthRole(['TENANT']);
  const { propertyId, roomId } = useParams();
  const [rooms, setRooms] = useState<PeakSeasonType[]>([]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        if (!roomId) return;
        const parsedId = Array.isArray(roomId) ? roomId[0] : roomId;
        const room = await getPeakSeasonsByRoomId(Number(parsedId));
        setRooms(room.data);
        if (rooms !== null) {
          console.log('Current user ID:', rooms);
        }
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(
          err.response?.data?.detail || 'Gagal memuat data peak season.',
        );
      }
    };
    fetchRoomData();
  }, [roomId]);
  if (!authorized) return null;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TenantSidebar />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Peak Season</h1>
            {roomId && (
              <Link
                href={`/Tenant_Property/Manage_Rooms/${propertyId}/Peak_Season/${roomId}/Add_PeakSeason`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Add Peak Season
              </Link>
            )}
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <PeakSeasonTable />
          </div>
          <div className="flex items-center justify-end">
            <Link
              href={`/Tenant_Property/Manage_Rooms/${propertyId}`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
            >
              Kembali
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
