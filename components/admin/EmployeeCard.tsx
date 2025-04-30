import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { colors } from "@/constants/colors";
import { User } from "@/types";
import { Briefcase, MapPin, Phone, Mail, ChevronRight } from "lucide-react-native";

interface EmployeeCardProps {
  employee: User;
  onPress?: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Avatar
            source={employee.avatar}
            name={employee.name}
            size="md"
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{employee.name}</Text>
            <Text style={styles.registrationNumber}>
              {employee.registrationNumber}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Briefcase size={16} color={colors.primary} />
            <Text style={styles.infoText}>{employee.department}</Text>
          </View>
          <View style={styles.infoItem}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.infoText}>{employee.areaAssigned}</Text>
          </View>
        </View>

        <View style={styles.contactContainer}>
          <View style={styles.contactItem}>
            <Phone size={16} color={colors.textSecondary} />
            <Text style={styles.contactText}>{employee.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Mail size={16} color={colors.textSecondary} />
            <Text style={styles.contactText}>{employee.email}</Text>
          </View>
        </View>
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
    alignItems: "center",
    marginBottom: 16,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  registrationNumber: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
  contactContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
});