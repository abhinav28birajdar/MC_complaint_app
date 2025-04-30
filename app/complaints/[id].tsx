import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { colors } from "@/constants/colors";
import { Complaint, User, UserRole, ComplaintStatus } from "@/types";
import { complaintTypes } from "@/constants/complaint-types";
import {
  MapPin,
  Clock,
  AlertTriangle,
  MessageSquare,
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";

interface ComplaintDetailsProps {
  complaint: Complaint;
  citizen?: User | null;
  employee?: User | null;
  onUpdateStatus?: () => void;
  currentUserRole?: UserRole;
}

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  complaint,
  citizen,
  employee,
  onUpdateStatus,
  currentUserRole,
}) => {
  const router = useRouter();
  const complaintType = complaintTypes.find(t => t.value === complaint.type);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleChatPress = () => {
    router.push(`./complaints/${complaint.id}/chat`);
  };

  const canChat = () => {
    if (!currentUserRole) return false;
    return currentUserRole === "citizen" || currentUserRole === "employee" || currentUserRole === "admin";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {complaintType?.label || complaint.type}
          </Text>
          <StatusBadge status={complaint.status} />
        </View>
        {complaint.priority === "urgent" && (
          <View style={styles.urgentContainer}>
            <AlertTriangle size={16} color={colors.danger} />
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}
      </View>

      <View style={styles.photoGrid}>
        {complaint.photoUrls.map((url, index) => (
          <Image key={index} source={{ uri: url }} style={styles.photo} />
        ))}
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{complaint.description}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationContainer}>
          <MapPin size={20} color={colors.primary} />
          <Text style={styles.locationText}>{complaint.address}</Text>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <View style={styles.timelineItem}>
          <Clock size={20} color={colors.primary} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Submitted</Text>
            <Text style={styles.timelineDate}>
              {formatDate(complaint.createdAt)}
            </Text>
          </View>
        </View>
        {complaint.status !== "new" && (
          <View style={styles.timelineItem}>
            <Clock size={20} color={colors.primary} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Last Updated</Text>
              <Text style={styles.timelineDate}>
                {formatDate(complaint.updatedAt)}
              </Text>
            </View>
          </View>
        )}
      </Card>

      {citizen && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Reported By</Text>
          <View style={styles.userContainer}>
            <Avatar
              source={citizen.avatar}
              name={citizen.name}
              size="md"
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{citizen.name}</Text>
              <Text style={styles.userContact}>{citizen.phone || 'N/A'}</Text>
            </View>
          </View>
        </Card>
      )}

      {employee && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned To</Text>
          <View style={styles.userContainer}>
            <Avatar
              source={employee.avatar}
              name={employee.name}
              size="md"
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{employee.name}</Text>
              <Text style={styles.userContact}>
                {employee.department || 'N/A'} • {employee.areaAssigned || 'N/A'}
              </Text>
            </View>
          </View>
        </Card>
      )}

      {canChat() && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChatPress}
          activeOpacity={0.7}
        >
          <View style={styles.chatButtonContent}>
            <MessageSquare size={20} color={colors.primary} />
            <Text style={styles.chatButtonText}>
              Chat with {currentUserRole === "citizen" ? "Employee" : "Citizen"}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.primary} />
        </TouchableOpacity>
      )}

      {onUpdateStatus && (
        <TouchableOpacity
          style={styles.updateButton}
          onPress={onUpdateStatus}
          activeOpacity={0.7}
        >
          <Text style={styles.updateButtonText}>Update Status</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  urgentContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.danger}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  timelineContent: {
    marginLeft: 12,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  timelineDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  userContact: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chatButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
    marginLeft: 8,
  },
  updateButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 32,
  },
  updateButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});