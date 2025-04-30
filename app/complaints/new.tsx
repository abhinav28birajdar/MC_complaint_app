import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ComplaintForm } from "@/components/complaints/ComplaintForm";
import { colors } from "@/constants/colors";
import { useComplaintStore } from "@/store/complaint-store";
import { useRouter } from "expo-router";
import { Complaint } from "@/types";

export default function NewComplaintScreen() {
  const router = useRouter();
  const { createComplaint, isLoading } = useComplaintStore();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (complaintData: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "status">) => {
    try {
      setError(null);
      const newComplaint = await createComplaint(complaintData);
      router.push(`./complaints/${newComplaint.id}`);
    } catch (err) {
      setError("Failed to submit complaint. Please try again.");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <ComplaintForm onSubmit={handleSubmit} isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});