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
      complaints: {
        Row: {
          citizen_id: string
          created_at: string // Note: Typically string in DB, number (timestamp) in app
          description: string
          employee_id: string | null
          id: string
          location: Json // Consider defining a stricter type if possible
          media: string[] | null
          notes: string | null
          priority: string // Consider Enum type in DB ('low', 'medium', 'high', 'critical')
          resolved_at: string | null // Note: Typically string in DB, number (timestamp) in app
          status: string // Consider Enum type in DB ('pending', 'inProgress', 'resolved', 'rejected')
          type: string // Consider Enum type in DB ('pothole', 'garbage', 'streetLight', 'waterLeakage', 'roadDamage', 'other')
          updated_at: string | null // Note: Typically string in DB, number (timestamp) in app
        }
        Insert: {
          citizen_id: string
          created_at?: string | null // Default value in DB often handles this
          description: string
          employee_id?: string | null
          id?: string // Default value in DB often handles this
          location: Json
          media?: string[] | null
          notes?: string | null
          priority?: string // Default value in DB often handles this
          resolved_at?: string | null
          status?: string // Default value in DB often handles this
          type: string
          updated_at?: string | null // Default value/trigger in DB often handles this
        }
        Update: {
          citizen_id?: string
          created_at?: string | null
          description?: string
          employee_id?: string | null
          id?: string
          location?: Json
          media?: string[] | null
          notes?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          type?: string
          updated_at?: string | null // Default value/trigger in DB often handles this
        }
        Relationships: [
          {
            foreignKeyName: "complaints_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trees: {
        Row: {
          created_at: string | null // Note: Timestamps consistency
          id: string
          // Mismatch: 'images' in DB vs 'imageUrl' in code usage. Consider aligning.
          images: string[] | null
          location: Json
          planted_date: string // Note: Timestamps consistency (string vs number)
          tree_name: string
          updated_at: string | null // Note: Timestamps consistency
          user_id: string // Matches 'userId' used in code fix
          watering_frequency: string | null
          watering_history: Json[] | null // Consider stricter type
          watering_reminder: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          images?: string[] | null
          location: Json
          planted_date: string // Expects string
          tree_name: string
          updated_at?: string | null
          user_id: string
          watering_frequency?: string | null
          watering_history?: Json[] | null
          watering_reminder?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          images?: string[] | null
          location?: Json
          planted_date?: string
          tree_name?: string
          updated_at?: string | null
          user_id?: string
          watering_frequency?: string | null
          watering_history?: Json[] | null
          watering_reminder?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "trees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          created_at: string | null // Note: Timestamps consistency
          email: string
          id: string
          name: string
          phone: string | null
          pin_code: string | null // Mismatch: 'pin_code' vs 'pinCode' in app type
          profile_image: string | null // Mismatch: 'profile_image' vs 'profileImage' in app type
          role: string // Consider Enum type in DB ('citizen', 'employee', 'admin')
          updated_at: string | null // Note: Timestamps consistency
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          id: string // Provided by Supabase Auth trigger usually
          name: string
          phone?: string | null
          pin_code?: string | null
          profile_image?: string | null
          role: string // Default value in DB often handles this
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          pin_code?: string | null
          profile_image?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          // This relationship seems incorrect - users.id referencing auth.users.id is usually handled by trigger
          // Keeping it as generated, but review if causing issues.
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users" // Should likely be referencedRelation: "users", schema: "auth"
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
      [_ in never]: never // Define Enums here if used in DB (e.g., user_role, complaint_status)
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}