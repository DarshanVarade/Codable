import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Palette, 
  Save,
  X,
  Sun,
  Moon,
  Monitor,
  Camera
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, setTheme } = useTheme();
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const [defaultLanguage, setDefaultLanguage] = useState('javascript');
  const [analysisDepth, setAnalysisDepth] = useState('standard');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    website: '',
    location: '',
    bio: ''
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        website: profile.website || '',
        location: profile.location || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
  ];

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'go', label: 'Go' },
  ];

  const avatarOptions = [
    { id: 'none', label: 'None', emoji: '👤' },
    { id: 'developer', label: 'Developer', emoji: '👨‍💻' },
    { id: 'scientist', label: 'Scientist', emoji: '👨‍🔬' },
    { id: 'artist', label: 'Artist', emoji: '👨‍🎨' },
    { id: 'student', label: 'Student', emoji: '👨‍🎓' },
    { id: 'robot', label: 'Robot', emoji: '🤖' },
    { id: 'ninja', label: 'Ninja', emoji: '🥷' },
    { id: 'wizard', label: 'Wizard', emoji: '🧙‍♂️' },
  ];

  const handleSave = async () => {
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast.error('Failed to update profile');
      } else {
        toast.success('Changes applied successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      username: profile?.username || '',
      website: profile?.website || '',
      location: profile?.location || '',
      bio: profile?.bio || ''
    });
    toast('Changes cancelled');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarSelect = async (avatarId: string) => {
    try {
      const avatarUrl = avatarId === 'none' ? null : avatarOptions.find(opt => opt.id === avatarId)?.emoji;
      await updateProfile({ avatar_url: avatarUrl });
      setShowAvatarModal(false);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      toast.error('Failed to update avatar');
    }
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
                      {profile?.avatar_url || (profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U')}
                    </div>
                    <button 
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-dark text-white rounded-full flex items-center justify-center hover:bg-primary-dark/80 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowAvatarModal(true)}
                      className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/80 transition-colors"
                    >
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg opacity-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="@username"
                      className="w-full px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                      className="w-full px-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
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

            {/* Action Buttons */}
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
          </motion.div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAvatarModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20 p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Choose Avatar</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAvatarSelect(option.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200/20 dark:border-gray-700/20 hover:border-primary-dark/50 hover:bg-primary-dark/10 transition-all"
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Settings;