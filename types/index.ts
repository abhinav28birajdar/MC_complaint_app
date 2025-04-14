export type UserRole = 'citizen' | 'employee' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  address?: string;
  phone?: string;
  pinCode?: string;
}

export type ComplaintStatus = 'pending' | 'inProgress' | 'resolved' | 'rejected';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';
export type ComplaintType = 'pothole' | 'garbage' | 'streetLight' | 'waterLeakage' | 'other'; // Example types

export interface Location {
  latitude?: number;
  longitude?: number;
  address: string;
}

export interface Complaint {
  id: string;
  type: ComplaintType;
  description: string;
  location: Location; // Use the Location interface
  media?: string[];
  status: ComplaintStatus;
  priority: ComplaintPriority;
  notes?: string;
  citizenId: string;
  employeeId?: string;
  createdAt: number; // Use number for timestamp (milliseconds)
  updatedAt: number; // Use number for timestamp (milliseconds)
  resolvedAt?: number; // Use number for timestamp (milliseconds)
}

export interface WateringEntry {
  date: number; // Use number for timestamp (milliseconds)
  imageUrl?: string;
}

export interface TreeEntry {
  id: string;
  userId: string;
  treeName: string;
  plantedDate: number; // Use number for timestamp (milliseconds)
  location: Location; // Use the Location interface
  images?: string[];
  wateringReminder?: boolean;
  wateringFrequency?: string; // e.g., 'daily', 'weekly'
  wateringHistory: WateringEntry[];
  createdAt: number; // Use number for timestamp (milliseconds)
  updatedAt: number; // Use number for timestamp (milliseconds)
}