import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code, 
  HelpCircle, 
  Settings,
  Brain,
  User
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
    { icon: Code, label: 'Code Analyzer', path: '/app/analyzer' },
    { icon: HelpCircle, label: 'Problem Solver', path: '/app/solver' },
    { icon: Settings, label: 'Settings', path: '/app/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/app/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent">
            Codable
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-dark/20 text-primary-dark border border-primary-dark/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Track your progress and coding journey
            </p>
          </div>
          
          <div className="relative group">
            <button className="w-10 h-10 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-full flex items-center justify-center text-white font-bold">
              {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-12 w-48 bg-card-light dark:bg-card-dark border border-gray-200/20 dark:border-gray-700/20 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-3 border-b border-gray-200/20 dark:border-gray-700/20">
                <p className="font-medium text-sm">{profile?.full_name || 'User'}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
              <div className="p-2">
                <Link
                  to="/app/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;