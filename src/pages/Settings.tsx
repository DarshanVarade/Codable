import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Palette, 
  Code, 
  Shield,
  CreditCard,
  Save,
  X,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, setTheme } = useTheme();
  const [defaultLanguage, setDefaultLanguage] = useState('javascript');
  const [analysisDepth, setAnalysisDepth] = useState('standard');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'editor', label: 'Editor', icon: Code },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'go', label: 'Go' },
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleCancel = () => {
    toast('Changes cancelled');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/20 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-dark/20 text-primary-dark border border-primary-dark/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/20 p-6"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Profile Picture</h2>
                
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-dark to-secondary-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      T
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-dark text-white rounded-full flex items-center justify-center hover:bg-primary-dark/80 transition-colors">
                      <User className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/80 transition-colors">
                      Change Avatar
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Test User"
                      className="w-full px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="test@example.com"
                      className="w-full px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      defaultValue="@testuser"
                      className="w-full px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <input
                      type="url"
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="City, Country"
                      className="w-full px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
                  />
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-6">Preferences</h2>
                  
                  {/* Theme Toggle */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Theme</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'system', label: 'System', icon: Monitor },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value as any)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                              theme === option.value
                                ? 'border-primary-dark bg-primary-dark/20 text-primary-dark'
                                : 'border-gray-200/20 dark:border-gray-700/20 hover:border-primary-dark/50'
                            }`}
                          >
                            <option.icon className="w-6 h-6" />
                            <span className="text-sm font-medium">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Default Language */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Default Language</h3>
                      <select
                        value={defaultLanguage}
                        onChange={(e) => setDefaultLanguage(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
                      >
                        {languages.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Analysis Depth */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Analysis Depth</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'quick', label: 'Quick', description: 'Fast analysis with basic insights' },
                          { value: 'standard', label: 'Standard', description: 'Balanced analysis with good detail' },
                          { value: 'detailed', label: 'Detailed', description: 'Comprehensive analysis with all insights' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setAnalysisDepth(option.value)}
                            className={`flex flex-col gap-2 p-4 rounded-lg border text-left transition-all ${
                              analysisDepth === option.value
                                ? 'border-primary-dark bg-primary-dark/20'
                                : 'border-gray-200/20 dark:border-gray-700/20 hover:border-primary-dark/50'
                            }`}
                          >
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{option.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tab content would go here */}
            {activeTab !== 'profile' && activeTab !== 'preferences' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  {tabs.find(tab => tab.id === activeTab)?.icon && 
                    React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, { className: "w-8 h-8 text-gray-400" })
                  }
                </div>
                <h3 className="text-lg font-medium mb-2">{tabs.find(tab => tab.id === activeTab)?.label}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings coming soon...
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {(activeTab === 'profile' || activeTab === 'preferences') && (
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200/20 dark:border-gray-700/20 mt-8">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/80 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;