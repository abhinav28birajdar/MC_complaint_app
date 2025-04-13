import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Settings, User, HelpCircle, Bell, Shield, FileText } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: <User size={20} color={colors.gray[600]} />,
      title: 'Edit Profile',
      onPress: () => router.push('./citizen/profile/edit'),
    },
    {
      icon: <Bell size={20} color={colors.gray[600]} />,
      title: 'Notifications',
      onPress: () => router.push('./citizen/profile/notifications'),
    },
    {
      icon: <Shield size={20} color={colors.gray[600]} />,
      title: 'Privacy & Security',
      onPress: () => router.push('./citizen/profile/privacy'),
    },
    {
      icon: <HelpCircle size={20} color={colors.gray[600]} />,
      title: 'Help & Support',
      onPress: () => router.push('./citizen/profile/support'),
    },
    {
      icon: <FileText size={20} color={colors.gray[600]} />,
      title: 'Terms & Conditions',
      onPress: () => router.push('./citizen/profile/terms'),
    },
    {
      icon: <Settings size={20} color={colors.gray[600]} />,
      title: 'Settings',
      onPress: () => router.push('./citizen/profile/settings'),
    },
    {
      icon: <LogOut size={20} color={colors.error} />,
      title: 'Logout',
      onPress: handleLogout,
      textColor: colors.error,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {user?.profileImage ? (
              <Image 
                source={{ uri: user.profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>
                  {user?.name?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => router.push('./citizen/profile/edit')}
            activeOpacity={0.7}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Complaints</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Trees Planted</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Recycling</Text>
          </View>
        </View>
        
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                {item.icon}
              </View>
              <Text style={[styles.menuItemText, item.textColor && { color: item.textColor }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImagePlaceholderText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 16,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  editProfileButtonText: {
    fontSize: 14,
    color: colors.gray[700],
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[600],
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.gray[200],
    alignSelf: 'center',
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemIcon: {
    width: 24,
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.gray[800],
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: colors.gray[500],
  },
});