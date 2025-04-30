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

// User data model
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  department?: string; // for employees/admins
  areaAssigned?: string; // for employees
  registrationNumber?: string; // for citizens
  departmentId?: string; // optional for link to department
}

// Complaint data model
export interface Complaint {
  id: string;
  citizenId: string;
  type: ComplaintType;
  description: string;
  photoUrls: string[];
  locationLat: number;
  locationLong: number;
  address: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedEmployeeId?: string;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// Complaint update logs (status change, notes, etc.)
export interface ComplaintUpdate {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  notes?: string;
  photoUrls?: string[];
  updatedBy: string; // userId
  updatedAt: string;
}

// Feedback from citizens after resolution
export interface Feedback {
  id: string;
  citizenId: string;
  complaintId: string;
  rating: number;
  feedbackText?: string;
  createdAt: string;
}

// Message exchange between citizen/employee/admin
export interface Message {
  id: string;
  complaintId: string;
  senderId: string;
  senderRole: UserRole;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Notification system
export interface Notification {
  id: string;
  userId: string;
  userRole: UserRole;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

// Department entity
export interface Department {
  id: string;
  name: string;
  description?: string;
}

// Area (for assignments or mapping)
export interface Area {
  id: string;
  name: string;
  description?: string;
}

// Scheduled work/events (related to complaints like garbage collection, plantation, etc.)
export interface Schedule {
  id: string;
  area: string;
  eventType: "garbage" | "tree" | "road";
  scheduleDate: string;
  remarks?: string;
  createdBy: string;
  createdAt: string;
}

// Awareness or cleanup/community event data
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  photoUrl?: string;
  createdBy: string;
  createdAt: string;
}
