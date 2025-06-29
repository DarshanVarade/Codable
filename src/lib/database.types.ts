export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          location: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          location?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          location?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      code_analyses: {
        Row: {
          id: string
          user_id: string
          title: string
          code_content: string
          language: string
          analysis_result: Json
          score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          code_content: string
          language?: string
          analysis_result?: Json
          score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          code_content?: string
          language?: string
          analysis_result?: Json
          score?: number
          created_at?: string
          updated_at?: string
        }
      }
      problem_solutions: {
        Row: {
          id: string
          user_id: string
          problem_statement: string
          language: string
          solution_code: string | null
          explanation: string | null
          execution_result: Json
          optimization_suggestions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          problem_statement: string
          language?: string
          solution_code?: string | null
          explanation?: string | null
          execution_result?: Json
          optimization_suggestions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          problem_statement?: string
          language?: string
          solution_code?: string | null
          explanation?: string | null
          execution_result?: Json
          optimization_suggestions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          criteria: Json
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon?: string
          criteria?: Json
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          criteria?: Json
          points?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          progress: Json
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          progress?: Json
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          progress?: Json
        }
      }
      user_stats: {
        Row: {
          user_id: string
          total_analyses: number
          problems_solved: number
          current_streak: number
          longest_streak: number
          time_saved_minutes: number
          total_time_spent_minutes: number
          total_points: number
          last_activity: string
          updated_at: string
        }
        Insert: {
          user_id: string
          total_analyses?: number
          problems_solved?: number
          current_streak?: number
          longest_streak?: number
          time_saved_minutes?: number
          total_time_spent_minutes?: number
          total_points?: number
          last_activity?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_analyses?: number
          problems_solved?: number
          current_streak?: number
          longest_streak?: number
          time_saved_minutes?: number
          total_time_spent_minutes?: number
          total_points?: number
          last_activity?: string
          updated_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      ai_messages: {
        Row: {
          id: string
          conversation_id: string
          role: string
          content: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: string
          content: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: string
          content?: string
          metadata?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}