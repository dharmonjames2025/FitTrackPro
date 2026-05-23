// File: src/navigation/TabNavigator.tsx
import React from 'react';
import { Platform, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/dashboard/HomeScreen';
import { WorkoutLogScreen } from '../screens/workout/WorkoutLogScreen';
import { NutritionLogScreen } from '../screens/nutrition/NutritionLogScreen';
import { StatsScreen } from '../screens/progress/StatsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'ellipse';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Workout') iconName = focused ? 'fitness' : 'fitness-outline';
          if (route.name === 'Nutrition') iconName = focused ? 'restaurant' : 'restaurant-outline';
          if (route.name === 'Progress') iconName = focused ? 'analytics' : 'analytics-outline';
          if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingTop: 10,
          paddingBottom: 34,
          height: 90,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workout" component={WorkoutLogScreen} />
      <Tab.Screen name="Nutrition" component={NutritionLogScreen} />
      <Tab.Screen name="Progress" component={StatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};