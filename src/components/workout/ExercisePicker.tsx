import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '../../types';

const GROUPS = ['all', 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs', 'glutes', 'cardio'];

const EXERCISES: Exercise[] = [
  { id: '1', name: 'Bench Press', category: 'compound', muscleGroup: 'chest', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '2', name: 'Incline Press', category: 'compound', muscleGroup: 'chest', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '3', name: 'Dumbbell Flyes', category: 'isolation', muscleGroup: 'chest', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '4', name: 'Push-ups', category: 'bodyweight', muscleGroup: 'chest', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '5', name: 'Deadlift', category: 'compound', muscleGroup: 'back', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '6', name: 'Pull-ups', category: 'bodyweight', muscleGroup: 'back', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '7', name: 'Barbell Row', category: 'compound', muscleGroup: 'back', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '8', name: 'Lat Pulldown', category: 'isolation', muscleGroup: 'back', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '9', name: 'Overhead Press', category: 'compound', muscleGroup: 'shoulders', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '10', name: 'Lateral Raise', category: 'isolation', muscleGroup: 'shoulders', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '11', name: 'Bicep Curls', category: 'isolation', muscleGroup: 'biceps', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '12', name: 'Hammer Curls', category: 'isolation', muscleGroup: 'biceps', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '13', name: 'Tricep Dips', category: 'bodyweight', muscleGroup: 'triceps', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '14', name: 'Tricep Pushdown', category: 'isolation', muscleGroup: 'triceps', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '15', name: 'Squat', category: 'compound', muscleGroup: 'legs', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '16', name: 'Leg Press', category: 'compound', muscleGroup: 'legs', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '17', name: 'Lunges', category: 'bodyweight', muscleGroup: 'legs', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '18', name: 'Calf Raises', category: 'isolation', muscleGroup: 'legs', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '19', name: 'Plank', category: 'bodyweight', muscleGroup: 'abs', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '20', name: 'Crunches', category: 'bodyweight', muscleGroup: 'abs', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '21', name: 'Hip Thrust', category: 'compound', muscleGroup: 'glutes', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '22', name: 'Glute Bridge', category: 'bodyweight', muscleGroup: 'glutes', equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '23', name: 'Burpees', category: 'cardio', muscleGroup: 'cardio' as any, equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '24', name: 'Running', category: 'cardio', muscleGroup: 'cardio' as any, equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
  { id: '25', name: 'Jump Rope', category: 'cardio', muscleGroup: 'cardio' as any, equipment: [], description: '', instructions: [], isCustom: false, createdAt: null as any },
];

interface Props { onSelect: (e: Exercise) => void; selectedExercises?: Exercise[]; }

export const ExercisePicker: React.FC<Props> = ({ onSelect, selectedExercises = [] }) => {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('all');

  const filtered = EXERCISES.filter(ex => {
    const name = (ex.name || '').toLowerCase();
    return name.includes(search.toLowerCase()) && (group === 'all' || ex.muscleGroup === group) && !selectedExercises.find(s => s.id === ex.id);
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#8E8E93" />
        <TextInput style={styles.input} placeholder="Search exercises..." value={search} onChangeText={setSearch} placeholderTextColor="#C7C7CC" />
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {GROUPS.map(g => (
          <TouchableOpacity key={g} style={[styles.chip, group === g && styles.chipActive]} onPress={() => setGroup(g)}>
            <Text style={[styles.chipText, group === g && styles.chipTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map(item => (
          <TouchableOpacity key={item.id} style={styles.item} onPress={() => onSelect(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.muscle}>{item.muscleGroup}</Text>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        ))}
        {filtered.length === 0 && (
          <Text style={styles.empty}>No exercises found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 10, paddingHorizontal: 12, marginBottom: 10 },
  input: { flex: 1, fontSize: 15, paddingVertical: 10, marginLeft: 8, color: '#1C1C1E' },
  filterRow: { maxHeight: 36, marginBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: '#F2F2F7', marginRight: 8 },
  chipActive: { backgroundColor: '#007AFF' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#8E8E93', textTransform: 'capitalize' },
  chipTextActive: { color: '#FFF' },
  list: { flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  name: { fontSize: 15, fontWeight: '600', color: '#1C1C1E', flex: 1 },
  muscle: { fontSize: 12, color: '#8E8E93', textTransform: 'capitalize', marginTop: 2 },
  empty: { padding: 40, color: '#8E8E93', fontSize: 15 },
});