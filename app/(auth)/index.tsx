import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { StatusBar } from "expo-status-bar";
import { useEventStore } from "@/store/event-store";
import { EventCard } from "@/components/ui/EventCard";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { events, fetchEvents } = useEventStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      
      (router as any).replace("/(tabs)");
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogin = () => {
    (router as any).push("/login");
  };

  const handleRegister = () => {
    // Using type assertion to bypass TypeScript check
    (router as any).push("/register");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text style={styles.title}>Municipal Connect</Text>
          <Text style={styles.subtitle}>
            Smart City Complaint Management
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Updates</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsContainer}
          >
            {events.slice(0, 3).map(event => (
              <View key={event.id} style={styles.eventCardContainer}>
                <EventCard event={event} />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.servicesContainer}>
            <View style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Text style={[styles.serviceIconText, { color: colors.primary }]}>🛣️</Text>
              </View>
              <Text style={styles.serviceTitle}>Road Maintenance</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: `${colors.info}20` }]}>
                <Text style={[styles.serviceIconText, { color: colors.info }]}>💧</Text>
              </View>
              <Text style={styles.serviceTitle}>Water Supply</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: `${colors.success}20` }]}>
                <Text style={[styles.serviceIconText, { color: colors.success }]}>🌳</Text>
              </View>
              <Text style={styles.serviceTitle}>Tree Plantation</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: `${colors.warning}20` }]}>
                <Text style={[styles.serviceIconText, { color: colors.warning }]}>🗑️</Text>
              </View>
              <Text style={styles.serviceTitle}>Waste Management</Text>
            </View>
          </View>
        </View>

        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>Ready to get started?</Text>
          <Text style={styles.ctaDescription}>
            Join our platform to report issues, track their progress, and help
            make our city better.
          </Text>
          <Button
            title="Create an Account"
            onPress={handleRegister}
            style={styles.registerButton}
          />
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 300,
    position: "relative",
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    marginTop: -40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.background,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  eventsContainer: {
    paddingRight: 20,
  },
  eventCardContainer: {
    width: width * 0.7,
    marginRight: 16,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceItem: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceIconText: {
    fontSize: 24,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    textAlign: "center",
  },
  ctaContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  registerButton: {
    width: "100%",
    marginBottom: 16,
  },
  loginText: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 16,
  },
});