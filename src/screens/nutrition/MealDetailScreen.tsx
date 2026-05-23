import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import { Meal } from '../../types';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const MealDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'MealDetail'>>();
  const navigation = useNavigation();
  const { mealId } = route.params;
  
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMealDetail();
  }, [mealId]);

  const loadMealDetail = async () => {
    // In a real app, fetch meal from Firebase
    // For now, we'll simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getMealTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      breakfast: '#FF9500',
      lunch: '#007AFF',
      dinner: '#5856D6',
      snack: '#34C759',
      pre_workout: '#FF3B30',
      post_workout: '#AF52DE',
    };
    return colors[type] || '#8E8E93';
  };

  if (loading) {
    return <LoadingSpinner message="Loading meal details..." />;
  }

  if (!meal) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>Meal not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Meal Details</Text>
        <View style={styles.placeholder} />
      </View>

      {meal.photoURL && (
        <Image source={{ uri: meal.photoURL }} style={styles.mealImage} />
      )}

      <Card style={styles.summaryCard}>
        <View style={styles.typeBadge}>
          <View style={[styles.typeDot, { backgroundColor: getMealTypeColor(meal.type) }]} />
          <Text style={[styles.typeText, { color: getMealTypeColor(meal.type) }]}>
            {meal.type.replace('_', ' ').charAt(0).toUpperCase() + meal.type.slice(1)}
          </Text>
        </View>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealTime}>{meal.time}</Text>

        <View style={styles.macroGrid}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.totalCalories}</Text>
            <Text style={styles.macroLabel}>Calories</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.totalProtein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.totalCarbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{meal.totalFats}g</Text>
            <Text style={styles.macroLabel}>Fats</Text>
          </View>
        </View>
      </Card>

      <View style={styles.foodsSection}>
        <Text style={styles.sectionTitle}>Foods</Text>
        {meal.foods.map((food, index) => (
          <Card key={index} style={styles.foodCard}>
            <View style={styles.foodHeader}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodServing}>{food.servingSize}g</Text>
            </View>
            <View style={styles.foodMacros}>
              <FoodMacro label="Calories" value={food.calories} unit="cal" />
              <FoodMacro label="Protein" value={food.protein} unit="g" />
              <FoodMacro label="Carbs" value={food.carbs} unit="g" />
              <FoodMacro label="Fats" value={food.fats} unit="g" />
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const FoodMacro: React.FC<{ label: string; value: number; unit: string }> = ({ label, value, unit }) => (
  <View style={styles.foodMacroItem}>
    <Text style={styles.foodMacroValue}>{value}</Text>
    <Text style={styles.foodMacroLabel}>
      {unit} {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  placeholder: {
    width: 40,
  },
  mealImage: {
    width: '100%',
    height: 250,
  },
  summaryCard: {
    marginHorizontal: 24,
    marginTop: 20,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mealName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  macroLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  foodsSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  foodCard: {
    marginBottom: 8,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  foodServing: {
    fontSize: 14,
    color: '#8E8E93',
  },
  foodMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodMacroItem: {
    alignItems: 'center',
  },
  foodMacroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  foodMacroLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  bottomPadding: {
    height: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    marginTop: 16,
  },
});