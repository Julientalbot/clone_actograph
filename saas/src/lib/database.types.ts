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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          organization_id: string | null
          role: 'admin' | 'manager' | 'analyst' | 'viewer'
          created_at: string
          updated_at: string
          last_seen_at: string | null
          is_active: boolean
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          organization_id?: string | null
          role?: 'admin' | 'manager' | 'analyst' | 'viewer'
          created_at?: string
          updated_at?: string
          last_seen_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          organization_id?: string | null
          role?: 'admin' | 'manager' | 'analyst' | 'viewer'
          created_at?: string
          updated_at?: string
          last_seen_at?: string | null
          is_active?: boolean
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          subscription_status: 'free' | 'pro' | 'enterprise'
          subscription_id: string | null
          max_users: number
          max_sessions: number | null
          created_at: string
          updated_at: string
          settings: Json
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          subscription_status?: 'free' | 'pro' | 'enterprise'
          subscription_id?: string | null
          max_users?: number
          max_sessions?: number | null
          created_at?: string
          updated_at?: string
          settings?: Json
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          subscription_status?: 'free' | 'pro' | 'enterprise'
          subscription_id?: string | null
          max_users?: number
          max_sessions?: number | null
          created_at?: string
          updated_at?: string
          settings?: Json
        }
      }
      sessions: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          organization_id: string
          project_id: string | null
          status: 'draft' | 'active' | 'completed' | 'archived'
          video_url: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          organization_id: string
          project_id?: string | null
          status?: 'draft' | 'active' | 'completed' | 'archived'
          video_url?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          organization_id?: string
          project_id?: string | null
          status?: 'draft' | 'active' | 'completed' | 'archived'
          video_url?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          metadata?: Json
        }
      }
      activity_events: {
        Row: {
          id: string
          session_id: string
          activity_id: string
          activity_name: string
          timestamp: number
          duration: number | null
          notes: string | null
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          session_id: string
          activity_id: string
          activity_name: string
          timestamp: number
          duration?: number | null
          notes?: string | null
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          session_id?: string
          activity_id?: string
          activity_name?: string
          timestamp?: number
          duration?: number | null
          notes?: string | null
          created_at?: string
          metadata?: Json
        }
      }
      activities: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          is_default: boolean
          organization_id: string | null
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color: string
          is_default?: boolean
          organization_id?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          is_default?: boolean
          organization_id?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          organization_id: string
          created_by: string
          status: 'active' | 'completed' | 'archived'
          created_at: string
          updated_at: string
          settings: Json
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          organization_id: string
          created_by: string
          status?: 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
          settings?: Json
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          organization_id?: string
          created_by?: string
          status?: 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
          settings?: Json
        }
      }
      subscriptions: {
        Row: {
          id: string
          organization_id: string
          stripe_subscription_id: string
          status: string
          price_id: string
          quantity: number
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          stripe_subscription_id: string
          status: string
          price_id: string
          quantity?: number
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          stripe_subscription_id?: string
          status?: string
          price_id?: string
          quantity?: number
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
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