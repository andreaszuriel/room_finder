'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  CalendarCheck,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../app/utils/hook/useAuth';
import { useAuthRole } from '../../app/utils/hook/useAuthRole';
import Image from 'next/image';
import { useProfile } from '@/context/ProfileContext';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Bookings', href: '/User_Bookings', icon: CalendarCheck },
  { name: 'Reviews', href: '/User_Reviews', icon: Star },
  { name: 'Wishlist', href: '/User_Wishlist', icon: Heart },
  { name: 'Settings', href: '/Settings_User', icon: Settings },
];

export default function SideNavbar() {
  const authorized = useAuthRole(['USER']);

  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const profileContext = useProfile(); // ✅ gunakan di dalam komponen

  const name = profileContext?.user?.name ?? 'Guest';
  const profilePhoto = profileContext?.user?.profilePhoto ?? '';

  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin ingin logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, logout',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };
  if (!authorized) return null;
  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-md md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <ChevronRight
          className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Sidebar */}
      <aside
        className={`h-screen bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 shadow-xl fixed top-0 left-0 z-40 transition-all duration-300 flex flex-col
        ${collapsed ? 'w-20' : 'w-64'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <User className="text-white" size={24} />
              </div>
              <h1 className="font-bold text-xl text-gray-800">User Panel</h1>
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

        {/* User Info */}
        <div
          className={`flex items-center p-4 ${
            collapsed ? 'justify-center' : 'border-b border-gray-200'
          }`}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border-2 border-dashed">
            {profilePhoto ? (
              <Image
                src={profilePhoto}
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
              <p className="text-sm text-gray-500">Regular User</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-4 px-2">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all duration-200 
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                    }
                    ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon
                    size={20}
                    className={`${isActive ? 'text-white' : 'text-blue-500'}`}
                  />
                  {!collapsed && <span>{name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 pt-2">
            <button
              onClick={handleLogout}
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

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
