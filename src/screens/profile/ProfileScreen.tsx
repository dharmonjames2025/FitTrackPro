// File: src/screens/profile/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/common/Avatar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { authService } from '../../services/authService';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout, updateUserProfile, refreshUser } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [uploading, setUploading] = useState(false);

  const handleSaveProfile = async () => {
    if (!editName.trim()) { Alert.alert('Error', 'Name is required'); return; }
    await updateUserProfile({ displayName: editName, bio: editBio });
    setShowEdit(false);
    Alert.alert('Success', 'Profile updated!');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Allow access to photos'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setUploading(true);
      try {
        await authService.uploadProfilePicture(user!.id, result.assets[0].uri);
        await refreshUser();
        Alert.alert('Success', 'Profile picture updated!');
      } catch (error: any) { Alert.alert('Error', error.message); }
      finally { setUploading(false); }
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleTrainerPress = () => {
    if (user?.isTrainer) {
      Alert.alert('Trainer Options', 'What would you like to do?', [
        { text: 'View Clients', onPress: () => navigation.navigate('Clients') },
        { text: 'Revert to Regular User', style: 'destructive', onPress: async () => {
          await updateUserProfile({ isTrainer: false });
          Alert.alert('Done', 'You are now a regular user!');
        }},
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      Alert.alert('Become a Trainer', 'Switch to trainer account? You can revert anytime.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Become Trainer', onPress: async () => {
          await updateUserProfile({ isTrainer: true });
          Alert.alert('Done', 'You are now a trainer! Share your trainer ID to get clients.');
        }},
      ]);
    }
  };

  const menuItems = [
    { icon: 'school-outline', label: user?.isTrainer ? 'Trainer Dashboard' : 'Become a Trainer', onPress: handleTrainerPress },
    { icon: 'trophy-outline', label: 'Achievements', onPress: () => navigation.navigate('Achievements') },
    { icon: 'settings-outline', label: 'Settings', onPress: () => navigation.navigate('Settings') },
    { icon: 'fitness-outline', label: 'Workout History', onPress: () => navigation.navigate('WorkoutHistory') },
    { icon: 'analytics-outline', label: 'Progress', onPress: () => navigation.navigate('Progress') },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#1C1C1E" />
        </TouchableOpacity>
      </View>

      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            <Avatar uri={user?.photoURL} name={user?.displayName} size={80} />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.displayName}>{user?.displayName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            {user?.isTrainer && <Text style={styles.trainerBadge}>🏋️ Trainer</Text>}
            {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => { setEditName(user?.displayName || ''); setEditBio(user?.bio || ''); setShowEdit(true); }}>
            <Ionicons name="pencil" size={16} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}><Text style={styles.statValue}>{user?.totalWorkouts || 0}</Text><Text style={styles.statLabel}>Workouts</Text></View>
          <View style={styles.statItem}><Text style={styles.statValue}>{user?.totalMinutes || 0}</Text><Text style={styles.statLabel}>Minutes</Text></View>
          <View style={styles.statItem}><Text style={styles.statValue}>{user?.streak || 0}</Text><Text style={styles.statLabel}>Day Streak</Text></View>
        </View>
      </Card>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon as any} size={22} color="#007AFF" />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutSection}>
        <Button title="Logout" onPress={handleLogout} variant="danger" size="large" />
      </View>
      <View style={{ height: 40 }} />

      <Modal visible={showEdit} onClose={() => setShowEdit(false)} title="Edit Profile">
        <View style={{ gap: 16 }}>
          <Input label="Display Name" value={editName} onChangeText={setEditName} placeholder="Your name" required />
          <Input label="Bio" value={editBio} onChangeText={setEditBio} placeholder="Tell us about yourself" />
          <Button title="Save Changes" onPress={handleSaveProfile} size="large" />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFF' },
  title: { fontSize: 32, fontWeight: '800', color: '#1C1C1E' },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  profileCard: { marginHorizontal: 24, marginTop: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  profileInfo: { flex: 1 },
  displayName: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  email: { fontSize: 14, color: '#8E8E93', marginTop: 2 },
  trainerBadge: { fontSize: 13, color: '#FF9500', fontWeight: '600', marginTop: 4 },
  bio: { fontSize: 14, color: '#1C1C1E', marginTop: 8 },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#007AFF', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  editBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F0FF', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, right: 0 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#1C1C1E' },
  statLabel: { fontSize: 12, color: '#8E8E93', marginTop: 4 },
  menu: { marginHorizontal: 24, marginTop: 24, backgroundColor: '#FFF', borderRadius: 16 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuLabel: { fontSize: 16, color: '#1C1C1E', fontWeight: '500' },
  logoutSection: { paddingHorizontal: 24, marginTop: 24 },
});