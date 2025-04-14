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
          created_at: string | null
          description: string
          employee_id: string | null
          id: string
          location: Json
          media: string[] | null
          notes: string | null
          priority: string
          resolved_at: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          citizen_id: string
          created_at?: string | null
          description: string
          employee_id?: string | null
          id?: string
          location: Json
          media?: string[] | null
          notes?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          type: string
          updated_at?: string | null
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
          updated_at?: string | null
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
          created_at: string | null
          id: string
          images: string[] | null
          location: Json
          planted_date: string
          tree_name: string
          updated_at: string | null
          user_id: string
          watering_frequency: string | null
          watering_history: Json[] | null
          watering_reminder: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          images?: string[] | null
          location: Json
          planted_date: string
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
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          pin_code: string | null
          profile_image: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          pin_code?: string | null
          profile_image?: string | null
          role: string
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
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
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

// ... (rest of the generated types)