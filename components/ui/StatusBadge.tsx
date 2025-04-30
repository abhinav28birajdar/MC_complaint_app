import React from "react";
import { Badge } from "./Badge";
import { ComplaintStatus } from "@/types";
import { complaintStatusMap } from "@/constants/complaint-status";

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const getVariant = () => {
    switch (status) {
      case "new":
        return "info";
      case "assigned":
        return "warning";
      case "in_progress":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "primary";
    }
  };

  return (
    <Badge
      label={complaintStatusMap[status].label}
      variant={getVariant()}
      size={size}
    />
  );
};