import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNutrition } from '../../hooks/useNutrition';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Meal, Food, MealType } from '../../types';
import { MealCard } from '../../components/nutrition/MealCard';
import { MacroProgress } from '../../components/nutrition/MacroProgress';
import { WaterTracker } from '../../components/nutrition/WaterTracker';
import { FoodSearch } from '../../components/nutrition/FoodSearch';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { MEAL_TYPES } from '../../types/nutrition';

export const NutritionLogScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const { todayLog, loading, addMeal, updateWaterIntake, deleteMeal } = useNutrition();
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [mealName, setMealName] = useState('');

  const dailyGoals = { calories: 2000, protein: 150, carbs: 200, fats: 65 };

  const handleAddMeal = async () => {
    if (selectedFoods.length === 0) { Alert.alert('Error', 'Add at least one food'); return; }
    if (!mealName.trim()) { Alert.alert('Error', 'Enter a meal name'); return; }
    const meal: Omit<Meal, 'id'> = {
      type: selectedMealType, name: mealName, foods: selectedFoods,
      totalCalories: selectedFoods.reduce((s, f) => s + f.calories, 0),
      totalProtein: selectedFoods.reduce((s, f) => s + f.protein, 0),
      totalCarbs: selectedFoods.reduce((s, f) => s + f.carbs, 0),
      totalFats: selectedFoods.reduce((s, f) => s + f.fats, 0),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    try {
      await addMeal(meal);
      setShowAddMeal(false); setSelectedFoods([]); setMealName('');
      Alert.alert('Success', 'Meal added!');
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} nestedScrollEnabled={true}>
      <View style={[styles.header, { backgroundColor: theme.headerBg }]}>
        <Text style={[styles.title, { color: theme.text }]}>Nutrition</Text>
        <Text style={{ color: theme.subText, fontSize: 16, marginTop: 4 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <View style={styles.section}>
        <MacroProgress current={{
          calories: todayLog?.totalCalories || 0, protein: todayLog?.totalProtein || 0,
          carbs: todayLog?.totalCarbs || 0, fats: todayLog?.totalFats || 0,
        }} goals={dailyGoals} />
      </View>

      <View style={styles.section}>
        <WaterTracker current={todayLog?.waterIntake || 0} goal={3000} onAdd={updateWaterIntake} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Meals</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddMeal(true)}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {todayLog?.meals && todayLog.meals.length > 0 ? (
          todayLog.meals.map(meal => <MealCard key={meal.id} meal={meal} onDelete={() => deleteMeal(meal.id)} />)
        ) : (
          <EmptyState icon="restaurant-outline" title="No Meals Logged" message="Add your first meal" />
        )}
      </View>

      <Modal visible={showAddMeal} onClose={() => setShowAddMeal(false)} title="Add Meal">
        <View style={{ gap: 12 }}>
          <Text style={{ fontWeight: '600', color: theme.text }}>Meal Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {MEAL_TYPES.map(type => (
              <TouchableOpacity key={type.value} style={[styles.chip, { backgroundColor: selectedMealType === type.value ? '#007AFF' : theme.bg }]} onPress={() => setSelectedMealType(type.value)}>
                <Text style={{ color: selectedMealType === type.value ? '#FFF' : theme.text, fontSize: 13, fontWeight: '500' }}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={{ fontWeight: '600', color: theme.text }}>Meal Name</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.bg, color: theme.text }]} value={mealName} onChangeText={setMealName} placeholder="e.g., Chicken Salad" placeholderTextColor={theme.subText} />

          <Text style={{ fontWeight: '600', color: theme.text }}>Foods</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {selectedFoods.map((food, i) => (
              <View key={i} style={[styles.foodChip, { backgroundColor: theme.bg }]}>
                <Text style={{ color: '#007AFF', fontSize: 13 }}>{food.name} ({food.calories}cal)</Text>
                <TouchableOpacity onPress={() => setSelectedFoods(selectedFoods.filter((_, j) => j !== i))}>
                  <Ionicons name="close" size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Button title="Search Foods" onPress={() => setShowFoodSearch(!showFoodSearch)} variant="outline" size="medium" />
          {showFoodSearch && <View style={{ height: 250 }}><FoodSearch onSelectFood={(food) => { setSelectedFoods([...selectedFoods, food]); setShowFoodSearch(false); }} /></View>}
          <Button title="Save Meal" onPress={handleAddMeal} size="large" />
        </View>
      </Modal>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 32, fontWeight: '800' },
  section: { paddingHorizontal: 24, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  foodChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, gap: 6 },
});