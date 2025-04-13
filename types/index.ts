export type UserRole = 'citizen' | 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  address?: string;
  pinCode?: string;
  createdAt: number;
}

export type ComplaintStatus = 'pending' | 'inProgress' | 'resolved' | 'rejected';

export type ComplaintType = 
  | 'garbage' 
  | 'waterLeakage' 
  | 'streetlight' 
  | 'roadDamage' 
  | 'others';

export interface Complaint {
  id: string;
  type: ComplaintType;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  media: string[];
  status: ComplaintStatus;
  citizenId: string;
  employeeId?: string;
  departmentId?: string;
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TreeEntry {
  id: string;
  userId: string;
  treeName: string;
  plantedDate: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  images: string[];
  wateringReminder: boolean;
  wateringFrequency: 'daily' | 'alternate' | 'weekly';
  wateringHistory: {
    date: number;
    imageUrl?: string;
  }[];
  createdAt: number;
  updatedAt: number;
}

export interface CleaningSchedule {
  id: string;
  areaName: string;
  pinCode: string;
  weeklySchedule: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  lastCleaned?: number;
  nextScheduled?: number;
  employeeIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface RecycleRequest {
  id: string;
  userId: string;
  type: 'paper' | 'plastic' | 'ewaste' | 'clothes' | 'other';
  address: string;
  preferredDate: number;
  preferredTimeSlot: 'morning' | 'afternoon' | 'evening';
  imageUrl?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  employeeId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface MedicalWasteReport {
  id: string;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
  media: string[];
  status: 'reported' | 'reviewed' | 'resolved';
  createdAt: number;
  updatedAt: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  targetUserIds?: string[];
  targetRoles?: UserRole[];
  isRead: boolean;
  createdAt: number;
}