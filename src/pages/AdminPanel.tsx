import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trash2, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Code,
  TrendingUp,
  AlertTriangle,
  Eye,
  Ban,
  UserX,
  Crown
} from 'lucide-react';
import { db } from '../lib/supabase';
import AdminNavbar from '../components/AdminNavbar';
import toast from 'react-hot-toast';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  profile_created_at: string | null;
  total_analyses: number;
  problems_solved: number;
  current_streak: number;
  last_activity: string | null;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAnalyses: 0,
    totalProblems: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Use the new RPC function to fetch users securely
      const { data: usersData, error } = await db.getAdminPanelUsers();

      if (error) {
        throw error;
      }

      setUsers(usersData || []);

      // Calculate stats
      const totalUsers = usersData?.length || 0;
      const activeUsers = usersData?.filter(u => 
        u.last_activity && 
        new Date(u.last_activity) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;
      const totalAnalyses = usersData?.reduce((sum, u) => sum + (u.total_analyses || 0), 0) || 0;
      const totalProblems = usersData?.reduce((sum, u) => sum + (u.problems_solved || 0), 0) || 0;

      setStats({
        totalUsers,
        activeUsers,
        totalAnalyses,
        totalProblems
      });

    } catch (error: any) {
      console.error('Error fetching users:', error);
      
      if (error.message?.includes('Admin privileges required') || error.message?.includes('Access denied')) {
        toast.error('Access denied. Admin privileges required.');
      } else {
        toast.error('Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setDeleting(true);
    try {
      // Use the new RPC function to delete user securely
      const { error } = await db.deleteUserAdmin(selectedUser.id);
      
      if (error) {
        throw error;
      }

      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting user:', error);
      
      if (error.message?.includes('Admin privileges required') || error.message?.includes('Access denied')) {
        toast.error('Access denied. Admin privileges required.');
      } else {
        toast.error('Failed to delete user');
      }
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivityStatus = (lastActivity: string | null) => {
    if (!lastActivity) return { status: 'Never', color: 'text-gray-500' };
    
    const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince === 0) return { status: 'Today', color: 'text-green-500' };
    if (daysSince === 1) return { status: 'Yesterday', color: 'text-green-400' };
    if (daysSince <= 7) return { status: `${daysSince}d ago`, color: 'text-yellow-500' };
    if (daysSince <= 30) return { status: `${daysSince}d ago`, color: 'text-orange-500' };
    return { status: `${daysSince}d ago`, color: 'text-red-500' };
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
      {/* Admin Navbar */}
      <AdminNavbar />
      
      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h1 className="text-2xl font-bold">User Management</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Manage users and monitor platform activity
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              icon: Users, 
              label: 'Total Users', 
              value: stats.totalUsers.toString(), 
              color: 'bg-blue-500' 
            },
            { 
              icon: TrendingUp, 
              label: 'Active Users (7d)', 
              value: stats.activeUsers.toString(), 
              color: 'bg-green-500' 
            },
            { 
              icon: Code, 
              label: 'Total Analyses', 
              value: stats.totalAnalyses.toString(), 
              color: 'bg-purple-500' 
            },
            { 
              icon: TrendingUp, 
              label: 'Problems Solved', 
              value: stats.totalProblems.toString(), 
              color: 'bg-orange-500' 
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/20 dark:border-gray-700/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden"
        >
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">User Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50 w-64"
                  />
                </div>
                <button className="p-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No users found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/20 dark:divide-gray-700/20">
                  {filteredUsers.map((user) => {
                    const activity = getActivityStatus(user.last_activity);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-full flex items-center justify-center text-white font-bold">
                              {user.avatar_url || user.full_name?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {user.full_name || 'Unnamed User'}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                              {user.username && (
                                <p className="text-xs text-gray-500">@{user.username}</p>
                              )}
                              {!user.email_confirmed_at && (
                                <p className="text-xs text-red-500">Email not verified</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${activity.color}`}>
                            {activity.status}
                          </span>
                          {user.last_sign_in_at && (
                            <p className="text-xs text-gray-500">
                              Last login: {formatDate(user.last_sign_in_at)}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="flex items-center gap-4">
                              <span className="text-gray-600 dark:text-gray-400">
                                {user.total_analyses || 0} analyses
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                {user.problems_solved || 0} solved
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {user.current_streak || 0} day streak
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20 p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Delete User</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-full flex items-center justify-center text-white font-bold">
                    {selectedUser.avatar_url || selectedUser.full_name?.[0] || selectedUser.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{selectedUser.full_name || 'Unnamed User'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this user? This will permanently remove their account, 
                profile, and all associated data including code analyses and problem solutions.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    'Delete User'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;