// src/types/index.ts

export type UserRole = 'citizen' | 'employee' | 'admin';

// Matches Supabase columns more closely, adjust as needed for app layer
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string | null; // Use profileImage consistently
  address?: string | null;
  phone?: string | null;
  pinCode?: string | null; // Use pinCode consistently
  // Timestamps can be added if needed in the app state
  // createdAt?: number;
  // updatedAt?: number;
}

export type ComplaintStatus = 'pending' | 'inProgress' | 'resolved' | 'rejected';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';
// Ensure all types used across files are defined here
export type ComplaintType = 'pothole' | 'garbage' | 'streetLight' | 'waterLeakage' | 'roadDamage' | 'other';

export interface Location {
  latitude?: number | null; // Allow null if sometimes unavailable
  longitude?: number | null;
  address: string; // Address is usually required
}

export interface Complaint {
  id: string;
  type: ComplaintType;
  description: string;
  location: Location; // Use the defined Location interface
  media?: string[]; // Array of image URIs/paths
  status: ComplaintStatus;
  priority: ComplaintPriority;
  notes?: string | null;
  citizenId: string; // Foreign key to User table
  employeeId?: string | null; // Foreign key to User table
  createdAt: number; // Use number (timestamp) in app
  updatedAt: number; // Use number (timestamp) in app
  resolvedAt?: number | null; // Use number (timestamp) in app
}

export interface WateringEntry {
  date: number; // Timestamp of watering
  imageUrl?: string; // Optional photo proof
  notes?: string; // Optional notes for the entry
}

// Define TreeEntry based on Supabase structure and app needs
export interface TreeEntry {
  id: string;
  userId: string; // Foreign key to User table
  treeName: string; // Use treeName consistently
  plantedDate: number; // Use number (timestamp) in app
  location: Location;
  images?: string[] | null; // Array of image URLs/paths (align with DB 'images')
  wateringReminder?: boolean | null;
  wateringFrequency?: string | null; // e.g., 'daily', 'weekly'
  wateringHistory: WateringEntry[]; // Array of watering events
  createdAt: number; // Use number (timestamp) in app
  updatedAt: number; // Use number (timestamp) in app
  notes?: string | null; // Added notes field if needed
}

// Represents the data needed to create a new complaint (subset of Complaint)
export type NewComplaintData = Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'resolvedAt' | 'employeeId'>;
// Represents the data needed to update a complaint
export type UpdateComplaintData = Partial<Pick<Complaint, 'status' | 'priority' | 'notes' | 'employeeId' | 'resolvedAt'>>;

// Represents the data needed to create a new tree
export type NewTreeData = Omit<TreeEntry, 'id' | 'createdAt' | 'updatedAt'>;

// Represents user profile update data structure
export interface UpdateProfileData {
    id: string; // ID is required to know which user to update
    name?: string;
    phone?: string | null;
    address?: string | null;
    pinCode?: string | null;
    profileImageUri?: string | null; // URI of the new image to upload, or null to remove
}
