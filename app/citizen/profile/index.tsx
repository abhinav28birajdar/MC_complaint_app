import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Settings, User, HelpCircle, Bell, Shield, FileText, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout', // More specific title
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Logout canceled'),
        },
        {
          text: 'Logout',
          onPress: async () => {
            if (typeof logout !== 'function') {
               console.error("Logout function not available");
               Alert.alert("Error", "Logout service is unavailable.");
               return;
            }
            try {
                 await logout();
                 // Navigation should be handled by the root layout's effect checking auth state
                 // No need to explicitly navigate here if root layout handles redirection
                 console.log("Logout successful, redirecting...");
            } catch (error) {
                console.error("Logout failed:", error);
                Alert.alert("Logout Error", `Failed to logout. ${error instanceof Error ? error.message : 'Please try again.'}`);
            }
          },
          style: 'destructive', // Red color for logout action
        },
      ],
      { cancelable: true } // Allow dismissing by tapping outside on Android
    );
  };

  // Define menu item structure for type safety
  interface MenuItem {
      icon: React.ReactElement;
      title: string;
      onPress: () => void;
      textColor?: string; // Optional text color override
  }

  const menuItems: MenuItem[] = [
    {
      icon: <User size={20} color={colors.gray[600]} />,
      title: 'Edit Profile',
      // Use root-relative paths consistently
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
      title: 'App Settings', // Renamed for clarity
      onPress: () => router.push('./citizen/profile/settings'),
    },
  ];

   const logoutItem: MenuItem = {
     icon: <LogOut size={20} color={colors.error} />,
     title: 'Logout',
     onPress: handleLogout,
     textColor: colors.error, // Specific color for logout text
   };


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      {/* Header is provided by Tabs layout */}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('./citizen/profile/edit')} activeOpacity={0.8} style={styles.profileImageContainer}>
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.profileImage}
                resizeMode='cover' // Ensure image covers the area
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>
                  {/* Ensure name exists before accessing charAt */}
                  {(user?.name && user.name.length > 0) ? user.name.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{user?.name || 'User Name'}</Text>
          <Text style={styles.userEmail} numberOfLines={1} ellipsizeMode="tail">{user?.email || 'user@example.com'}</Text>

          {/* Removed separate Edit Profile button as image/name is now touchable */}
          {/* <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => router.push('/citizen/profile/edit')}
            activeOpacity={0.7}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity> */}
        </View>

        {/* Optional Stats Container - Uncomment if needed */}
        {/* <View style={styles.statsContainer}> ... </View> */}

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account</Text>
          <View style={styles.menuContainer}>
              {menuItems.slice(0, 3).map((item, index) => ( // First 3 items
                  <React.Fragment key={`account-${index}`}>
                      <TouchableOpacity
                         style={styles.menuItem}
                         onPress={item.onPress}
                         activeOpacity={0.7}
                       >
                         <View style={styles.menuItemIcon}>
                           {item.icon}
                         </View>
                         {/* *** FIX: Remove textColor access as it's not defined for these items *** */}
                         <Text style={styles.menuItemText}>
                           {item.title}
                         </Text>
                         <ChevronRight size={18} color={colors.gray[400]} style={styles.menuItemChevron}/>
                       </TouchableOpacity>
                       {index < 2 && <View style={styles.menuDivider} />}
                   </React.Fragment>
              ))}
          </View>
        </View>

        <View style={styles.menuSection}>
           <Text style={styles.menuSectionTitle}>Support & Legal</Text>
           <View style={styles.menuContainer}>
              {menuItems.slice(3, 6).map((item, index) => ( // Next 3 items
                 <React.Fragment key={`support-${index}`}>
                     <TouchableOpacity
                       style={styles.menuItem}
                       onPress={item.onPress}
                       activeOpacity={0.7}
                     >
                       <View style={styles.menuItemIcon}>
                         {item.icon}
                       </View>
                       {/* *** FIX: Remove textColor access as it's not defined for these items *** */}
                       <Text style={styles.menuItemText}>
                         {item.title}
                       </Text>
                       <ChevronRight size={18} color={colors.gray[400]} style={styles.menuItemChevron}/>
                     </TouchableOpacity>
                     {index < 2 && <View style={styles.menuDivider} />}
                 </React.Fragment>
              ))}
          </View>
        </View>


         <View style={[styles.menuContainer, styles.logoutMenuContainer]}>
             <TouchableOpacity
               style={styles.menuItem}
               onPress={logoutItem.onPress}
               activeOpacity={0.7}
             >
               <View style={styles.menuItemIcon}>
                 {logoutItem.icon}
               </View>
               {/* Apply specific text color for logout */}
               <Text style={[styles.menuItemText, { color: logoutItem.textColor }]}>
                 {logoutItem.title}
               </Text>
               {/* Optional: Hide chevron for logout */}
               {/* <ChevronRight size={18} color={colors.error} style={styles.menuItemChevron}/> */}
             </TouchableOpacity>
         </View>


        <View style={styles.versionContainer}>
          {/* TODO: Get app version dynamically */}
          <Text style={styles.versionText}>App Version 1.0.0</Text>
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
   scrollContent: {
     paddingBottom: 40, // Space at the bottom
   },
  header: {
    alignItems: 'center',
    paddingTop: 32, // More space top
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    // Removed borderBottom for seamless look with sections
  },
  profileImageContainer: { // Now the touchable area
    marginBottom: 12,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3, // Slightly thicker border
    borderColor: colors.primary, // Primary color border
    backgroundColor: colors.gray[200], // BG for placeholder
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // Removed explicit BG color here, handled by container
  },
  profileImagePlaceholderText: {
    fontSize: 48, // Larger placeholder text
    fontWeight: 'bold',
    color: colors.primary, // Use primary color for text
  },
  userName: {
    fontSize: 22, // Larger name
    fontWeight: '600', // Slightly less bold
    color: colors.gray[900],
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray[500], // Lighter email color
    marginBottom: 16, // Space below email
  },
  // Edit profile button removed - styles kept for reference if needed
  // editProfileButton: { ... }
  // editProfileButtonText: { ... }

  // Stats Container Styles (if used)
   statsContainer: { flexDirection: 'row', backgroundColor: colors.white, marginTop: 16, paddingVertical: 16, borderRadius: 12, marginHorizontal: 20, shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, borderWidth: 1, borderColor: colors.gray[200], },
   statItem: { flex: 1, alignItems: 'center', },
   statValue: { fontSize: 20, fontWeight: 'bold', color: colors.primary, marginBottom: 4, },
   statLabel: { fontSize: 12, color: colors.gray[600], },
   statDivider: { width: 1, height: '60%', backgroundColor: colors.gray[200], alignSelf: 'center', },

  // Menu Styles
  menuSection: {
      marginTop: 24, // Space between sections
      marginHorizontal: 16, // Use horizontal margin for section
  },
  menuSectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.gray[500], // Subdued title color
      marginBottom: 8,
      marginLeft: 4, // Indent title slightly
      textTransform: 'uppercase', // Uppercase title
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    // Removed marginHorizontal (handled by menuSection)
    // Removed marginTop (handled by menuSection)
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 }, // Slightly more shadow
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden', // Clip divider lines
  },
   logoutMenuContainer: {
     marginTop: 24, // Consistent space before logout button
     marginHorizontal: 16, // Consistent margin
     borderColor: colors.gray[200], // Standard border color
   },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14, // Adjusted padding
    paddingHorizontal: 16, // Adjusted padding
  },
  menuItemIcon: {
    width: 24, // Ensure consistent icon alignment
    alignItems: 'center', // Center icon horizontally
    marginRight: 20, // Increased space after icon
  },
  menuItemText: {
    flex: 1, // Allow text to take remaining space
    fontSize: 16,
    color: colors.gray[800],
  },
   menuItemChevron: {
     marginLeft: 8, // Space before chevron
   },
   menuDivider: {
     height: StyleSheet.hairlineWidth, // Use hairline for subtle divider
     backgroundColor: colors.gray[200], // Lighter divider
     marginHorizontal: 16, // Indent divider to align with text/chevron
     marginLeft: 60, // Further indent to align after icon area
   },
  versionContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: colors.gray[400], // Lighter version text
  },
});