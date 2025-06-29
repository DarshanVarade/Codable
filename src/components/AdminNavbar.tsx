import React, { useState, useRef, useEffect } from 'react';
import { 
  Crown,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const AdminNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';

  const handleSignOut = async () => {
    await signOut();
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 1000); // Hide after 1 second
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 px-4 sm:px-6 py-4 relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="https://github.com/DarshanVarade/Data/blob/main/Codable.png?raw=true" 
            alt="Codable Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent">
            Codable
          </span>
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Admin Panel</span>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {/* Admin Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Administrator</span>
          </div>
          
          {/* User Name - Hidden on small screens */}
          <div className="hidden md:block">
            <p className="text-sm font-medium">
              {displayName}
            </p>
          </div>
          
          {/* User Dropdown */}
          <div 
            className="relative z-[99999]"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold hover:scale-105 transition-transform relative z-[99999]">
              {profile?.avatar_url || profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
            </button>
            
            {/* Dropdown Menu */}
            <div className={`absolute right-0 top-12 w-56 bg-card-light dark:bg-card-dark border border-gray-200/20 dark:border-gray-700/20 rounded-lg shadow-2xl transition-all duration-200 z-[99999] ${
              dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
            }`} style={{ zIndex: 99999 }}>
              <div className="p-3 border-b border-gray-200/20 dark:border-gray-700/20">
                <p className="font-medium text-sm">{displayName}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Crown className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">Administrator</span>
                </div>
              </div>
              <div className="p-2 grid grid-cols-2 gap-1">
                <button
                  className="flex flex-col items-center gap-1 px-3 py-3 text-sm rounded-lg hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs">Profile</span>
                </button>
                <button
                  className="flex flex-col items-center gap-1 px-3 py-3 text-sm rounded-lg hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-xs">Preferences</span>
                </button>
              </div>
              <div className="p-2 border-t border-gray-200/20 dark:border-gray-700/20">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100/70 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;