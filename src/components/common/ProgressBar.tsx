import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  animated?: boolean;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#007AFF',
  backgroundColor = '#F2F2F7',
  height = 8,
  animated = true,
}) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: Math.min(Math.max(progress, 0), 100),
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      widthAnim.setValue(Math.min(Math.max(progress, 0), 100));
    }
  }, [progress, animated]);

  return (
    <View style={[styles.container, { height, backgroundColor, borderRadius: height / 2 }]}>
      <Animated.View
        style={[
          styles.progress,
          {
            backgroundColor: color,
            height,
            borderRadius: height / 2,
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});