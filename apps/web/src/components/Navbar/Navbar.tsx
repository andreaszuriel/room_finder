'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getProfileUser } from '@/lib/api/axios';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import { useAuth } from '@/app/utils/hook/useAuth';
import Swal from 'sweetalert2';

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { isAuthenticated, role, logout, isAuthLoaded } = useAuth();
  const [name, setName] = useState('');
  const [profileImg, setProfileImg] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (storedRole !== 'user' || !token) return;

    const fetchUserData = async () => {
      try {
        const profile = await getProfileUser();
        const data = profile.detail;

        setName(data.name);
        setProfileImg(data.profilePhoto);
        console.log('Current user ID:', data.id);
        console.log('User name:', data.name);
      } catch (error: unknown) {
        const err = error as AxiosError<{ detail?: string }>;
        toast.error(err.response?.data?.detail || 'Terjadi kesalahan.');
      }
    };

    fetchUserData();
  }, []);

  if (!isAuthLoaded) return null;

  return (
    <header className="bg-white shadow-sm fixed top-0 z-50 w-full">
      <div className="w-full px-4 md:px-8 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/room_finderr.jpeg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-gray-900">Room Finder</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated || role !== 'TENANT' ? (
            <Link
              href="/Register_Tenant"
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
            >
              Become a Tenant
            </Link>
          ) : null}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300"
              >
                {profileImg ? (
                  <Image
                    src={profileImg}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User
                    size={18}
                    className="text-gray-500 w-full h-full flex items-center justify-center"
                  />
                )}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 font-semibold">
                    {name && `Hi, ${name}`}
                  </div>
                  <Link
                    href="/Settings_User"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href={
                      role === 'TENANT' ? '/Tenant_Property' : '/User_Bookings'
                    }
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: 'Yakin ingin logout?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Iya',
                        cancelButtonText: 'Batal',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          logout();
                          setShowProfileMenu(false);
                        }
                      });
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/Login"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Login
              </Link>
              <Link
                href="/Register_temp"
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
