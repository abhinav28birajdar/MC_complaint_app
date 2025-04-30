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
import { colors } from "@/constants/colors";
import { useScheduleStore } from "@/store/schedule-store";
import { Schedule } from "@/types";
import { Calendar, Clock, MapPin, Trash2, Trees, Book } from "lucide-react-native";

export default function ScheduleScreen() {
  const { schedules, fetchSchedules, isLoading } = useScheduleStore();
  const [refreshing, setRefreshing] = useState(false);
  const [groupedSchedules, setGroupedSchedules] = useState<Record<string, Schedule[]>>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (schedules.length > 0) {
      groupSchedulesByDate();
    }
  }, [schedules]);

  const loadData = async () => {
    await fetchSchedules();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const groupSchedulesByDate = () => {
    const grouped: Record<string, Schedule[]> = {};
    
    schedules.forEach(schedule => {
      const date = new Date(schedule.scheduleDate);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(schedule);
    });
    
    setGroupedSchedules(grouped);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case "garbage":
        return <Trash2 size={20} color={colors.warning} />;
      case "tree":
        return <Trees size={20} color={colors.success} />;
      case "road":
        return <Book size={20} color={colors.primary} />;
      default:
        return null;
    }
  };

  const renderScheduleItem = ({ item }: { item: Schedule }) => {
    return (
      <Card style={styles.scheduleCard}>
        <View style={styles.scheduleHeader}>
          <View style={styles.eventTypeContainer}>
            {getEventTypeIcon(item.eventType)}
            <Text style={styles.eventType}>
              {item.eventType.charAt(0).toUpperCase() + item.eventType.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.scheduleDetails}>
          <View style={styles.detailItem}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{formatTime(item.scheduleDate)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.area}</Text>
          </View>
        </View>
        
        {item.remarks && (
          <Text style={styles.remarks}>{item.remarks}</Text>
        )}
      </Card>
    );
  };

  const renderDateSection = ({ item }: { item: [string, Schedule[]] }) => {
    const [dateKey, dateSchedules] = item;
    
    return (
      <View style={styles.dateSection}>
        <View style={styles.dateSectionHeader}>
          <Calendar size={20} color={colors.primary} />
          <Text style={styles.dateSectionTitle}>
            {formatDate(dateKey)}
          </Text>
        </View>
        
        <FlatList
          data={dateSchedules}
          renderItem={renderScheduleItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.entries(groupedSchedules).sort()}
        renderItem={renderDateSection}
        keyExtractor={([dateKey]) => dateKey}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No schedules available</Text>
            <Text style={styles.emptyDescription}>
              There are no upcoming schedules at the moment.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
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
  dateSection: {
    marginBottom: 24,
  },
  dateSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dateSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  scheduleCard: {
    marginBottom: 12,
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventType: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  scheduleDetails: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  remarks: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
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
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});