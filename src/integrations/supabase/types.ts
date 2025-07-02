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
      crew_members: {
        Row: {
          crew_id: string | null
          id: string
          is_active: boolean | null
          joined_date: string
          role_in_crew: string | null
          worker_id: string | null
        }
        Insert: {
          crew_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_date?: string
          role_in_crew?: string | null
          worker_id?: string | null
        }
        Update: {
          crew_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_date?: string
          role_in_crew?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crew_members_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "field_crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_members_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "field_workers"
            referencedColumns: ["id"]
          },
        ]
      }
      dispatch_assignments: {
        Row: {
          accepted_at: string | null
          actual_duration: unknown | null
          assigned_to_crew_id: string | null
          assigned_to_name: string
          assigned_to_worker_id: string | null
          assignment_type: string | null
          completed_at: string | null
          completion_notes: string | null
          created_at: string
          created_by: string
          description: string
          due_date: string
          estimated_duration: unknown | null
          gps_tracking_enabled: boolean | null
          id: string
          location: Json
          photos: string[] | null
          priority: string | null
          project_id: string | null
          required_equipment: string[] | null
          required_materials: Json | null
          route_optimization: boolean | null
          signature_data: string | null
          signature_required: boolean | null
          special_instructions: string | null
          started_at: string | null
          status: string | null
          updated_at: string
          work_order_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          actual_duration?: unknown | null
          assigned_to_crew_id?: string | null
          assigned_to_name: string
          assigned_to_worker_id?: string | null
          assignment_type?: string | null
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          created_by: string
          description: string
          due_date: string
          estimated_duration?: unknown | null
          gps_tracking_enabled?: boolean | null
          id?: string
          location: Json
          photos?: string[] | null
          priority?: string | null
          project_id?: string | null
          required_equipment?: string[] | null
          required_materials?: Json | null
          route_optimization?: boolean | null
          signature_data?: string | null
          signature_required?: boolean | null
          special_instructions?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          work_order_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          actual_duration?: unknown | null
          assigned_to_crew_id?: string | null
          assigned_to_name?: string
          assigned_to_worker_id?: string | null
          assignment_type?: string | null
          completed_at?: string | null
          completion_notes?: string | null
          created_at?: string
          created_by?: string
          description?: string
          due_date?: string
          estimated_duration?: unknown | null
          gps_tracking_enabled?: boolean | null
          id?: string
          location?: Json
          photos?: string[] | null
          priority?: string | null
          project_id?: string | null
          required_equipment?: string[] | null
          required_materials?: Json | null
          route_optimization?: boolean | null
          signature_data?: string | null
          signature_required?: boolean | null
          special_instructions?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_assignments_assigned_to_crew_id_fkey"
            columns: ["assigned_to_crew_id"]
            isOneToOne: false
            referencedRelation: "field_crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_assignments_assigned_to_worker_id_fkey"
            columns: ["assigned_to_worker_id"]
            isOneToOne: false
            referencedRelation: "field_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_assignments_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
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
          description: string | null
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
          description?: string | null
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
          description?: string | null
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
      employee_payroll_records: {
        Row: {
          created_at: string
          employee_id: string
          federal_tax: number
          gross_pay: number
          holiday_hours: number
          id: string
          medicare: number
          net_pay: number
          notes: string | null
          other_deductions: number
          overtime_hours: number
          pay_date: string | null
          pay_period_end: string
          pay_period_start: string
          regular_hours: number
          sick_hours: number
          social_security: number
          state_tax: number
          status: string
          vacation_hours: number
        }
        Insert: {
          created_at?: string
          employee_id: string
          federal_tax?: number
          gross_pay?: number
          holiday_hours?: number
          id?: string
          medicare?: number
          net_pay?: number
          notes?: string | null
          other_deductions?: number
          overtime_hours?: number
          pay_date?: string | null
          pay_period_end: string
          pay_period_start: string
          regular_hours?: number
          sick_hours?: number
          social_security?: number
          state_tax?: number
          status?: string
          vacation_hours?: number
        }
        Update: {
          created_at?: string
          employee_id?: string
          federal_tax?: number
          gross_pay?: number
          holiday_hours?: number
          id?: string
          medicare?: number
          net_pay?: number
          notes?: string | null
          other_deductions?: number
          overtime_hours?: number
          pay_date?: string | null
          pay_period_end?: string
          pay_period_start?: string
          regular_hours?: number
          sick_hours?: number
          social_security?: number
          state_tax?: number
          status?: string
          vacation_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "employee_payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_performance_reviews: {
        Row: {
          areas_for_improvement: string | null
          created_at: string
          employee_comments: string | null
          employee_id: string
          goals_for_next_period: string | null
          goals_met: number | null
          id: string
          overall_rating: number | null
          punctuality: number | null
          quality_of_work: number | null
          review_date: string
          review_period_end: string
          review_period_start: string
          reviewer_id: string
          safety_compliance: number | null
          status: string
          strengths: string | null
          teamwork: number | null
        }
        Insert: {
          areas_for_improvement?: string | null
          created_at?: string
          employee_comments?: string | null
          employee_id: string
          goals_for_next_period?: string | null
          goals_met?: number | null
          id?: string
          overall_rating?: number | null
          punctuality?: number | null
          quality_of_work?: number | null
          review_date?: string
          review_period_end: string
          review_period_start: string
          reviewer_id: string
          safety_compliance?: number | null
          status?: string
          strengths?: string | null
          teamwork?: number | null
        }
        Update: {
          areas_for_improvement?: string | null
          created_at?: string
          employee_comments?: string | null
          employee_id?: string
          goals_for_next_period?: string | null
          goals_met?: number | null
          id?: string
          overall_rating?: number | null
          punctuality?: number | null
          quality_of_work?: number | null
          review_date?: string
          review_period_end?: string
          review_period_start?: string
          reviewer_id?: string
          safety_compliance?: number | null
          status?: string
          strengths?: string | null
          teamwork?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_profiles: {
        Row: {
          address: string | null
          certifications: Json | null
          created_at: string
          department: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string
          first_name: string
          hire_date: string
          id: string
          job_title: string
          last_name: string
          notes: string | null
          pay_rate: number
          pay_type: string
          phone: string | null
          profile_photo: string | null
          skills: string[] | null
          status: string
          supervisor_id: string | null
          termination_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          certifications?: Json | null
          created_at?: string
          department: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id: string
          first_name: string
          hire_date: string
          id?: string
          job_title: string
          last_name: string
          notes?: string | null
          pay_rate: number
          pay_type?: string
          phone?: string | null
          profile_photo?: string | null
          skills?: string[] | null
          status?: string
          supervisor_id?: string | null
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          certifications?: Json | null
          created_at?: string
          department?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string
          first_name?: string
          hire_date?: string
          id?: string
          job_title?: string
          last_name?: string
          notes?: string | null
          pay_rate?: number
          pay_type?: string
          phone?: string | null
          profile_photo?: string | null
          skills?: string[] | null
          status?: string
          supervisor_id?: string | null
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_profiles_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_schedules: {
        Row: {
          created_at: string
          created_by: string
          employee_id: string
          id: string
          location: string | null
          notes: string | null
          project_id: string | null
          role_for_day: string | null
          schedule_date: string
          shift_end: string
          shift_start: string
          status: string
        }
        Insert: {
          created_at?: string
          created_by: string
          employee_id: string
          id?: string
          location?: string | null
          notes?: string | null
          project_id?: string | null
          role_for_day?: string | null
          schedule_date: string
          shift_end: string
          shift_start: string
          status?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          employee_id?: string
          id?: string
          location?: string | null
          notes?: string | null
          project_id?: string | null
          role_for_day?: string | null
          schedule_date?: string
          shift_end?: string
          shift_start?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_schedules_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_schedules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_training_records: {
        Row: {
          attachments: string[] | null
          certification_number: string | null
          completion_date: string | null
          cost: number | null
          created_at: string
          employee_id: string
          expiry_date: string | null
          id: string
          instructor: string | null
          location: string | null
          notes: string | null
          score: number | null
          start_date: string
          status: string
          training_name: string
          training_provider: string | null
          training_type: string
        }
        Insert: {
          attachments?: string[] | null
          certification_number?: string | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string
          employee_id: string
          expiry_date?: string | null
          id?: string
          instructor?: string | null
          location?: string | null
          notes?: string | null
          score?: number | null
          start_date: string
          status?: string
          training_name: string
          training_provider?: string | null
          training_type: string
        }
        Update: {
          attachments?: string[] | null
          certification_number?: string | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string
          employee_id?: string
          expiry_date?: string | null
          id?: string
          instructor?: string | null
          location?: string | null
          notes?: string | null
          score?: number | null
          start_date?: string
          status?: string
          training_name?: string
          training_provider?: string | null
          training_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_training_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      environmental_conditions: {
        Row: {
          air_quality_index: number | null
          created_at: string
          dust_level: string | null
          humidity: number | null
          id: string
          noise_level: number | null
          precipitation: string | null
          project_id: string | null
          recommendations: string | null
          recorded_at: string
          recorded_by: string
          site_id: string | null
          temperature: number | null
          visibility: string | null
          weather_source: string | null
          wind_direction: number | null
          wind_speed: number | null
          work_impact: string | null
        }
        Insert: {
          air_quality_index?: number | null
          created_at?: string
          dust_level?: string | null
          humidity?: number | null
          id?: string
          noise_level?: number | null
          precipitation?: string | null
          project_id?: string | null
          recommendations?: string | null
          recorded_at?: string
          recorded_by: string
          site_id?: string | null
          temperature?: number | null
          visibility?: string | null
          weather_source?: string | null
          wind_direction?: number | null
          wind_speed?: number | null
          work_impact?: string | null
        }
        Update: {
          air_quality_index?: number | null
          created_at?: string
          dust_level?: string | null
          humidity?: number | null
          id?: string
          noise_level?: number | null
          precipitation?: string | null
          project_id?: string | null
          recommendations?: string | null
          recorded_at?: string
          recorded_by?: string
          site_id?: string | null
          temperature?: number | null
          visibility?: string | null
          weather_source?: string | null
          wind_direction?: number | null
          wind_speed?: number | null
          work_impact?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "environmental_conditions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "environmental_conditions_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_tracking: {
        Row: {
          created_at: string
          current_location: unknown | null
          equipment_id: string
          equipment_name: string
          equipment_type: string
          fuel_level: number | null
          gps_tracking_enabled: boolean | null
          hours_operated: number | null
          id: string
          last_location_update: string | null
          last_maintenance: string | null
          maintenance_due: boolean | null
          next_maintenance: string | null
          notes: string | null
          operator_id: string | null
          operator_name: string | null
          project_id: string | null
          site_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_location?: unknown | null
          equipment_id: string
          equipment_name: string
          equipment_type: string
          fuel_level?: number | null
          gps_tracking_enabled?: boolean | null
          hours_operated?: number | null
          id?: string
          last_location_update?: string | null
          last_maintenance?: string | null
          maintenance_due?: boolean | null
          next_maintenance?: string | null
          notes?: string | null
          operator_id?: string | null
          operator_name?: string | null
          project_id?: string | null
          site_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_location?: unknown | null
          equipment_id?: string
          equipment_name?: string
          equipment_type?: string
          fuel_level?: number | null
          gps_tracking_enabled?: boolean | null
          hours_operated?: number | null
          id?: string
          last_location_update?: string | null
          last_maintenance?: string | null
          maintenance_due?: boolean | null
          next_maintenance?: string | null
          notes?: string | null
          operator_id?: string | null
          operator_name?: string | null
          project_id?: string | null
          site_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_tracking_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "field_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_tracking_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      field_crews: {
        Row: {
          created_at: string
          crew_leader_id: string | null
          current_crew_size: number | null
          current_work_order_id: string | null
          equipment_assigned: string[] | null
          id: string
          max_crew_size: number | null
          name: string
          notes: string | null
          project_id: string | null
          shift_end: string | null
          shift_start: string | null
          site_id: string | null
          specialty: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          crew_leader_id?: string | null
          current_crew_size?: number | null
          current_work_order_id?: string | null
          equipment_assigned?: string[] | null
          id?: string
          max_crew_size?: number | null
          name: string
          notes?: string | null
          project_id?: string | null
          shift_end?: string | null
          shift_start?: string | null
          site_id?: string | null
          specialty: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          crew_leader_id?: string | null
          current_crew_size?: number | null
          current_work_order_id?: string | null
          equipment_assigned?: string[] | null
          id?: string
          max_crew_size?: number | null
          name?: string
          notes?: string | null
          project_id?: string | null
          shift_end?: string | null
          shift_start?: string | null
          site_id?: string | null
          specialty?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_crews_crew_leader_id_fkey"
            columns: ["crew_leader_id"]
            isOneToOne: false
            referencedRelation: "field_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_crews_current_work_order_id_fkey"
            columns: ["current_work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_crews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_crews_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      field_photos: {
        Row: {
          caption: string | null
          created_at: string
          description: string | null
          direction_facing: number | null
          file_name: string
          file_size: number
          file_url: string
          gps_coordinates: unknown | null
          id: string
          is_after_photo: boolean | null
          is_before_photo: boolean | null
          is_progress_photo: boolean | null
          is_quality_photo: boolean | null
          is_safety_photo: boolean | null
          metadata: Json | null
          photo_date: string
          photographer: string
          project_id: string | null
          related_id: string | null
          related_table: string | null
          site_id: string | null
          tags: string[] | null
          weather_conditions: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          description?: string | null
          direction_facing?: number | null
          file_name: string
          file_size: number
          file_url: string
          gps_coordinates?: unknown | null
          id?: string
          is_after_photo?: boolean | null
          is_before_photo?: boolean | null
          is_progress_photo?: boolean | null
          is_quality_photo?: boolean | null
          is_safety_photo?: boolean | null
          metadata?: Json | null
          photo_date?: string
          photographer: string
          project_id?: string | null
          related_id?: string | null
          related_table?: string | null
          site_id?: string | null
          tags?: string[] | null
          weather_conditions?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          description?: string | null
          direction_facing?: number | null
          file_name?: string
          file_size?: number
          file_url?: string
          gps_coordinates?: unknown | null
          id?: string
          is_after_photo?: boolean | null
          is_before_photo?: boolean | null
          is_progress_photo?: boolean | null
          is_quality_photo?: boolean | null
          is_safety_photo?: boolean | null
          metadata?: Json | null
          photo_date?: string
          photographer?: string
          project_id?: string | null
          related_id?: string | null
          related_table?: string | null
          site_id?: string | null
          tags?: string[] | null
          weather_conditions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "field_photos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_photos_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      field_sites: {
        Row: {
          access_instructions: string | null
          address: string | null
          boundaries: unknown | null
          coordinates: unknown | null
          created_at: string
          id: string
          name: string
          project_id: string | null
          safety_requirements: string[] | null
          site_manager: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          access_instructions?: string | null
          address?: string | null
          boundaries?: unknown | null
          coordinates?: unknown | null
          created_at?: string
          id?: string
          name: string
          project_id?: string | null
          safety_requirements?: string[] | null
          site_manager?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          access_instructions?: string | null
          address?: string | null
          boundaries?: unknown | null
          coordinates?: unknown | null
          created_at?: string
          id?: string
          name?: string
          project_id?: string | null
          safety_requirements?: string[] | null
          site_manager?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_sites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      field_workers: {
        Row: {
          background_check_date: string | null
          certifications: Json | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          current_location: unknown | null
          current_project_id: string | null
          current_site_id: string | null
          drug_test_date: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          employee_id: string
          hire_date: string | null
          hourly_rate: number | null
          id: string
          last_location_update: string | null
          name: string
          notes: string | null
          role: string
          safety_training_expiry: string | null
          shift_end: string | null
          shift_start: string | null
          specialty: string[] | null
          status: string | null
          supervisor: string | null
          updated_at: string
        }
        Insert: {
          background_check_date?: string | null
          certifications?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_location?: unknown | null
          current_project_id?: string | null
          current_site_id?: string | null
          drug_test_date?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          employee_id: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          last_location_update?: string | null
          name: string
          notes?: string | null
          role: string
          safety_training_expiry?: string | null
          shift_end?: string | null
          shift_start?: string | null
          specialty?: string[] | null
          status?: string | null
          supervisor?: string | null
          updated_at?: string
        }
        Update: {
          background_check_date?: string | null
          certifications?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_location?: unknown | null
          current_project_id?: string | null
          current_site_id?: string | null
          drug_test_date?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          employee_id?: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          last_location_update?: string | null
          name?: string
          notes?: string | null
          role?: string
          safety_training_expiry?: string | null
          shift_end?: string | null
          shift_start?: string | null
          specialty?: string[] | null
          status?: string | null
          supervisor?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_workers_current_project_id_fkey"
            columns: ["current_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_workers_current_site_id_fkey"
            columns: ["current_site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_fuel_records: {
        Row: {
          cost_per_gallon: number
          created_at: string
          driver_id: string | null
          fuel_date: string
          fuel_station: string | null
          gallons_purchased: number
          id: string
          notes: string | null
          odometer_reading: number
          receipt_photo: string | null
          total_cost: number
          vehicle_id: string
        }
        Insert: {
          cost_per_gallon: number
          created_at?: string
          driver_id?: string | null
          fuel_date?: string
          fuel_station?: string | null
          gallons_purchased: number
          id?: string
          notes?: string | null
          odometer_reading: number
          receipt_photo?: string | null
          total_cost: number
          vehicle_id: string
        }
        Update: {
          cost_per_gallon?: number
          created_at?: string
          driver_id?: string | null
          fuel_date?: string
          fuel_station?: string | null
          gallons_purchased?: number
          id?: string
          notes?: string | null
          odometer_reading?: number
          receipt_photo?: string | null
          total_cost?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fleet_fuel_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "field_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_fuel_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_inspections: {
        Row: {
          checklist_items: Json
          corrective_actions: string | null
          created_at: string
          defects_found: string[] | null
          engine_hours: number | null
          id: string
          inspection_date: string
          inspection_type: string
          inspector_id: string
          mileage: number | null
          next_inspection_due: string | null
          notes: string | null
          overall_condition: string
          pass_fail: string
          photos: string[] | null
          vehicle_id: string
        }
        Insert: {
          checklist_items: Json
          corrective_actions?: string | null
          created_at?: string
          defects_found?: string[] | null
          engine_hours?: number | null
          id?: string
          inspection_date?: string
          inspection_type: string
          inspector_id: string
          mileage?: number | null
          next_inspection_due?: string | null
          notes?: string | null
          overall_condition: string
          pass_fail: string
          photos?: string[] | null
          vehicle_id: string
        }
        Update: {
          checklist_items?: Json
          corrective_actions?: string | null
          created_at?: string
          defects_found?: string[] | null
          engine_hours?: number | null
          id?: string
          inspection_date?: string
          inspection_type?: string
          inspector_id?: string
          mileage?: number | null
          next_inspection_due?: string | null
          notes?: string | null
          overall_condition?: string
          pass_fail?: string
          photos?: string[] | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fleet_inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "field_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_inspections_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_maintenance_records: {
        Row: {
          attachments: string[] | null
          cost: number | null
          created_at: string
          description: string
          engine_hours_at_service: number | null
          id: string
          invoice_number: string | null
          maintenance_type: string
          mileage_at_service: number | null
          next_service_date: string | null
          next_service_mileage: number | null
          notes: string | null
          parts_replaced: string[] | null
          performed_by: string
          service_date: string
          shop_name: string | null
          vehicle_id: string
          warranty_expires: string | null
        }
        Insert: {
          attachments?: string[] | null
          cost?: number | null
          created_at?: string
          description: string
          engine_hours_at_service?: number | null
          id?: string
          invoice_number?: string | null
          maintenance_type: string
          mileage_at_service?: number | null
          next_service_date?: string | null
          next_service_mileage?: number | null
          notes?: string | null
          parts_replaced?: string[] | null
          performed_by: string
          service_date: string
          shop_name?: string | null
          vehicle_id: string
          warranty_expires?: string | null
        }
        Update: {
          attachments?: string[] | null
          cost?: number | null
          created_at?: string
          description?: string
          engine_hours_at_service?: number | null
          id?: string
          invoice_number?: string | null
          maintenance_type?: string
          mileage_at_service?: number | null
          next_service_date?: string | null
          next_service_mileage?: number | null
          notes?: string | null
          parts_replaced?: string[] | null
          performed_by?: string
          service_date?: string
          shop_name?: string | null
          vehicle_id?: string
          warranty_expires?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fleet_maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_trip_logs: {
        Row: {
          created_at: string
          driver_id: string
          end_location: unknown | null
          end_mileage: number | null
          fuel_used: number | null
          id: string
          project_id: string | null
          purpose: string
          route_data: Json | null
          start_location: unknown | null
          start_mileage: number
          total_miles: number | null
          trip_end: string | null
          trip_start: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          driver_id: string
          end_location?: unknown | null
          end_mileage?: number | null
          fuel_used?: number | null
          id?: string
          project_id?: string | null
          purpose: string
          route_data?: Json | null
          start_location?: unknown | null
          start_mileage: number
          total_miles?: number | null
          trip_end?: string | null
          trip_start: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          driver_id?: string
          end_location?: unknown | null
          end_mileage?: number | null
          fuel_used?: number | null
          id?: string
          project_id?: string | null
          purpose?: string
          route_data?: Json | null
          start_location?: unknown | null
          start_mileage?: number
          total_miles?: number | null
          trip_end?: string | null
          trip_start?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fleet_trip_logs_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "field_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_trip_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_trip_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_vehicles: {
        Row: {
          assigned_driver_id: string | null
          created_at: string
          current_engine_hours: number | null
          current_fuel_level: number | null
          current_location: unknown | null
          current_mileage: number | null
          current_project_id: string | null
          fuel_capacity: number | null
          fuel_type: string | null
          gps_device_id: string | null
          home_yard_location: string | null
          id: string
          inspection_expiry: string | null
          insurance_expiry: string | null
          insurance_policy_number: string | null
          last_gps_update: string | null
          license_plate: string | null
          make: string
          model: string
          purchase_cost: number | null
          purchase_date: string | null
          registration_expiry: string | null
          status: string
          updated_at: string
          vehicle_number: string
          vehicle_type: string
          vin: string | null
          year: number
        }
        Insert: {
          assigned_driver_id?: string | null
          created_at?: string
          current_engine_hours?: number | null
          current_fuel_level?: number | null
          current_location?: unknown | null
          current_mileage?: number | null
          current_project_id?: string | null
          fuel_capacity?: number | null
          fuel_type?: string | null
          gps_device_id?: string | null
          home_yard_location?: string | null
          id?: string
          inspection_expiry?: string | null
          insurance_expiry?: string | null
          insurance_policy_number?: string | null
          last_gps_update?: string | null
          license_plate?: string | null
          make: string
          model: string
          purchase_cost?: number | null
          purchase_date?: string | null
          registration_expiry?: string | null
          status?: string
          updated_at?: string
          vehicle_number: string
          vehicle_type: string
          vin?: string | null
          year: number
        }
        Update: {
          assigned_driver_id?: string | null
          created_at?: string
          current_engine_hours?: number | null
          current_fuel_level?: number | null
          current_location?: unknown | null
          current_mileage?: number | null
          current_project_id?: string | null
          fuel_capacity?: number | null
          fuel_type?: string | null
          gps_device_id?: string | null
          home_yard_location?: string | null
          id?: string
          inspection_expiry?: string | null
          insurance_expiry?: string | null
          insurance_policy_number?: string | null
          last_gps_update?: string | null
          license_plate?: string | null
          make?: string
          model?: string
          purchase_cost?: number | null
          purchase_date?: string | null
          registration_expiry?: string | null
          status?: string
          updated_at?: string
          vehicle_number?: string
          vehicle_type?: string
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "fleet_vehicles_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "field_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_vehicles_current_project_id_fkey"
            columns: ["current_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      material_inventory: {
        Row: {
          category: string
          created_at: string
          expiry_date: string | null
          id: string
          last_delivery_date: string | null
          location_on_site: string | null
          lot_number: string | null
          material_code: string | null
          material_name: string
          minimum_stock: number | null
          next_delivery_date: string | null
          notes: string | null
          project_id: string | null
          quality_status: string | null
          quantity_available: number | null
          quantity_on_hand: number
          quantity_reserved: number | null
          site_id: string | null
          storage_requirements: string | null
          supplier: string | null
          total_value: number | null
          unit: string
          unit_cost: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          last_delivery_date?: string | null
          location_on_site?: string | null
          lot_number?: string | null
          material_code?: string | null
          material_name: string
          minimum_stock?: number | null
          next_delivery_date?: string | null
          notes?: string | null
          project_id?: string | null
          quality_status?: string | null
          quantity_available?: number | null
          quantity_on_hand?: number
          quantity_reserved?: number | null
          site_id?: string | null
          storage_requirements?: string | null
          supplier?: string | null
          total_value?: number | null
          unit: string
          unit_cost?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          last_delivery_date?: string | null
          location_on_site?: string | null
          lot_number?: string | null
          material_code?: string | null
          material_name?: string
          minimum_stock?: number | null
          next_delivery_date?: string | null
          notes?: string | null
          project_id?: string | null
          quality_status?: string | null
          quantity_available?: number | null
          quantity_on_hand?: number
          quantity_reserved?: number | null
          site_id?: string | null
          storage_requirements?: string | null
          supplier?: string | null
          total_value?: number | null
          unit?: string
          unit_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_inventory_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_inventory_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
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
      punchlist_items: {
        Row: {
          assigned_crew: string | null
          assigned_to: string
          category: string | null
          corrective_action: string | null
          cost_impact: number | null
          created_at: string
          description: string
          detailed_description: string | null
          due_date: string
          gps_coordinates: unknown | null
          id: string
          location: string
          photos_after: string[] | null
          photos_before: string[] | null
          priority: string | null
          project_id: string | null
          reporter_name: string
          resolution_date: string | null
          resolution_notes: string | null
          resolved_by: string | null
          root_cause: string | null
          schedule_impact_days: number | null
          severity: string
          site_id: string | null
          station_reference: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assigned_crew?: string | null
          assigned_to: string
          category?: string | null
          corrective_action?: string | null
          cost_impact?: number | null
          created_at?: string
          description: string
          detailed_description?: string | null
          due_date: string
          gps_coordinates?: unknown | null
          id: string
          location: string
          photos_after?: string[] | null
          photos_before?: string[] | null
          priority?: string | null
          project_id?: string | null
          reporter_name: string
          resolution_date?: string | null
          resolution_notes?: string | null
          resolved_by?: string | null
          root_cause?: string | null
          schedule_impact_days?: number | null
          severity: string
          site_id?: string | null
          station_reference?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assigned_crew?: string | null
          assigned_to?: string
          category?: string | null
          corrective_action?: string | null
          cost_impact?: number | null
          created_at?: string
          description?: string
          detailed_description?: string | null
          due_date?: string
          gps_coordinates?: unknown | null
          id?: string
          location?: string
          photos_after?: string[] | null
          photos_before?: string[] | null
          priority?: string | null
          project_id?: string | null
          reporter_name?: string
          resolution_date?: string | null
          resolution_notes?: string | null
          resolved_by?: string | null
          root_cause?: string | null
          schedule_impact_days?: number | null
          severity?: string
          site_id?: string | null
          station_reference?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "punchlist_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "punchlist_items_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_inspections: {
        Row: {
          acceptance_criteria: string | null
          approval_date: string | null
          approved_by: string | null
          corrective_actions_required: string | null
          created_at: string
          deficiencies: string[] | null
          documents: string[] | null
          id: string
          inspection_date: string
          inspection_type: string
          inspector_name: string
          location: string
          measurements: Json | null
          notes: string | null
          pass_fail: string | null
          photos: string[] | null
          project_id: string | null
          re_inspection_date: string | null
          re_inspection_required: boolean | null
          site_id: string | null
          specification_reference: string | null
          station_reference: string | null
          test_results: Json | null
          updated_at: string
          work_order_id: string | null
        }
        Insert: {
          acceptance_criteria?: string | null
          approval_date?: string | null
          approved_by?: string | null
          corrective_actions_required?: string | null
          created_at?: string
          deficiencies?: string[] | null
          documents?: string[] | null
          id?: string
          inspection_date?: string
          inspection_type: string
          inspector_name: string
          location: string
          measurements?: Json | null
          notes?: string | null
          pass_fail?: string | null
          photos?: string[] | null
          project_id?: string | null
          re_inspection_date?: string | null
          re_inspection_required?: boolean | null
          site_id?: string | null
          specification_reference?: string | null
          station_reference?: string | null
          test_results?: Json | null
          updated_at?: string
          work_order_id?: string | null
        }
        Update: {
          acceptance_criteria?: string | null
          approval_date?: string | null
          approved_by?: string | null
          corrective_actions_required?: string | null
          created_at?: string
          deficiencies?: string[] | null
          documents?: string[] | null
          id?: string
          inspection_date?: string
          inspection_type?: string
          inspector_name?: string
          location?: string
          measurements?: Json | null
          notes?: string | null
          pass_fail?: string | null
          photos?: string[] | null
          project_id?: string | null
          re_inspection_date?: string | null
          re_inspection_required?: boolean | null
          site_id?: string | null
          specification_reference?: string | null
          station_reference?: string | null
          test_results?: Json | null
          updated_at?: string
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quality_inspections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quality_inspections_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quality_inspections_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
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
      safety_incidents: {
        Row: {
          body_part_affected: string | null
          corrective_actions: string | null
          created_at: string
          days_away_from_work: number | null
          description: string
          documents: string[] | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          gps_coordinates: unknown | null
          hospital_name: string | null
          id: string
          immediate_cause: string | null
          incident_date: string
          incident_number: string
          incident_type: string
          injured_person: string | null
          injury_type: string | null
          investigation_completed: boolean | null
          investigation_date: string | null
          investigation_required: boolean | null
          investigator: string | null
          location: string
          medical_treatment_required: boolean | null
          osha_recordable: boolean | null
          photos: string[] | null
          preventive_measures: string | null
          project_id: string | null
          regulatory_notification_required: boolean | null
          reported_by: string
          reported_date: string
          root_cause: string | null
          severity: string
          site_id: string | null
          status: string | null
          updated_at: string
          witnesses: string[] | null
        }
        Insert: {
          body_part_affected?: string | null
          corrective_actions?: string | null
          created_at?: string
          days_away_from_work?: number | null
          description: string
          documents?: string[] | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          gps_coordinates?: unknown | null
          hospital_name?: string | null
          id?: string
          immediate_cause?: string | null
          incident_date: string
          incident_number: string
          incident_type: string
          injured_person?: string | null
          injury_type?: string | null
          investigation_completed?: boolean | null
          investigation_date?: string | null
          investigation_required?: boolean | null
          investigator?: string | null
          location: string
          medical_treatment_required?: boolean | null
          osha_recordable?: boolean | null
          photos?: string[] | null
          preventive_measures?: string | null
          project_id?: string | null
          regulatory_notification_required?: boolean | null
          reported_by: string
          reported_date?: string
          root_cause?: string | null
          severity: string
          site_id?: string | null
          status?: string | null
          updated_at?: string
          witnesses?: string[] | null
        }
        Update: {
          body_part_affected?: string | null
          corrective_actions?: string | null
          created_at?: string
          days_away_from_work?: number | null
          description?: string
          documents?: string[] | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          gps_coordinates?: unknown | null
          hospital_name?: string | null
          id?: string
          immediate_cause?: string | null
          incident_date?: string
          incident_number?: string
          incident_type?: string
          injured_person?: string | null
          injury_type?: string | null
          investigation_completed?: boolean | null
          investigation_date?: string | null
          investigation_required?: boolean | null
          investigator?: string | null
          location?: string
          medical_treatment_required?: boolean | null
          osha_recordable?: boolean | null
          photos?: string[] | null
          preventive_measures?: string | null
          project_id?: string | null
          regulatory_notification_required?: boolean | null
          reported_by?: string
          reported_date?: string
          root_cause?: string | null
          severity?: string
          site_id?: string | null
          status?: string | null
          updated_at?: string
          witnesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "safety_incidents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safety_incidents_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_visits: {
        Row: {
          attachments: string[] | null
          attendees: string[] | null
          created_at: string
          duration_minutes: number | null
          environmental_notes: string | null
          findings: string | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          gps_location: unknown | null
          id: string
          inspector_id: string | null
          inspector_name: string
          photos: string[] | null
          project_id: string | null
          purpose: string
          recommendations: string | null
          safety_observations: string | null
          site_id: string | null
          status: string | null
          temperature: number | null
          updated_at: string
          visibility: string | null
          visit_date: string
          weather_conditions: string | null
          wind_speed: number | null
        }
        Insert: {
          attachments?: string[] | null
          attendees?: string[] | null
          created_at?: string
          duration_minutes?: number | null
          environmental_notes?: string | null
          findings?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          gps_location?: unknown | null
          id?: string
          inspector_id?: string | null
          inspector_name: string
          photos?: string[] | null
          project_id?: string | null
          purpose: string
          recommendations?: string | null
          safety_observations?: string | null
          site_id?: string | null
          status?: string | null
          temperature?: number | null
          updated_at?: string
          visibility?: string | null
          visit_date?: string
          weather_conditions?: string | null
          wind_speed?: number | null
        }
        Update: {
          attachments?: string[] | null
          attendees?: string[] | null
          created_at?: string
          duration_minutes?: number | null
          environmental_notes?: string | null
          findings?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          gps_location?: unknown | null
          id?: string
          inspector_id?: string | null
          inspector_name?: string
          photos?: string[] | null
          project_id?: string | null
          purpose?: string
          recommendations?: string | null
          safety_observations?: string | null
          site_id?: string | null
          status?: string | null
          temperature?: number | null
          updated_at?: string
          visibility?: string | null
          visit_date?: string
          weather_conditions?: string | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "site_visits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_visits_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      subcontractors: {
        Row: {
          address: string | null
          bond_amount: number | null
          bond_expiry: string | null
          certifications: string[] | null
          company_name: string
          contact_email: string | null
          contact_person: string
          contact_phone: string
          contract_value: number | null
          created_at: string
          current_projects: string[] | null
          equipment_owned: string[] | null
          id: string
          insurance_certificate: string | null
          insurance_expiry: string | null
          key_personnel: Json | null
          license_expiry: string | null
          license_number: string | null
          notes: string | null
          overall_rating: number | null
          prequalification_expiry: string | null
          prequalified: boolean | null
          quality_rating: number | null
          safety_rating: number | null
          schedule_rating: number | null
          status: string | null
          trade_specialty: string
          updated_at: string
          work_completed_value: number | null
        }
        Insert: {
          address?: string | null
          bond_amount?: number | null
          bond_expiry?: string | null
          certifications?: string[] | null
          company_name: string
          contact_email?: string | null
          contact_person: string
          contact_phone: string
          contract_value?: number | null
          created_at?: string
          current_projects?: string[] | null
          equipment_owned?: string[] | null
          id?: string
          insurance_certificate?: string | null
          insurance_expiry?: string | null
          key_personnel?: Json | null
          license_expiry?: string | null
          license_number?: string | null
          notes?: string | null
          overall_rating?: number | null
          prequalification_expiry?: string | null
          prequalified?: boolean | null
          quality_rating?: number | null
          safety_rating?: number | null
          schedule_rating?: number | null
          status?: string | null
          trade_specialty: string
          updated_at?: string
          work_completed_value?: number | null
        }
        Update: {
          address?: string | null
          bond_amount?: number | null
          bond_expiry?: string | null
          certifications?: string[] | null
          company_name?: string
          contact_email?: string | null
          contact_person?: string
          contact_phone?: string
          contract_value?: number | null
          created_at?: string
          current_projects?: string[] | null
          equipment_owned?: string[] | null
          id?: string
          insurance_certificate?: string | null
          insurance_expiry?: string | null
          key_personnel?: Json | null
          license_expiry?: string | null
          license_number?: string | null
          notes?: string | null
          overall_rating?: number | null
          prequalification_expiry?: string | null
          prequalified?: boolean | null
          quality_rating?: number | null
          safety_rating?: number | null
          schedule_rating?: number | null
          status?: string | null
          trade_specialty?: string
          updated_at?: string
          work_completed_value?: number | null
        }
        Relationships: []
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
      time_clock_records: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          break_end: string | null
          break_start: string | null
          clock_in: string
          clock_in_photo: string | null
          clock_out: string | null
          clock_out_photo: string | null
          created_at: string
          employee_id: string
          id: string
          location: unknown | null
          lunch_end: string | null
          lunch_start: string | null
          notes: string | null
          overtime_hours: number | null
          project_id: string | null
          regular_hours: number | null
          status: string
          total_hours: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          break_end?: string | null
          break_start?: string | null
          clock_in: string
          clock_in_photo?: string | null
          clock_out?: string | null
          clock_out_photo?: string | null
          created_at?: string
          employee_id: string
          id?: string
          location?: unknown | null
          lunch_end?: string | null
          lunch_start?: string | null
          notes?: string | null
          overtime_hours?: number | null
          project_id?: string | null
          regular_hours?: number | null
          status?: string
          total_hours?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          break_end?: string | null
          break_start?: string | null
          clock_in?: string
          clock_in_photo?: string | null
          clock_out?: string | null
          clock_out_photo?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          location?: unknown | null
          lunch_end?: string | null
          lunch_start?: string | null
          notes?: string | null
          overtime_hours?: number | null
          project_id?: string | null
          regular_hours?: number | null
          status?: string
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "time_clock_records_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_clock_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_clock_records_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_assignments: {
        Row: {
          actual_return_date: string | null
          assigned_to_crew_id: string | null
          assigned_to_worker_id: string | null
          checked_out_by: string
          checkout_date: string
          checkout_notes: string | null
          condition_at_checkout: string | null
          condition_at_return: string | null
          created_at: string
          expected_return_date: string | null
          id: string
          maintenance_notes: string | null
          maintenance_required: boolean | null
          project_id: string | null
          replacement_cost: number | null
          return_notes: string | null
          returned_to: string | null
          serial_number: string | null
          site_id: string | null
          status: string | null
          tool_id: string
          tool_name: string
          tool_type: string
          updated_at: string
        }
        Insert: {
          actual_return_date?: string | null
          assigned_to_crew_id?: string | null
          assigned_to_worker_id?: string | null
          checked_out_by: string
          checkout_date?: string
          checkout_notes?: string | null
          condition_at_checkout?: string | null
          condition_at_return?: string | null
          created_at?: string
          expected_return_date?: string | null
          id?: string
          maintenance_notes?: string | null
          maintenance_required?: boolean | null
          project_id?: string | null
          replacement_cost?: number | null
          return_notes?: string | null
          returned_to?: string | null
          serial_number?: string | null
          site_id?: string | null
          status?: string | null
          tool_id: string
          tool_name: string
          tool_type: string
          updated_at?: string
        }
        Update: {
          actual_return_date?: string | null
          assigned_to_crew_id?: string | null
          assigned_to_worker_id?: string | null
          checked_out_by?: string
          checkout_date?: string
          checkout_notes?: string | null
          condition_at_checkout?: string | null
          condition_at_return?: string | null
          created_at?: string
          expected_return_date?: string | null
          id?: string
          maintenance_notes?: string | null
          maintenance_required?: boolean | null
          project_id?: string | null
          replacement_cost?: number | null
          return_notes?: string | null
          returned_to?: string | null
          serial_number?: string | null
          site_id?: string | null
          status?: string | null
          tool_id?: string
          tool_name?: string
          tool_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_assignments_assigned_to_crew_id_fkey"
            columns: ["assigned_to_crew_id"]
            isOneToOne: false
            referencedRelation: "field_crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_assignments_assigned_to_worker_id_fkey"
            columns: ["assigned_to_worker_id"]
            isOneToOne: false
            referencedRelation: "field_workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_assignments_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      utility_adjustments: {
        Row: {
          actual_date: string | null
          adjustment_type: string | null
          billing_info: string | null
          completion_notes: string | null
          contact_email: string | null
          contact_name: string
          contact_phone: string
          coordination_notes: string | null
          cost: number | null
          created_at: string
          delay_reason: string | null
          description: string
          follow_up_date: string | null
          follow_up_required: boolean | null
          gps_coordinates: unknown | null
          id: string
          location: string
          permit_number: string | null
          permit_required: boolean | null
          permit_status: string | null
          photos: string[] | null
          project_id: string | null
          related_documents: string[] | null
          scheduled_date: string
          secondary_contact: string | null
          site_id: string | null
          station_reference: string | null
          status: string | null
          updated_at: string
          utility_company: string
          utility_type: string
        }
        Insert: {
          actual_date?: string | null
          adjustment_type?: string | null
          billing_info?: string | null
          completion_notes?: string | null
          contact_email?: string | null
          contact_name: string
          contact_phone: string
          coordination_notes?: string | null
          cost?: number | null
          created_at?: string
          delay_reason?: string | null
          description: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          gps_coordinates?: unknown | null
          id: string
          location: string
          permit_number?: string | null
          permit_required?: boolean | null
          permit_status?: string | null
          photos?: string[] | null
          project_id?: string | null
          related_documents?: string[] | null
          scheduled_date: string
          secondary_contact?: string | null
          site_id?: string | null
          station_reference?: string | null
          status?: string | null
          updated_at?: string
          utility_company: string
          utility_type: string
        }
        Update: {
          actual_date?: string | null
          adjustment_type?: string | null
          billing_info?: string | null
          completion_notes?: string | null
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string
          coordination_notes?: string | null
          cost?: number | null
          created_at?: string
          delay_reason?: string | null
          description?: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          gps_coordinates?: unknown | null
          id?: string
          location?: string
          permit_number?: string | null
          permit_required?: boolean | null
          permit_status?: string | null
          photos?: string[] | null
          project_id?: string | null
          related_documents?: string[] | null
          scheduled_date?: string
          secondary_contact?: string | null
          site_id?: string | null
          station_reference?: string | null
          status?: string | null
          updated_at?: string
          utility_company?: string
          utility_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "utility_adjustments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "utility_adjustments_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          actual_hours: number | null
          approved_at: string | null
          approved_by: string | null
          assigned_crew: string | null
          assigned_to: string
          completion_date: string | null
          completion_notes: string | null
          created_at: string
          created_by: string
          crew_size: number | null
          description: string
          due_date: string
          equipment_required: string[] | null
          estimated_hours: number | null
          gps_coordinates: unknown | null
          id: string
          location: string | null
          materials_required: Json | null
          photos: string[] | null
          priority: string | null
          progress_notes: string | null
          project_id: string | null
          punchlist_item_id: string | null
          quality_check_completed: boolean | null
          quality_check_notes: string | null
          quality_check_required: boolean | null
          related_documents: string[] | null
          safety_requirements: string[] | null
          scope_of_work: string | null
          site_id: string | null
          special_instructions: string | null
          start_date: string | null
          station_reference: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_crew?: string | null
          assigned_to: string
          completion_date?: string | null
          completion_notes?: string | null
          created_at?: string
          created_by: string
          crew_size?: number | null
          description: string
          due_date: string
          equipment_required?: string[] | null
          estimated_hours?: number | null
          gps_coordinates?: unknown | null
          id: string
          location?: string | null
          materials_required?: Json | null
          photos?: string[] | null
          priority?: string | null
          progress_notes?: string | null
          project_id?: string | null
          punchlist_item_id?: string | null
          quality_check_completed?: boolean | null
          quality_check_notes?: string | null
          quality_check_required?: boolean | null
          related_documents?: string[] | null
          safety_requirements?: string[] | null
          scope_of_work?: string | null
          site_id?: string | null
          special_instructions?: string | null
          start_date?: string | null
          station_reference?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          approved_at?: string | null
          approved_by?: string | null
          assigned_crew?: string | null
          assigned_to?: string
          completion_date?: string | null
          completion_notes?: string | null
          created_at?: string
          created_by?: string
          crew_size?: number | null
          description?: string
          due_date?: string
          equipment_required?: string[] | null
          estimated_hours?: number | null
          gps_coordinates?: unknown | null
          id?: string
          location?: string | null
          materials_required?: Json | null
          photos?: string[] | null
          priority?: string | null
          progress_notes?: string | null
          project_id?: string | null
          punchlist_item_id?: string | null
          quality_check_completed?: boolean | null
          quality_check_notes?: string | null
          quality_check_required?: boolean | null
          related_documents?: string[] | null
          safety_requirements?: string[] | null
          scope_of_work?: string | null
          site_id?: string | null
          special_instructions?: string | null
          start_date?: string | null
          station_reference?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_punchlist_item_id_fkey"
            columns: ["punchlist_item_id"]
            isOneToOne: false
            referencedRelation: "punchlist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "field_sites"
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
