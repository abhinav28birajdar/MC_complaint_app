import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { EventsCarousel } from "@/components/home/EventsCarousel";
import { ComplaintsList } from "@/components/home/ComplaintsList";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";
import { useEventStore } from "@/store/event-store";
import { useComplaintStore } from "@/store/complaint-store";
import { useRouter } from "expo-router";
import { mockUsers } from "@/mocks/users";
import { Plus } from "lucide-react-native";

// ✅ Import the real Complaint type from your central types file
import { Complaint } from "@/types";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { events, fetchEvents } = useEventStore();
  const {
    complaints,
    fetchComplaints,
    fetchUserComplaints,
    fetchAssignedComplaints,
  } = useComplaintStore();

  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    await fetchEvents();
    await fetchComplaints();

    if (user.role === "citizen") {
      const userComps = await fetchUserComplaints(user.id);
      setUserComplaints(userComps);
    } else if (user.role === "employee") {
      const assignedComps = await fetchAssignedComplaints(user.id);
      setUserComplaints(assignedComps);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleNewComplaint = () => {
    router.push("./complaints/new");
  };

  const getCitizen = (citizenId: string) => {
    const citizen = mockUsers.find((u) => u.id === citizenId);
    if (!citizen) return null;
    return {
      name: citizen.name,
      avatar: citizen.avatar,
    };
  };

  const getEmployee = (employeeId?: string) => {
    if (!employeeId) return null;
    const employee = mockUsers.find((u) => u.id === employeeId);
    if (!employee) return null;
    return {
      name: employee.name,
      avatar: employee.avatar,
    };
  };

  const renderWelcomeCard = () => {
    if (!user) return null;

    return (
      <Card style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>
          Welcome, {user.name.split(" ")[0]}!
        </Text>
        <Text style={styles.welcomeSubtitle}>
          {user.role === "citizen"
            ? "Report and track your municipal complaints"
            : user.role === "employee"
            ? "Manage and resolve assigned complaints"
            : "Oversee all operations and manage employees"}
        </Text>
        {user.role === "citizen" && (
          <TouchableOpacity
            style={styles.newComplaintButton}
            onPress={handleNewComplaint}
          >
            <Plus size={20} color="white" />
            <Text style={styles.newComplaintText}>New Complaint</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {renderWelcomeCard()}

      <EventsCarousel events={events.slice(0, 5)} />

      <View style={styles.complaintsContainer}>
        <ComplaintsList
          complaints={userComplaints.slice(0, 5)}
          isLoading={false}
          title={
            user?.role === "citizen"
              ? "Your Recent Complaints"
              : user?.role === "employee"
              ? "Assigned to You"
              : "Recent Complaints"
          }
          emptyTitle={
            user?.role === "citizen"
              ? "No complaints yet"
              : "No assigned complaints"
          }
          emptyDescription={
            user?.role === "citizen"
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  welcomeCard: {
    margin: 16,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  newComplaintButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  newComplaintText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  complaintsContainer: {
    flex: 1,
    marginBottom: 20,
  },
});
