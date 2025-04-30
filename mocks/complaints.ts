import { Complaint } from "@/types";

export const mockComplaints: Complaint[] = [
  {
    id: "complaint-1",
    citizenId: "citizen-1",
    type: "road_damage",
    description: "Large pothole in the middle of the road causing traffic and danger to vehicles",
    photoUrls: [
      "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    ],
    locationLat: 18.5204,
    locationLong: 73.8567,
    address: "MG Road, Near Central Mall",
    priority: "urgent",
    status: "assigned",
    assignedEmployeeId: "employee-1",
    createdAt: "2023-09-15T10:30:00Z",
    updatedAt: "2023-09-15T14:20:00Z"
  },
  {
    id: "complaint-2",
    citizenId: "citizen-1",
    type: "water_supply",
    description: "No water supply in our area for the last 2 days",
    photoUrls: [
      "https://images.unsplash.com/photo-1583950709791-31d6cc593d2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    ],
    locationLat: 18.5314,
    locationLong: 73.8446,
    address: "Shivaji Nagar, Block C",
    priority: "urgent",
    status: "in_progress",
    assignedEmployeeId: "employee-2",
    createdAt: "2023-09-14T08:15:00Z",
    updatedAt: "2023-09-15T09:30:00Z"
  },
  {
    id: "complaint-3",
    citizenId: "citizen-2",
    type: "garbage_issue",
    description: "Garbage not collected for a week, causing bad smell and health hazards",
    photoUrls: [
      "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    ],
    locationLat: 18.5123,
    locationLong: 73.8541,
    address: "Koregaon Park, Lane 7",
    priority: "normal",
    status: "new",
    createdAt: "2023-09-16T11:45:00Z",
    updatedAt: "2023-09-16T11:45:00Z"
  },
  {
    id: "complaint-4",
    citizenId: "citizen-2",
    type: "tree_plantation",
    description: "Request for tree plantation in our society park",
    photoUrls: [
      "https://images.unsplash.com/photo-1597573337211-e1080345bc71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    ],
    locationLat: 18.5603,
    locationLong: 73.9123,
    address: "Viman Nagar, Society Garden",
    priority: "normal",
    status: "completed",
    assignedEmployeeId: "employee-1",
    createdAt: "2023-09-10T09:20:00Z",
    updatedAt: "2023-09-13T16:40:00Z"
  },
  {
    id: "complaint-5",
    citizenId: "citizen-1",
    type: "hospital_waste",
    description: "Improper disposal of hospital waste near residential area",
    photoUrls: [
      "https://images.unsplash.com/photo-1530982011887-3cc11cc85693?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    ],
    locationLat: 18.5404,
    locationLong: 73.8744,
    address: "Near City Hospital, Deccan",
    priority: "urgent",
    status: "cancelled",
    createdAt: "2023-09-12T14:10:00Z",
    updatedAt: "2023-09-14T10:30:00Z"
  }
];