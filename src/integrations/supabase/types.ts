export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      change_orders: {
        Row: {
          amount: number | null
          created_at: string
          description: string | null
          id: string
          project_id: string | null
          request_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          project_id?: string | null
          request_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          project_id?: string | null
          request_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          document_id: string | null
          file_size: number
          file_url: string
          id: string
          notes: string | null
          uploaded_at: string
          version: string
        }
        Insert: {
          document_id?: string | null
          file_size: number
          file_url: string
          id?: string
          notes?: string | null
          uploaded_at?: string
          version: string
        }
        Update: {
          document_id?: string | null
          file_size?: number
          file_url?: string
          id?: string
          notes?: string | null
          uploaded_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string | null
          file_name: string
          file_size: number
          file_url: string
          id: string
          name: string
          project_id: string | null
          tags: string[] | null
          uploaded_at: string
          version: string | null
        }
        Insert: {
          category?: string | null
          file_name: string
          file_size: number
          file_url: string
          id?: string
          name: string
          project_id?: string | null
          tags?: string[] | null
          uploaded_at?: string
          version?: string | null
        }
        Update: {
          category?: string | null
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          name?: string
          project_id?: string | null
          tags?: string[] | null
          uploaded_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          project_id: string | null
          status: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          project_id?: string | null
          status?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          project_id?: string | null
          status?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_budget_items: {
        Row: {
          actual_amount: number | null
          budgeted_amount: number
          category: string
          created_at: string
          id: string
          item_name: string
          notes: string | null
          project_id: string | null
          updated_at: string
        }
        Insert: {
          actual_amount?: number | null
          budgeted_amount: number
          category: string
          created_at?: string
          id?: string
          item_name: string
          notes?: string | null
          project_id?: string | null
          updated_at?: string
        }
        Update: {
          actual_amount?: number | null
          budgeted_amount?: number
          category?: string
          created_at?: string
          id?: string
          item_name?: string
          notes?: string | null
          project_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_budget_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          completion_date: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_notes: {
        Row: {
          author: string | null
          content: string | null
          id: string
          project_id: string | null
          timestamp: string
          title: string
        }
        Insert: {
          author?: string | null
          content?: string | null
          id?: string
          project_id?: string | null
          timestamp?: string
          title: string
        }
        Update: {
          author?: string | null
          content?: string | null
          id?: string
          project_id?: string | null
          timestamp?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team_members: {
        Row: {
          added_at: string
          id: string
          permissions: string[] | null
          project_id: string | null
          role: string
          user_email: string | null
          user_name: string
        }
        Insert: {
          added_at?: string
          id?: string
          permissions?: string[] | null
          project_id?: string | null
          role: string
          user_email?: string | null
          user_name: string
        }
        Update: {
          added_at?: string
          id?: string
          permissions?: string[] | null
          project_id?: string | null
          role?: string
          user_email?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget_allocated: number | null
          budget_spent: number | null
          client_name: string | null
          completed_tasks: number | null
          contract_value: number | null
          created_at: string
          delay_days: number | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          name: string
          progress_percentage: number | null
          project_id: string | null
          project_manager: string | null
          rfi_count: number | null
          start_date: string | null
          status: string | null
          total_tasks: number | null
          updated_at: string
        }
        Insert: {
          budget_allocated?: number | null
          budget_spent?: number | null
          client_name?: string | null
          completed_tasks?: number | null
          contract_value?: number | null
          created_at?: string
          delay_days?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          progress_percentage?: number | null
          project_id?: string | null
          project_manager?: string | null
          rfi_count?: number | null
          start_date?: string | null
          status?: string | null
          total_tasks?: number | null
          updated_at?: string
        }
        Update: {
          budget_allocated?: number | null
          budget_spent?: number | null
          client_name?: string | null
          completed_tasks?: number | null
          contract_value?: number | null
          created_at?: string
          delay_days?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          progress_percentage?: number | null
          project_id?: string | null
          project_manager?: string | null
          rfi_count?: number | null
          start_date?: string | null
          status?: string | null
          total_tasks?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      rfis: {
        Row: {
          created_at: string
          description: string | null
          id: string
          priority: string | null
          project_id: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      submittals: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          project_id: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submittals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
