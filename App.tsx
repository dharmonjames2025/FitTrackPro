// File: App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => { LogBox.ignoreLogs(['VirtualizedLists should never be nested']); }, []);

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </AuthProvider>
  );
}