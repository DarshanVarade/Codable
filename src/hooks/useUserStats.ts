import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      setStats(null);
      setLoading(false);
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await db.getUserStats(user.id);
      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async (updates: any) => {
    if (!user) return;

    try {
      const { error } = await db.updateUserStats(user.id, updates);
      if (error) throw error;
      
      setStats({ ...stats, ...updates });
      return { error: null };
    } catch (error) {
      console.error('Error updating stats:', error);
      return { error };
    }
  };

  const incrementAnalyses = async () => {
    if (!stats) return;
    
    const newCount = (stats.total_analyses || 0) + 1;
    await updateStats({ 
      total_analyses: newCount,
      last_activity: new Date().toISOString()
    });
  };

  const incrementProblemsSolved = async () => {
    if (!stats) return;
    
    const newCount = (stats.problems_solved || 0) + 1;
    await updateStats({ 
      problems_solved: newCount,
      last_activity: new Date().toISOString()
    });
  };

  return {
    stats,
    loading,
    updateStats,
    incrementAnalyses,
    incrementProblemsSolved,
    refetch: fetchStats
  };
};