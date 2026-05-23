// File: src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TabNavigator } from './TabNavigator';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ActiveWorkoutScreen } from '../screens/workout/ActiveWorkoutScreen';
import { WorkoutDetailScreen } from '../screens/workout/WorkoutDetailScreen';
import { WorkoutHistoryScreen } from '../screens/workout/WorkoutHistoryScreen';
import { MealDetailScreen } from '../screens/nutrition/MealDetailScreen';
import { NutritionStatsScreen } from '../screens/nutrition/NutritionStatsScreen';
import { MeasurementsScreen } from '../screens/progress/MeasurementsScreen';
import { ProgressPhotosScreen } from '../screens/progress/ProgressPhotosScreen';
import { StatsScreen } from '../screens/progress/StatsScreen';
import { FeedScreen } from '../screens/social/FeedScreen';
import { ChallengesScreen } from '../screens/social/ChallengesScreen';
import { LeaderboardScreen } from '../screens/social/LeaderboardScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { AchievementsScreen } from '../screens/profile/AchievementsScreen';
import { ActivityScreen } from '../screens/dashboard/ActivityScreen';
import { ClientsScreen } from '../screens/trainer/ClientsScreen';
import { ClientDetailScreen } from '../screens/trainer/ClientDetailScreen';
import { ProgramScreen } from '../screens/trainer/ProgramScreen';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator id="AuthStack" screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const AppNavigatorStack = () => (
  <AppStack.Navigator id="AppStack" screenOptions={{ headerShown: false }}>
    <AppStack.Screen name="MainTabs" component={TabNavigator} />
    <AppStack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
    <AppStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
    <AppStack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
    <AppStack.Screen name="MealDetail" component={MealDetailScreen} />
    <AppStack.Screen name="NutritionStats" component={NutritionStatsScreen} />
    <AppStack.Screen name="Measurements" component={MeasurementsScreen} />
    <AppStack.Screen name="ProgressPhotos" component={ProgressPhotosScreen} />
    <AppStack.Screen name="Stats" component={StatsScreen} />
    <AppStack.Screen name="Feed" component={FeedScreen} />
    <AppStack.Screen name="Challenges" component={ChallengesScreen} />
    <AppStack.Screen name="Leaderboard" component={LeaderboardScreen} />
    <AppStack.Screen name="Settings" component={SettingsScreen} />
    <AppStack.Screen name="Achievements" component={AchievementsScreen} />
    <AppStack.Screen name="Activity" component={ActivityScreen} />
    <AppStack.Screen name="Clients" component={ClientsScreen} />
    <AppStack.Screen name="ClientDetail" component={ClientDetailScreen} />
    <AppStack.Screen name="ProgramDetail" component={ProgramScreen} />
  </AppStack.Navigator>
);

export const AppNavigator = () => {
  const { firebaseUser, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return <NavigationContainer>{firebaseUser ? <AppNavigatorStack /> : <AuthNavigator />}</NavigationContainer>;
};