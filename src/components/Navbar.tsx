import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code, 
  HelpCircle, 
  Settings,
  User,
  Menu,
  X,
  Crown,
  MessageCircle,
  Bot,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useAdminAuth } from '../hooks/useAdminAuth';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { isAdmin } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current AI provider from localStorage
  const [aiProvider, setAiProvider] = useState<'gemini' | 'copilotkit'>(() => {
    return (localStorage.getItem('aiProvider') as 'gemini' | 'copilotkit') || 'gemini';
  });

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
    { icon: Code, label: 'Code Analyzer', path: '/app/analyzer' },
    { icon: HelpCircle, label: 'Problem Solver', path: '/app/solver' },
    { icon: MessageCircle, label: 'Codable AI', path: '/app/ai' },
  ];

  // Add admin menu item if user is admin
  if (isAdmin) {
    menuItems.push({ icon: Crown, label: 'Admin Panel', path: '/admin' });
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleAIProvider = () => {
    const newProvider = aiProvider === 'gemini' ? 'copilotkit' : 'gemini';
    setAiProvider(newProvider);
    localStorage.setItem('aiProvider', newProvider);
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('aiProviderChanged', {
      detail: { key: 'aiProvider', newValue: newProvider }
    }));
    
    toast.success(`Switched to ${newProvider === 'gemini' ? 'Gemini 2.0 Flash' : 'CopilotKit'} AI`);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

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
        <Link to="/app/dashboard" className="flex items-center gap-3">
          <img 
            src="https://github.com/DarshanVarade/Data/blob/main/Codable.png?raw=true" 
            alt="Codable Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent">
            Codable
          </span>
        </Link>

        {/* Desktop Navigation Items */}
        <div className="hidden lg:flex items-center gap-2">
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
                <item.icon className={`w-4 h-4 ${item.path === '/admin' ? 'text-yellow-500' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {/* AI Provider Switch */}
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleAIProvider}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                aiProvider === 'copilotkit'
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
              }`}
              title={`Switch to ${aiProvider === 'gemini' ? 'CopilotKit' : 'Gemini 2.0 Flash'}`}
            >
              {aiProvider === 'copilotkit' ? (
                <>
                  <Bot className="w-4 h-4" />
                  <span>CopilotKit</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini</span>
                </>
              )}
            </button>
          </div>

          {/* Admin Badge - Hidden on small screens */}
          {isAdmin && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Admin</span>
            </div>
          )}
          
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
            <button className="w-10 h-10 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-full flex items-center justify-center text-white font-bold hover:scale-105 transition-transform relative z-[99999]">
              {profile?.avatar_url || profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </button>
            
            {/* Dropdown Menu */}
            <div className={`absolute right-0 top-12 w-56 bg-card-light dark:bg-card-dark border border-gray-200/20 dark:border-gray-700/20 rounded-lg shadow-2xl transition-all duration-200 z-[99999] ${
              dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
            }`} style={{ zIndex: 99999 }}>
              <div className="p-3 border-b border-gray-200/20 dark:border-gray-700/20">
                <p className="font-medium text-sm">{displayName}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
                {isAdmin && (
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">Administrator</span>
                  </div>
                )}
              </div>
              <div className="p-2 grid grid-cols-2 gap-1">
                <Link
                  to="/app/settings"
                  className="flex flex-col items-center gap-1 px-3 py-3 text-sm rounded-lg hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs">Profile</span>
                </Link>
                <Link
                  to="/app/settings"
                  className="flex flex-col items-center gap-1 px-3 py-3 text-sm rounded-lg hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-xs">Preferences</span>
                </Link>
              </div>
              {isAdmin && (
                <div className="p-2 border-t border-gray-200/20 dark:border-gray-700/20">
                  <Link
                    to="/admin"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-100/70 dark:hover:bg-yellow-900/30 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Crown className="w-4 h-4" />
                    Admin Panel
                  </Link>
                </div>
              )}
              <div className="p-2 border-t border-gray-200/20 dark:border-gray-700/20">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100/70 dark:hover:bg-red-900/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-dark/20 text-primary-dark border border-primary-dark/30'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${item.path === '/admin' ? 'text-yellow-500' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Mobile AI Provider Switch */}
            <button
              onClick={() => {
                toggleAIProvider();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                aiProvider === 'copilotkit'
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
              }`}
            >
              {aiProvider === 'copilotkit' ? (
                <>
                  <Bot className="w-5 h-5" />
                  <span>Switch to Gemini AI</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Switch to CopilotKit</span>
                </>
              )}
            </button>
            
            <Link
              to="/app/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === '/app/settings'
                  ? 'bg-primary-dark/20 text-primary-dark border border-primary-dark/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;