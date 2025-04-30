import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { EventCard } from "@/components/ui/EventCard";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { colors } from "@/constants/colors";
import { useEventStore } from "@/store/event-store";
import { useRouter } from "expo-router";
import { Calendar } from "lucide-react-native";

export default function EventsScreen() {
  const router = useRouter();
  const { events, fetchEvents, isLoading } = useEventStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchEvents();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleEventPress = (eventId: string) => {
    router.push(`./events/${eventId}`);
  };

  if (isLoading && !refreshing) {
    return <Loading fullScreen />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <EventCard
              event={item}
              onPress={() => handleEventPress(item.id)}
            />
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No events found"
            description="There are no upcoming events at the moment."
            icon={<Calendar size={48} color={colors.primary} />}
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
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  eventContainer: {
    marginBottom: 16,
  },
});