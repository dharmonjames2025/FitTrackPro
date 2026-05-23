// File: src/screens/dashboard/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Button } from '../../components/common/Button';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { icon: 'fitness', label: 'Workout', color: '#007AFF', screen: 'Workout' },
    { icon: 'restaurant', label: 'Nutrition', color: '#FF9500', screen: 'Nutrition' },
    { icon: 'analytics', label: 'Progress', color: '#34C759', screen: 'Progress' },
    { icon: 'people', label: 'Feed', color: '#5856D6', screen: 'Feed' },
    { icon: 'trophy', label: 'Challenges', color: '#FFD700', screen: 'Challenges' },
    { icon: 'time', label: 'History', color: '#FF2D55', screen: 'WorkoutHistory' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}, {user?.displayName?.split(' ')[0] || 'User'}</Text>
          <Text style={styles.subtitle}>Let's crush it today! 💪</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.displayName?.charAt(0)?.toUpperCase() || 'U'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <Card style={styles.streakCard}>
          <View style={styles.streakContent}>
            <View>
              <Text style={styles.streakTitle}>Current Streak</Text>
              <View style={styles.streakRow}>
                <Text style={styles.streakNumber}>{user?.streak || 0}</Text>
                <Text style={styles.streakUnit}>days</Text>
              </View>
            </View>
            <Ionicons name="flame" size={40} color="#FF9500" />
          </View>
          <ProgressBar progress={0} color="#007AFF" />
          <Text style={styles.weeklyGoal}>Complete a workout to start your streak!</Text>
        </Card>

        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickAction} onPress={() => navigation.navigate(action.screen)}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <Card>
            <Text style={styles.quickStartTitle}>Start a Workout</Text>
            <Text style={styles.quickStartText}>Begin tracking your exercise now</Text>
            <Button title="Start Workout" onPress={() => navigation.navigate('Workout')} variant="primary" size="medium" />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFF' },
  greeting: { fontSize: 24, fontWeight: '700', color: '#1C1C1E' },
  subtitle: { fontSize: 16, color: '#8E8E93', marginTop: 4 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: '600' },
  streakCard: { marginHorizontal: 24, marginTop: 20, padding: 20 },
  streakContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  streakTitle: { fontSize: 16, color: '#8E8E93', marginBottom: 4 },
  streakRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  streakNumber: { fontSize: 40, fontWeight: '800', color: '#1C1C1E' },
  streakUnit: { fontSize: 18, color: '#8E8E93' },
  weeklyGoal: { fontSize: 12, color: '#8E8E93', marginTop: 8, textAlign: 'center' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 12, marginTop: 20, flexWrap: 'wrap', gap: 10 },
  quickAction: { alignItems: 'center', gap: 6, width: '30%' },
  quickActionIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  quickActionLabel: { fontSize: 11, color: '#1C1C1E', fontWeight: '500', textAlign: 'center' },
  section: { paddingHorizontal: 24, marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1C1C1E', marginBottom: 12 },
  quickStartTitle: { fontSize: 18, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 },
  quickStartText: { fontSize: 14, color: '#8E8E93', marginBottom: 16 },
});