// File: src/types/index.ts
import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoals: string[];
  isTrainer: boolean;
  trainerId?: string;
  darkMode?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
  isActive: boolean;
  totalWorkouts: number;
  totalMinutes: number;
  streak: number;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: WorkoutType;
  difficulty: DifficultyLevel;
  duration: number;
  caloriesBurned?: number;
  exercises: WorkoutExercise[];
  isPublic: boolean;
  isTemplate: boolean;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type WorkoutType = 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'yoga' | 'crossfit' | 'other';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  notes?: string;
  order: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroup: MuscleGroup;
  equipment?: string[];
  description: string;
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
  isCustom: boolean;
  userId?: string;
  createdAt: Timestamp;
}

export type ExerciseCategory = 'compound' | 'isolation' | 'bodyweight' | 'cardio' | 'stretching';
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'glutes' | 'abs' | 'full_body' | 'cardio';

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutId: string;
  workoutName: string;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  duration: number;
  exercises: LoggedExercise[];
  notes?: string;
  rating?: number;
  caloriesBurned?: number;
  status: WorkoutStatus;
  createdAt: Timestamp;
}

export type WorkoutStatus = 'in_progress' | 'completed' | 'abandoned';

export interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: LoggedSet[];
  notes?: string;
}

export interface LoggedSet {
  setNumber: number;
  reps: number;
  weight?: number;
  duration?: number;
  completed: boolean;
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  waterIntake: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Meal {
  id: string;
  type: MealType;
  name: string;
  foods: Food[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  time: string;
  photoURL?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';

export interface Food {
  id: string;
  name: string;
  servingSize: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  photoURL?: string;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
  createdAt: Timestamp;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  photoURL: string;
  thumbnailURL?: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  notes?: string;
  createdAt: Timestamp;
  visibility: 'private' | 'friends' | 'public';
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  startDate: Timestamp;
  endDate: Timestamp;
  goal: number;
  metric: string;
  participants: number;
  maxParticipants?: number;
  createdBy: string;
  prize?: string;
  status: ChallengeStatus;
  rules: string[];
  imageURL?: string;
  createdAt: Timestamp;
}

export type ChallengeType = 'individual' | 'team' | 'head_to_head';
export type ChallengeStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  progress: number;
  completedAt?: Timestamp;
  rank?: number;
  joinedAt: Timestamp;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  content: string;
  mediaURLs?: string[];
  workoutLogId?: string;
  achievementId?: string;
  likes: string[];
  comments: Comment[];
  visibility: 'public' | 'friends' | 'private';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  content: string;
  createdAt: Timestamp;
}

export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlockedAt?: Timestamp;
  createdAt: Timestamp;
}

export type AchievementType = 'workout_streak' | 'total_workouts' | 'weight_lost' | 'personal_record' | 'challenge_winner' | 'nutrition_streak' | 'early_bird' | 'night_owl';

export interface TrainerClient {
  id: string;
  trainerId: string;
  clientId: string;
  clientName: string;
  status: 'active' | 'inactive' | 'pending';
  startDate: Timestamp;
  endDate?: Timestamp;
  programId?: string;
  notes?: string;
  createdAt: Timestamp;
}

export interface TrainingProgram {
  id: string;
  trainerId: string;
  clientId: string;
  clientName: string;
  name: string;
  description: string;
  duration: number;
  workouts: ProgramWorkout[];
  nutritionPlan?: NutritionPlan;
  goals: string[];
  status: 'active' | 'completed' | 'paused';
  startDate: Timestamp;
  endDate: Timestamp;
  createdAt: Timestamp;
}

export interface ProgramWorkout {
  id: string;
  workoutId: string;
  dayOfWeek: number;
  weekNumber: number;
  notes?: string;
}

export interface NutritionPlan {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  meals: MealPlan[];
}

export interface MealPlan {
  type: MealType;
  description: string;
  foods: Food[];
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Timestamp;
}

export type NotificationType = 'challenge_invite' | 'workout_reminder' | 'achievement_unlocked' | 'trainer_message' | 'social_like' | 'social_comment' | 'challenge_update';

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: any;
  timestamp: Timestamp;
}