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
      ai_settings: {
        Row: {
          api_key: string | null
          api_version: string | null
          deployment: string | null
          endpoint: string | null
          id: number
          system_prompt: string | null
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          api_version?: string | null
          deployment?: string | null
          endpoint?: string | null
          id?: number
          system_prompt?: string | null
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          api_version?: string | null
          deployment?: string | null
          endpoint?: string | null
          id?: number
          system_prompt?: string | null
          updated_at?: string
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
      login_otp: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: string
          phone: string
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          phone: string
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          phone?: string
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
      profiles: {
        Row: {
          city: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          shop_address: string | null
          shop_name: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          shop_address?: string | null
          shop_name?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          shop_address?: string | null
          shop_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
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
    }
    Functions: {
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
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
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
      mr_status: ["Open", "InProgress", "Completed", "Cancelled"],
      notification_severity: ["info", "success", "warning", "error"],
    },
  },
} as const
