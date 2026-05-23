import { useState, useEffect, useCallback } from 'react';
import { nutritionService } from '../services/nutritionService';
import { NutritionLog, Meal } from '../types';
import { useAuth } from '../context/AuthContext';

export const useNutrition = () => {
  const { user } = useAuth();
  const [todayLog, setTodayLog] = useState<NutritionLog | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => setLoading(false), 5000);

    try {
      const unsubscribe = nutritionService.getNutritionLogRealtime(
        user.id,
        today,
        (data) => {
          setTodayLog(data);
          setLoading(false);
          clearTimeout(timeout);
        }
      );

      return () => {
        clearTimeout(timeout);
        unsubscribe();
      };
    } catch (error) {
      console.error('Error loading nutrition:', error);
      setLoading(false);
    }
  }, [user, today]);

  const addMeal = useCallback(async (meal: Omit<Meal, 'id'>) => {
    if (!user) return;
    await nutritionService.createOrUpdateNutritionLog(user.id, today, meal);
  }, [user, today]);

  const updateWaterIntake = useCallback(async (amount: number) => {
    if (!user) return;
    await nutritionService.updateWaterIntake(user.id, today, amount);
  }, [user, today]);

  const deleteMeal = useCallback(async (mealId: string) => {
    if (!user) return;
    await nutritionService.deleteMeal(user.id, today, mealId);
  }, [user, today]);

  return { todayLog, loading, addMeal, updateWaterIntake, deleteMeal };
};