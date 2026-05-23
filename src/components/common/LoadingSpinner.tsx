import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'large',
  color = '#007AFF',
  fullScreen = true,
}) => {
  const Container = fullScreen ? View : React.Fragment;

  const content = (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );

  if (fullScreen) {
    return <Container style={styles.wrapper}>{content}</Container>;
  }

  return content;
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});