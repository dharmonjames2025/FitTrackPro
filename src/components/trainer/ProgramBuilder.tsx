import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgramWorkout, NutritionPlan, MealPlan, Food } from '../../types';

interface ProgramBuilderProps {
  onSave: (program: {
    name: string;
    description: string;
    duration: number;
    workouts: ProgramWorkout[];
    nutritionPlan?: NutritionPlan;
    goals: string[];
  }) => void;
}

export const ProgramBuilder: React.FC<ProgramBuilderProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(4); // weeks
  const [workouts, setWorkouts] = useState<ProgramWorkout[]>([]);
  const [goals, setGoals] = useState<string[]>([]);

  const addWorkout = () => {
    const newWorkout: ProgramWorkout = {
      id: Date.now().toString(),
      workoutId: '',
      dayOfWeek: 1,
      weekNumber: 1,
    };
    setWorkouts([...workouts, newWorkout]);
  };

  const addGoal = (goal: string) => {
    if (!goals.includes(goal)) {
      setGoals([...goals, goal]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Program Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter program name"
        placeholderTextColor="#C7C7CC"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the program"
        placeholderTextColor="#C7C7CC"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Duration (weeks)</Text>
      <TextInput
        style={styles.input}
        value={duration.toString()}
        onChangeText={(text) => setDuration(parseInt(text) || 4)}
        keyboardType="numeric"
        placeholderTextColor="#C7C7CC"
      />

      <Text style={styles.label}>Workouts</Text>
      {workouts.map((workout, index) => (
        <View key={workout.id} style={styles.workoutItem}>
          <Text>Day {workout.dayOfWeek} - Week {workout.weekNumber}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={addWorkout} style={styles.addButton}>
        <Ionicons name="add" size={20} color="#007AFF" />
        <Text style={styles.addButtonText}>Add Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => onSave({ name, description, duration, workouts, goals })}
      >
        <Text style={styles.saveButtonText}>Save Program</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  workoutItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  addButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});