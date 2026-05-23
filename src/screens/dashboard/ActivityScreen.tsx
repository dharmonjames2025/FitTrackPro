import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ActivityLog } from '../../types';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatters } from '../../utils/formatters';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const ActivityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user]);

  const loadActivities = async () => {
    try {
      const q = query(
        collection(db, 'activityLogs'),
        where('userId', '==', user!.id),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLog[];
      
      setActivities(logs);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  };

  const getActivityIcon = (action: string): string => {
    const icons: { [key: string]: string } = {
      create_workout: 'add-circle',
      start_workout: 'play-circle',
      complete_workout: 'checkmark-circle',
      log_meal: 'restaurant',
      add_measurement: 'analytics',
      join_challenge: 'trophy',
      achievement: 'ribbon',
    };
    return icons[action] || 'ellipse';
  };

  const getActivityColor = (action: string): string => {
    const colors: { [key: string]: string } = {
      create_workout: '#007AFF',
      start_workout: '#FF9500',
      complete_workout: '#34C759',
      log_meal: '#FF9500',
      add_measurement: '#5856D6',
      join_challenge: '#FFD700',
      achievement: '#FF3B30',
    };
    return colors[action] || '#8E8E93';
  };

  const getActivityMessage = (activity: ActivityLog): string => {
    switch (activity.action) {
      case 'create_workout':
        return `Created workout "${activity.details.workoutName}"`;
      case 'start_workout':
        return `Started "${activity.details.workoutName}"`;
      case 'complete_workout':
        return `Completed "${activity.details.workoutName}" - ${activity.details.duration} min`;
      case 'log_meal':
        return `Logged ${activity.details.mealType} - ${activity.details.calories} cal`;
      case 'add_measurement':
        return `Added measurement: ${activity.details.weight}kg`;
      case 'join_challenge':
        return `Joined challenge "${activity.details.challengeName}"`;
      case 'achievement':
        return `Unlocked achievement: ${activity.details.achievementTitle}`;
      default:
        return activity.action;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading activities..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Activity Log</Text>
        <View style={styles.placeholder} />
      </View>

      {activities.length > 0 ? (
        activities.map((activity) => (
          <Card key={activity.id} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <View style={[styles.iconContainer, { backgroundColor: getActivityColor(activity.action) + '20' }]}>
                <Ionicons
                  name={getActivityIcon(activity.action) as any}
                  size={24}
                  color={getActivityColor(activity.action)}
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityMessage}>
                  {getActivityMessage(activity)}
                </Text>
                <Text style={styles.activityTime}>
                  {formatters.relativeTime(activity.timestamp.toDate())}
                </Text>
              </View>
            </View>
          </Card>
        ))
      ) : (
        <EmptyState
          icon="time-outline"
          title="No Activity Yet"
          message="Your fitness activities will appear here"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  placeholder: {
    width: 40,
  },
  activityCard: {
    marginHorizontal: 24,
    marginTop: 12,
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
});