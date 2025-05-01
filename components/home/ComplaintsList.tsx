import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
} from "react-native";
import { ComplaintCard } from "@/components/ui/ComplaintCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { colors } from "@/constants/Colors";
import { Complaint } from "@/types";
import { useRouter } from "expo-router";
import { FileText } from "lucide-react-native";

interface ComplaintsListProps {
  complaints: Complaint[];
  isLoading: boolean;
  title?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  showCitizen?: boolean;
  getCitizen?: (citizenId: string) => { name: string; avatar?: string } | null;
  getEmployee?: (employeeId?: string) => { name: string; avatar?: string } | null;
}

export const ComplaintsList: React.FC<ComplaintsListProps> = ({
  complaints,
  isLoading,
  title = "Recent Complaints",
  emptyTitle = "No complaints yet",
  emptyDescription = "You haven't submitted any complaints yet.",
  emptyActionLabel = "Submit a Complaint",
  onEmptyAction,
  showCitizen = false,
  getCitizen,
  getEmployee,
}) => {
  const router = useRouter();

  const handleComplaintPress = (complaintId: string) => {
    router.push(`./complaints/${complaintId}`);
  };

  const renderItem = ({ item }: ListRenderItemInfo<Complaint>) => {
    const citizen = showCitizen && getCitizen ? getCitizen(item.citizenId) : null;
    const employee = item.assignedEmployeeId && getEmployee ? getEmployee(item.assignedEmployeeId) : null;

    return (
      <ComplaintCard
        complaint={item}
        onPress={() => handleComplaintPress(item.id)}
        showCitizen={showCitizen}
        citizen={citizen}
        employee={employee}
      />
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      {complaints.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={<FileText size={48} color={colors.primary} />}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  listContent: {
    padding: 16,
  },
});