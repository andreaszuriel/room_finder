'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getProfileUser } from '@/lib/api/axios';

type UserProfile = {
  name: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
};

type ProfileContextType = {
  user: UserProfile | null;
  refreshProfile: () => Promise<void>;
  setUser: (user: UserProfile) => void;
};

const ProfileContext = createContext<ProfileContextType>({
  user: null,
  refreshProfile: async () => {},
  setUser: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const refreshProfile = async () => {
    try {
      const res = await getProfileUser();
      setUser(res.detail);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ user, refreshProfile, setUser }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
