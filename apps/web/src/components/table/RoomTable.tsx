'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { hardDeleteRoom, restoreRoom, softDeleteRoom } from '@/lib/api/axios';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import Link from 'next/link';
import { RoomType } from '@/types/property';

type Props = {
  rooms: RoomType[];
  setRooms: React.Dispatch<React.SetStateAction<RoomType[]>>;
};

export default function TenantRoomTable({ rooms, setRooms }: Props) {
  const { propertyId } = useParams();
  const handleArchive = async (id: number) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menonaktifkan room ini?',
      text: 'Room akan ditandai sebagai tidak tersedia.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, nonaktifkan!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await softDeleteRoom(Number(propertyId), id);
        setRooms((prev) =>
          prev.map((p) => (p.id === id ? { ...p, deletedAt: new Date() } : p)),
        );
        toast.success('Room berhasil ditandai tidak tersedia');
      } catch {
        toast.error('Gagal menonaktifkan room');
      }
    }
  };

  const handleUnarchive = async (id: number) => {
    const result = await Swal.fire({
      title: 'Buka arsip room?',
      text: 'Room akan tersedia kembali.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, tampilkan!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await restoreRoom(Number(propertyId), id);
        setRooms((prev) =>
          prev.map((p) => (p.id === id ? { ...p, deletedAt: null } : p)),
        );
        toast.success('Room berhasil diaktifkan kembali.');
      } catch {
        toast.error('Gagal mengaktifkan kembali room.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus room ini?',
      text: 'Properti akan dihapus dari room anda.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await hardDeleteRoom(Number(propertyId), id);
        setRooms((prev) => prev.filter((p) => p.id !== id));
        toast.success('room berhasil dihapus');
      } catch {
        toast.error('Gagal menghapus room');
      }
    }
  };
  return (
    <table className="w-full table-auto">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-4">Image</th>
          <th className="p-4">Name</th>
          <th className="p-4">Availability</th>
          <th className="p-4">Peak Season</th>
          <th className="p-4">Status</th>
          <th className="p-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr key={room.id} className="border-b hover:bg-gray-50 h-24">
            <td className="p-4">
              <Image
                src={room.image || '/urban_loft.jpg'}
                alt={room.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            </td>
            <td className="p-4 font-semibold">{room.name}</td>
            <td className="p-4 font-semibold">
              <Link
                href={`/Tenant_Property/Manage_Rooms/${propertyId}/Room/${room.id}/Availability`}
                className="text-blue-600 hover:underline mr-4"
              >
                Manage
              </Link>
            </td>
            <td className="p-4 font-semibold">
              <Link
                href={`/Tenant_Property/Manage_Rooms/${propertyId}/Peak_Season/${room.id}`}
                className="text-blue-600 hover:underline mr-4"
              >
                Manage
              </Link>
            </td>
            <td className="p-4">
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  room.deletedAt === null
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {room.deletedAt === null ? 'Available' : 'Unavailable'}
              </span>
            </td>
            <td className="p-4 whitespace-nowrap">
              <Link
                href={`/Tenant_Property/Manage_Rooms/${propertyId}/Room/${room.id}/Edit`}
                className="text-blue-600 hover:underline mr-4"
              >
                Edit
              </Link>
              <button
                onClick={() =>
                  room.deletedAt
                    ? handleUnarchive(room.id)
                    : handleArchive(room.id)
                }
                className={`${
                  room.deletedAt
                    ? 'text-green-600 hover:underline mr-4'
                    : 'text-yellow-600 hover:underline mr-4'
                }`}
              >
                {room.deletedAt ? 'Unarchive' : 'Archive'}
              </button>
              <button
                onClick={() => handleDelete(room.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        {rooms.length === 0 && (
          <tr>
            <td colSpan={5} className="p-4 text-center text-gray-500">
              No Room found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
