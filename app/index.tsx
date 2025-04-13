import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/Colors';
import Button from '@/components/Button';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      switch (user.role) {
        case 'citizen':
          router.replace('./citizen');
          break;
        case 'employee':
          router.replace('./employee');
          break;
        case 'admin':
          router.replace('/admin');
          break;
        default:
          router.replace('/auth/role-selection');
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  const handleGetStarted = () => {
    router.push('/auth/role-selection');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.primary, '#4B0082']}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=500&auto=format&fit=crop' }}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>CivicConnect</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Welcome to CivicConnect</Text>
          <Text style={styles.subtitle}>
            Your one-stop solution for municipal services, complaint management, and community engagement
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>📝</Text>
            </View>
            <Text style={styles.featureText}>File and track complaints</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🌱</Text>
            </View>
            <Text style={styles.featureText}>Track tree plantations</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>♻️</Text>
            </View>
            <Text style={styles.featureText}>Request recycling pickup</Text>
          </View>
        </View>
        
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="secondary"
          size="lg"
          fullWidth
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 12,
  },
  infoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  featuresContainer: {
    marginVertical: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 16,
    color: colors.white,
    flex: 1,
  },
});