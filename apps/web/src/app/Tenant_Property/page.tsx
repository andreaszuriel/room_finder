'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import TenantSidebar from '../../components/Tenant_Navbar/page';
import TenantPropertyTable from '@/components/molecules/TenantPropertyTable';
import { getTenantProperties } from '@/lib/api/axios';
import { useAuthRole } from '../utils/hook/useAuthRole';
import { toast } from 'sonner';
import { PropertyType } from '@/types/property';
import { AxiosError } from 'axios';

export default function TenantMyPropertyPage() {
  const authorized = useAuthRole(['TENANT']);
  const [properties, setProperties] = useState<PropertyType[]>([]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const property = await getTenantProperties();
        setProperties(property.data);
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(
          err.response?.data?.detail || 'Gagal memuat data properti.',
        );
      }
    };
    fetchPropertyData();
  }, []);
  if (!authorized) return null;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TenantSidebar />
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Properties</h1>
            <Link
              href="/Tenant_Property/Create_Property"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Property
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <TenantPropertyTable
              properties={properties}
              setProperties={setProperties}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
