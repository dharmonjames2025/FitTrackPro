import { useState, useEffect } from 'react';
import { workoutService } from '../services/workoutService';
import { Workout, WorkoutLog } from '../types';
import { useAuth } from '../context/AuthContext';

export const useWorkouts = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutLog[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Force stop loading after 5 seconds
    const timeout = setTimeout(() => setLoading(false), 5000);

    try {
      const unsubscribeWorkouts = workoutService.getUserWorkoutsRealtime(
        user.id,
        (data) => {
          setWorkouts(data);
          setLoading(false);
          clearTimeout(timeout);
        }
      );

      const unsubscribeHistory = workoutService.getWorkoutHistoryRealtime(
        user.id,
        (data) => setWorkoutHistory(data)
      );

      const unsubscribeActive = workoutService.getActiveWorkoutRealtime(
        user.id,
        (data) => setActiveWorkout(data)
      );

      return () => {
        clearTimeout(timeout);
        unsubscribeWorkouts();
        unsubscribeHistory();
        unsubscribeActive();
      };
    } catch (error) {
      console.error('Error loading workouts:', error);
      setLoading(false);
    }
  }, [user]);

  return {
    workouts,
    workoutHistory,
    activeWorkout,
    loading,
    startWorkout: (workoutId: string) => workoutService.startWorkout(user!.id, workoutId),
    completeWorkout: (logId: string, duration: number, exercises: any[]) => 
      workoutService.completeWorkout(logId, duration, exercises),
    cancelWorkout: (logId: string) => workoutService.cancelWorkout(logId),
    deleteWorkout: (workoutId: string) => workoutService.deleteWorkout(workoutId),
  };
};