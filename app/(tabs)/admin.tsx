import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useComplaintStore } from "@/store/complaint-store";
import {
  Users,
  Calendar,
  FileText,
  BarChart2,
  ChevronRight,
  PlusCircle,
} from "lucide-react-native";

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { complaints, fetchComplaints } = useComplaintStore();

  useEffect(() => {
    if (user?.role !== "admin") {
      router.replace("./(tabs)");
    } else {
      fetchComplaints();
    }
  }, [user]);

  const handleManageEmployees = () => {
    router.push("./admin/employees");
  };

  const handleCreateEvent = () => {
    router.push("./admin/events/new");
  };

  const getComplaintStats = () => {
    const total = complaints.length;
    const pending = complaints.filter(
      c => c.status === "new" || c.status === "assigned" || c.status === "in_progress"
    ).length;
    const completed = complaints.filter(c => c.status === "completed").length;
    
    return { total, pending, completed };
  };

  const stats = getComplaintStats();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Complaints</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <TouchableOpacity onPress={handleManageEmployees}>
        <Card style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={[styles.actionIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Users size={24} color={colors.primary} />
            </View>
            <View style={styles.actionDetails}>
              <Text style={styles.actionTitle}>Manage Employees</Text>
              <Text style={styles.actionDescription}>
                Add, edit, or remove employees and assign them to departments
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleCreateEvent}>
        <Card style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={[styles.actionIcon, { backgroundColor: `${colors.info}15` }]}>
              <Calendar size={24} color={colors.info} />
            </View>
            <View style={styles.actionDetails}>
              <Text style={styles.actionTitle}>Create Event</Text>
              <Text style={styles.actionDescription}>
                Schedule new events, drives, or announcements for citizens
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("./complaints")}>
        <Card style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={[styles.actionIcon, { backgroundColor: `${colors.warning}15` }]}>
              <FileText size={24} color={colors.warning} />
            </View>
            <View style={styles.actionDetails}>
              <Text style={styles.actionTitle}>View All Complaints</Text>
              <Text style={styles.actionDescription}>
                Review and manage all citizen complaints
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Card>
      </TouchableOpacity>

      <TouchableOpacity>
        <Card style={styles.actionCard}>
          <View style={styles.actionContent}>
            <View style={[styles.actionIcon, { backgroundColor: `${colors.secondary}15` }]}>
              <BarChart2 size={24} color={colors.secondary} />
            </View>
            <View style={styles.actionDetails}>
              <Text style={styles.actionTitle}>Analytics & Reports</Text>
              <Text style={styles.actionDescription}>
                View detailed reports and analytics on complaints and performance
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </Card>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Municipal Connect Admin Dashboard
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 12,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionDetails: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});