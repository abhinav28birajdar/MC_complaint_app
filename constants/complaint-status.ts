import { ComplaintStatus } from "@/types";
import { colors } from "./colors";

export const complaintStatusMap: Record<ComplaintStatus, { label: string; color: string }> = {
  new: {
    label: "New",
    color: colors.statusNew
  },
  assigned: {
    label: "Assigned",
    color: colors.statusAssigned
  },
  in_progress: {
    label: "In Progress",
    color: colors.statusInProgress
  },
  completed: {
    label: "Completed",
    color: colors.statusCompleted
  },
  cancelled: {
    label: "Cancelled",
    color: colors.statusCancelled
  }
};