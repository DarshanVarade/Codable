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
      
      // Calculate accurate current streak
      const currentStreak = await calculateCurrentStreak();
      
      // Calculate total time spent (estimate based on activities)
      const totalTimeSpent = await calculateTotalTimeSpent();
      
      setStats({
        ...data,
        current_streak: currentStreak,
        // Use time_saved_minutes from database, but also provide calculated total time
        calculated_total_time: totalTimeSpent
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentStreak = async () => {
    if (!user) return 0;

    try {
      // Get all user activities (analyses and solutions) ordered by date
      const { data: analyses } = await db.getCodeAnalyses(user.id);
      const { data: solutions } = await db.getProblemSolutions(user.id);
      
      // Combine and sort all activities by date
      const allActivities = [
        ...(analyses || []).map(a => ({ date: a.created_at, type: 'analysis' })),
        ...(solutions || []).map(s => ({ date: s.created_at, type: 'solution' }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (allActivities.length === 0) return 0;

      // Group activities by day
      const activityDays = new Set();
      allActivities.forEach(activity => {
        const date = new Date(activity.date);
        const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        activityDays.add(dayKey);
      });

      const sortedDays = Array.from(activityDays).sort().reverse();
      
      // Calculate current streak
      let streak = 0;
      const today = new Date();
      const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
      
      // Check if user was active today or yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
      
      let startIndex = -1;
      if (sortedDays[0] === todayKey) {
        startIndex = 0;
      } else if (sortedDays[0] === yesterdayKey) {
        startIndex = 0;
      } else {
        return 0; // No recent activity
      }

      // Count consecutive days
      for (let i = startIndex; i < sortedDays.length; i++) {
        const currentDay = new Date(sortedDays[i].split('-').map(Number));
        const expectedDay = new Date(today);
        expectedDay.setDate(expectedDay.getDate() - i);
        
        const currentDayKey = `${currentDay.getFullYear()}-${currentDay.getMonth()}-${currentDay.getDate()}`;
        const expectedDayKey = `${expectedDay.getFullYear()}-${expectedDay.getMonth()}-${expectedDay.getDate()}`;
        
        if (currentDayKey === expectedDayKey) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  };

  const calculateTotalTimeSpent = async () => {
    if (!user) return 0;

    try {
      // Get all user activities
      const { data: analyses } = await db.getCodeAnalyses(user.id);
      const { data: solutions } = await db.getProblemSolutions(user.id);
      
      // Estimate time spent based on activities
      // Code analysis: ~3-5 minutes per analysis
      // Problem solving: ~8-15 minutes per solution
      // AI conversations: ~2-3 minutes per conversation
      
      const analysisTime = (analyses?.length || 0) * 4; // 4 minutes average
      const solutionTime = (solutions?.length || 0) * 12; // 12 minutes average
      
      // Get AI conversations count
      const { data: conversations } = await db.getConversations(user.id);
      const conversationTime = (conversations?.length || 0) * 2.5; // 2.5 minutes average
      
      return Math.round(analysisTime + solutionTime + conversationTime);
    } catch (error) {
      console.error('Error calculating time spent:', error);
      return 0;
    }
  };

  const updateStats = async (updates: any) => {
    if (!user) return;

    try {
      // Recalculate streak when updating
      const currentStreak = await calculateCurrentStreak();
      
      const updatedStats = {
        ...updates,
        current_streak: currentStreak,
        last_activity: new Date().toISOString()
      };
      
      const { error } = await db.updateUserStats(user.id, updatedStats);
      if (error) throw error;
      
      setStats({ ...stats, ...updatedStats });
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
      total_analyses: newCount
    });
  };

  const incrementProblemsSolved = async () => {
    if (!stats) return;
    
    const newCount = (stats.problems_solved || 0) + 1;
    await updateStats({ 
      problems_solved: newCount
    });
  };

  // Auto-refresh stats every 5 minutes to keep streak accurate
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  return {
    stats,
    loading,
    updateStats,
    incrementAnalyses,
    incrementProblemsSolved,
    refetch: fetchStats
  };
};