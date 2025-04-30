import { ComplaintType } from "@/types";

export const complaintTypes: { value: ComplaintType; label: string; icon: string }[] = [
  {
    value: "road_damage",
    label: "Road Damage",
    icon: "road"
  },
  {
    value: "water_supply",
    label: "Water Supply",
    icon: "droplet"
  },
  {
    value: "garbage_issue",
    label: "Garbage Issue",
    icon: "trash-2"
  },
  {
    value: "tree_plantation",
    label: "Tree Plantation",
    icon: "tree"
  },
  {
    value: "hospital_waste",
    label: "Hospital Waste",
    icon: "activity"
  },
  {
    value: "other",
    label: "Other",
    icon: "more-horizontal"
  }
];