import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "expo-router";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  LogOut,
  Settings,
  Shield,
  HelpCircle,
  Bell,
} from "lucide-react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            logout();
            router.replace("./(auth)");
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Not logged in</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar
          source={user.avatar}
          name={user.name}
          size="xl"
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Text>
        </View>
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoItem}>
          <Mail size={20} color={colors.primary} />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Phone size={20} color={colors.primary} />
          <Text style={styles.infoText}>{user.phone}</Text>
        </View>
        {user.address && (
          <View style={styles.infoItem}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.infoText}>{user.address}</Text>
          </View>
        )}
        {user.department && (
          <View style={styles.infoItem}>
            <Briefcase size={20} color={colors.primary} />
            <Text style={styles.infoText}>{user.department}</Text>
          </View>
        )}
        {user.areaAssigned && (
          <View style={styles.infoItem}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.infoText}>{user.areaAssigned}</Text>
          </View>
        )}
        {user.registrationNumber && (
          <View style={styles.infoItem}>
            <Shield size={20} color={colors.primary} />
            <Text style={styles.infoText}>ID: {user.registrationNumber}</Text>
          </View>
        )}
      </Card>

      <Text style={styles.sectionTitle}>Settings</Text>

      <TouchableOpacity>
        <Card style={styles.settingCard}>
          <View style={styles.settingItem}>
            <Bell size={20} color={colors.text} />
            <Text style={styles.settingText}>Notification Preferences</Text>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity>
        <Card style={styles.settingCard}>
          <View style={styles.settingItem}>
            <Settings size={20} color={colors.text} />
            <Text style={styles.settingText}>Account Settings</Text>
          </View>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity>
        <Card style={styles.settingCard}>
          <View style={styles.settingItem}>
            <HelpCircle size={20} color={colors.text} />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
        </Card>
      </TouchableOpacity>

      <Button
        title="Logout"
        variant="outline"
        leftIcon={<LogOut size={20} color={colors.primary} />}
        onPress={handleLogout}
        style={styles.logoutButton}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Municipal Connect v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.card,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  roleText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  infoCard: {
    margin: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  settingCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    margin: 16,
  },
  footer: {
    alignItems: "center",
    marginVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});