import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Workout } from '../../types';
import { Card } from '../common/Card';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  onStart?: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onPress, onStart }) => {
  const difficultyColors = {
    beginner: '#34C759',
    intermediate: '#FF9500',
    advanced: '#FF3B30',
  };

  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{workout.name}</Text>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: difficultyColors[workout.difficulty] + '20' }
          ]}>
            <Text style={[
              styles.difficultyText,
              { color: difficultyColors[workout.difficulty] }
            ]}>
              {workout.difficulty}
            </Text>
          </View>
        </View>
      </View>

      {workout.description && (
        <Text style={styles.description} numberOfLines={2}>
          {workout.description}
        </Text>
      )}

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={16} color="#8E8E93" />
          <Text style={styles.statText}>{workout.duration} min</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="fitness-outline" size={16} color="#8E8E93" />
          <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
        </View>
        {workout.caloriesBurned && (
          <View style={styles.stat}>
            <Ionicons name="flame-outline" size={16} color="#8E8E93" />
            <Text style={styles.statText}>{workout.caloriesBurned} cal</Text>
          </View>
        )}
      </View>

      {workout.tags && workout.tags.length > 0 && (
        <View style={styles.tags}>
          {workout.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {onStart && (
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Ionicons name="play" size={20} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});