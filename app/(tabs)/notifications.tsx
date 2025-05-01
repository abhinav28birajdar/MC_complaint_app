import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { Notification } from "@/types";
import { Bell, Check, Trash2 } from "lucide-react-native";

export default function NotificationsScreen() {
  const { user } = useAuthStore();
  const {
    notifications,
    fetchNotifications,
    fetchUserNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    isLoading,
  } = useNotificationStore();
  
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    await fetchNotifications();
    const userNotifs = await fetchUserNotifications(user.id, user.role);
    setUserNotifications(userNotifs);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
    await loadData();
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    await markAllAsRead(user.id);
    await loadData();
  };

  const handleClearAll = async () => {
    if (!user) return;
    await clearNotifications(user.id);
    await loadData();
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else {
      return notifTime.toLocaleDateString();
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    return (
      <Card
        style={[
          styles.notificationCard,
          !item.read ? styles.unreadNotification : null,
        ]}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationIcon}>
            <Bell size={20} color={colors.primary} />
          </View>
          <View style={styles.notificationDetails}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationTime}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
        
        {!item.read && (
          <TouchableOpacity
            style={styles.markReadButton}
            onPress={() => handleMarkAsRead(item.id)}
          >
            <Check size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  const renderHeader = () => {
    if (userNotifications.length === 0) return null;
    
    const unreadCount = userNotifications.filter(n => !n.read).length;
    
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
        </Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleMarkAllAsRead}
            >
              <Text style={styles.headerButtonText}>Mark all as read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClearAll}
          >
            <Trash2 size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Bell size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyDescription}>
              You don't have any notifications at the moment.
            </Text>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          userNotifications.length === 0 && styles.emptyListContent,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
  },
  headerButtonText: {
    fontSize: 14,
    color: colors.primary,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  markReadButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}10`,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
