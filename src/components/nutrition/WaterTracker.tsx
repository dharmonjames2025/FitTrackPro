import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

interface WaterTrackerProps {
  current: number;
  goal: number;
  onAdd: (amount: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ current, goal, onAdd }) => {
  const waterAmounts = [150, 250, 500];
  const totalGlasses = 8;

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="water" size={24} color="#007AFF" />
          <Text style={styles.title}>Water Intake</Text>
        </View>
        <Text style={styles.progressText}>
          {Math.round((current / goal) * 100)}%
        </Text>
      </View>

      <View style={styles.waterDisplay}>
        <Text style={styles.currentWater}>{current}</Text>
        <Text style={styles.waterUnit}>ml / {goal}ml</Text>
      </View>

      <ProgressBar progress={(current / goal) * 100} color="#007AFF" height={10} />

      <View style={styles.buttons}>
        {waterAmounts.map(amount => (
          <TouchableOpacity
            key={amount}
            style={styles.waterButton}
            onPress={() => onAdd(amount)}
          >
            <Ionicons name="add" size={16} color="#007AFF" />
            <Text style={styles.waterButtonText}>{amount}ml</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.glassesContainer}>
        {Array.from({ length: totalGlasses }).map((_, index) => {
          if ((index + 1) * (goal / totalGlasses) <= current) {
            return <Ionicons key={index} name="water" size={28} color="#007AFF" />;
          }
          return <Ionicons key={index} name="water-outline" size={28} color="#E5E5EA" />;
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  progressText: { fontSize: 18, fontWeight: '600', color: '#007AFF' },
  waterDisplay: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: 16, gap: 4 },
  currentWater: { fontSize: 36, fontWeight: '800', color: '#1C1C1E' },
  waterUnit: { fontSize: 16, color: '#8E8E93' },
  buttons: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 16, marginBottom: 16 },
  waterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 4 },
  waterButtonText: { fontSize: 14, fontWeight: '600', color: '#007AFF' },
  glassesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
});