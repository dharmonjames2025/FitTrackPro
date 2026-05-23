import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutExercise } from '../../types';

interface ExerciseItemProps {
  exercise: WorkoutExercise;
  onPress?: () => void;
  onRemove?: () => void;
  isDraggable?: boolean;
  index?: number;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  onPress,
  onRemove,
  isDraggable,
  index,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {isDraggable && (
            <Ionicons name="menu" size={20} color="#C7C7CC" style={styles.dragHandle} />
          )}
          <View style={styles.info}>
            <Text style={styles.name}>{exercise.exerciseName}</Text>
            <Text style={styles.details}>
              {exercise.sets} sets × {exercise.reps} reps
              {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
            </Text>
          </View>
        </View>
        
        {onRemove && (
          <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Ionicons name="close-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        )}
        
        {!onRemove && (
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8FA',
    borderRadius: 12,
    marginBottom: 8,
    padding: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dragHandle: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  details: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
});