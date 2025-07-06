'use client';
import { useParams } from 'next/navigation';
import { useAuthRole } from '@/app/utils/hook/useAuthRole';
import EditRoomForm from '@/components/form/EditRoomForm';

export default function EditRoomPage() {
  const authorized = useAuthRole(['TENANT']);
  const params = useParams();
  const propertyId = Number(params.propertyId);
  const roomId = Number(params.roomId);
  if (!authorized) return null;
  return <EditRoomForm propertyId={propertyId} roomId={roomId} />;
}
