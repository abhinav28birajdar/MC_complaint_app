import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Card } from "./Card";
import { StatusBadge } from "./StatusBadge";
import { Avatar } from "./Avatar";
import { colors } from "@/constants/Colors";
import { Complaint } from "@/types";
import { complaintTypes } from "@/constants/complaint-types";
import { MapPin, Clock } from "lucide-react-native";

interface ComplaintCardProps {
  complaint: Complaint;
  onPress?: () => void;
  showCitizen?: boolean;
  citizen?: { name: string; avatar?: string } | null;
  employee?: { name: string; avatar?: string } | null;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onPress,
  showCitizen = false,
  citizen,
  employee,
}) => {
  const complaintType = complaintTypes.find(t => t.value === complaint.type);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <Text style={styles.type}>
              {complaintType?.label || complaint.type}
            </Text>
            <StatusBadge status={complaint.status} size="sm" />
          </View>
          {complaint.priority === "urgent" && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>

        {complaint.photoUrls && complaint.photoUrls.length > 0 && (
          <Image
            source={{ uri: complaint.photoUrls[0] }}
            style={styles.image}
          />
        )}

        <Text style={styles.description} numberOfLines={2}>
          {complaint.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={colors.textSecondary} />
            <Text style={styles.location} numberOfLines={1}>
              {complaint.address}
            </Text>
          </View>
          
          <View style={styles.dateContainer}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={styles.date}>
              {formatDate(complaint.createdAt)}
            </Text>
          </View>
        </View>

        {(showCitizen && citizen) || employee ? (
          <View style={styles.userContainer}>
            {showCitizen && citizen && (
              <View style={styles.userInfo}>
                <Avatar
                  source={citizen.avatar}
                  name={citizen.name}
                  size="sm"
                />
                <Text style={styles.userName}>{citizen.name}</Text>
              </View>
            )}
            
            {employee && (
              <View style={styles.userInfo}>
                <Text style={styles.assignedTo}>Assigned to:</Text>
                <Avatar
                  source={employee.avatar}
                  name={employee.name}
                  size="sm"
                />
                <Text style={styles.userName}>{employee.name}</Text>
              </View>
            )}
          </View>
        ) : null}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  type: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  urgentBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  location: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  assignedTo: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 4,
  },
  userName: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 4,
    fontWeight: "500",
  },
});