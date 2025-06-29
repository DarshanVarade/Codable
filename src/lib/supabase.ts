import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  // Send magic link for sign in
  sendMagicLink: async (email: string) => {
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
  },

  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`
    });
  },

  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({
      password: password
    });
  },

  resendVerification: async (email: string) => {
    return await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Admin functions
  verifyAdminCredentials: async (email: string, password: string) => {
    const { data, error } = await supabase.rpc('verify_admin_password', {
      admin_email: email,
      password_input: password
    });
    
    if (error) {
      console.error('Admin verification error:', error);
      return false;
    }
    
    return data === true;
  },

  isAdminUser: async (email?: string) => {
    const { data, error } = await supabase.rpc('is_admin', {
      user_email: email || null
    });
    
    if (error) {
      console.error('Admin check error:', error);
      return false;
    }
    
    return data === true;
  },

  // Admin panel functions
  getAdminPanelUsers: async () => {
    const { data, error } = await supabase.rpc('get_all_users_for_admin_panel');
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  },

  deleteUserAdmin: async (userId: string) => {
    const { data, error } = await supabase.rpc('delete_user_admin', {
      user_id_to_delete: userId
    });
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  },

  // Profiles
  getProfile: async (userId: string) => {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  },

  updateProfile: async (userId: string, updates: any) => {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
  },

  // Code Analyses
  getCodeAnalyses: async (userId: string) => {
    return await supabase
      .from('code_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  createCodeAnalysis: async (analysis: any) => {
    return await supabase
      .from('code_analyses')
      .insert(analysis);
  },

  updateCodeAnalysis: async (id: string, updates: any) => {
    return await supabase
      .from('code_analyses')
      .update(updates)
      .eq('id', id);
  },

  deleteCodeAnalysis: async (id: string) => {
    return await supabase
      .from('code_analyses')
      .delete()
      .eq('id', id);
  },

  // Problem Solutions
  getProblemSolutions: async (userId: string) => {
    return await supabase
      .from('problem_solutions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  createProblemSolution: async (solution: any) => {
    return await supabase
      .from('problem_solutions')
      .insert(solution);
  },

  // User Stats
  getUserStats: async (userId: string) => {
    return await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
  },

  updateUserStats: async (userId: string, updates: any) => {
    return await supabase
      .from('user_stats')
      .upsert({ user_id: userId, ...updates });
  },

  // Achievements
  getAchievements: async () => {
    return await supabase
      .from('achievements')
      .select('*')
      .order('points');
  },

  getUserAchievements: async (userId: string) => {
    return await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', userId);
  },

  unlockAchievement: async (userId: string, achievementId: string) => {
    return await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId
      });
  },

  // AI Conversations
  getConversations: async (userId: string) => {
    return await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
  },

  createConversation: async (userId: string, title?: string) => {
    return await supabase
      .from('ai_conversations')
      .insert({
        user_id: userId,
        title: title || 'New Conversation'
      })
      .select()
      .single();
  },

  getMessages: async (conversationId: string) => {
    return await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at');
  },

  addMessage: async (conversationId: string, role: 'user' | 'assistant', content: string, metadata?: any) => {
    return await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        metadata: metadata || {}
      });
  }
};