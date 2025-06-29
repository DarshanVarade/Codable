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
  Camera,
  CheckCircle,
  Brain,
  Zap
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
  const [aiProvider, setAiProvider] = useState('gemini');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    website: '',
    location: '',
    bio: ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      const newFormData = {
        full_name: profile.full_name || '',
        username: profile.username || '',
        website: profile.website || '',
        location: profile.location || '',
        bio: profile.bio || ''
      };
      setFormData(newFormData);
      setHasChanges(false);
    }
  }, [profile]);

  // Load AI provider preference from localStorage
  useEffect(() => {
    const savedProvider = localStorage.getItem('aiProvider') || 'gemini';
    setAiProvider(savedProvider);
  }, []);

  // Check for changes whenever form data updates
  useEffect(() => {
    if (profile) {
      const hasProfileChanges = 
        formData.full_name !== (profile.full_name || '') ||
        formData.username !== (profile.username || '') ||
        formData.website !== (profile.website || '') ||
        formData.location !== (profile.location || '') ||
        formData.bio !== (profile.bio || '');
      
      setHasChanges(hasProfileChanges);
    }
  }, [formData, profile]);

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
    if (!hasChanges) {
      toast('No changes to save', {
        icon: '💡',
        duration: 2000,
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast.error('Failed to update profile. Please try again.');
        console.error('Profile update error:', error);
      } else {
        toast.success('Profile updated successfully! 🎉', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#FFFFFF',
          },
          iconTheme: {
            primary: '#FFFFFF',
            secondary: '#10B981',
          },
        });
        setHasChanges(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!hasChanges) {
      toast('No changes to cancel', {
        icon: '💡',
        duration: 2000,
      });
      return;
    }

    setFormData({
      full_name: profile?.full_name || '',
      username: profile?.username || '',
      website: profile?.website || '',
      location: profile?.location || '',
      bio: profile?.bio || ''
    });
    setHasChanges(false);
    toast('Changes cancelled', {
      icon: '↩️',
      duration: 2000,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarSelect = async (avatarId: string) => {
    try {
      const avatarUrl = avatarId === 'none' ? null : avatarOptions.find(opt => opt.id === avatarId)?.emoji;
      const { error } = await updateProfile({ avatar_url: avatarUrl });
      
      if (error) {
        toast.error('Failed to update avatar. Please try again.');
        console.error('Avatar update error:', error);
      } else {
        setShowAvatarModal(false);
        toast.success('Avatar updated successfully! ✨', {
          duration: 3000,
          style: {
            background: '#8B5CF6',
            color: '#FFFFFF',
          },
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred while updating avatar.');
      console.error('Avatar update error:', error);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    const previousTheme = theme;
    setTheme(newTheme);
    
    // Show success message with theme-specific styling
    const themeMessages = {
      light: { message: 'Switched to Light theme ☀️', bg: '#F59E0B' },
      dark: { message: 'Switched to Dark theme 🌙', bg: '#6366F1' },
      system: { message: 'Using System theme 💻', bg: '#10B981' }
    };
    
    const themeInfo = themeMessages[newTheme];
    
    toast.success(themeInfo.message, {
      duration: 2500,
      style: {
        background: themeInfo.bg,
        color: '#FFFFFF',
      },
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    const previousLanguage = defaultLanguage;
    setDefaultLanguage(newLanguage);
    
    if (previousLanguage !== newLanguage) {
      toast.success(`Default language set to ${languages.find(l => l.value === newLanguage)?.label} 🚀`, {
        duration: 2500,
        style: {
          background: '#3B82F6',
          color: '#FFFFFF',
        },
      });
    }
  };

  const handleAnalysisDepthChange = (newDepth: string) => {
    const previousDepth = analysisDepth;
    setAnalysisDepth(newDepth);
    
    if (previousDepth !== newDepth) {
      const depthMessages = {
        quick: 'Analysis depth set to Quick ⚡',
        standard: 'Analysis depth set to Standard ⚖️',
        detailed: 'Analysis depth set to Detailed 🔍'
      };
      
      toast.success(depthMessages[newDepth as keyof typeof depthMessages], {
        duration: 2500,
        style: {
          background: '#059669',
          color: '#FFFFFF',
        },
      });
    }
  };

  const handleAiProviderChange = (newProvider: 'gemini' | 'copilotkit') => {
    const previousProvider = aiProvider;
    setAiProvider(newProvider);
    localStorage.setItem('aiProvider', newProvider);
    
    if (previousProvider !== newProvider) {
      const providerMessages = {
        gemini: { message: 'Switched to Gemini 2.0 Flash 🧠', bg: '#22D3EE' },
        copilotkit: { message: 'Switched to CopilotKit 🤖', bg: '#8B5CF6' }
      };
      
      const providerInfo = providerMessages[newProvider];
      
      toast.success(providerInfo.message, {
        duration: 2500,
        style: {
          background: providerInfo.bg,
          color: '#FFFFFF',
        },
      });
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
                  <div className="space-y-6">
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
                            onClick={() => handleThemeChange(option.value as any)}
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

                    {/* AI Provider Selection */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">AI Assistant Provider</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { 
                            value: 'gemini', 
                            label: 'Gemini 2.0 Flash', 
                            icon: Brain,
                            description: 'Google\'s advanced AI model',
                            color: 'from-blue-500 to-cyan-500'
                          },
                          { 
                            value: 'copilotkit', 
                            label: 'CopilotKit', 
                            icon: Zap,
                            description: 'Enhanced code assistance',
                            color: 'from-purple-500 to-pink-500'
                          },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleAiProviderChange(option.value as any)}
                            className={`flex flex-col gap-3 p-4 rounded-lg border text-left transition-all ${
                              aiProvider === option.value
                                ? 'border-primary-dark bg-primary-dark/20'
                                : 'border-gray-200/20 dark:border-gray-700/20 hover:border-primary-dark/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 bg-gradient-to-br ${option.color} rounded-lg flex items-center justify-center`}>
                                <option.icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <span className="font-medium">{option.label}</span>
                                {aiProvider === option.value && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-green-600 dark:text-green-400">Active</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{option.description}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Current:</strong> {aiProvider === 'gemini' ? 'Gemini 2.0 Flash' : 'CopilotKit'} - 
                          This setting affects the AI assistant in the Codable AI chat.
                        </p>
                      </div>
                    </div>

                    {/* Default Language */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Default Language</h3>
                      <select
                        value={defaultLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
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
                            onClick={() => handleAnalysisDepthChange(option.value)}
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

            {/* Action Buttons - Only show for profile tab */}
            {activeTab === 'profile' && (
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200/20 dark:border-gray-700/20 mt-8">
                <button
                  onClick={handleCancel}
                  disabled={!hasChanges}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  className="flex items-center gap-2 px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
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