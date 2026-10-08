'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  onboardingCompleted: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {
        setUser(null);
      }
    }

    // Verify session with /auth/me
    const token = localStorage.getItem('accessToken');
    if (token) {
      apiClient
        .get<AuthUser>('/auth/me')
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          // Token expired or invalid
          setUser(null);
          apiClient.clearTokens();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      apiClient.clearTokens();
      setUser(null);
      router.push('/login');
    }
  };

  return {
    user,
    setUser,
    isLoading,
    isAuthenticated: !!user,
    logout
  };
}
