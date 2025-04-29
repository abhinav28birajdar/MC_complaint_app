import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, UserRound, Briefcase } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleRoleSelect = (role: 'citizen' | 'employee' | 'admin') => {
    router.push({
      pathname: '/auth/login',
      params: { role }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>
          Select your role to continue with the appropriate access
        </Text>
      </View>

      <View style={styles.rolesContainer}>
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect('citizen')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${colors.accent}20` }]}>
            <User size={32} color={colors.accent} />
          </View>
          <Text style={styles.roleTitle}>Citizen</Text>
          <Text style={styles.roleDescription}>
            Lodge complaints, track progress, and participate in community initiatives
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect('employee')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${colors.info}20` }]}>
            <Briefcase size={32} color={colors.info} />
          </View>
          <Text style={styles.roleTitle}>Employee</Text>
          <Text style={styles.roleDescription}>
            Manage assigned tasks, update complaint status, and coordinate services
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect('admin')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
            <UserRound size={32} color={colors.primary} />
          </View>
          <Text style={styles.roleTitle}>Admin/Department</Text>
          <Text style={styles.roleDescription}>
            Oversee operations, assign tasks, and manage department activities
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
    lineHeight: 24,
  },
  rolesContainer: {
    flex: 1,
    gap: 20,
  },
  roleCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 22,
  },
});