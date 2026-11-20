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
      growth_journeys: {
        Row: {
          id: string;
          user_id: string;
          assessment_attempt_id: string | null;
          title: string;
          description: string;
          status: string;
          target_duration: string;
          weekly_commitment_hours: string;
          capability_keys: string[];
          primary_priorities: string[];
          personalization_snapshot: Json;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          assessment_attempt_id?: string | null;
          title: string;
          description: string;
          status?: string;
          target_duration?: string;
          weekly_commitment_hours?: string;
          capability_keys?: string[];
          primary_priorities?: string[];
          personalization_snapshot?: Json;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          assessment_attempt_id?: string | null;
          title?: string;
          description?: string;
          status?: string;
          target_duration?: string;
          weekly_commitment_hours?: string;
          capability_keys?: string[];
          primary_priorities?: string[];
          personalization_snapshot?: Json;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      journey_capability_focus_areas: {
        Row: {
          id: string;
          journey_id: string;
          capability_key: string;
          capability_name: string;
          rationale: string;
          selected_dimensions: string[];
          intended_outcomes: string[];
          priority: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          journey_id: string;
          capability_key: string;
          capability_name: string;
          rationale: string;
          selected_dimensions?: string[];
          intended_outcomes?: string[];
          priority?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          journey_id?: string;
          capability_key?: string;
          capability_name?: string;
          rationale?: string;
          selected_dimensions?: string[];
          intended_outcomes?: string[];
          priority?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      development_goals: {
        Row: {
          id: string;
          journey_id: string;
          focus_area_id: string | null;
          capability_key: string;
          dimension_slug: string | null;
          title: string;
          description: string;
          reason_for_recommendation: string;
          expected_outcome: string;
          priority: string;
          target_date: string | null;
          status: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          journey_id: string;
          focus_area_id?: string | null;
          capability_key: string;
          dimension_slug?: string | null;
          title: string;
          description: string;
          reason_for_recommendation: string;
          expected_outcome: string;
          priority?: string;
          target_date?: string | null;
          status?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          journey_id?: string;
          focus_area_id?: string | null;
          capability_key?: string;
          dimension_slug?: string | null;
          title?: string;
          description?: string;
          reason_for_recommendation?: string;
          expected_outcome?: string;
          priority?: string;
          target_date?: string | null;
          status?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      journey_milestones: {
        Row: {
          id: string;
          journey_id: string;
          goal_id: string;
          title: string;
          description: string;
          expected_outcome: string;
          suggested_period: string;
          status: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          journey_id: string;
          goal_id: string;
          title: string;
          description: string;
          expected_outcome: string;
          suggested_period?: string;
          status?: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          journey_id?: string;
          goal_id?: string;
          title?: string;
          description?: string;
          expected_outcome?: string;
          suggested_period?: string;
          status?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      planned_activities: {
        Row: {
          id: string;
          journey_id: string;
          goal_id: string;
          milestone_id: string | null;
          capability_key: string;
          title: string;
          description: string;
          purpose: string;
          estimated_minutes: number;
          suggested_order: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          journey_id: string;
          goal_id: string;
          milestone_id?: string | null;
          capability_key: string;
          title: string;
          description: string;
          purpose: string;
          estimated_minutes?: number;
          suggested_order?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          journey_id?: string;
          goal_id?: string;
          milestone_id?: string | null;
          capability_key?: string;
          title?: string;
          description?: string;
          purpose?: string;
          estimated_minutes?: number;
          suggested_order?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      journey_generation_records: {
        Row: {
          id: string;
          journey_id: string | null;
          user_id: string;
          provider: string;
          model_name: string;
          generation_type: string;
          prompt_tokens: number | null;
          completion_tokens: number | null;
          input_snapshot: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          journey_id?: string | null;
          user_id: string;
          provider: string;
          model_name: string;
          generation_type: string;
          prompt_tokens?: number | null;
          completion_tokens?: number | null;
          input_snapshot?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          journey_id?: string | null;
          user_id?: string;
          provider?: string;
          model_name?: string;
          generation_type?: string;
          prompt_tokens?: number | null;
          completion_tokens?: number | null;
          input_snapshot?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      coaching_sessions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          capability_key: string;
          journey_id: string | null;
          goal_id: string | null;
          status: string;
          current_hint_level: number;
          instruction_version: string;
          created_at: string;
          updated_at: string;
          last_message_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          capability_key: string;
          journey_id?: string | null;
          goal_id?: string | null;
          status?: string;
          current_hint_level?: number;
          instruction_version?: string;
          created_at?: string;
          updated_at?: string;
          last_message_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          capability_key?: string;
          journey_id?: string | null;
          goal_id?: string | null;
          status?: string;
          current_hint_level?: number;
          instruction_version?: string;
          created_at?: string;
          updated_at?: string;
          last_message_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      coaching_messages: {
        Row: {
          id: string;
          session_id: string;
          role: string;
          content: string;
          response_type: string;
          hint_level: number | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: string;
          content: string;
          response_type?: string;
          hint_level?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: string;
          content?: string;
          response_type?: string;
          hint_level?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      coaching_session_summaries: {
        Row: {
          id: string;
          session_id: string;
          explored_topics: string[];
          key_questions_considered: string[];
          perspectives_developed: string[];
          reasoning_demonstrated: string;
          growth_frontiers: string[];
          recommended_next_steps: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          explored_topics?: string[];
          key_questions_considered?: string[];
          perspectives_developed?: string[];
          reasoning_demonstrated: string;
          growth_frontiers?: string[];
          recommended_next_steps?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          explored_topics?: string[];
          key_questions_considered?: string[];
          perspectives_developed?: string[];
          reasoning_demonstrated?: string;
          growth_frontiers?: string[];
          recommended_next_steps?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      coaching_session_context_snapshots: {
        Row: {
          id: string;
          session_id: string;
          assessment_summary: Json;
          journey_goal_summary: Json;
          user_interests: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          assessment_summary?: Json;
          journey_goal_summary?: Json;
          user_interests?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          assessment_summary?: Json;
          journey_goal_summary?: Json;
          user_interests?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          detailed_instructions: string;
          capability_category: string;
          relevant_dimensions: string[];
          difficulty: string;
          estimated_completion_time: string;
          learning_objective: string;
          scenario: string;
          required_deliverables: Json;
          suggested_thinking_steps: string[];
          optional_resources: Json;
          reflection_prompts: string[];
          version: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          detailed_instructions: string;
          capability_category: string;
          relevant_dimensions?: string[];
          difficulty: string;
          estimated_completion_time: string;
          learning_objective: string;
          scenario: string;
          required_deliverables?: Json;
          suggested_thinking_steps?: string[];
          optional_resources?: Json;
          reflection_prompts?: string[];
          version?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string;
          detailed_instructions?: string;
          capability_category?: string;
          relevant_dimensions?: string[];
          difficulty?: string;
          estimated_completion_time?: string;
          learning_objective?: string;
          scenario?: string;
          required_deliverables?: Json;
          suggested_thinking_steps?: string[];
          optional_resources?: Json;
          reflection_prompts?: string[];
          version?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      challenge_versions: {
        Row: {
          id: string;
          challenge_id: string;
          version: number;
          snapshot: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          version: number;
          snapshot: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          version?: number;
          snapshot?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      challenge_attempts: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          challenge_version: number;
          status: string;
          journey_activity_id: string | null;
          started_at: string;
          submitted_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          challenge_id: string;
          challenge_version?: number;
          status?: string;
          journey_activity_id?: string | null;
          started_at?: string;
          submitted_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          challenge_id?: string;
          challenge_version?: number;
          status?: string;
          journey_activity_id?: string | null;
          started_at?: string;
          submitted_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      challenge_drafts: {
        Row: {
          id: string;
          attempt_id: string;
          user_id: string;
          notes: string;
          deliverables: Json;
          last_saved_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          user_id: string;
          notes?: string;
          deliverables?: Json;
          last_saved_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          user_id?: string;
          notes?: string;
          deliverables?: Json;
          last_saved_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      challenge_submissions: {
        Row: {
          id: string;
          attempt_id: string;
          user_id: string;
          challenge_id: string;
          challenge_version: number;
          notes_snapshot: string;
          deliverables_snapshot: Json;
          submission_number: number;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          user_id: string;
          challenge_id: string;
          challenge_version?: number;
          notes_snapshot?: string;
          deliverables_snapshot?: Json;
          submission_number?: number;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          user_id?: string;
          challenge_id?: string;
          challenge_version?: number;
          notes_snapshot?: string;
          deliverables_snapshot?: Json;
          submission_number?: number;
          submitted_at?: string;
        };
        Relationships: [];
      };
      challenge_evaluations: {
        Row: {
          id: string;
          submission_id: string;
          attempt_id: string;
          user_id: string;
          evaluator_type: string;
          evaluator_version: string;
          strengths: Json;
          growth_opportunities: Json;
          evidence_citations: Json;
          alternative_perspectives: Json;
          recommended_next_steps: Json;
          dimension_evaluations: Json;
          confidence_score: number;
          evidence_sufficiency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          submission_id: string;
          attempt_id: string;
          user_id: string;
          evaluator_type?: string;
          evaluator_version?: string;
          strengths?: Json;
          growth_opportunities?: Json;
          evidence_citations?: Json;
          alternative_perspectives?: Json;
          recommended_next_steps?: Json;
          dimension_evaluations?: Json;
          confidence_score?: number;
          evidence_sufficiency?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          submission_id?: string;
          attempt_id?: string;
          user_id?: string;
          evaluator_type?: string;
          evaluator_version?: string;
          strengths?: Json;
          growth_opportunities?: Json;
          evidence_citations?: Json;
          alternative_perspectives?: Json;
          recommended_next_steps?: Json;
          dimension_evaluations?: Json;
          confidence_score?: number;
          evidence_sufficiency?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      challenge_reflections: {
        Row: {
          id: string;
          attempt_id: string;
          user_id: string;
          challenge_id: string;
          responses: Json;
          is_submitted: boolean;
          submitted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          user_id: string;
          challenge_id: string;
          responses?: Json;
          is_submitted?: boolean;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          user_id?: string;
          challenge_id?: string;
          responses?: Json;
          is_submitted?: boolean;
          submitted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      challenge_bookmarks: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          challenge_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          challenge_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      challenge_ai_assistance_records: {
        Row: {
          id: string;
          attempt_id: string;
          user_id: string;
          coaching_session_id: string | null;
          queries_count: number;
          hint_levels_used: number[];
          action_types_used: string[];
          assistance_summary: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          user_id: string;
          coaching_session_id?: string | null;
          queries_count?: number;
          hint_levels_used?: number[];
          action_types_used?: string[];
          assistance_summary?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          user_id?: string;
          coaching_session_id?: string | null;
          queries_count?: number;
          hint_levels_used?: number[];
          action_types_used?: string[];
          assistance_summary?: string;
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
