import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import { WorkoutLog } from '../../types';
import { workoutService } from '../../services/workoutService';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const ActiveWorkoutScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'ActiveWorkout'>>();
  const navigation = useNavigation();
  const { logId } = route.params;

  const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => { loadWorkoutLog(); }, []);
  useEffect(() => { const i = setInterval(() => setElapsedTime(p => p + 1), 1000); return () => clearInterval(i); }, []);

  useEffect(() => {
    if (!restTimerActive) return;
    if (restSeconds <= 0) { setRestTimerActive(false); return; }
    const i = setInterval(() => setRestSeconds(p => p - 1), 1000);
    return () => clearInterval(i);
  }, [restTimerActive, restSeconds]);

  const loadWorkoutLog = async () => {
    try {
      const snap = await getDoc(doc(db, 'workoutLogs', logId));
      if (snap.exists()) setWorkoutLog({ id: snap.id, ...snap.data() } as WorkoutLog);
    } catch { Alert.alert('Error', 'Failed to load'); }
    finally { setLoading(false); }
  };

  const updateSet = (setIndex: number, field: string, value: string) => {
    if (!workoutLog) return;
    const ex = [...workoutLog.exercises];
    const set = { ...ex[currentExerciseIndex].sets[setIndex] };
    if (field === 'reps') set.reps = parseInt(value) || 0;
    if (field === 'weight') set.weight = parseFloat(value) || 0;
    if (field === 'duration') set.duration = parseInt(value) || 0;
    ex[currentExerciseIndex].sets[setIndex] = set;
    setWorkoutLog({ ...workoutLog, exercises: ex });
  };

  const toggleSet = (setIndex: number) => {
    if (!workoutLog) return;
    const ex = [...workoutLog.exercises];
    ex[currentExerciseIndex].sets[setIndex].completed = !ex[currentExerciseIndex].sets[setIndex].completed;
    setWorkoutLog({ ...workoutLog, exercises: ex });
  };

  const nextExercise = () => {
    if (currentExerciseIndex < workoutLog!.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setRestTimerActive(true);
      setRestSeconds(60);
    }
  };

  const completeWorkout = () => {
    if (!workoutLog) return;
    Alert.alert('Complete', 'Finish this workout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete', onPress: async () => {
        const mins = Math.round(elapsedTime / 60) || 1;
        await workoutService.completeWorkout(logId, mins, workoutLog.exercises, '', 0, mins * 7);
        navigation.goBack();
      }},
    ]);
  };

  const cancelWorkout = () => {
    Alert.alert('Cancel', 'Lose all progress?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: async () => {
        await workoutService.cancelWorkout(logId);
        navigation.goBack();
      }},
    ]);
  };

  if (loading) return <LoadingSpinner />;
  if (!workoutLog) return <View style={styles.center}><Text style={styles.err}>Not found</Text></View>;

  const ex = workoutLog.exercises[currentExerciseIndex];
  
  // Check if ANY set has duration > 0, or if all sets have reps > 1
  const hasDuration = ex.sets.some(s => (s.duration || 0) > 0);
  const isTimed = hasDuration || ex.exerciseName.toLowerCase().includes('plank') || 
                  ex.exerciseName.toLowerCase().includes('stretch') ||
                  ex.exerciseName.toLowerCase().includes('hold') ||
                  ex.exerciseName.toLowerCase().includes('pose');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={cancelWorkout}><Ionicons name="close" size={28} color="#FF3B30" /></TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{workoutLog.workoutName}</Text>
        <TouchableOpacity onPress={completeWorkout}><Ionicons name="checkmark-circle" size={28} color="#34C759" /></TouchableOpacity>
      </View>

      <ScrollView style={styles.body}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentExerciseIndex + 1) / workoutLog.exercises.length) * 100}%` }]} />
        </View>

        <Text style={styles.count}>Exercise {currentExerciseIndex + 1} of {workoutLog.exercises.length}</Text>
        <Text style={styles.exName}>{ex.exerciseName}</Text>
        <Text style={styles.type}>{isTimed ? '⏱ Duration (seconds)' : '💪 Reps & Weight'}</Text>

        {restTimerActive ? (
          <View style={styles.restBox}>
            <Text style={styles.restText}>Rest: {restSeconds}s</Text>
            <Button title="Skip" onPress={() => setRestTimerActive(false)} variant="outline" size="small" />
          </View>
        ) : (
          ex.sets.map((set, i) => (
            <View key={i} style={[styles.setRow, set.completed && styles.setDone]}>
              <TouchableOpacity onPress={() => toggleSet(i)}>
                <Ionicons name={set.completed ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={set.completed ? '#34C759' : '#C7C7CC'} />
              </TouchableOpacity>
              <Text style={styles.setLabel}>Set {i + 1}</Text>
              {isTimed ? (
                <View style={styles.inputRow}>
                  <TextInput style={styles.input} value={String(set.duration || 0)} onChangeText={v => updateSet(i, 'duration', v)} keyboardType="numeric" />
                  <Text style={styles.unit}>sec</Text>
                </View>
              ) : (
                <>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} value={String(set.reps || 0)} onChangeText={v => updateSet(i, 'reps', v)} keyboardType="numeric" />
                    <Text style={styles.unit}>reps</Text>
                  </View>
                  <View style={styles.inputRow}>
                    <TextInput style={styles.input} value={String(set.weight || 0)} onChangeText={v => updateSet(i, 'weight', v)} keyboardType="decimal-pad" />
                    <Text style={styles.unit}>kg</Text>
                  </View>
                </>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {!restTimerActive && (
        <View style={styles.footer}>
          {currentExerciseIndex < workoutLog.exercises.length - 1 ? (
            <Button title="Next Exercise →" onPress={nextExercise} size="large" />
          ) : (
            <Button title="✓ Complete Workout" onPress={completeWorkout} size="large" />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  title: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', flex: 1, textAlign: 'center' },
  body: { flex: 1, paddingHorizontal: 20 },
  progressBar: { height: 4, backgroundColor: '#F2F2F7', borderRadius: 2, marginTop: 16, marginBottom: 20, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#007AFF', borderRadius: 2 },
  count: { fontSize: 14, color: '#8E8E93', marginBottom: 4 },
  exName: { fontSize: 24, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  type: { fontSize: 14, color: '#007AFF', marginBottom: 20, fontWeight: '500' },
  restBox: { alignItems: 'center', paddingVertical: 40, gap: 16 },
  restText: { fontSize: 36, fontWeight: '800', color: '#FF9500' },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F8F8FA', padding: 12, borderRadius: 10, marginBottom: 8 },
  setDone: { backgroundColor: '#F0FFF0', borderColor: '#34C759', borderWidth: 1 },
  setLabel: { fontSize: 15, fontWeight: '600', color: '#1C1C1E', width: 50 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 8, flex: 1 },
  input: { fontSize: 16, fontWeight: '600', color: '#1C1C1E', paddingVertical: 6, textAlign: 'center', flex: 1 },
  unit: { fontSize: 12, color: '#8E8E93', marginLeft: 4 },
  footer: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  err: { fontSize: 18, color: '#FF3B30' },
});