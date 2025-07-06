'use client';

import Link from 'next/link';
import { useAuth } from '../utils/hook/useAuth';
import Swal from 'sweetalert2';
import { usePathname } from 'next/navigation';
import {
  Home,
  CalendarCheck,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  User,
  Hotel,
  ChartNoAxesColumnIncreasing,
} from 'lucide-react';
import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { getProfileTenant } from '@/lib/api/axios';
import { toast } from 'sonner';
import Image from 'next/image';

const tenantMenu = [
  {
    label: 'Dashboard',
    href: '/Tenant_Reports',
    icon: <ChartNoAxesColumnIncreasing size={20} />,
  },
  { label: 'My Property', href: '/Tenant_Property', icon: <Home size={20} /> },
  {
    label: 'Bookings',
    href: '/Tenant_Bookings',
    icon: <CalendarCheck size={20} />,
  },
  { label: 'Reviews', href: '/Tenant_Reviews', icon: <Star size={20} /> },
  { label: 'Settings', href: '/Tenant_Settings', icon: <Settings size={20} /> },
];

export default function TenantSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const { isAuthenticated, logout, isAuthLoaded } = useAuth();

  useEffect(() => {
    if (!isAuthLoaded || !isAuthenticated || !localStorage.getItem('token'))
      return;
    const fetchUserData = async () => {
      try {
        const profile = await getProfileTenant();
        const data = profile.detail;

        setUserId(data.id);
        if (userId !== null) {
          console.log('Current user ID:', userId);
        }
        setName(data.tenant?.companyName);
        setProfileImg(data.profilePhoto);
      } catch (error: unknown) {
        const axiosErr = error as AxiosError<{ message: string }>;
        toast.error(
          axiosErr.response?.data?.message || 'Gagal memuat data pengguna.',
        );
      }
    };
    fetchUserData();
  }, [isAuthLoaded, isAuthenticated]);

  const handleLogoutClick = () => {
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
      }
    });
  };
  if (!isAuthLoaded) return null;

  return (
    <aside
      className={`h-screen bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'min-w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Hotel className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">Tenant Panel</h1>
            </div>
          </div>
        )}
        <button
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            size={20}
            className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* User Profile */}
      <div
        className={`flex items-center p-4 ${collapsed ? 'justify-center' : 'border-b border-gray-200'}`}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border-2 border-dashed">
          {profileImg ? (
            <Image
              src={profileImg}
              alt="Profile"
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
        </div>
        {!collapsed && (
          <div className="ml-3">
            <h3 className="font-bold text-lg text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500">Tenant</p>
          </div>
        )}
      </div>

      {/* Main Content (menu + logout) */}
      <div className="flex-1 overflow-y-auto">
        {/* Navigation */}
        <nav className="py-4 px-2">
          {tenantMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <span className={isActive ? 'text-white' : 'text-blue-500'}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout - moved just below nav */}
        <div className="px-4 pt-2">
          <button
            onClick={handleLogoutClick}
            className={`flex items-center gap-3 text-gray-600 hover:text-red-600 w-full ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} className="text-gray-500" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
