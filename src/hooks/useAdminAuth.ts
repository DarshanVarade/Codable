import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const ADMIN_EMAIL = 'vampire@gmail.com';

export const useAdminAuth = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const adminStatus = user?.email === ADMIN_EMAIL;
      setIsAdmin(adminStatus);
      setAdminLoading(false);
    }
  }, [user, loading]);

  return {
    isAdmin,
    loading: adminLoading,
    user
  };
};