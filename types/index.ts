// File: types/index.ts

// User role types
export type UserRole = "citizen" | "employee" | "admin";

// Complaint status types
export type ComplaintStatus = "new" | "assigned" | "in_progress" | "completed" | "cancelled";

// Complaint type categories
export type ComplaintType =
  | "road_damage"
  | "water_supply"
  | "garbage_issue"
  | "tree_plantation"
  | "hospital_waste"
  | "other";

// Priority levels for complaints
export type ComplaintPriority = "normal" | "urgent";

// User data model (using camelCase)
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string; // Changed from avatar
  address?: string;
  department?: string; // for employees/admins
  areaAssigned?: string; // for employees
  registrationNumber?: string; // for citizens
  departmentId?: string; // optional for link to department
}

// Complaint data model (using camelCase)
export interface Complaint {
  id: string;
  citizenId: string; // Corresponds to citizen_id in DB
  type: ComplaintType;
  description: string;
  photoUrls?: string[]; // Corresponds to photo_urls in DB
  locationLat?: number; // Corresponds to location_lat in DB
  locationLong?: number; // Corresponds to location_long in DB
  address?: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedEmployeeId?: string; // Corresponds to assigned_employee_id in DB
  departmentId?: string; // Corresponds to department_id in DB
  createdAt: string; // Corresponds to created_at in DB
  updatedAt: string; // Corresponds to updated_at in DB
  resolvedAt?: string; // Corresponds to resolved_at in DB
}

// Complaint update logs (using camelCase)
export interface ComplaintUpdate {
  id: string;
  complaintId: string; // Corresponds to complaint_id in DB
  status: ComplaintStatus;
  notes?: string;
  photoUrls?: string[]; // Corresponds to photo_urls in DB
  updatedBy: string; // userId, corresponds to updated_by in DB
  updatedAt: string; // Corresponds to updated_at in DB
}

// Feedback from citizens (using camelCase)
export interface Feedback {
  id: string;
  citizenId: string; // Corresponds to citizen_id in DB
  complaintId: string; // Corresponds to complaint_id in DB
  rating: number;
  feedbackText?: string;
  createdAt: string; // Corresponds to created_at in DB
}

// Message exchange (using camelCase)
export interface Message {
  id: string;
  complaintId: string; // Corresponds to complaint_id in DB
  senderId: string; // Corresponds to sender_id in DB
  senderRole: UserRole; // Corresponds to sender_role in DB
  receiverId: string; // Corresponds to receiver_id in DB
  message: string;
  timestamp: string;
  read: boolean;
}

// Notification system (using camelCase)
export interface Notification {
  id: string;
  userId: string; // Corresponds to user_id in DB
  userRole: UserRole; // Corresponds to user_role in DB
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

// Department entity (using camelCase)
export interface Department {
  id: string;
  name: string;
  description?: string;
}

// Area (for assignments or mapping) (using camelCase)
export interface Area {
  id: string;
  name: string;
  description?: string;
}

// Scheduled work/events (using camelCase)
export interface Schedule {
  id: string;
  area: string;
  eventType: "garbage" | "tree" | "road"; // Corresponds to event_type in DB
  scheduleDate: string; // Corresponds to schedule_date in DB
  remarks?: string;
  createdBy: string; // Corresponds to created_by in DB
  createdAt: string; // Corresponds to created_at in DB
}

// Awareness or community event data (using camelCase)
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  photoUrl?: string; // Corresponds to photo_url in DB
  createdBy: string; // Corresponds to created_by in DB
  createdAt: string; // Corresponds to created_at in DB
}