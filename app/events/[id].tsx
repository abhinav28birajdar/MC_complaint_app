import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEventStore } from "@/store/event-store";
import { Event } from "@/types";
import { Calendar, Clock, MapPin, Share2 } from "lucide-react-native";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { events, fetchEvents, getEventById, isLoading } = useEventStore();
  
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    
    await fetchEvents();
    const eventData = getEventById(id);
    
    if (eventData) {
      setEvent(eventData);
    } else {
      router.back();
    }
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

  if (isLoading || !event) {
    return <Loading fullScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: event.photoUrl }}
        style={styles.image}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        
        <Card style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.infoText}>{formatDate(event.date)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={20} color={colors.primary} />
            <Text style={styles.infoText}>{formatTime(event.date)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.infoText}>Municipal Corporation</Text>
          </View>
        </Card>
        
        <Card style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>About Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </Card>
        
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color={colors.primary} />
          <Text style={styles.shareText}>Share Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  infoCard: {
    marginBottom: 16,
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
  descriptionCard: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginBottom: 32,
  },
  shareText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
    marginLeft: 8,
  },
});