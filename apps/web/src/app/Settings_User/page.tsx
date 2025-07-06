'use client';

import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import {
  getProfileUser,
  updateUserProfile,
  updateUserPassword,
} from '@/lib/api/axios';
import { useAuthRole } from '../utils/hook/useAuthRole';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import Image from 'next/image';
import SideNavbar from '@/components/User_Navbar/page';

export default function UserSettingsPage() {
  const authorized = useAuthRole(['USER']);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (!allowedTypes.includes(file.type)) {
      return toast.error(
        'Hanya file JPG, JPEG, PNG, atau GIF yang diperbolehkan',
      );
    }

    if (file.size > maxSize) {
      return toast.error('Ukuran file maksimum adalah 1MB');
    }

    const reader = new FileReader();
    reader.onload = () => setProfileImg(reader.result as string);
    reader.readAsDataURL(file);
    setPhotoFile(file);
  };

  const fetchProfile = async () => {
    try {
      const res = await getProfileUser();
      const user = res.detail;
      setForm({
        name: user.name || '',
        email: user.email,
        phone: user.phone || '',
      });
      setProfileImg(user.profilePhoto || null);
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
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      if (photoFile) {
        formData.append('image', photoFile);
      }

      await updateUserProfile(formData);

      toast.success('Berhasil memperbarui profil');
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      toast.error(
        axiosErr.response?.data?.message || 'Gagal memperbarui profil',
      );
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
      console.error('Update password error:', err.response?.data);
      toast.error(err.response?.data?.detail || 'Terjadi kesalahan.');
    }
  };
  if (!authorized) return null;
  return (
    <div className="flex">
      {/* Sidebar */}
      <SideNavbar />

      {/* Main content */}
      <main className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>
        <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
          <div className="flex justify-center mb-4">
            <div
              className="w-24 h-24 rounded-full border overflow-hidden cursor-pointer relative group"
              onClick={() => document.getElementById('photoInput')?.click()}
            >
              {profileImg ? (
                <Image
                  src={profileImg}
                  alt="Foto Profil"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  <User size={40} />
                </div>
              )}
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>
          <div>
            <label className="block font-medium">Nama</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded p-2 mt-1"
              value={form.name}
              onChange={handleChange}
            />
          </div>
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
