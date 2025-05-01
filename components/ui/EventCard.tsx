import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Card } from "./Card";
import { colors } from "@/constants/Colors";
import { Event } from "@/types";
import { Calendar } from "lucide-react-native";

interface EventCardProps {
  event: Event;
  onPress?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        {event.photoUrl && (
          <Image source={{ uri: event.photoUrl }} style={styles.image} />
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.dateContainer}>
            <Calendar size={16} color={colors.primary} />
            <Text style={styles.date}>{formatDate(event.date)}</Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 6,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});