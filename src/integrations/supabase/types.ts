export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string | null
          metadata: Json
          read_at: string | null
          severity: Database["public"]["Enums"]["notification_severity"]
          source: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          metadata?: Json
          read_at?: string | null
          severity?: Database["public"]["Enums"]["notification_severity"]
          source?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          metadata?: Json
          read_at?: string | null
          severity?: Database["public"]["Enums"]["notification_severity"]
          source?: string
          title?: string
        }
        Relationships: []
      }
      adp_login_otp: {
        Row: {
          attempts: number
          code_hash: string
          consumed: boolean
          created_at: string
          expires_at: string
          id: string
          phone: string
        }
        Insert: {
          attempts?: number
          code_hash: string
          consumed?: boolean
          created_at?: string
          expires_at: string
          id?: string
          phone: string
        }
        Update: {
          attempts?: number
          code_hash?: string
          consumed?: boolean
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
        }
        Relationships: []
      }
      adp_profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      adp_security_events: {
        Row: {
          actor_email: string | null
          actor_id: string | null
          category: string
          created_at: string
          description: string | null
          detail: Json
          event_type: string
          id: string
          ip_address: string | null
          status: string
          user_agent: string | null
        }
        Insert: {
          actor_email?: string | null
          actor_id?: string | null
          category: string
          created_at?: string
          description?: string | null
          detail?: Json
          event_type: string
          id?: string
          ip_address?: string | null
          status?: string
          user_agent?: string | null
        }
        Update: {
          actor_email?: string | null
          actor_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          detail?: Json
          event_type?: string
          id?: string
          ip_address?: string | null
          status?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      adp_settings: {
        Row: {
          created_at: string
          description: string | null
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      adp_user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      ai_settings: {
        Row: {
          a2a_endpoint: string | null
          a2a_model: string | null
          ai_services_endpoint: string | null
          api_version: string | null
          auth_agent: string | null
          azure_openai_endpoint: string | null
          connection_status: string | null
          copilot_agent: string | null
          core_agent: string | null
          core_model: string | null
          default_agent: string | null
          default_deployment: string | null
          deployment: string | null
          embedding_model: string | null
          enabled: boolean
          endpoint: string | null
          environment: string | null
          finance_agent: string | null
          finance_model: string | null
          foundry_endpoint: string | null
          foundry_secret_name: string | null
          gpt_model: string | null
          id: number
          last_connection_check: string | null
          last_connection_error: string | null
          maint_agent: string | null
          maint_model: string | null
          openai_secret_name: string | null
          payments_agent: string | null
          production_agent: string | null
          project_agent: string | null
          project_endpoint: string | null
          provider: string | null
          speech_secret_name: string | null
          speech_to_text_endpoint: string | null
          speech_to_text_model: string | null
          system_prompt: string | null
          text_to_speech_endpoint: string | null
          translator_endpoint: string | null
          translator_secret_name: string | null
          updated_at: string
          vision_agent: string | null
          vision_endpoint: string | null
          vision_region: string | null
          vision_resource: string | null
          vision_secret_name: string | null
          voice_live_model: string | null
        }
        Insert: {
          a2a_endpoint?: string | null
          a2a_model?: string | null
          ai_services_endpoint?: string | null
          api_version?: string | null
          auth_agent?: string | null
          azure_openai_endpoint?: string | null
          connection_status?: string | null
          copilot_agent?: string | null
          core_agent?: string | null
          core_model?: string | null
          default_agent?: string | null
          default_deployment?: string | null
          deployment?: string | null
          embedding_model?: string | null
          enabled?: boolean
          endpoint?: string | null
          environment?: string | null
          finance_agent?: string | null
          finance_model?: string | null
          foundry_endpoint?: string | null
          foundry_secret_name?: string | null
          gpt_model?: string | null
          id?: number
          last_connection_check?: string | null
          last_connection_error?: string | null
          maint_agent?: string | null
          maint_model?: string | null
          openai_secret_name?: string | null
          payments_agent?: string | null
          production_agent?: string | null
          project_agent?: string | null
          project_endpoint?: string | null
          provider?: string | null
          speech_secret_name?: string | null
          speech_to_text_endpoint?: string | null
          speech_to_text_model?: string | null
          system_prompt?: string | null
          text_to_speech_endpoint?: string | null
          translator_endpoint?: string | null
          translator_secret_name?: string | null
          updated_at?: string
          vision_agent?: string | null
          vision_endpoint?: string | null
          vision_region?: string | null
          vision_resource?: string | null
          vision_secret_name?: string | null
          voice_live_model?: string | null
        }
        Update: {
          a2a_endpoint?: string | null
          a2a_model?: string | null
          ai_services_endpoint?: string | null
          api_version?: string | null
          auth_agent?: string | null
          azure_openai_endpoint?: string | null
          connection_status?: string | null
          copilot_agent?: string | null
          core_agent?: string | null
          core_model?: string | null
          default_agent?: string | null
          default_deployment?: string | null
          deployment?: string | null
          embedding_model?: string | null
          enabled?: boolean
          endpoint?: string | null
          environment?: string | null
          finance_agent?: string | null
          finance_model?: string | null
          foundry_endpoint?: string | null
          foundry_secret_name?: string | null
          gpt_model?: string | null
          id?: number
          last_connection_check?: string | null
          last_connection_error?: string | null
          maint_agent?: string | null
          maint_model?: string | null
          openai_secret_name?: string | null
          payments_agent?: string | null
          production_agent?: string | null
          project_agent?: string | null
          project_endpoint?: string | null
          provider?: string | null
          speech_secret_name?: string | null
          speech_to_text_endpoint?: string | null
          speech_to_text_model?: string | null
          system_prompt?: string | null
          text_to_speech_endpoint?: string | null
          translator_endpoint?: string | null
          translator_secret_name?: string | null
          updated_at?: string
          vision_agent?: string | null
          vision_endpoint?: string | null
          vision_region?: string | null
          vision_resource?: string | null
          vision_secret_name?: string | null
          voice_live_model?: string | null
        }
        Relationships: []
      }
      app_secrets: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          entity_label: string | null
          entity_type: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          entity_label?: string | null
          entity_type?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          entity_label?: string | null
          entity_type?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      auth_providers: {
        Row: {
          client_id: string | null
          client_secret: string | null
          created_at: string
          enabled: boolean
          extra: Json
          id: string
          key: string
          label: string
          last_checked_at: string | null
          notes: string | null
          post_auth_redirect_url: string | null
          pre_auth_redirect_url: string | null
          scopes: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          client_secret?: string | null
          created_at?: string
          enabled?: boolean
          extra?: Json
          id?: string
          key: string
          label: string
          last_checked_at?: string | null
          notes?: string | null
          post_auth_redirect_url?: string | null
          pre_auth_redirect_url?: string | null
          scopes?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          client_secret?: string | null
          created_at?: string
          enabled?: boolean
          extra?: Json
          id?: string
          key?: string
          label?: string
          last_checked_at?: string | null
          notes?: string | null
          post_auth_redirect_url?: string | null
          pre_auth_redirect_url?: string | null
          scopes?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      branches: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      chatbot_knowledge: {
        Row: {
          category: string
          content: string
          created_at: string
          file_name: string | null
          id: string
          is_active: boolean
          source_type: string
          title: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          file_name?: string | null
          id?: string
          is_active?: boolean
          source_type?: string
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          file_name?: string | null
          id?: string
          is_active?: boolean
          source_type?: string
          title?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string
          plan_interest: string | null
          shop_name: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone: string
          plan_interest?: string | null
          shop_name?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          plan_interest?: string | null
          shop_name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      conversation_analytics: {
        Row: {
          action_items: Json | null
          conversation_id: string
          created_at: string | null
          entities: Json | null
          id: number
          sentiment_label: string | null
          sentiment_score: number | null
          summary: string | null
          topics: string[] | null
          updated_at: string | null
        }
        Insert: {
          action_items?: Json | null
          conversation_id: string
          created_at?: string | null
          entities?: Json | null
          id?: number
          sentiment_label?: string | null
          sentiment_score?: number | null
          summary?: string | null
          topics?: string[] | null
          updated_at?: string | null
        }
        Update: {
          action_items?: Json | null
          conversation_id?: string
          created_at?: string | null
          entities?: Json | null
          id?: number
          sentiment_label?: string | null
          sentiment_score?: number | null
          summary?: string | null
          topics?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          agent_id: string | null
          analysis: Json | null
          audio_url: string | null
          conversation_id: string
          created_at: string | null
          duration_seconds: number | null
          dynamic_variables: Json | null
          ended_at: string | null
          failure_metadata: Json | null
          failure_reason: string | null
          has_audio: boolean | null
          has_transcript: boolean | null
          id: number
          started_at: string | null
          status: string | null
          telephony_metadata: Json | null
          transcript: Json | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          analysis?: Json | null
          audio_url?: string | null
          conversation_id: string
          created_at?: string | null
          duration_seconds?: number | null
          dynamic_variables?: Json | null
          ended_at?: string | null
          failure_metadata?: Json | null
          failure_reason?: string | null
          has_audio?: boolean | null
          has_transcript?: boolean | null
          id?: number
          started_at?: string | null
          status?: string | null
          telephony_metadata?: Json | null
          transcript?: Json | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          analysis?: Json | null
          audio_url?: string | null
          conversation_id?: string
          created_at?: string | null
          duration_seconds?: number | null
          dynamic_variables?: Json | null
          ended_at?: string | null
          failure_metadata?: Json | null
          failure_reason?: string | null
          has_audio?: boolean | null
          has_transcript?: boolean | null
          id?: number
          started_at?: string | null
          status?: string | null
          telephony_metadata?: Json | null
          transcript?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cost_estimate_requests: {
        Row: {
          accuracy: string | null
          area: number | null
          category: string | null
          city: string | null
          client_name: string
          client_phone: string
          client_type: string | null
          condition: string | null
          contingency_pct: number | null
          created_at: string
          enabled_items: Json | null
          estimated_total: number | null
          finish_level: string | null
          floors: number | null
          id: string
          location: string | null
          management_pct: number | null
          notes: string | null
          per_meter: number | null
          project_name: string | null
          range_max: number | null
          range_min: number | null
          scope: string | null
          status: string | null
          subtype: string | null
        }
        Insert: {
          accuracy?: string | null
          area?: number | null
          category?: string | null
          city?: string | null
          client_name: string
          client_phone: string
          client_type?: string | null
          condition?: string | null
          contingency_pct?: number | null
          created_at?: string
          enabled_items?: Json | null
          estimated_total?: number | null
          finish_level?: string | null
          floors?: number | null
          id?: string
          location?: string | null
          management_pct?: number | null
          notes?: string | null
          per_meter?: number | null
          project_name?: string | null
          range_max?: number | null
          range_min?: number | null
          scope?: string | null
          status?: string | null
          subtype?: string | null
        }
        Update: {
          accuracy?: string | null
          area?: number | null
          category?: string | null
          city?: string | null
          client_name?: string
          client_phone?: string
          client_type?: string | null
          condition?: string | null
          contingency_pct?: number | null
          created_at?: string
          enabled_items?: Json | null
          estimated_total?: number | null
          finish_level?: string | null
          floors?: number | null
          id?: string
          location?: string | null
          management_pct?: number | null
          notes?: string | null
          per_meter?: number | null
          project_name?: string | null
          range_max?: number | null
          range_min?: number | null
          scope?: string | null
          status?: string | null
          subtype?: string | null
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          code: string | null
          created_at: string
          endpoint: string | null
          health: Database["public"]["Enums"]["health_status"]
          id: string
          kind: Database["public"]["Enums"]["datasource_kind"]
          location: string | null
          name: string
          notes: string | null
          region: string | null
          status: Database["public"]["Enums"]["lifecycle_status"]
          system_id: string | null
          technical_owner: string | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          endpoint?: string | null
          health?: Database["public"]["Enums"]["health_status"]
          id?: string
          kind?: Database["public"]["Enums"]["datasource_kind"]
          location?: string | null
          name: string
          notes?: string | null
          region?: string | null
          status?: Database["public"]["Enums"]["lifecycle_status"]
          system_id?: string | null
          technical_owner?: string | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          endpoint?: string | null
          health?: Database["public"]["Enums"]["health_status"]
          id?: string
          kind?: Database["public"]["Enums"]["datasource_kind"]
          location?: string | null
          name?: string
          notes?: string | null
          region?: string | null
          status?: Database["public"]["Enums"]["lifecycle_status"]
          system_id?: string | null
          technical_owner?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_sources_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      databases: {
        Row: {
          backup_enabled: boolean
          backup_required: boolean | null
          business_owner: string | null
          code: string | null
          created_at: string
          engine: string
          engine_version: string | null
          environment_id: string | null
          health: Database["public"]["Enums"]["health_status"]
          host: string | null
          id: string
          last_backup_at: string | null
          last_health_check_at: string | null
          name: string
          notes: string | null
          port: number | null
          restore_verified: boolean | null
          status: Database["public"]["Enums"]["lifecycle_status"]
          system_id: string | null
          target_version: string | null
          technical_owner: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          backup_enabled?: boolean
          backup_required?: boolean | null
          business_owner?: string | null
          code?: string | null
          created_at?: string
          engine?: string
          engine_version?: string | null
          environment_id?: string | null
          health?: Database["public"]["Enums"]["health_status"]
          host?: string | null
          id?: string
          last_backup_at?: string | null
          last_health_check_at?: string | null
          name: string
          notes?: string | null
          port?: number | null
          restore_verified?: boolean | null
          status?: Database["public"]["Enums"]["lifecycle_status"]
          system_id?: string | null
          target_version?: string | null
          technical_owner?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          backup_enabled?: boolean
          backup_required?: boolean | null
          business_owner?: string | null
          code?: string | null
          created_at?: string
          engine?: string
          engine_version?: string | null
          environment_id?: string | null
          health?: Database["public"]["Enums"]["health_status"]
          host?: string | null
          id?: string
          last_backup_at?: string | null
          last_health_check_at?: string | null
          name?: string
          notes?: string | null
          port?: number | null
          restore_verified?: boolean | null
          status?: Database["public"]["Enums"]["lifecycle_status"]
          system_id?: string | null
          target_version?: string | null
          technical_owner?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "databases_environment_id_fkey"
            columns: ["environment_id"]
            isOneToOne: false
            referencedRelation: "environments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "databases_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      environments: {
        Row: {
          code: string | null
          created_at: string
          health: Database["public"]["Enums"]["health_status"]
          id: string
          kind: Database["public"]["Enums"]["environment_kind"]
          name: string
          region: string | null
          status: Database["public"]["Enums"]["lifecycle_status"]
          system_id: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          health?: Database["public"]["Enums"]["health_status"]
          id?: string
          kind?: Database["public"]["Enums"]["environment_kind"]
          name: string
          region?: string | null
          status?: Database["public"]["Enums"]["lifecycle_status"]
          system_id?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          health?: Database["public"]["Enums"]["health_status"]
          id?: string
          kind?: Database["public"]["Enums"]["environment_kind"]
          name?: string
          region?: string | null
          status?: Database["public"]["Enums"]["lifecycle_status"]
          system_id?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "environments_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          code: string
          created_at: string
          is_active: boolean
          name_ar: string
          sort_order: number
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean
          name_ar: string
          sort_order: number
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean
          name_ar?: string
          sort_order?: number
        }
        Relationships: []
      }
      expenses_2025_2026: {
        Row: {
          amount: number
          bank: string | null
          bank_reference: string | null
          category: string | null
          created_at: string
          description: string | null
          destination: string
          destination_known: boolean | null
          direction_type: string
          evidence_source: string | null
          expense_category_code: string | null
          id: number
          operation_id: string
          review_status: string
          source_file: string
          transaction_date: string
          transaction_year: number | null
          updated_at: string
        }
        Insert: {
          amount: number
          bank?: string | null
          bank_reference?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          destination: string
          destination_known?: boolean | null
          direction_type: string
          evidence_source?: string | null
          expense_category_code?: string | null
          id?: never
          operation_id: string
          review_status?: string
          source_file?: string
          transaction_date: string
          transaction_year?: number | null
          updated_at?: string
        }
        Update: {
          amount?: number
          bank?: string | null
          bank_reference?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          destination?: string
          destination_known?: boolean | null
          direction_type?: string
          evidence_source?: string | null
          expense_category_code?: string | null
          id?: never
          operation_id?: string
          review_status?: string
          source_file?: string
          transaction_date?: string
          transaction_year?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_2025_2026_expense_category_code_fkey"
            columns: ["expense_category_code"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["code"]
          },
        ]
      }
      finishing_levels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          name_en: string | null
          price_per_sqm: number
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          name_en?: string | null
          price_per_sqm?: number
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          name_en?: string | null
          price_per_sqm?: number
          sort_order?: number
        }
        Relationships: []
      }
      followup_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          conversation_id: string
          created_at: string | null
          description: string | null
          due_date: string | null
          id: number
          metadata: Json | null
          priority: string | null
          status: string | null
          task_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          conversation_id: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          task_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          conversation_id?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          task_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          project_id: string
          type: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          project_id: string
          type: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          project_id?: string
          type?: string
        }
        Relationships: []
      }
      keepalive: {
        Row: {
          id: number
        }
        Insert: {
          id: number
        }
        Update: {
          id?: number
        }
        Relationships: []
      }
      maintenance_requests: {
        Row: {
          actual_cost: number | null
          branch_id: string | null
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          company_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          estimated_cost: number | null
          id: string
          location: string | null
          priority: string | null
          service_type: string | null
          sla_due_date: string | null
          status: Database["public"]["Enums"]["mr_status"]
          title: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          branch_id?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          priority?: string | null
          service_type?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["mr_status"]
          title: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          branch_id?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          priority?: string | null
          service_type?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["mr_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      media_files: {
        Row: {
          contact_id: string | null
          created_at: string | null
          file_size: number | null
          id: string
          media_id: string | null
          message_id: string | null
          metadata: Json | null
          mime_type: string | null
          project_id: string
          public_url: string | null
          storage_path: string | null
          whatsapp_number_id: string
          workflow_id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          file_size?: number | null
          id?: string
          media_id?: string | null
          message_id?: string | null
          metadata?: Json | null
          mime_type?: string | null
          project_id: string
          public_url?: string | null
          storage_path?: string | null
          whatsapp_number_id: string
          workflow_id: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          file_size?: number | null
          id?: string
          media_id?: string | null
          message_id?: string | null
          metadata?: Json | null
          mime_type?: string | null
          project_id?: string
          public_url?: string | null
          storage_path?: string | null
          whatsapp_number_id?: string
          workflow_id?: string
        }
        Relationships: []
      }
      media_messages: {
        Row: {
          conversation_id: string
          file_size: number | null
          id: number
          is_processed: boolean | null
          media_base64: string | null
          media_type: string | null
          media_url: string | null
          mime_type: string | null
          processed_at: string | null
          received_at: string | null
          transcript: string | null
        }
        Insert: {
          conversation_id: string
          file_size?: number | null
          id?: number
          is_processed?: boolean | null
          media_base64?: string | null
          media_type?: string | null
          media_url?: string | null
          mime_type?: string | null
          processed_at?: string | null
          received_at?: string | null
          transcript?: string | null
        }
        Update: {
          conversation_id?: string
          file_size?: number | null
          id?: number
          is_processed?: boolean | null
          media_base64?: string | null
          media_type?: string | null
          media_url?: string | null
          mime_type?: string | null
          processed_at?: string | null
          received_at?: string | null
          transcript?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      otp_codes: {
        Row: {
          attempts: number
          created_at: string
          expires_at: string
          id: string
          otp_code: string
          phone_number: string
          verified: boolean
        }
        Insert: {
          attempts?: number
          created_at?: string
          expires_at: string
          id?: string
          otp_code: string
          phone_number: string
          verified?: boolean
        }
        Update: {
          attempts?: number
          created_at?: string
          expires_at?: string
          id?: string
          otp_code?: string
          phone_number?: string
          verified?: boolean
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          features: Json
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name_ar: string
          name_en: string
          price: number
          price_yearly: number
        }
        Insert: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          features: Json
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name_ar: string
          name_en: string
          price: number
          price_yearly: number
        }
        Update: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name_ar?: string
          name_en?: string
          price?: number
          price_yearly?: number
        }
        Relationships: []
      }
      pn_attachments: {
        Row: {
          bucket_id: string
          created_at: string
          file_name: string
          file_size: number | null
          id: string
          mime_type: string | null
          note_id: string
          object_path: string
          project_id: string
          uploaded_by: string | null
        }
        Insert: {
          bucket_id?: string
          created_at?: string
          file_name: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          note_id: string
          object_path: string
          project_id: string
          uploaded_by?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          note_id?: string
          object_path?: string
          project_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pn_attachments_note_fk"
            columns: ["project_id", "note_id"]
            isOneToOne: false
            referencedRelation: "pn_notes"
            referencedColumns: ["project_id", "id"]
          },
        ]
      }
      pn_audit: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: number
          project_id: string | null
          snapshot: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: never
          project_id?: string | null
          snapshot?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: never
          project_id?: string | null
          snapshot?: Json
        }
        Relationships: []
      }
      pn_comments: {
        Row: {
          actor_id: string | null
          body: string
          created_at: string
          id: string
          note_id: string
          project_id: string
        }
        Insert: {
          actor_id?: string | null
          body: string
          created_at?: string
          id?: string
          note_id: string
          project_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string
          created_at?: string
          id?: string
          note_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pn_comments_note_fk"
            columns: ["project_id", "note_id"]
            isOneToOne: false
            referencedRelation: "pn_notes"
            referencedColumns: ["project_id", "id"]
          },
        ]
      }
      pn_notes: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          position: number
          project_id: string
          section_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          position?: number
          project_id: string
          section_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          position?: number
          project_id?: string
          section_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pn_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "pn_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pn_notes_section_fk"
            columns: ["project_id", "section_id"]
            isOneToOne: false
            referencedRelation: "pn_sections"
            referencedColumns: ["project_id", "id"]
          },
        ]
      }
      pn_projects: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      pn_sections: {
        Row: {
          created_at: string
          created_by: string
          id: string
          position: number
          project_id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: string
          position?: number
          project_id: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          position?: number
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "pn_sections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "pn_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      pn_status_events: {
        Row: {
          actor_id: string | null
          comment: string | null
          created_at: string
          id: number
          note_id: string
          project_id: string
          status: string
        }
        Insert: {
          actor_id?: string | null
          comment?: string | null
          created_at?: string
          id?: never
          note_id: string
          project_id: string
          status: string
        }
        Update: {
          actor_id?: string | null
          comment?: string | null
          created_at?: string
          id?: never
          note_id?: string
          project_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pn_status_events_note_fk"
            columns: ["project_id", "note_id"]
            isOneToOne: false
            referencedRelation: "pn_notes"
            referencedColumns: ["project_id", "id"]
          },
        ]
      }
      project_comments: {
        Row: {
          author_email: string
          author_name: string
          comment_text: string
          created_at: string | null
          id: string
          image_id: string | null
          is_approved: boolean | null
          project_id: string
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          author_email: string
          author_name: string
          comment_text: string
          created_at?: string | null
          id?: string
          image_id?: string | null
          is_approved?: boolean | null
          project_id: string
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          author_email?: string
          author_name?: string
          comment_text?: string
          created_at?: string | null
          id?: string
          image_id?: string | null
          is_approved?: boolean | null
          project_id?: string
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "project_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          order_index: number | null
          project_id: string
          thumbnail_url: string | null
          title: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          order_index?: number | null
          project_id: string
          thumbnail_url?: string | null
          title?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          order_index?: number | null
          project_id?: string
          thumbnail_url?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          is_approved: boolean
          project_id: string
          rating: number
          reviewer_email: string | null
          reviewer_name: string
          reviewer_phone: string | null
          updated_at: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          is_approved?: boolean
          project_id: string
          rating: number
          reviewer_email?: string | null
          reviewer_name: string
          reviewer_phone?: string | null
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          project_id?: string
          rating?: number
          reviewer_email?: string | null
          reviewer_name?: string
          reviewer_phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          area_sqm: number | null
          budget: number | null
          category: string | null
          client_name: string | null
          company_name: string | null
          content_ar: string | null
          content_en: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          end_date: string | null
          gallery: Json | null
          id: string
          is_featured: boolean | null
          is_published: boolean
          location: string | null
          model_3d_embeds: Json | null
          model_3d_url: string | null
          name: string
          order_index: number | null
          progress: number | null
          short_description: string | null
          slug: string | null
          sort_order: number
          start_date: string | null
          stats: Json | null
          status: string | null
          title_en: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          area_sqm?: number | null
          budget?: number | null
          category?: string | null
          client_name?: string | null
          company_name?: string | null
          content_ar?: string | null
          content_en?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          gallery?: Json | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean
          location?: string | null
          model_3d_embeds?: Json | null
          model_3d_url?: string | null
          name: string
          order_index?: number | null
          progress?: number | null
          short_description?: string | null
          slug?: string | null
          sort_order?: number
          start_date?: string | null
          stats?: Json | null
          status?: string | null
          title_en?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          area_sqm?: number | null
          budget?: number | null
          category?: string | null
          client_name?: string | null
          company_name?: string | null
          content_ar?: string | null
          content_en?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          gallery?: Json | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean
          location?: string | null
          model_3d_embeds?: Json | null
          model_3d_url?: string | null
          name?: string
          order_index?: number | null
          progress?: number | null
          short_description?: string | null
          slug?: string | null
          sort_order?: number
          start_date?: string | null
          stats?: Json | null
          status?: string | null
          title_en?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      quotation_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      quotation_items: {
        Row: {
          category_id: string
          created_at: string
          default_unit_price: number
          description: string
          id: string
          is_active: boolean
          item_code: string | null
          sort_order: number
          unit: string
        }
        Insert: {
          category_id: string
          created_at?: string
          default_unit_price?: number
          description: string
          id?: string
          is_active?: boolean
          item_code?: string | null
          sort_order?: number
          unit?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          default_unit_price?: number
          description?: string
          id?: string
          is_active?: boolean
          item_code?: string | null
          sort_order?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "quotation_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_line_items: {
        Row: {
          created_at: string
          description: string
          id: string
          item_id: string | null
          notes: string | null
          quantity: number
          quotation_id: string
          sort_order: number
          total: number
          unit: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          item_id?: string | null
          notes?: string | null
          quantity?: number
          quotation_id: string
          sort_order?: number
          total?: number
          unit?: string
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          item_id?: string | null
          notes?: string | null
          quantity?: number
          quotation_id?: string
          sort_order?: number
          total?: number
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotation_line_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "quotation_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_line_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_notifications: {
        Row: {
          created_at: string | null
          id: string
          notification_type: string
          quotation_id: string
          recipient_phone: string | null
          recipient_type: string
          status: string | null
          wa_message_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notification_type: string
          quotation_id: string
          recipient_phone?: string | null
          recipient_type: string
          status?: string | null
          wa_message_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_type?: string
          quotation_id?: string
          recipient_phone?: string | null
          recipient_type?: string
          status?: string | null
          wa_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_notifications_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          approval_notes: string | null
          approved_at: string | null
          approved_by: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          discount_amount: number | null
          discount_percentage: number | null
          finishing_level_id: string | null
          id: string
          labor_percentage: number | null
          material_cost: number | null
          modified_at: string | null
          modified_by: string | null
          notes: string | null
          pdf_url: string | null
          pricing_system: string
          project_type: string
          property_area: number | null
          property_type: string | null
          quotation_number: string
          rejection_reason: string | null
          status: string
          subtotal: number
          tax_amount: number | null
          tax_percentage: number | null
          total: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          finishing_level_id?: string | null
          id?: string
          labor_percentage?: number | null
          material_cost?: number | null
          modified_at?: string | null
          modified_by?: string | null
          notes?: string | null
          pdf_url?: string | null
          pricing_system?: string
          project_type?: string
          property_area?: number | null
          property_type?: string | null
          quotation_number: string
          rejection_reason?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_percentage?: number | null
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          finishing_level_id?: string | null
          id?: string
          labor_percentage?: number | null
          material_cost?: number | null
          modified_at?: string | null
          modified_by?: string | null
          notes?: string | null
          pdf_url?: string | null
          pricing_system?: string
          project_type?: string
          property_area?: number | null
          property_type?: string | null
          quotation_number?: string
          rejection_reason?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_percentage?: number | null
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_finishing_level_id_fkey"
            columns: ["finishing_level_id"]
            isOneToOne: false
            referencedRelation: "finishing_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      request_server: {
        Row: {
          data: Json | null
          id: number
          inserted_at: string
          name: string | null
          updated_at: string
        }
        Insert: {
          data?: Json | null
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          data?: Json | null
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_pages: {
        Row: {
          content_ar: string | null
          content_en: string | null
          created_at: string
          features: Json | null
          gallery: Json | null
          hero_image_url: string | null
          id: string
          is_published: boolean
          slug: string
          sort_order: number
          subtitle_ar: string | null
          subtitle_en: string | null
          title_ar: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          content_ar?: string | null
          content_en?: string | null
          created_at?: string
          features?: Json | null
          gallery?: Json | null
          hero_image_url?: string | null
          id?: string
          is_published?: boolean
          slug: string
          sort_order?: number
          subtitle_ar?: string | null
          subtitle_en?: string | null
          title_ar: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          content_ar?: string | null
          content_en?: string | null
          created_at?: string
          features?: Json | null
          gallery?: Json | null
          hero_image_url?: string | null
          id?: string
          is_published?: boolean
          slug?: string
          sort_order?: number
          subtitle_ar?: string | null
          subtitle_en?: string | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sso_apps: {
        Row: {
          allowed_roles: string[]
          base_url: string
          color: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          id: string
          is_active: boolean
          is_default: boolean
          logo_url: string | null
          name_ar: string
          name_en: string
          redirect_url: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          allowed_roles?: string[]
          base_url: string
          color?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          logo_url?: string | null
          name_ar: string
          name_en: string
          redirect_url?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          allowed_roles?: string[]
          base_url?: string
          color?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          logo_url?: string | null
          name_ar?: string
          name_en?: string
          redirect_url?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      storage_endpoints: {
        Row: {
          created_at: string
          default_bucket: string | null
          endpoint_url: string
          id: string
          is_active: boolean
          key: string
          label: string
          notes: string | null
          path_style: boolean
          provider: string
          region: string
          secret_prefix: string
          signature_version: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_bucket?: string | null
          endpoint_url: string
          id?: string
          is_active?: boolean
          key: string
          label: string
          notes?: string | null
          path_style?: boolean
          provider?: string
          region?: string
          secret_prefix: string
          signature_version?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_bucket?: string | null
          endpoint_url?: string
          id?: string
          is_active?: boolean
          key?: string
          label?: string
          notes?: string | null
          path_style?: boolean
          provider?: string
          region?: string
          secret_prefix?: string
          signature_version?: string
          updated_at?: string
        }
        Relationships: []
      }
      storage_object_locations: {
        Row: {
          availability: string
          bucket: string | null
          created_at: string
          endpoint_id: string | null
          etag: string | null
          id: string
          is_primary: boolean
          last_verified_at: string | null
          location_kind: string
          location_role: string
          object_id: string
          object_key: string | null
          physical_locator: string
          sha256: string | null
          size_bytes: number | null
          updated_at: string
        }
        Insert: {
          availability?: string
          bucket?: string | null
          created_at?: string
          endpoint_id?: string | null
          etag?: string | null
          id?: string
          is_primary?: boolean
          last_verified_at?: string | null
          location_kind?: string
          location_role?: string
          object_id: string
          object_key?: string | null
          physical_locator: string
          sha256?: string | null
          size_bytes?: number | null
          updated_at?: string
        }
        Update: {
          availability?: string
          bucket?: string | null
          created_at?: string
          endpoint_id?: string | null
          etag?: string | null
          id?: string
          is_primary?: boolean
          last_verified_at?: string | null
          location_kind?: string
          location_role?: string
          object_id?: string
          object_key?: string | null
          physical_locator?: string
          sha256?: string | null
          size_bytes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_object_locations_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "storage_endpoints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_object_locations_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "storage_object_resolution"
            referencedColumns: ["object_id"]
          },
          {
            foreignKeyName: "storage_object_locations_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "storage_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_objects: {
        Row: {
          content_class: string | null
          created_at: string
          created_by: string | null
          current_project_id: string | null
          current_request_id: string | null
          display_name: string
          extension: string | null
          id: string
          metadata: Json
          mime_type: string | null
          object_code: string
          origin_project_id: string | null
          origin_request_id: string | null
          original_filename: string | null
          sha256: string | null
          size_bytes: number | null
          status: string
          updated_at: string
        }
        Insert: {
          content_class?: string | null
          created_at?: string
          created_by?: string | null
          current_project_id?: string | null
          current_request_id?: string | null
          display_name: string
          extension?: string | null
          id?: string
          metadata?: Json
          mime_type?: string | null
          object_code?: string
          origin_project_id?: string | null
          origin_request_id?: string | null
          original_filename?: string | null
          sha256?: string | null
          size_bytes?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          content_class?: string | null
          created_at?: string
          created_by?: string | null
          current_project_id?: string | null
          current_request_id?: string | null
          display_name?: string
          extension?: string | null
          id?: string
          metadata?: Json
          mime_type?: string | null
          object_code?: string
          origin_project_id?: string | null
          origin_request_id?: string | null
          original_filename?: string | null
          sha256?: string | null
          size_bytes?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_objects_current_project_id_fkey"
            columns: ["current_project_id"]
            isOneToOne: false
            referencedRelation: "storage_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_objects_current_request_id_fkey"
            columns: ["current_request_id"]
            isOneToOne: false
            referencedRelation: "storage_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_objects_origin_project_id_fkey"
            columns: ["origin_project_id"]
            isOneToOne: false
            referencedRelation: "storage_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_objects_origin_request_id_fkey"
            columns: ["origin_request_id"]
            isOneToOne: false
            referencedRelation: "storage_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_projects: {
        Row: {
          canonical_uri: string
          client_name: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          origin_request_id: string
          project_code: string
          promoted_at: string
          status: string
          updated_at: string
        }
        Insert: {
          canonical_uri: string
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          origin_request_id: string
          project_code?: string
          promoted_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          canonical_uri?: string
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          origin_request_id?: string
          project_code?: string
          promoted_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_projects_origin_request_id_fkey"
            columns: ["origin_request_id"]
            isOneToOne: true
            referencedRelation: "storage_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_promotions: {
        Row: {
          created_at: string
          id: string
          payment_amount: number
          payment_currency: string
          payment_received_at: string
          payment_reference: string
          payment_verified_at: string
          project_id: string
          request_id: string
          verification_source: string
          verified_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_amount: number
          payment_currency?: string
          payment_received_at: string
          payment_reference: string
          payment_verified_at?: string
          project_id: string
          request_id: string
          verification_source: string
          verified_by?: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_amount?: number
          payment_currency?: string
          payment_received_at?: string
          payment_reference?: string
          payment_verified_at?: string
          project_id?: string
          request_id?: string
          verification_source?: string
          verified_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_promotions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "storage_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_promotions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "storage_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_requests: {
        Row: {
          client_name: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          notes: string | null
          request_code: string
          status: string
          updated_at: string
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          notes?: string | null
          request_code?: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          notes?: string | null
          request_code?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          branches_count: number | null
          created_at: string | null
          end_date: string
          id: string
          payment_method: string | null
          payment_status: string | null
          plan_id: string
          start_date: string
          status: string | null
          total_price: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          branches_count?: number | null
          created_at?: string | null
          end_date: string
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          plan_id: string
          start_date: string
          status?: string | null
          total_price: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          branches_count?: number | null
          created_at?: string | null
          end_date?: string
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          plan_id?: string
          start_date?: string
          status?: string | null
          total_price?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      systems: {
        Row: {
          business_owner: string | null
          code: string | null
          created_at: string
          criticality: Database["public"]["Enums"]["criticality_level"]
          description: string | null
          health: Database["public"]["Enums"]["health_status"]
          id: string
          name: string
          operational_notes: string | null
          owner: string | null
          purpose: string | null
          status: Database["public"]["Enums"]["lifecycle_status"]
          technical_owner: string | null
          updated_at: string
        }
        Insert: {
          business_owner?: string | null
          code?: string | null
          created_at?: string
          criticality?: Database["public"]["Enums"]["criticality_level"]
          description?: string | null
          health?: Database["public"]["Enums"]["health_status"]
          id?: string
          name: string
          operational_notes?: string | null
          owner?: string | null
          purpose?: string | null
          status?: Database["public"]["Enums"]["lifecycle_status"]
          technical_owner?: string | null
          updated_at?: string
        }
        Update: {
          business_owner?: string | null
          code?: string | null
          created_at?: string
          criticality?: Database["public"]["Enums"]["criticality_level"]
          description?: string | null
          health?: Database["public"]["Enums"]["health_status"]
          id?: string
          name?: string
          operational_notes?: string | null
          owner?: string | null
          purpose?: string | null
          status?: Database["public"]["Enums"]["lifecycle_status"]
          technical_owner?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tax_invoices: {
        Row: {
          commercial_register: string | null
          created_at: string
          description: string | null
          id: string
          invoice_date: string | null
          invoice_number: string | null
          item: string | null
          source_section: string | null
          tax_amount: number | null
          tax_card: string | null
          tax_type: string | null
          taxable_amount: number | null
          taxpayer: string | null
        }
        Insert: {
          commercial_register?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          item?: string | null
          source_section?: string | null
          tax_amount?: number | null
          tax_card?: string | null
          tax_type?: string | null
          taxable_amount?: number | null
          taxpayer?: string | null
        }
        Update: {
          commercial_register?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          item?: string | null
          source_section?: string | null
          tax_amount?: number | null
          tax_card?: string | null
          tax_type?: string | null
          taxable_amount?: number | null
          taxpayer?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string
          created_at: string | null
          id: string
          language: string
          phone_number_id: string
          preview_text: string | null
          status: string
          variables_count: number | null
          wa_template_code: string
          wa_template_name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          language: string
          phone_number_id: string
          preview_text?: string | null
          status: string
          variables_count?: number | null
          wa_template_code: string
          wa_template_name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          language?: string
          phone_number_id?: string
          preview_text?: string | null
          status?: string
          variables_count?: number | null
          wa_template_code?: string
          wa_template_name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      webhook_endpoints: {
        Row: {
          created_at: string | null
          events: Json | null
          id: string
          is_active: boolean | null
          project_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          events?: Json | null
          id?: string
          is_active?: boolean | null
          project_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          events?: Json | null
          id?: string
          is_active?: boolean | null
          project_id?: string
          url?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          event_hash: string
          id: string
          payload: Json
          raw_body: string | null
          signature: string | null
          source: string
        }
        Insert: {
          created_at?: string | null
          event_hash: string
          id?: string
          payload: Json
          raw_body?: string | null
          signature?: string | null
          source: string
        }
        Update: {
          created_at?: string | null
          event_hash?: string
          id?: string
          payload?: Json
          raw_body?: string | null
          signature?: string | null
          source?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          conversation_id: string | null
          error_message: string | null
          id: number
          payload: Json | null
          processed_at: string | null
          processing_time_ms: number | null
          received_at: string | null
          response_status: number | null
          webhook_type: string | null
        }
        Insert: {
          conversation_id?: string | null
          error_message?: string | null
          id?: number
          payload?: Json | null
          processed_at?: string | null
          processing_time_ms?: number | null
          received_at?: string | null
          response_status?: number | null
          webhook_type?: string | null
        }
        Update: {
          conversation_id?: string | null
          error_message?: string | null
          id?: number
          payload?: Json | null
          processed_at?: string | null
          processing_time_ms?: number | null
          received_at?: string | null
          response_status?: number | null
          webhook_type?: string | null
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          conversation_id: string
          created_at: string | null
          ended_at: string | null
          id: number
          last_message_at: string | null
          message_count: number | null
          platform_metadata: Json | null
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_phone: string
          whatsapp_conversation_id: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          ended_at?: string | null
          id?: number
          last_message_at?: string | null
          message_count?: number | null
          platform_metadata?: Json | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_phone: string
          whatsapp_conversation_id?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          ended_at?: string | null
          id?: number
          last_message_at?: string | null
          message_count?: number | null
          platform_metadata?: Json | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_phone?: string
          whatsapp_conversation_id?: string | null
        }
        Relationships: []
      }
      whatsapp_flows: {
        Row: {
          categories: string[] | null
          created_at: string | null
          id: string
          json_version: string | null
          name: string
          preview_url: string | null
          status: string | null
          updated_at: string | null
          validation_errors: Json | null
          wa_flow_id: string | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string | null
          id?: string
          json_version?: string | null
          name: string
          preview_url?: string | null
          status?: string | null
          updated_at?: string | null
          validation_errors?: Json | null
          wa_flow_id?: string | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string | null
          id?: string
          json_version?: string | null
          name?: string
          preview_url?: string | null
          status?: string | null
          updated_at?: string | null
          validation_errors?: Json | null
          wa_flow_id?: string | null
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          content: string | null
          created_at: string
          customer_name: string | null
          direction: string
          id: string
          media_mime_type: string | null
          media_url: string | null
          message_type: string
          phone_number: string
          status: string | null
          wa_message_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          customer_name?: string | null
          direction?: string
          id?: string
          media_mime_type?: string | null
          media_url?: string | null
          message_type?: string
          phone_number: string
          status?: string | null
          wa_message_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          customer_name?: string | null
          direction?: string
          id?: string
          media_mime_type?: string | null
          media_url?: string | null
          message_type?: string
          phone_number?: string
          status?: string | null
          wa_message_id?: string | null
        }
        Relationships: []
      }
      workflow_steps: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          type: string
          workflow_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          type: string
          workflow_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          type?: string
          workflow_id?: string
        }
        Relationships: []
      }
      workflows: {
        Row: {
          ai_enabled: boolean | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          project_id: string
        }
        Insert: {
          ai_enabled?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          project_id: string
        }
        Update: {
          ai_enabled?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          project_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      project_comments_public: {
        Row: {
          author_name: string | null
          comment_text: string | null
          created_at: string | null
          id: string | null
          image_id: string | null
          is_approved: boolean | null
          project_id: string | null
          rating: number | null
        }
        Insert: {
          author_name?: string | null
          comment_text?: string | null
          created_at?: string | null
          id?: string | null
          image_id?: string | null
          is_approved?: boolean | null
          project_id?: string | null
          rating?: number | null
        }
        Update: {
          author_name?: string | null
          comment_text?: string | null
          created_at?: string | null
          id?: string | null
          image_id?: string | null
          is_approved?: boolean | null
          project_id?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "project_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_reviews_public: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string | null
          is_approved: boolean | null
          project_id: string | null
          rating: number | null
          reviewer_name: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string | null
          is_approved?: boolean | null
          project_id?: string | null
          rating?: number | null
          reviewer_name?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string | null
          is_approved?: boolean | null
          project_id?: string | null
          rating?: number | null
          reviewer_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_object_resolution: {
        Row: {
          availability: string | null
          bucket: string | null
          endpoint_id: string | null
          is_primary: boolean | null
          last_verified_at: string | null
          location_id: string | null
          location_kind: string | null
          location_role: string | null
          object_code: string | null
          object_id: string | null
          object_key: string | null
          physical_locator: string | null
        }
        Relationships: [
          {
            foreignKeyName: "storage_object_locations_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "storage_endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_manage_storage: { Args: never; Returns: boolean }
      generate_quotation_number: { Args: never; Returns: string }
      get_active_subscriptions: {
        Args: { user_id: string }
        Returns: {
          branches_count: number
          end_date: string
          plan_name: string
          total_price: number
        }[]
      }
      get_conversation_stats: {
        Args: { end_date: string; start_date: string }
        Returns: {
          avg_duration: number
          needs_followup_count: number
          negative_sentiment_count: number
          positive_sentiment_count: number
          total_conversations: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      log_security_event: {
        Args: {
          _actor_email?: string
          _category: string
          _description?: string
          _detail?: Json
          _event_type: string
          _ip_address?: string
          _status?: string
          _user_agent?: string
        }
        Returns: string
      }
      next_storage_object_code: { Args: never; Returns: string }
      next_storage_project_code: { Args: never; Returns: string }
      next_storage_request_code: { Args: never; Returns: string }
      pn_create_project: {
        Args: { project_description?: string; project_name: string }
        Returns: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "pn_projects"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      promote_storage_request: {
        Args: {
          _payment_amount: number
          _payment_currency?: string
          _payment_received_at: string
          _payment_reference: string
          _request_id: string
          _verification_source?: string
        }
        Returns: {
          canonical_uri: string
          project_code: string
          project_id: string
        }[]
      }
      register_storage_server_object: {
        Args: {
          _content_class: string
          _context_id: string
          _context_type: string
          _display_name: string
          _extension: string
          _mime_type: string
          _object_code: string
          _original_filename: string
          _sha256: string
          _size_bytes: number
        }
        Returns: {
          object_code: string
          object_id: string
        }[]
      }
      reserve_storage_object_code: { Args: never; Returns: string }
    }
    Enums: {
      app_role:
        | "platform_owner"
        | "platform_admin"
        | "database_administrator"
        | "data_engineer"
        | "data_analyst"
        | "read_only"
      criticality_level: "critical" | "high" | "medium" | "low" | "unknown"
      datasource_kind:
        | "api"
        | "file_store"
        | "object_storage"
        | "queue"
        | "cache"
        | "warehouse"
        | "vector_store"
        | "spreadsheet"
        | "other"
      environment_kind:
        | "production"
        | "staging"
        | "development"
        | "testing"
        | "sandbox"
        | "dr"
        | "other"
      health_status: "healthy" | "warning" | "critical" | "unknown"
      lifecycle_status:
        | "active"
        | "inactive"
        | "maintenance"
        | "deprecated"
        | "archived"
        | "unknown"
      mr_status: "Open" | "InProgress" | "Completed" | "Cancelled"
      notification_severity: "info" | "success" | "warning" | "error"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "platform_owner",
        "platform_admin",
        "database_administrator",
        "data_engineer",
        "data_analyst",
        "read_only",
      ],
      criticality_level: ["critical", "high", "medium", "low", "unknown"],
      datasource_kind: [
        "api",
        "file_store",
        "object_storage",
        "queue",
        "cache",
        "warehouse",
        "vector_store",
        "spreadsheet",
        "other",
      ],
      environment_kind: [
        "production",
        "staging",
        "development",
        "testing",
        "sandbox",
        "dr",
        "other",
      ],
      health_status: ["healthy", "warning", "critical", "unknown"],
      lifecycle_status: [
        "active",
        "inactive",
        "maintenance",
        "deprecated",
        "archived",
        "unknown",
      ],
      mr_status: ["Open", "InProgress", "Completed", "Cancelled"],
      notification_severity: ["info", "success", "warning", "error"],
    },
  },
} as const
