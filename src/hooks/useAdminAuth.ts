import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '../lib/supabase';

export const useAdminAuth = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!loading && user?.email) {
        try {
          const adminStatus = await db.isAdminUser(user.email);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setAdminLoading(false);
    };

    checkAdminStatus();
  }, [user, loading]);

  return {
    isAdmin,
    loading: adminLoading,
    user
  };
};