import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Meal } from '../../types';
import { Card } from '../common/Card';

interface MealCardProps {
  meal: Meal;
  onPress?: () => void;
  onDelete?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onPress, onDelete }) => {
  const getMealIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      breakfast: 'sunny',
      lunch: 'sunny-outline',
      dinner: 'moon',
      snack: 'cafe',
      pre_workout: 'fitness',
      post_workout: 'barbell',
    };
    return icons[type] || 'restaurant';
  };

  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.mealType}>
          <Ionicons name={getMealIcon(meal.type) as any} size={20} color="#007AFF" />
          <Text style={styles.mealTypeText}>
            {meal.type.replace('_', ' ').charAt(0).toUpperCase() + meal.type.slice(1)}
          </Text>
        </View>
        <Text style={styles.time}>{meal.time}</Text>
      </View>

      <Text style={styles.name}>{meal.name}</Text>

      {meal.foods.length > 0 && (
        <View style={styles.foods}>
          {meal.foods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodServing}>{food.servingSize}g</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.macros}>
        <MacroItem label="Calories" value={meal.totalCalories} unit="cal" color="#FF9500" />
        <MacroItem label="Protein" value={meal.totalProtein} unit="g" color="#007AFF" />
        <MacroItem label="Carbs" value={meal.totalCarbs} unit="g" color="#34C759" />
        <MacroItem label="Fats" value={meal.totalFats} unit="g" color="#FF3B30" />
      </View>

      {meal.photoURL && (
        <Image source={{ uri: meal.photoURL }} style={styles.mealImage} />
      )}

      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </Card>
  );
};

const MacroItem: React.FC<{ label: string; value: number; unit: string; color: string }> = ({
  label,
  value,
  unit,
  color,
}) => (
  <View style={styles.macroItem}>
    <View style={[styles.macroDot, { backgroundColor: color }]} />
    <Text style={styles.macroValue}>{Math.round(value)}</Text>
    <Text style={styles.macroLabel}>{unit}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  foods: {
    backgroundColor: '#F8F8FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  foodName: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  foodServing: {
    fontSize: 14,
    color: '#8E8E93',
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  macroLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  mealImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
});