import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  TrendingUp, 
  Clock, 
  Award,
  Calendar,
  Zap,
  Target,
  Trophy,
  Timer,
  Flame,
  BarChart3,
  Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useUserStats } from '../hooks/useUserStats';
import { db } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { stats, refetch } = useUserStats();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [realActivityData, setRealActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  // Format time spent in a readable format
  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else if (minutes < 1440) { // Less than 24 hours
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    } else {
      const days = Math.floor(minutes / 1440);
      const remainingHours = Math.floor((minutes % 1440) / 60);
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
  };

  // Get streak status and color
  const getStreakStatus = (streak: number) => {
    if (streak === 0) return { text: 'Start your streak!', color: 'text-gray-500', bgColor: 'bg-gray-500' };
    if (streak === 1) return { text: 'Great start!', color: 'text-green-500', bgColor: 'bg-green-500' };
    if (streak < 7) return { text: 'Building momentum!', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    if (streak < 30) return { text: 'On fire!', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    return { text: 'Legendary!', color: 'text-red-500', bgColor: 'bg-red-500' };
  };

  // Fetch real activity data from database
  const fetchRealActivityData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get all user activities from database
      const [analysesResult, solutionsResult] = await Promise.all([
        db.getCodeAnalyses(user.id),
        db.getProblemSolutions(user.id)
      ]);

      const analyses = analysesResult.data || [];
      const solutions = solutionsResult.data || [];

      // Combine all activities
      const allActivities = [
        ...analyses.map(a => ({ date: a.created_at, type: 'analysis' })),
        ...solutions.map(s => ({ date: s.created_at, type: 'solution' }))
      ];

      // Group activities by date
      const activityByDate = new Map();
      
      allActivities.forEach(activity => {
        const date = new Date(activity.date);
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        if (!activityByDate.has(dateKey)) {
          activityByDate.set(dateKey, { date: new Date(date.getFullYear(), date.getMonth(), date.getDate()), count: 0 });
        }
        activityByDate.get(dateKey).count++;
      });

      // Convert to array and sort by date
      const activityData = Array.from(activityByDate.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
      
      setRealActivityData(activityData);
    } catch (error) {
      console.error('Error fetching activity data:', error);
      setRealActivityData([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate responsive heatmap data based on screen size
  const generateResponsiveHeatmapData = () => {
    if (realActivityData.length === 0) return { weeks: [], totalContributions: 0, monthLabels: [] };

    // Calculate how many weeks we can show based on screen width
    const screenWidth = window.innerWidth;
    let weeksToShow = 52; // Default to 1 year
    
    if (screenWidth < 640) { // sm
      weeksToShow = 20; // ~5 months
    } else if (screenWidth < 768) { // md
      weeksToShow = 30; // ~7 months
    } else if (screenWidth < 1024) { // lg
      weeksToShow = 40; // ~10 months
    }

    // Always end at today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    // Calculate start date based on weeks to show
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (weeksToShow * 7));
    
    // Align to start of week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Create activity map for quick lookup
    const activityMap = new Map();
    realActivityData.forEach(activity => {
      const dateKey = activity.date.toISOString().split('T')[0];
      activityMap.set(dateKey, activity.count);
    });

    // Generate weeks data
    const weeks = [];
    let currentDate = new Date(startDate);
    let totalContributions = 0;

    for (let week = 0; week < weeksToShow; week++) {
      const weekData = [];
      
      for (let day = 0; day < 7; day++) {
        const dateKey = currentDate.toISOString().split('T')[0];
        const count = activityMap.get(dateKey) || 0;
        const intensity = count === 0 ? 0 : Math.min(Math.ceil(count / 2), 4); // Scale to 0-4
        
        weekData.push({
          date: new Date(currentDate),
          count,
          intensity
        });

        totalContributions += count;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      weeks.push(weekData);
    }

    // Generate month labels
    const monthLabels = [];
    const monthsToShow = Math.ceil(weeksToShow / 4.33); // Approximate months
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      monthLabels.push(date.toLocaleDateString('en-US', { month: 'short' }));
    }

    return { weeks, totalContributions, monthLabels };
  };

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-gray-100 dark:bg-gray-800';
      case 1: return 'bg-green-200 dark:bg-green-900';
      case 2: return 'bg-green-300 dark:bg-green-700';
      case 3: return 'bg-green-400 dark:bg-green-600';
      case 4: return 'bg-green-500 dark:bg-green-500';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const currentStreak = stats?.current_streak || 0;
  const streakStatus = getStreakStatus(currentStreak);
  const totalTimeSpent = stats?.total_time_spent_minutes || 0;

  const statsData = [
    { 
      icon: Code, 
      label: 'Total Analyses', 
      value: stats?.total_analyses?.toString() || '0', 
      color: 'bg-blue-500',
      description: 'Code pieces analyzed'
    },
    { 
      icon: TrendingUp, 
      label: 'Problems Solved', 
      value: stats?.problems_solved?.toString() || '0', 
      color: 'bg-green-500',
      description: 'Programming challenges completed'
    },
    { 
      icon: Flame, 
      label: 'Current Streak', 
      value: `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`, 
      color: streakStatus.bgColor,
      description: streakStatus.text,
      isStreak: true
    },
    { 
      icon: Timer, 
      label: 'Total Time Spent', 
      value: formatTimeSpent(totalTimeSpent), 
      color: 'bg-purple-500',
      description: 'Time invested in coding'
    },
  ];

  const achievements = [
    { 
      id: 1, 
      name: 'First Analysis', 
      description: 'Complete your first code analysis', 
      unlocked: (stats?.total_analyses || 0) > 0 
    },
    { 
      id: 2, 
      name: 'Problem Solver', 
      description: 'Solve 10 programming problems', 
      unlocked: (stats?.problems_solved || 0) >= 10 
    },
    { 
      id: 3, 
      name: 'Consistent Coder', 
      description: 'Maintain a 7-day streak', 
      unlocked: (stats?.current_streak || 0) >= 7 
    },
    { 
      id: 4, 
      name: 'Time Investor', 
      description: 'Spend 2+ hours coding', 
      unlocked: (stats?.total_time_spent_minutes || 0) >= 120 
    },
    { 
      id: 5, 
      name: 'Streak Master', 
      description: 'Maintain a 30-day streak', 
      unlocked: (stats?.current_streak || 0) >= 30 
    },
    { 
      id: 6, 
      name: 'Code Analyst', 
      description: 'Analyze 50+ pieces of code', 
      unlocked: (stats?.total_analyses || 0) >= 50 
    },
  ];

  // Generate activity data based on user stats with more realistic patterns
  const generateActivityData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const totalActivity = (stats?.total_analyses || 0) + (stats?.problems_solved || 0);
    const currentStreak = stats?.current_streak || 0;
    
    return days.map((day, index) => {
      let activity = 0;
      
      if (totalActivity > 0) {
        // More realistic activity distribution
        const baseActivity = Math.floor(totalActivity / 14); // Spread over 2 weeks
        const randomVariation = Math.floor(Math.random() * (baseActivity + 1));
        
        // Higher activity on weekdays, lower on weekends
        const weekdayMultiplier = index < 5 ? 1.2 : 0.7;
        
        // Recent streak affects recent days
        const streakBonus = currentStreak > 0 && index >= 5 ? Math.min(currentStreak / 7, 2) : 1;
        
        activity = Math.floor((baseActivity + randomVariation) * weekdayMultiplier * streakBonus);
        activity = Math.max(0, Math.min(activity, totalActivity)); // Clamp values
      }
      
      return {
        day,
        activity
      };
    });
  };

  const activityData = generateActivityData();

  // Fetch real data when switching to heatmap view
  useEffect(() => {
    if (showHeatmap && realActivityData.length === 0) {
      fetchRealActivityData();
    }
  }, [showHeatmap, user]);

  // Refresh stats when component mounts
  useEffect(() => {
    refetch();
  }, []);

  const renderHeatmap = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading activity data...</p>
        </div>
      );
    }

    const { weeks, totalContributions, monthLabels } = generateResponsiveHeatmapData();
    
    if (weeks.length === 0) {
      return (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">No Activity Yet</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start analyzing code or solving problems to see your activity heatmap!
          </p>
        </div>
      );
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Coding Activity Heatmap
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {totalContributions} contributions
          </div>
        </div>
        
        {/* Month labels - responsive */}
        <div className="flex justify-between text-xs text-gray-500 mb-2 ml-8">
          {monthLabels.map((month, index) => (
            <span key={index} className="text-center" style={{ width: `${100 / monthLabels.length}%` }}>
              {month}
            </span>
          ))}
        </div>
        
        {/* Heatmap grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 text-xs text-gray-500 mr-2">
            <div className="h-3"></div> {/* Spacer for alignment */}
            <div className="h-3 flex items-center">Mon</div>
            <div className="h-3"></div>
            <div className="h-3 flex items-center">Wed</div>
            <div className="h-3"></div>
            <div className="h-3 flex items-center">Fri</div>
            <div className="h-3"></div>
          </div>
          
          {/* Heatmap cells */}
          <div className="flex gap-1 flex-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1 flex-1">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const day = week[dayIndex];
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isToday = day && day.date.getTime() === today.getTime();
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`h-3 rounded-sm border transition-all cursor-pointer relative ${
                        day ? getIntensityColor(day.intensity) : 'bg-gray-100 dark:bg-gray-800'
                      } ${
                        isToday 
                          ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg scale-110 z-10' 
                          : 'border-gray-200 dark:border-gray-600 hover:ring-2 hover:ring-gray-400'
                      }`}
                      title={day ? `${day.date.toLocaleDateString()}: ${day.count} contributions${isToday ? ' (Today)' : ''}` : ''}
                      style={{ aspectRatio: '1' }}
                    >
                      {/* Today indicator */}
                      {isToday && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Current day indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm ring-2 ring-blue-500" />
          <span className="font-medium">Today: {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}</span>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((intensity) => (
                <div
                  key={intensity}
                  className={`w-3 h-3 rounded-sm border border-gray-200 dark:border-gray-600 ${getIntensityColor(intensity)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
          
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Current streak: <span className="font-medium text-green-600 dark:text-green-400">{currentStreak} days</span>
          </div>
        </div>
        
        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{currentStreak}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{stats?.longest_streak || 0}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Longest Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{totalContributions}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Contributions</div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-dark/20 to-secondary-dark/20 rounded-xl p-6 border border-primary-dark/30"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, {displayName}! 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and coding journey
        </p>
        {currentStreak > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <Flame className={`w-5 h-5 ${streakStatus.color}`} />
            <span className={`text-sm font-medium ${streakStatus.color}`}>
              {currentStreak} day streak - {streakStatus.text}
            </span>
          </div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/20 dark:border-gray-700/20 hover:border-primary-dark/30 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              {stat.isStreak && currentStreak > 0 && (
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(currentStreak, 5))].map((_, i) => (
                    <Flame key={i} className={`w-3 h-3 ${streakStatus.color}`} />
                  ))}
                  {currentStreak > 5 && (
                    <span className={`text-xs font-bold ${streakStatus.color}`}>
                      +{currentStreak - 5}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Activity / Daily Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/20 dark:border-gray-700/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHeatmap(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  !showHeatmap 
                    ? 'bg-primary-dark/20 text-primary-dark border border-primary-dark/30' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Weekly Activity
              </button>
              <button
                onClick={() => setShowHeatmap(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  showHeatmap 
                    ? 'bg-primary-dark/20 text-primary-dark border border-primary-dark/30' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <Activity className="w-4 h-4" />
                Daily Streak
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              {showHeatmap ? 'Your coding activity over time' : 'Your coding activity this week'}
            </div>
          </div>
          
          {!showHeatmap ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Area
                      type="monotone"
                      dataKey="activity"
                      stroke="#22D3EE"
                      fill="url(#colorActivity)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {activityData.every(d => d.activity === 0) ? (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No recent activity found
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Try analyzing some code or solving problems!
                  </p>
                </div>
              ) : (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Great progress this week! Keep it up! 🚀
                  </p>
                  {currentStreak > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      You've been coding for {currentStreak} consecutive days
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            renderHeatmap()
          )}
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/20 dark:border-gray-700/20"
        >
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold">Achievements</h2>
          </div>
          
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  achievement.unlocked
                    ? 'bg-yellow-500/20 border-yellow-500/30 transform hover:scale-105'
                    : 'bg-gray-100/50 dark:bg-gray-800/50 border-gray-200/20 dark:border-gray-700/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{achievement.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/20 dark:border-gray-700/20"
      >
        <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>
        {(stats?.total_analyses || 0) > 0 || (stats?.problems_solved || 0) > 0 ? (
          <div className="space-y-4">
            {(stats?.total_analyses || 0) > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Code Analysis Completed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You've analyzed {stats.total_analyses} pieces of code
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    ~{Math.round((stats.total_analyses * 4) / 60 * 10) / 10}h spent
                  </p>
                </div>
              </div>
            )}
            {(stats?.problems_solved || 0) > 0 && (
              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Problems Solved</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You've solved {stats.problems_solved} programming problems
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    ~{Math.round((stats.problems_solved * 12) / 60 * 10) / 10}h spent
                  </p>
                </div>
              </div>
            )}
            {totalTimeSpent > 0 && (
              <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Timer className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Total Time Investment</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You've invested {formatTimeSpent(totalTimeSpent)} in coding activities
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {Math.round(totalTimeSpent / 60 * 10) / 10}h total
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No recent activity found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Try analyzing some code or solving problems to start tracking your progress!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;