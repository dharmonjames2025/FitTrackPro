// File: src/screens/workout/WorkoutDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import { WorkoutLog } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatters } from '../../utils/formatters';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const WorkoutDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'WorkoutDetail'>>();
  const navigation = useNavigation();
  const { logId } = route.params;
  
  const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkoutDetail();
  }, [logId]);

  const loadWorkoutDetail = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'workoutLogs', logId));
      if (docSnap.exists()) {
        setWorkoutLog({ id: docSnap.id, ...docSnap.data() } as WorkoutLog);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  if (!workoutLog) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={60} color="#FF3B30" />
        <Text style={styles.errorText}>Workout not found</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === 'completed') return '#34C759';
    if (status === 'in_progress') return '#FF9500';
    return '#FF3B30';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Workout Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <Card style={styles.summaryCard}>
        <Text style={styles.workoutName}>{workoutLog.workoutName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(workoutLog.status) + '20', alignSelf: 'flex-start' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(workoutLog.status) }]}>
            {workoutLog.status?.replace('_', ' ')}
          </Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={18} color="#8E8E93" />
            <Text style={styles.detailText}>
              {workoutLog.startedAt?.toDate ? formatters.date(workoutLog.startedAt.toDate()) : 'Unknown date'}
            </Text>
          </View>
          {workoutLog.completedAt && (
            <View style={styles.detailItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#8E8E93" />
              <Text style={styles.detailText}>
                Completed: {workoutLog.completedAt.toDate ? formatters.time(workoutLog.completedAt.toDate()) : 'Unknown'}
              </Text>
            </View>
          )}
          {workoutLog.duration > 0 && (
            <View style={styles.detailItem}>
              <Ionicons name="timer-outline" size={18} color="#8E8E93" />
              <Text style={styles.detailText}>Duration: {formatters.duration(workoutLog.duration)}</Text>
            </View>
          )}
          {workoutLog.caloriesBurned ? (
            <View style={styles.detailItem}>
              <Ionicons name="flame-outline" size={18} color="#8E8E93" />
              <Text style={styles.detailText}>{workoutLog.caloriesBurned} calories burned</Text>
            </View>
          ) : null}
        </View>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {workoutLog.exercises?.map((exercise, index) => (
          <Card key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
            {exercise.sets?.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={styles.setLabel}>Set {set.setNumber}</Text>
                <Text style={styles.setDetail}>
                  {set.duration ? `${set.duration}s` : `${set.reps} reps${set.weight ? ` @ ${set.weight}kg` : ''}`}
                </Text>
                <Ionicons
                  name={set.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={18}
                  color={set.completed ? '#34C759' : '#C7C7CC'}
                />
              </View>
            ))}
            {exercise.notes ? <Text style={styles.notes}>{exercise.notes}</Text> : null}
          </Card>
        ))}
      </View>

      {workoutLog.notes ? (
        <Card style={styles.notesCard}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={styles.notesText}>{workoutLog.notes}</Text>
        </Card>
      ) : null}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFF' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  errorText: { fontSize: 18, color: '#FF3B30', marginTop: 16 },
  summaryCard: { marginHorizontal: 24, marginTop: 20 },
  workoutName: { fontSize: 22, fontWeight: '700', color: '#1C1C1E', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 16 },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  details: { gap: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14, color: '#1C1C1E' },
  section: { paddingHorizontal: 24, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', marginBottom: 12 },
  exerciseCard: { marginBottom: 8 },
  exerciseName: { fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginBottom: 10 },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#F8F8FA', borderRadius: 8, marginBottom: 4 },
  setLabel: { fontSize: 13, fontWeight: '500', color: '#1C1C1E' },
  setDetail: { fontSize: 13, color: '#8E8E93' },
  notes: { fontSize: 13, color: '#8E8E93', fontStyle: 'italic', marginTop: 8 },
  notesCard: { marginHorizontal: 24, marginTop: 16 },
  notesTitle: { fontSize: 16, fontWeight: '600', color: '#1C1C1E', marginBottom: 8 },
  notesText: { fontSize: 14, color: '#8E8E93', lineHeight: 20 },
});