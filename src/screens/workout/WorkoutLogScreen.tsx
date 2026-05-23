import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { WorkoutCard } from '../../components/workout/WorkoutCard';
import { ExercisePicker } from '../../components/workout/ExercisePicker';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { Exercise, WorkoutExercise } from '../../types';
import { workoutService } from '../../services/workoutService';

export const WorkoutLogScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const { workouts, startWorkout } = useWorkouts();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const filteredWorkouts = workouts.filter(w => w.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAddExercise = (exercise: Exercise) => {
    const isTimed = exercise.name.toLowerCase().includes('plank') || 
                    exercise.name.toLowerCase().includes('stretch') ||
                    exercise.name.toLowerCase().includes('hold') ||
                    exercise.name.toLowerCase().includes('pose');
    setSelectedExercises([...selectedExercises, {
      exerciseId: exercise.id, exerciseName: exercise.name,
      sets: 3, reps: isTimed ? 1 : 10, weight: 0, duration: isTimed ? 30 : 0,
      order: selectedExercises.length + 1,
    }]);
    setShowExercisePicker(false);
  };

  const handleRemoveExercise = (index: number) => setSelectedExercises(selectedExercises.filter((_, i) => i !== index));

  const handleUpdateExercise = (index: number, field: string, value: string) => {
    const updated = [...selectedExercises];
    if (field === 'sets') updated[index].sets = parseInt(value) || 1;
    if (field === 'reps') updated[index].reps = parseInt(value) || 1;
    if (field === 'weight') updated[index].weight = parseFloat(value) || 0;
    if (field === 'duration') updated[index].duration = parseInt(value) || 0;
    setSelectedExercises(updated);
  };

  const handleCreateWorkout = async () => {
    if (!workoutName.trim()) { Alert.alert('Error', 'Enter workout name'); return; }
    if (selectedExercises.length === 0) { Alert.alert('Error', 'Add at least one exercise'); return; }
    try {
      await workoutService.createWorkout(user!.id, {
        name: workoutName, type: 'strength', difficulty: 'beginner', duration: 30,
        exercises: selectedExercises, isPublic: false, isTemplate: true, tags: [],
      });
      setShowCreateModal(false); setWorkoutName(''); setSelectedExercises([]);
      Alert.alert('Success', 'Workout created!');
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  const handleStartWorkout = async (workoutId: string) => {
    try {
      const logId = await startWorkout(workoutId);
      navigation.navigate('ActiveWorkout', { logId });
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Workouts</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowCreateModal(true)}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBox, { backgroundColor: theme.cardBg }]}>
        <Ionicons name="search" size={20} color={theme.subText} />
        <TextInput style={[styles.searchInput, { color: theme.text }]} placeholder="Search workouts..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor={theme.subText} />
      </View>

      <FlatList
        data={filteredWorkouts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <WorkoutCard workout={item} onPress={() => {}} onStart={() => handleStartWorkout(item.id)} />}
        ListEmptyComponent={<EmptyState icon="fitness-outline" title="No Workouts Yet" message="Create your first workout" action={<Button title="Create Workout" onPress={() => setShowCreateModal(true)} variant="primary" />} />}
        contentContainerStyle={styles.list}
      />

      <Modal visible={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Workout">
        <View style={{ gap: 12 }}>
          <Input label="Workout Name" value={workoutName} onChangeText={setWorkoutName} placeholder="e.g., Upper Body" required />
          <Text style={{ fontWeight: '600', color: theme.text }}>Exercises ({selectedExercises.length})</Text>
          
          {selectedExercises.map((ex, i) => {
            const isTimed = (ex.duration || 0) > 0;
            return (
              <View key={i} style={[styles.exCard, { backgroundColor: theme.bg }]}>
                <View style={styles.exHeader}>
                  <Text style={[styles.exName, { color: theme.text }]}>{ex.exerciseName}</Text>
                  <TouchableOpacity onPress={() => handleRemoveExercise(i)}>
                    <Ionicons name="close-circle" size={22} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
                {editingIndex === i ? (
                  <View style={styles.editRow}>
                    <View style={styles.editField}>
                      <Text style={{ color: theme.subText, fontSize: 10 }}>Sets</Text>
                      <TextInput style={styles.editInput} value={String(ex.sets)} onChangeText={v => handleUpdateExercise(i, 'sets', v)} keyboardType="numeric" />
                    </View>
                    {isTimed ? (
                      <View style={styles.editField}>
                        <Text style={{ color: theme.subText, fontSize: 10 }}>Duration (s)</Text>
                        <TextInput style={styles.editInput} value={String(ex.duration || 0)} onChangeText={v => handleUpdateExercise(i, 'duration', v)} keyboardType="numeric" />
                      </View>
                    ) : (
                      <>
                        <View style={styles.editField}>
                          <Text style={{ color: theme.subText, fontSize: 10 }}>Reps</Text>
                          <TextInput style={styles.editInput} value={String(ex.reps)} onChangeText={v => handleUpdateExercise(i, 'reps', v)} keyboardType="numeric" />
                        </View>
                        <View style={styles.editField}>
                          <Text style={{ color: theme.subText, fontSize: 10 }}>Weight (kg)</Text>
                          <TextInput style={styles.editInput} value={String(ex.weight || 0)} onChangeText={v => handleUpdateExercise(i, 'weight', v)} keyboardType="decimal-pad" />
                        </View>
                      </>
                    )}
                    <TouchableOpacity onPress={() => setEditingIndex(null)}>
                      <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => setEditingIndex(i)} style={styles.exPreview}>
                    <Text style={{ color: theme.subText, fontSize: 13 }}>
                      {ex.sets} sets × {isTimed ? `${ex.duration}s` : `${ex.reps} reps${ex.weight ? ` @ ${ex.weight}kg` : ''}`}
                    </Text>
                    <Ionicons name="pencil" size={14} color={theme.subText} />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          <Button title="+ Add Exercise" onPress={() => setShowExercisePicker(true)} variant="outline" size="medium" />
          {showExercisePicker && <View style={{ height: 250 }}><ExercisePicker onSelect={handleAddExercise} selectedExercises={selectedExercises.map(e => ({ id: e.exerciseId } as Exercise))} /></View>}
          <Button title="Create Workout" onPress={handleCreateWorkout} size="large" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1 },
  title: { fontSize: 32, fontWeight: '800' },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginTop: 16, borderRadius: 12, paddingHorizontal: 12 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 12, marginLeft: 8 },
  list: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 100 },
  exCard: { padding: 12, borderRadius: 10 },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  exName: { fontSize: 14, fontWeight: '600', flex: 1 },
  exPreview: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  editField: { flex: 1 },
  editInput: { backgroundColor: '#FFF', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, fontSize: 14, textAlign: 'center', borderWidth: 1, borderColor: '#E5E5EA', color: '#1C1C1E' },
});