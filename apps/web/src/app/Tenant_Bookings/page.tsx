'use client';

import { useState, useEffect } from 'react';
import {
  getTenantBookings,
  acceptBookingByTenant,
  rejectBookingByTenant,
  cancelBookingByTenant,
} from '@/lib/api/axios';
import { Booking } from '@/types/booking';
import { AxiosError } from 'axios';
import { BookingStatus } from '@/types/property';
import { useAuthRole } from '../utils/hook/useAuthRole';
import TenantSidebar from '../../components/Tenant_Navbar/page';
import { User, Calendar, Check, X, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

export default function TenantBookingsPage() {
  const authorized = useAuthRole(['TENANT']);
  const tabs = [
    'All',
    'Waiting Payment',
    'Waiting Confirmation',
    'Canceled',
    'Confirmed',
  ];
  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBookings();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchKeyword, activeTab, currentPage]);

  const fetchBookings = async () => {
    try {
      const statusMap: Record<string, string | undefined> = {
        All: undefined,
        'Waiting Payment': 'WAITING_PAYMENT',
        'Waiting Confirmation': 'WAITING_CONFIRMATION',
        Canceled: 'CANCELED',
        Confirmed: 'CONFIRMED',
      };

      const response = await getTenantBookings({
        status: statusMap[activeTab],
        search: searchKeyword,
        page: currentPage,
      });

      setBookings(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching tenant bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab, currentPage]);

  const handleAction = async (bookingId: number, newStatus: BookingStatus) => {
    const confirm = await Swal.fire({
      title: `Sudah periksa bukti? Apakah anda yakin untuk ${newStatus === 'CONFIRMED' ? 'approve' : 'reject'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (!confirm.isConfirmed) return;

    try {
      if (newStatus === BookingStatus.CONFIRMED) {
        await acceptBookingByTenant(bookingId);
        Swal.fire('Approved', 'Booking has been approved.', 'success');
      } else if (newStatus === BookingStatus.REJECTED) {
        await rejectBookingByTenant(bookingId);
        Swal.fire('Rejected', 'Booking has been rejected.', 'success');
      }
      await fetchBookings();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleCancel = async (bookingId: number) => {
    try {
      const confirm = await Swal.fire({
        title: 'Batalkan Booking?',
        text: 'Booking akan dibatalkan secara permanen.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, batalkan',
      });

      if (!confirm.isConfirmed) return;

      await cancelBookingByTenant(bookingId);
      Swal.fire('Dibatalkan', 'Booking berhasil dibatalkan.', 'success');
      await fetchBookings();
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      console.error('DEBUG ERROR:', err?.response?.data || err.message);
      Swal.fire(
        'Gagal',
        err?.response?.data?.detail || 'Terjadi kesalahan',
        'error',
      );
    }
  };

  const handleProof = (proofImageUrl: string) => {
    Swal.fire({
      title: 'Bukti Pembayaran',
      imageUrl: proofImageUrl,
      imageAlt: 'Bukti pembayaran',
      imageWidth: 400,
      imageHeight: 'auto',
      confirmButtonText: 'Tutup',
    });
  };
  if (!authorized) return null;
  return (
    <div className="flex">
      <TenantSidebar />

      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Approval</h1>

        {/* Tabs */}
        <div className="flex justify-between items-center mb-6">
          {/* Tabs di kiri */}
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full border transition ${
                  activeTab === tab
                    ? 'bg-indigo-900 text-white'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar di kanan */}
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition w-64 text-sm"
            />
          </div>
        </div>

        {/* Booking List */}
        <div className="flex flex-col">
          {bookings.length === 0 ? (
            <div className="text-center text-gray-500 py-10 text-xl">
              No Data
            </div>
          ) : (
            <div className="space-y-1">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-5 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-800">
                        {booking.property.name}
                      </h2>
                      <span className="flex items-center text-sm  gap-1">
                        <Calendar size={14} />{' '}
                        {new Date(booking.createdAt).toLocaleDateString(
                          'id-ID',
                        )}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'WAITING_CONFIRMATION'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex flex-row gap-2 items-center">
                      <span className="flex items-center gap-1">
                        <User size={14} /> {booking.user.name}
                      </span>
                      <p className="text-sm text-gray-500">
                        {booking.user.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.orderNumber}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600"></div>
                  </div>

                  {booking.status === 'WAITING_PAYMENT' && (
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm flex items-center gap-1"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  )}

                  {booking.status === 'WAITING_CONFIRMATION' && (
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button
                        onClick={() => handleProof(booking.paymentProof)}
                        className="px-3 py-1 border text-sm rounded-lg hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Eye size={14} /> Lihat Bukti
                      </button>
                      <button
                        onClick={() =>
                          handleAction(booking.id, BookingStatus.REJECTED)
                        }
                        className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm flex items-center gap-1"
                      >
                        <X size={14} /> Reject
                      </button>
                      <button
                        onClick={() =>
                          handleAction(booking.id, BookingStatus.CONFIRMED)
                        }
                        className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm flex items-center gap-1"
                      >
                        <Check size={14} /> Approve
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-2 px-4 ">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="self-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
