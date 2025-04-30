import { Message } from "@/types";

export const mockMessages: Message[] = [
  {
    id: "message-1",
    complaintId: "complaint-1",
    senderId: "citizen-1",
    senderRole: "citizen",
    receiverId: "employee-1",
    message: "When will you start working on this pothole? It's causing accidents.",
    timestamp: "2023-09-15T14:30:00Z",
    read: true
  },
  {
    id: "message-2",
    complaintId: "complaint-1",
    senderId: "employee-1",
    senderRole: "employee",
    receiverId: "citizen-1",
    message: "We have scheduled the repair for tomorrow morning. Sorry for the inconvenience.",
    timestamp: "2023-09-15T15:00:00Z",
    read: true
  },
  {
    id: "message-3",
    complaintId: "complaint-1",
    senderId: "citizen-1",
    senderRole: "citizen",
    receiverId: "employee-1",
    message: "Thank you for the quick response. Please ensure it's fixed properly.",
    timestamp: "2023-09-15T15:10:00Z",
    read: true
  },
  {
    id: "message-4",
    complaintId: "complaint-2",
    senderId: "citizen-1",
    senderRole: "citizen",
    receiverId: "employee-2",
    message: "We are facing severe water shortage. Please help urgently.",
    timestamp: "2023-09-14T09:30:00Z",
    read: true
  },
  {
    id: "message-5",
    complaintId: "complaint-2",
    senderId: "employee-2",
    senderRole: "employee",
    receiverId: "citizen-1",
    message: "Our team is working on the main pipeline. Water supply should resume by evening.",
    timestamp: "2023-09-14T10:15:00Z",
    read: true
  }
];