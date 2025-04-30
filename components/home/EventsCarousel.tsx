import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { EventCard } from "@/components/ui/EventCard";
import { colors } from "@/constants/colors";
import { Event } from "@/types";
import { useRouter } from "expo-router";

interface EventsCarouselProps {
  events: Event[];
  title?: string;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

export const EventsCarousel: React.FC<EventsCarouselProps> = ({
  events,
  title = "Upcoming Events",
}) => {
  const router = useRouter();

  const handleEventPress = (eventId: string) => {
    router.push(`./events/${eventId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => router.push("./events")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {events.map(event => (
          <View key={event.id} style={styles.cardContainer}>
            <EventCard
              event={event}
              onPress={() => handleEventPress(event.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: 8,
  },
});