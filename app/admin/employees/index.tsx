import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { EmployeeCard } from "@/components/admin/EmployeeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { User } from "@/types";
import { mockUsers } from "@/mocks/users";
import { UserPlus, Users } from "lucide-react-native";

export default function EmployeesScreen() {
  const router = useRouter();
  const [employees, setEmployees] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Filter only employees from mock data
    const employeesList = mockUsers.filter(user => user.role === "employee");
    setEmployees(employeesList);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const handleEmployeePress = (employeeId: string) => {
    router.push(`./admin/employees/${employeeId}`);
  };

  const handleAddEmployee = () => {
    // In a real app, this would navigate to an add employee form
    alert("Add employee functionality would be implemented here");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employees</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddEmployee}
        >
          <UserPlus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={employees}
        renderItem={({ item }) => (
          <EmployeeCard
            employee={item}
            onPress={() => handleEmployeePress(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No employees found"
            description="There are no employees registered in the system."
            icon={<Users size={48} color={colors.primary} />}
            actionLabel="Add Employee"
            onAction={handleAddEmployee}
          />
        }
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
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
});