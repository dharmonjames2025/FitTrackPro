import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '../common/ProgressBar';

interface MacroProgressProps {
  current: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export const MacroProgress: React.FC<MacroProgressProps> = ({ current, goals }) => {
  const getProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Macro Progress</Text>
      
      <View style={styles.caloriesContainer}>
        <Text style={styles.caloriesValue}>{Math.round(current.calories)}</Text>
        <Text style={styles.caloriesTarget}>/ {goals.calories} cal</Text>
      </View>
      
      <ProgressBar
        progress={getProgress(current.calories, goals.calories)}
        color="#FF9500"
        height={12}
      />

      <View style={styles.macrosGrid}>
        <MacroBar
          label="Protein"
          current={current.protein}
          goal={goals.protein}
          color="#007AFF"
          icon="fish"
        />
        <MacroBar
          label="Carbs"
          current={current.carbs}
          goal={goals.carbs}
          color="#34C759"
          icon="pizza"
        />
        <MacroBar
          label="Fats"
          current={current.fats}
          goal={goals.fats}
          color="#FF3B30"
          icon="nutrition"
        />
      </View>
    </View>
  );
};

const MacroBar: React.FC<{
  label: string;
  current: number;
  goal: number;
  color: string;
  icon: string;
}> = ({ label, current, goal, color, icon }) => (
  <View style={styles.macroBar}>
    <View style={styles.macroHeader}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValues}>
        {Math.round(current)} / {goal}g
      </Text>
    </View>
    <ProgressBar progress={(current / goal) * 100} color={color} height={6} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
    gap: 4,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  caloriesTarget: {
    fontSize: 16,
    color: '#8E8E93',
  },
  macrosGrid: {
    marginTop: 20,
    gap: 16,
  },
  macroBar: {
    gap: 8,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  macroValues: {
    fontSize: 14,
    color: '#8E8E93',
  },
});