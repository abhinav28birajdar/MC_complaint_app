import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/Colors";
import { ComplaintStatus } from "@/types";
import { X } from "lucide-react-native";

interface StatusUpdateModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (status: ComplaintStatus, notes: string) => Promise<void>;
  currentStatus: ComplaintStatus;
  isLoading: boolean;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  visible,
  onClose,
  onSubmit,
  currentStatus,
  isLoading,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(currentStatus);
  const [notes, setNotes] = useState("");

  const statusOptions: { value: ComplaintStatus; label: string; color: string }[] = [
    { value: "in_progress", label: "In Progress", color: colors.statusInProgress },
    { value: "completed", label: "Completed", color: colors.statusCompleted },
    { value: "cancelled", label: "Cancelled", color: colors.statusCancelled },
  ];

  // Filter out current status and statuses that shouldn't be available
  const availableStatuses = statusOptions.filter(option => {
    if (option.value === currentStatus) return false;
    
    // Can't go back to "new" or "assigned" status
    if (option.value === "new" || option.value === "assigned") return false;
    
    // Can only mark as completed if currently in progress
    if (option.value === "completed" && currentStatus !== "in_progress") return false;
    
    return true;
  });

  const handleSubmit = async () => {
    await onSubmit(selectedStatus, notes);
    setNotes("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Status</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Select New Status</Text>
            <View style={styles.statusOptions}>
              {availableStatuses.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.statusOption,
                    selectedStatus === option.value && {
                      backgroundColor: `${option.color}20`,
                      borderColor: option.color,
                    },
                  ]}
                  onPress={() => setSelectedStatus(option.value)}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: option.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      selectedStatus === option.value && {
                        color: option.color,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Add Notes</Text>
            <Input
              placeholder="Add details about the status update..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.notesInput}
            />

            <Button
              title="Update Status"
              onPress={handleSubmit}
              isLoading={isLoading}
              style={styles.submitButton}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  statusOptions: {
    gap: 12,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: colors.text,
  },
  notesInput: {
    height: 100,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
});