/**
 * Database Type Definitions
 * Represents the PostgreSQL schema in Supabase for OBHASH (Phase 1 & Phase 2).
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // references auth.users
          email: string;
          display_name: string | null;
          full_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          target_age_group: string | null; // e.g. "18-30"
          interests: string[];
          growth_intentions: string[];
          onboarding_completed: boolean;
          preferred_language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          target_age_group?: string | null;
          interests?: string[];
          growth_intentions?: string[];
          onboarding_completed?: boolean;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          target_age_group?: string | null;
          interests?: string[];
          growth_intentions?: string[];
          onboarding_completed?: boolean;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      capabilities: {
        Row: {
          id: string;
          slug: string; // critical-thinking, creative-problem-solving, curiosity
          name: string;
          description: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          resource: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          resource?: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
