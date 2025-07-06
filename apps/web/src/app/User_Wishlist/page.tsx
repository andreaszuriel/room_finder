'use client';

import SideNavbar from '@/components/User_Navbar/page';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthRole } from '../utils/hook/useAuthRole';
import api from '@/lib/api/axios';

type Property = {
  id: number;
  name: string;
  city?: {
    name: string;
  };
  price: number;
  mainImage?: string;
};

export default function WishlistPage() {
  const authorized = useAuthRole(['USER']);
  const [wishlist, setWishlist] = useState<Property[]>([]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/api/wishlist');
      setWishlist(res.data.data); // backend return { data: [...] }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const handleToggleWishlist = async (propertyId: number) => {
    try {
      await api.post(`/api/wishlist/${propertyId}`);
      // Update local state (hapus dari list)
      setWishlist((prev) => prev.filter((item) => item.id !== propertyId));
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);
  if (!authorized) return null;
  return (
    <div className="flex">
      <SideNavbar />
      <main className="ml-64 p-6 w-full bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart className="text-pink-500" /> My Wishlist
        </h1>
        {wishlist.length === 0 ? (
          <p className="text-gray-500">No properties in wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-4 relative"
              >
                <img
                  src={item.mainImage ?? '/default.jpg'}
                  alt={item.name}
                  className="rounded-lg w-full h-40 object-cover mb-4"
                />

                {/* Heart button to remove */}
                <button
                  onClick={() => handleToggleWishlist(item.id)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:scale-105 transition"
                  title="Remove from wishlist"
                >
                  <Heart className="text-pink-500 fill-pink-500 w-5 h-5" />
                </button>

                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {item.city?.name ?? 'Unknown City'}
                </p>
                <p className="text-blue-600 font-semibold">
                  Rp {item.price ? item.price.toLocaleString('id-ID') : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
