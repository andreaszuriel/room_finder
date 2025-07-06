'use client';

import { useState, useEffect } from 'react';
import {
  getProfileTenant,
  updateUserProfile,
  updateUserPassword,
} from '@/lib/api/axios';
import { useAuthRole } from '../utils/hook/useAuthRole';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';
import TenantSidebar from '../../components/Tenant_Navbar/page';
import { AxiosError } from 'axios';

export default function TenantSettingsPage() {
  const authorized = useAuthRole(['TENANT']);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [form, setForm] = useState({
    email: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchProfile = async () => {
    try {
      const res = await getProfileTenant();
      const user = res.detail;
      setForm({
        email: user.email,
        phone: user.phone || '',
      });
    } catch (error) {
      console.error('Gagal fetch profile:', error);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('email', form.email);
      formData.append('phone', form.phone);

      await updateUserProfile(formData);

      toast.success('Berhasil memperbarui profil');
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      toast.error(err?.response?.data?.detail || 'Gagal memperbarui profil');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmNewPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.warning('Semua kolom harus diisi.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('Konfirmasi password tidak cocok.');
      return;
    }

    try {
      await updateUserPassword({ oldPassword, newPassword });
      toast.success('Password berhasil diperbarui.');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      toast.error(err.response?.data.detail || 'Terjadi kesalahan.');
    }
  };
  if (!authorized) return null;
  return (
    <div className="flex">
      {/* Sidebar */}
      <TenantSidebar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>
        <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded p-2 mt-1"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block font-medium">Telepon</label>
            <input
              type="text"
              name="phone"
              className="w-full border rounded p-2 mt-1"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Ubah Kata Sandi
          </h3>
          <div className="border-b border-gray-300 mb-4" />
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label>Password Lama</label>
            <div className="relative">
              <input
                type={showPassword1 ? 'text' : 'password'}
                name="oldPassword"
                className="w-full border rounded p-2 mt-1"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
              />
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword1(!showPassword1)}
              >
                {showPassword1 ? (
                  <FaEye className="h-5 w-5" />
                ) : (
                  <FaEyeSlash className="h-5 w-5" />
                )}
              </span>
            </div>
          </div>
          <div>
            <label>Password Baru</label>
            <div className="relative">
              <input
                type={showPassword2 ? 'text' : 'password'}
                name="newPassword"
                className="w-full border rounded p-2 mt-1"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? (
                  <FaEye className="h-5 w-5" />
                ) : (
                  <FaEyeSlash className="h-5 w-5" />
                )}
              </span>
            </div>
          </div>
          <div>
            <label>Konfirmasi Password Baru</label>
            <div className="relative">
              <input
                type={showPassword3 ? 'text' : 'password'}
                name="confirmNewPassword"
                className="w-full border rounded p-2 mt-1"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
              />
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword3(!showPassword3)}
              >
                {showPassword3 ? (
                  <FaEye className="h-5 w-5" />
                ) : (
                  <FaEyeSlash className="h-5 w-5" />
                )}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ganti Password
          </button>
        </form>
      </main>
    </div>
  );
}
