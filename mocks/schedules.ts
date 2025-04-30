import { Schedule } from "@/types";

export const mockSchedules: Schedule[] = [
  {
    id: "schedule-1",
    area: "North Zone",
    eventType: "garbage",
    scheduleDate: "2023-09-20T06:00:00Z",
    remarks: "Regular garbage collection",
    createdBy: "admin-1",
    createdAt: "2023-09-15T10:30:00Z"
  },
  {
    id: "schedule-2",
    area: "East Zone",
    eventType: "tree",
    scheduleDate: "2023-09-22T08:00:00Z",
    remarks: "Tree plantation drive in public parks",
    createdBy: "admin-1",
    createdAt: "2023-09-16T11:45:00Z"
  },
  {
    id: "schedule-3",
    area: "West Zone",
    eventType: "road",
    scheduleDate: "2023-09-25T07:30:00Z",
    remarks: "Road repair and maintenance",
    createdBy: "admin-1",
    createdAt: "2023-09-17T09:20:00Z"
  },
  {
    id: "schedule-4",
    area: "South Zone",
    eventType: "garbage",
    scheduleDate: "2023-09-21T06:30:00Z",
    remarks: "Special drive for plastic waste collection",
    createdBy: "admin-1",
    createdAt: "2023-09-18T13:10:00Z"
  }
];