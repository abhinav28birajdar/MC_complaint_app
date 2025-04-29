import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, User, ShieldCheck, HelpCircle, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth-store';

export default function EmployeeProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert( 'Logout', 'Are you sure you want to logout?',
      [ { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: async () => { await logout(); /* Redirect handled by root */ }, style: 'destructive' } ],
      { cancelable: true }
    );
  };

  // Simplified menu for employees
  const menuItems = [
    // Add employee-specific items if needed, e.g., 'View Performance', 'Request Leave'
    { icon: <ShieldCheck size={20} color={colors.gray[600]} />, title: 'Account Security', onPress: () => {} /* Navigate to security screen */ },
    { icon: <HelpCircle size={20} color={colors.gray[600]} />, title: 'Help Center', onPress: () => {} /* Navigate to help screen */ },
  ];

  const logoutItem = { icon: <LogOut size={20} color={colors.error} />, title: 'Logout', onPress: handleLogout };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
        {/* Header provided by Tabs layout */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
             {/* Same profile image logic as citizen profile */}
             {user?.profileImage ? <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
              : <View style={styles.profileImagePlaceholder}><Text style={styles.profileImagePlaceholderText}>{user?.name?.charAt(0).toUpperCase() || 'E'}</Text></View>}
          </View>
          <Text style={styles.userName}>{user?.name || 'Employee Name'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'employee@example.com'}</Text>
           {/* Maybe add Department/Role */}
           <Text style={styles.userRole}>{user?.role?.toUpperCase() || 'EMPLOYEE'}</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
                 <TouchableOpacity style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
                   <View style={styles.menuItemIcon}>{item.icon}</View>
                   <Text style={styles.menuItemText}>{item.title}</Text>
                   <ChevronRight size={18} color={colors.gray[400]} style={styles.menuItemChevron}/>
                 </TouchableOpacity>
                 {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
             </React.Fragment>
          ))}
        </View>

        <View style={[styles.menuContainer, styles.logoutMenuContainer]}>
             <TouchableOpacity style={styles.menuItem} onPress={logoutItem.onPress} activeOpacity={0.7}>
               <View style={styles.menuItemIcon}>{logoutItem.icon}</View>
               <Text style={[styles.menuItemText, { color: colors.error }]}>{logoutItem.title}</Text>
             </TouchableOpacity>
         </View>

        <View style={styles.versionContainer}><Text style={styles.versionText}>Version 1.0.0</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Use styles similar to app/citizen/profile/index.tsx, potentially simplified
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingBottom: 40 },
    header: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 20, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray[200] },
    profileImageContainer: { marginBottom: 16, width: 100, height: 100, borderRadius: 50, overflow: 'hidden', borderWidth: 2, borderColor: colors.primaryLight },
    profileImage: { width: '100%', height: '100%' },
    profileImagePlaceholder: { width: '100%', height: '100%', backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
    profileImagePlaceholderText: { fontSize: 40, fontWeight: 'bold', color: colors.white },
    userName: { fontSize: 20, fontWeight: 'bold', color: colors.gray[900], marginBottom: 4 },
    userEmail: { fontSize: 14, color: colors.gray[600], marginBottom: 8 },
    userRole: { fontSize: 12, color: colors.primary, fontWeight: '600', backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
    menuContainer: { backgroundColor: colors.white, borderRadius: 12, marginHorizontal: 20, marginTop: 24, shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, borderWidth: 1, borderColor: colors.gray[200], overflow: 'hidden' },
    logoutMenuContainer: { marginTop: 16, borderColor: colors.errorLight },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
    menuItemIcon: { width: 24, alignItems: 'center', marginRight: 16 },
    menuItemText: { flex: 1, fontSize: 16, color: colors.gray[800] },
    menuItemChevron: { marginLeft: 8 },
    menuDivider: { height: 1, backgroundColor: colors.gray[100], marginHorizontal: 20 },
    versionContainer: { alignItems: 'center', marginTop: 40, marginBottom: 24 },
    versionText: { fontSize: 12, color: colors.gray[500] },
});