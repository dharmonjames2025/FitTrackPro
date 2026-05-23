import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workout: undefined;
  Nutrition: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  ActiveWorkout: { logId: string };
  WorkoutDetail: { logId: string };
  CreateWorkout: undefined;
  EditWorkout: { workoutId: string };
  ExerciseDetail: { exerciseId: string };
  MealDetail: { mealId: string };
  AddMeal: { date?: string };
  ProgressPhoto: undefined;
  Challenges: undefined;
  ChallengeDetail: { challengeId: string };
  Leaderboard: { challengeId: string };
  PostDetail: { postId: string };
  CreatePost: undefined;
  ClientDetail: { clientId: string };
  ProgramDetail: { programId: string };
  Settings: undefined;
  Achievements: undefined;
  EditProfile: undefined;
  TrainerProfile: { trainerId: string };
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;

export type ActiveWorkoutRouteProp = RouteProp<AppStackParamList, 'ActiveWorkout'>;
export type WorkoutDetailRouteProp = RouteProp<AppStackParamList, 'WorkoutDetail'>;
export type ChallengeDetailRouteProp = RouteProp<AppStackParamList, 'ChallengeDetail'>;