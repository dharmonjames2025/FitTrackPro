import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkouts } from '../../hooks/useWorkouts';
import { WorkoutLog } from '../../types';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { formatters } from '../../utils/formatters';

export const WorkoutHistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { workoutHistory } = useWorkouts();

  const getStatusColor = (status: string) => {
    if (status === 'completed') return '#34C759';
    if (status === 'in_progress') return '#FF9500';
    return '#FF3B30';
  };

  const renderItem = ({ item }: { item: WorkoutLog }) => (
    <Card onPress={() => navigation.navigate('WorkoutDetail', { logId: item.id })} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.workoutName}>{item.workoutName}</Text>
          <Text style={styles.workoutDate}>
            {formatters.date(item.startedAt?.toDate?.() || new Date())}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status?.replace('_', ' ') || 'unknown'}
          </Text>
        </View>
      </View>
      {item.duration > 0 && (
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="time-outline" size={14} color="#8E8E93" />
            <Text style={styles.statText}>{item.duration} min</Text>
          </View>
          {item.caloriesBurned ? (
            <View style={styles.stat}>
              <Ionicons name="flame-outline" size={14} color="#8E8E93" />
              <Text style={styles.statText}>{item.caloriesBurned} cal</Text>
            </View>
          ) : null}
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Workout History</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={workoutHistory}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="fitness-outline" title="No Workout History" message="Complete your first workout!" />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFF' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  list: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  card: { marginBottom: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardInfo: { flex: 1 },
  workoutName: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  workoutDate: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  stats: { flexDirection: 'row', gap: 16, marginTop: 12 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 13, color: '#8E8E93' },
});