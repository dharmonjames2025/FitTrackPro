import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [metricUnits, setMetricUnits] = useState(true);

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: 'mail-outline', label: 'Email', value: user?.email, type: 'info' },
        { icon: 'lock-closed-outline', label: 'Change Password', type: 'action', onPress: () => Alert.alert('Change Password', 'Feature coming soon!') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'notifications-outline', label: 'Notifications', type: 'switch', value: notifications, onToggle: setNotifications },
        { icon: 'scale-outline', label: 'Metric Units', type: 'switch', value: metricUnits, onToggle: setMetricUnits },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {sections.map((section, si) => (
        <View key={si} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item: any, ii: number) => (
              <TouchableOpacity key={ii} style={[styles.row, ii < section.items.length - 1 && styles.rowBorder]} onPress={item.type === 'action' ? item.onPress : undefined} disabled={item.type !== 'action'}>
                <View style={styles.rowLeft}>
                  <Ionicons name={item.icon} size={22} color="#007AFF" />
                  <Text style={styles.rowLabel}>{item.label}</Text>
                </View>
                <View style={styles.rowRight}>
                  {item.type === 'info' && <Text style={styles.rowValue}>{item.value}</Text>}
                  {item.type === 'switch' && <Switch value={item.value} onValueChange={item.onToggle} trackColor={{ false: '#E5E5EA', true: '#34C759' }} thumbColor="#FFF" />}
                  {item.type === 'action' && <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.appInfo}>
        <Text style={styles.appName}>FitTrack Pro</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFF' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  section: { marginTop: 24, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#8E8E93', marginBottom: 8, textTransform: 'uppercase' },
  sectionContent: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 16, color: '#1C1C1E' },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValue: { fontSize: 14, color: '#8E8E93' },
  appInfo: { alignItems: 'center', marginTop: 40 },
  appName: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  appVersion: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
});