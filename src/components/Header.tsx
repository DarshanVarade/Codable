import React from 'react';
import { Menu, Bot, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  onAIClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onAIClick }) => {
  return (
    <header className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold">Welcome back, Test User</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your progress and coding journey
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAIClick}
            className="flex items-center gap-2 px-4 py-2 bg-primary-dark/20 text-primary-dark rounded-lg hover:bg-primary-dark/30 transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>
          
          <Link
            to="/app/settings"
            className="p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;