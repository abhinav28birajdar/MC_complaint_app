import { User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "citizen-1",
    name: "John Citizen",
    email: "john@example.com",
    phone: "9876543210",
    role: "citizen",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    address: "123 Main St, Cityville"
  },
  {
    id: "citizen-2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "9876543211",
    role: "citizen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    address: "456 Park Ave, Townsville"
  },
  {
    id: "employee-1",
    name: "Mike Worker",
    email: "mike@municipality.gov",
    phone: "9876543212",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    department: "Roads",
    areaAssigned: "North Zone",
    registrationNumber: "EMP001"
  },
  {
    id: "employee-2",
    name: "Lisa Technician",
    email: "lisa@municipality.gov",
    phone: "9876543213",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    department: "Water Supply",
    areaAssigned: "East Zone",
    registrationNumber: "EMP002"
  },
  {
    id: "admin-1",
    name: "David Admin",
    email: "david@municipality.gov",
    phone: "9876543214",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    department: "Administration"
  }
];