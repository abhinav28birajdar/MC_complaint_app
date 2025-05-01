import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
  ScrollView,
} from "react-native";
import { ComplaintsList } from "@/components/home/ComplaintsList";
import { colors } from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useComplaintStore } from "@/store/complaint-store";
import { useRouter } from "expo-router";
import { mockUsers } from "@/mocks/users";
import { Complaint, ComplaintStatus } from "@/types";
import { Plus, Filter } from "lucide-react-native";

export default function ComplaintsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { complaints, fetchComplaints, fetchUserComplaints, fetchAssignedComplaints, isLoading } = useComplaintStore();
  
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [activeFilter, setActiveFilter] = useState<ComplaintStatus | "all">("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    if (complaints.length > 0) {
      applyFilter(activeFilter);
    }
  }, [complaints, activeFilter]);

  const loadData = async () => {
    if (!user) return;
    
    if (user.role === "citizen") {
      const userComplaints = await fetchUserComplaints(user.id);
      setFilteredComplaints(userComplaints);
    } else if (user.role === "employee") {
      const assignedComplaints = await fetchAssignedComplaints(user.id);
      setFilteredComplaints(assignedComplaints);
    } else {
      await fetchComplaints();
      setFilteredComplaints(complaints);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const applyFilter = (filter: ComplaintStatus | "all") => {
    setActiveFilter(filter);
    
    if (filter === "all") {
      if (user?.role === "citizen") {
        fetchUserComplaints(user.id).then(setFilteredComplaints);
      } else if (user?.role === "employee") {
        fetchAssignedComplaints(user.id).then(setFilteredComplaints);
      } else {
        setFilteredComplaints(complaints);
      }
    } else {
      if (user?.role === "citizen") {
        fetchUserComplaints(user.id).then(comps => 
          setFilteredComplaints(comps.filter(c => c.status === filter))
        );
      } else if (user?.role === "employee") {
        fetchAssignedComplaints(user.id).then(comps => 
          setFilteredComplaints(comps.filter(c => c.status === filter))
        );
      } else {
        setFilteredComplaints(complaints.filter(c => c.status === filter));
      }
    }
  };

  const handleNewComplaint = () => {
    router.push("./complaints/new");
  };

  const getCitizen = (citizenId: string) => {
    const citizen = mockUsers.find(u => u.id === citizenId);
    if (!citizen) return null;
    return {
      name: citizen.name,
      avatar: citizen.avatar,
    };
  };

  const getEmployee = (employeeId?: string) => {
    if (!employeeId) return null;
    const employee = mockUsers.find(u => u.id === employeeId);
    if (!employee) return null;
    return {
      name: employee.name,
      avatar: employee.avatar,
    };
  };

  const filterOptions: { value: ComplaintStatus | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "new", label: "New" },
    { value: "assigned", label: "Assigned" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <Filter size={16} color={colors.textSecondary} />
          <Text style={styles.filterText}>Filter:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContent}
          >
            {filterOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterOption,
                  activeFilter === option.value && styles.activeFilterOption,
                ]}
                onPress={() => applyFilter(option.value)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    activeFilter === option.value && styles.activeFilterOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {user?.role === "citizen" && (
          <TouchableOpacity
            style={styles.newButton}
            onPress={handleNewComplaint}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <ComplaintsList
        complaints={filteredComplaints}
        isLoading={isLoading || refreshing}
        title=""
        emptyTitle={
          user?.role === "citizen"
            ? "No complaints found"
            : "No assigned complaints"
        }
        emptyDescription={
          activeFilter !== "all"
            ? `You don't have any ${activeFilter} complaints.`
            : user?.role === "citizen"
            ? "You haven't submitted any complaints yet."
            : "You don't have any assigned complaints yet."
        }
        emptyActionLabel={user?.role === "citizen" ? "Submit a Complaint" : undefined}
        onEmptyAction={user?.role === "citizen" ? handleNewComplaint : undefined}
        showCitizen={user?.role !== "citizen"}
        getCitizen={getCitizen}
        getEmployee={getEmployee}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  filterContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
    marginRight: 8,
  },
  filtersScrollContent: {
    paddingRight: 16,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
    marginRight: 8,
  },
  activeFilterOption: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 12,
    color: colors.text,
  },
  activeFilterOptionText: {
    color: "white",
    fontWeight: "500",
  },
  newButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});