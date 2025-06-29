import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
}

export const supabase = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers with better error handling
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    try {
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      return await supabase.auth.signInWithPassword({
        email,
        password
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      return await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Send magic link for sign in
  sendMagicLink: async (email: string) => {
    try {
      return await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (error) {
      console.error('Magic link error:', error);
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  updatePassword: async (password: string) => {
    try {
      return await supabase.auth.updateUser({
        password: password
      });
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  resendVerification: async (email: string) => {
    try {
      return await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers with improved error handling
export const db = {
  // Admin functions
  verifyAdminCredentials: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc('verify_admin_password', {
        admin_email: email,
        password_input: password
      });
      
      if (error) {
        console.error('Admin verification error:', error);
        return false;
      }
      
      return data === true;
    } catch (error) {
      console.error('Admin verification error:', error);
      return false;
    }
  },

  isAdminUser: async (email?: string) => {
    try {
      const { data, error } = await supabase.rpc('is_admin', {
        user_email: email || null
      });
      
      if (error) {
        console.error('Admin check error:', error);
        return false;
      }
      
      return data === true;
    } catch (error) {
      console.error('Admin check error:', error);
      return false;
    }
  },

  // Admin panel functions
  getAdminPanelUsers: async () => {
    try {
      const { data, error } = await supabase.rpc('get_all_users_for_admin_panel');
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Get admin panel users error:', error);
      throw error;
    }
  },

  deleteUserAdmin: async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('delete_user_admin', {
        user_id_to_delete: userId
      });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Delete user admin error:', error);
      throw error;
    }
  },

  // Profiles
  getProfile: async (userId: string) => {
    try {
      return await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  updateProfile: async (userId: string, updates: any) => {
    try {
      return await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Code Analyses
  getCodeAnalyses: async (userId: string) => {
    try {
      return await supabase
        .from('code_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    } catch (error) {
      console.error('Get code analyses error:', error);
      throw error;
    }
  },

  createCodeAnalysis: async (analysis: any) => {
    try {
      return await supabase
        .from('code_analyses')
        .insert(analysis);
    } catch (error) {
      console.error('Create code analysis error:', error);
      throw error;
    }
  },

  updateCodeAnalysis: async (id: string, updates: any) => {
    try {
      return await supabase
        .from('code_analyses')
        .update(updates)
        .eq('id', id);
    } catch (error) {
      console.error('Update code analysis error:', error);
      throw error;
    }
  },

  deleteCodeAnalysis: async (id: string) => {
    try {
      return await supabase
        .from('code_analyses')
        .delete()
        .eq('id', id);
    } catch (error) {
      console.error('Delete code analysis error:', error);
      throw error;
    }
  },

  // Problem Solutions
  getProblemSolutions: async (userId: string) => {
    try {
      return await supabase
        .from('problem_solutions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    } catch (error) {
      console.error('Get problem solutions error:', error);
      throw error;
    }
  },

  createProblemSolution: async (solution: any) => {
    try {
      return await supabase
        .from('problem_solutions')
        .insert(solution);
    } catch (error) {
      console.error('Create problem solution error:', error);
      throw error;
    }
  },

  // User Stats with better error handling
  getUserStats: async (userId: string) => {
    try {
      const result = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      // If no stats exist, create default ones
      if (!result.data && !result.error) {
        const defaultStats = {
          user_id: userId,
          total_analyses: 0,
          problems_solved: 0,
          current_streak: 0,
          longest_streak: 0,
          time_saved_minutes: 0,
          total_points: 0,
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: createError } = await supabase
          .from('user_stats')
          .insert(defaultStats);
        
        if (createError) {
          console.error('Error creating default stats:', createError);
          throw createError;
        }
        
        return { data: defaultStats, error: null };
      }
      
      return result;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  },

  updateUserStats: async (userId: string, updates: any) => {
    try {
      return await supabase
        .from('user_stats')
        .upsert({ user_id: userId, ...updates });
    } catch (error) {
      console.error('Update user stats error:', error);
      throw error;
    }
  },

  // Achievements
  getAchievements: async () => {
    try {
      return await supabase
        .from('achievements')
        .select('*')
        .order('points');
    } catch (error) {
      console.error('Get achievements error:', error);
      throw error;
    }
  },

  getUserAchievements: async (userId: string) => {
    try {
      return await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements (*)
        `)
        .eq('user_id', userId);
    } catch (error) {
      console.error('Get user achievements error:', error);
      throw error;
    }
  },

  unlockAchievement: async (userId: string, achievementId: string) => {
    try {
      return await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId
        });
    } catch (error) {
      console.error('Unlock achievement error:', error);
      throw error;
    }
  },

  // AI Conversations
  getConversations: async (userId: string) => {
    try {
      return await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  },

  createConversation: async (userId: string, title?: string) => {
    try {
      return await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          title: title || 'New Conversation'
        })
        .select()
        .single();
    } catch (error) {
      console.error('Create conversation error:', error);
      throw error;
    }
  },

  getMessages: async (conversationId: string) => {
    try {
      return await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at');
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  },

  addMessage: async (conversationId: string, role: 'user' | 'assistant', content: string, metadata?: any) => {
    try {
      return await supabase
        .from('ai_messages')
        .insert({
          conversation_id: conversationId,
          role,
          content,
          metadata: metadata || {}
        });
    } catch (error) {
      console.error('Add message error:', error);
      throw error;
    }
  }
};