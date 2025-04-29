import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Bell, Shield, ListChecks, Users, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

// Placeholder Setting Item Component
const SettingItem = ({ icon, title, onPress }: { icon: React.ReactNode, title: string, onPress: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuItemIcon}>{icon}</View>
    <Text style={styles.menuItemText}>{title}</Text>
    <ChevronRight size={18} color={colors.gray[400]} />
  </TouchableOpacity>
);


export default function AdminSettingsScreen() {
  // Placeholder actions - implement navigation and logic
  const handleManageComplaintTypes = () => console.log("Navigate to Manage Complaint Types");
  const handleManageUsers = () => console.log("Navigate to Manage Users"); // Maybe go back to user list?
  const handleNotificationSettings = () => console.log("Navigate to Notification Settings");
  const handleSystemSettings = () => console.log("Navigate to System Settings");
  const handleSecuritySettings = () => console.log("Navigate to Security Settings");


  const settingsItems = [
     { icon: <ListChecks size={20} color={colors.gray[600]} />, title: 'Manage Complaint Types', onPress: handleManageComplaintTypes },
     { icon: <Users size={20} color={colors.gray[600]} />, title: 'Manage Users & Roles', onPress: handleManageUsers },
     { icon: <Bell size={20} color={colors.gray[600]} />, title: 'Notification Settings', onPress: handleNotificationSettings },
     { icon: <Shield size={20} color={colors.gray[600]} />, title: 'Security & Access Control', onPress: handleSecuritySettings },
     { icon: <Settings size={20} color={colors.gray[600]} />, title: 'System Configuration', onPress: handleSystemSettings },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
       {/* Header provided by Tabs layout */}

       <ScrollView>
            <View style={styles.menuContainer}>
              {settingsItems.map((item, index) => (
                 <React.Fragment key={index}>
                     <SettingItem icon={item.icon} title={item.title} onPress={item.onPress} />
                     {index < settingsItems.length - 1 && <View style={styles.menuDivider} />}
                 </React.Fragment>
               ))}
            </View>

            {/* Add other settings sections if needed */}
       </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
   // Reusing styles from profile screens
   menuContainer: { backgroundColor: colors.white, borderRadius: 12, marginHorizontal: 20, marginTop: 24, shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, borderWidth: 1, borderColor: colors.gray[200], overflow: 'hidden' },
   menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
   menuItemIcon: { width: 24, alignItems: 'center', marginRight: 16 },
   menuItemText: { flex: 1, fontSize: 16, color: colors.gray[800] },
   menuDivider: { height: 1, backgroundColor: colors.gray[100], marginHorizontal: 20 },
});