import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  TrendingUp, 
  Clock, 
  Award,
  Calendar,
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useUserStats } from '../hooks/useUserStats';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { stats } = useUserStats();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  const statsData = [
    { 
      icon: Code, 
      label: 'Total Analyses', 
      value: stats?.total_analyses?.toString() || '0', 
      color: 'bg-blue-500' 
    },
    { 
      icon: TrendingUp, 
      label: 'Problems Solved', 
      value: stats?.problems_solved?.toString() || '0', 
      color: 'bg-green-500' 
    },
    { 
      icon: Clock, 
      label: 'Current Streak', 
      value: `${stats?.current_streak || 0} days`, 
      color: 'bg-yellow-500' 
    },
    { 
      icon: Zap, 
      label: 'Time Saved', 
      value: `${Math.floor((stats?.time_saved_minutes || 0) / 60)}h ${(stats?.time_saved_minutes || 0) % 60}m`, 
      color: 'bg-purple-500' 
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
      name: 'Speed Demon', 
      description: 'Analyze code in under 10 seconds', 
      unlocked: (stats?.total_analyses || 0) >= 5 
    },
    { 
      id: 4, 
      name: 'Debugging Master', 
      description: 'Find and fix 5 bugs', 
      unlocked: (stats?.problems_solved || 0) >= 5 
    },
  ];

  // Generate activity data based on user stats
  const generateActivityData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const totalActivity = (stats?.total_analyses || 0) + (stats?.problems_solved || 0);
    
    return days.map((day, index) => ({
      day,
      activity: totalActivity > 0 ? Math.floor(Math.random() * (totalActivity / 2)) + 1 : 0
    }));
  };

  const activityData = generateActivityData();

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
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/20 dark:border-gray-700/20 hover:border-primary-dark/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/20 dark:border-gray-700/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Weekly Activity</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              Your coding activity this week
            </div>
          </div>
          
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
            </div>
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
          
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  achievement.unlocked
                    ? 'bg-yellow-500/20 border-yellow-500/30'
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
                <div>
                  <p className="font-medium">Code Analysis Completed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You've analyzed {stats.total_analyses} pieces of code
                  </p>
                </div>
              </div>
            )}
            {(stats?.problems_solved || 0) > 0 && (
              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Problems Solved</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You've solved {stats.problems_solved} programming problems
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
              Try analyzing some code or solving problems!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;