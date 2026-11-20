/**
 * Database Type Definitions
 * Represents the PostgreSQL schema in Supabase for OBHASH (Phases 1, 2 & 3).
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          full_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          target_age_group: string | null;
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
          slug: string;
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
      assessment_modules: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          capability_key: string;
          estimated_minutes: number;
          version: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          capability_key: string;
          estimated_minutes?: number;
          version?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string;
          capability_key?: string;
          estimated_minutes?: number;
          version?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      assessment_dimensions: {
        Row: {
          id: string;
          module_id: string;
          slug: string;
          name: string;
          description: string;
          rubric_version: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          slug: string;
          name: string;
          description: string;
          rubric_version?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          slug?: string;
          name?: string;
          description?: string;
          rubric_version?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      assessment_items: {
        Row: {
          id: string;
          module_id: string;
          dimension_id: string | null;
          activity_type: string;
          title: string;
          scenario: string;
          instructions: string;
          response_type: string;
          options: Json | null;
          rubric: Json;
          order_index: number;
          version: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          dimension_id?: string | null;
          activity_type: string;
          title: string;
          scenario: string;
          instructions: string;
          response_type: string;
          options?: Json | null;
          rubric: Json;
          order_index?: number;
          version?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          dimension_id?: string | null;
          activity_type?: string;
          title?: string;
          scenario?: string;
          instructions?: string;
          response_type?: string;
          options?: Json | null;
          rubric?: Json;
          order_index?: number;
          version?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      assessment_attempts: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          assessment_version: string;
          status: string;
          evaluation_status: string;
          started_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          assessment_version?: string;
          status?: string;
          evaluation_status?: string;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          assessment_version?: string;
          status?: string;
          evaluation_status?: string;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      assessment_responses: {
        Row: {
          id: string;
          attempt_id: string;
          item_id: string;
          response_data: Json;
          submitted_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          item_id: string;
          response_data: Json;
          submitted_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          item_id?: string;
          response_data?: Json;
          submitted_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      assessment_evaluations: {
        Row: {
          id: string;
          attempt_id: string;
          response_id: string;
          dimension_id: string | null;
          score: number;
          performance_level: string;
          evidence: string;
          strengths: string[];
          development_opportunities: string[];
          confidence: number;
          evaluator_type: string;
          evaluator_version: string;
          rubric_version: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          response_id: string;
          dimension_id?: string | null;
          score: number;
          performance_level: string;
          evidence: string;
          strengths?: string[];
          development_opportunities?: string[];
          confidence?: number;
          evaluator_type?: string;
          evaluator_version?: string;
          rubric_version?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          response_id?: string;
          dimension_id?: string | null;
          score?: number;
          performance_level?: string;
          evidence?: string;
          strengths?: string[];
          development_opportunities?: string[];
          confidence?: number;
          evaluator_type?: string;
          evaluator_version?: string;
          rubric_version?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      capability_profiles: {
        Row: {
          id: string;
          user_id: string;
          attempt_id: string | null;
          capability_key: string;
          overall_score: number;
          performance_level: string;
          dimension_results: Json;
          evidence_summary: string[];
          strengths_summary: string[];
          opportunities_summary: string[];
          baseline_version: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          attempt_id?: string | null;
          capability_key: string;
          overall_score: number;
          performance_level: string;
          dimension_results: Json;
          evidence_summary?: string[];
          strengths_summary?: string[];
          opportunities_summary?: string[];
          baseline_version?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          attempt_id?: string | null;
          capability_key?: string;
          overall_score?: number;
          performance_level?: string;
          dimension_results?: Json;
          evidence_summary?: string[];
          strengths_summary?: string[];
          opportunities_summary?: string[];
          baseline_version?: string;
          created_at?: string;
          updated_at?: string;
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
