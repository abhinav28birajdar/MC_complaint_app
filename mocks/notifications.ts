import { Notification } from "@/types";

export const mockNotifications: Notification[] = [
  {
    id: "notification-1",
    userId: "citizen-1",
    userRole: "citizen",
    title: "Complaint Assigned",
    message: "Your complaint about road damage has been assigned to Mike Worker.",
    read: false,
    timestamp: "2023-09-15T14:20:00Z"
  },
  {
    id: "notification-2",
    userId: "employee-1",
    userRole: "employee",
    title: "New Complaint Assigned",
    message: "A new complaint about road damage has been assigned to you.",
    read: true,
    timestamp: "2023-09-15T14:20:00Z"
  },
  {
    id: "notification-3",
    userId: "citizen-1",
    userRole: "citizen",
    title: "Complaint Status Update",
    message: "Your complaint about water supply is now in progress.",
    read: false,
    timestamp: "2023-09-15T09:30:00Z"
  },
  {
    id: "notification-4",
    userId: "admin-1",
    userRole: "admin",
    title: "New Complaint Received",
    message: "A new urgent complaint about garbage issue has been received.",
    read: false,
    timestamp: "2023-09-16T11:45:00Z"
  },
  {
    id: "notification-5",
    userId: "citizen-2",
    userRole: "citizen",
    title: "Complaint Completed",
    message: "Your request for tree plantation has been completed successfully.",
    read: true,
    timestamp: "2023-09-13T16:40:00Z"
  }
];