'use client';

import { useParams } from 'next/navigation';
import RoomAvailabilityTable from '@/components/table/AvailabilityTable';
import TenantSidebar from '@/components/Tenant_Navbar/page';
import Link from 'next/link';
import { useAuthRole } from '@/app/utils/hook/useAuthRole';

export default function RoomAvailabilityPage() {
  const params = useParams();
  const propertyId = Number(params.propertyId);
  const roomId = Number(params.roomId);
  const authorized = useAuthRole(['TENANT']);

  if (isNaN(propertyId) || isNaN(roomId)) {
    return <div className="p-6 text-red-500">Invalid Room or Property ID</div>;
  }
  if (!authorized) return null;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TenantSidebar />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Room Availability</h1>
            {roomId && (
              <Link
                href={`/Tenant_Property/Manage_Rooms/${propertyId}/Room/${roomId}/Availability/Set_Availability`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Set Availability
              </Link>
            )}
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <RoomAvailabilityTable roomId={roomId} propertyId={propertyId} />
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
