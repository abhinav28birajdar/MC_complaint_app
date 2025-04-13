export type Database = {
    public: {
      Tables: {
        users: {
          Row: {
            id: string;
            email: string;
            name: string | null;
            phone: string | null;
            address: string | null;
            pin_code: string | null;
            role: 'citizen' | 'employee' | 'admin';
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            email: string;
            name?: string | null;
            phone?: string | null;
            address?: string | null;
            pin_code?: string | null;
            role: 'citizen' | 'employee' | 'admin';
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            email?: string;
            name?: string | null;
            phone?: string | null;
            address?: string | null;
            pin_code?: string | null;
            role?: 'citizen' | 'employee' | 'admin';
            created_at?: string;
            updated_at?: string;
          };
        };
        trees: {
          Row: {
            id: string;
            user_id: string;
            tree_name: string;
            planted_date: string;
            location: {
              latitude: number;
              longitude: number;
              address: string;
            };
            images: string[];
            watering_reminder: boolean;
            watering_frequency: 'daily' | 'alternate' | 'weekly';
            watering_history: {
              date: string;
              image_url?: string;
            }[];
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            tree_name: string;
            planted_date: string;
            location: {
              latitude: number;
              longitude: number;
              address: string;
            };
            images: string[];
            watering_reminder: boolean;
            watering_frequency: 'daily' | 'alternate' | 'weekly';
            watering_history?: {
              date: string;
              image_url?: string;
            }[];
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            tree_name?: string;
            planted_date?: string;
            location?: {
              latitude: number;
              longitude: number;
              address: string;
            };
            images?: string[];
            watering_reminder?: boolean;
            watering_frequency?: 'daily' | 'alternate' | 'weekly';
            watering_history?: {
              date: string;
              image_url?: string;
            }[];
            created_at?: string;
            updated_at?: string;
          };
        };
        complaints: {
          Row: {
            id: string;
            type: 'garbage' | 'waterLeakage' | 'streetlight' | 'pothole' | 'other';
            description: string;
            location: {
              latitude: number;
              longitude: number;
              address: string;
            };
            media: string[];
            status: 'pending' | 'inProgress' | 'resolved' | 'rejected';
            citizen_id: string;
            employee_id: string | null;
            priority: 'low' | 'medium' | 'high';
            notes: string | null;
            created_at: string;
            updated_at: string;
            resolved_at: string | null;
          };
          Insert: {
            id?: string;
            type: 'garbage' | 'waterLeakage' | 'streetlight' | 'pothole' | 'other';
            description: string;
            location: {
              latitude: number;
              longitude: number;
              address: string;
            };
            media: string[];
            status?: 'pending' | 'inProgress' | 'resolved' | 'rejected';
            citizen_id: string;
            employee_id?: string | null;
            priority?: 'low' | 'medium' | 'high';
            notes?: string | null;
            created_at?: string;
            updated_at?: string;
            resolved_at?: string | null;
          };
          Update: {
            id?: string;
            type?: 'garbage' | 'waterLeakage' | 'streetlight' | 'pothole' | 'other';
            description?: string;
            location?: {
              latitude: number;
              longitude: number;
              address: string;
            };
            media?: string[];
            status?: 'pending' | 'inProgress' | 'resolved' | 'rejected';
            citizen_id?: string;
            employee_id?: string | null;
            priority?: 'low' | 'medium' | 'high';
            notes?: string | null;
            created_at?: string;
            updated_at?: string;
            resolved_at?: string | null;
          };
        };
      };
    };
  };