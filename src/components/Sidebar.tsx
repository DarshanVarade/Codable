import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code, 
  HelpCircle, 
  GitBranch, 
  Settings,
  Brain
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
  { icon: Code, label: 'Code Analyzer', path: '/app/analyzer' },
  { icon: HelpCircle, label: 'Problem Solver', path: '/app/solver' },
  { icon: GitBranch, label: 'Flowchart', path: '/app/flowchart' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 z-50 w-70 h-full bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border-r border-gray-200/20 dark:border-gray-700/20 lg:translate-x-0 lg:static lg:z-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200/20 dark:border-gray-700/20">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent">
              Codable
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-dark/20 text-primary-dark border border-primary-dark/30'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                      onClick={() => window.innerWidth < 1024 && onToggle()}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200/20 dark:border-gray-700/20">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100/50 dark:bg-gray-800/50">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-full" />
              <div>
                <p className="text-sm font-medium">Test User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Premium</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;