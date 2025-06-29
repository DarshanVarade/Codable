import React from 'react';
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

const Dashboard: React.FC = () => {
  const stats = [
    { icon: Code, label: 'Total Analyses', value: '0', color: 'bg-blue-500' },
    { icon: TrendingUp, label: 'Problem Solved', value: '0', color: 'bg-green-500' },
    { icon: Clock, label: 'Current Streak', value: '0 days', color: 'bg-yellow-500' },
    { icon: Zap, label: 'Time Saved', value: '0h', color: 'bg-purple-500' },
  ];

  const achievements = [
    { id: 1, name: 'First Analysis', description: 'Complete your first code analysis', unlocked: false },
    { id: 2, name: 'Problem Solver', description: 'Solve 10 programming problems', unlocked: false },
    { id: 3, name: 'Speed Demon', description: 'Analyze code in under 10 seconds', unlocked: false },
    { id: 4, name: 'Debugging Master', description: 'Find and fix 5 bugs', unlocked: false },
  ];

  const activityData = [
    { day: 'Mon', activity: 0 },
    { day: 'Tue', activity: 0 },
    { day: 'Wed', activity: 0 },
    { day: 'Thu', activity: 0 },
    { day: 'Fri', activity: 0 },
    { day: 'Sat', activity: 0 },
    { day: 'Sun', activity: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-dark/20 to-secondary-dark/20 rounded-xl p-6 border border-primary-dark/30"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, Test User! 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and coding journey
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No recent activity found
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Try analyzing some code or solving problems!
            </p>
          </div>
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
        <div className="text-center py-12">
          <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No recent activity found</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Try analyzing some code or solving problems!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;