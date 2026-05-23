import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WorkoutTimerProps {
  onComplete?: (duration: number) => void;
  isRestTimer?: boolean;
  restDuration?: number;
  onRestComplete?: () => void;
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  onComplete,
  isRestTimer = false,
  restDuration = 60,
  onRestComplete,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [restTime, setRestTime] = useState(restDuration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (isRestTimer) {
          setRestTime(prev => {
            if (prev <= 1) {
              clearInterval(intervalRef.current!);
              setIsRunning(false);
              onRestComplete?.();
              return 0;
            }
            return prev - 1;
          });
        } else {
          setElapsedTime(prev => prev + 1);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isRestTimer]);

  const toggleTimer = () => {
    if (!isRunning && !isRestTimer) {
      setElapsedTime(0);
    }
    if (!isRunning && isRestTimer) {
      setRestTime(restDuration);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setRestTime(restDuration);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerCircle}>
        <View style={styles.timerContent}>
          <Text style={styles.timerText}>
            {formatTime(isRestTimer ? restTime : elapsedTime)}
          </Text>
          <Text style={styles.timerLabel}>
            {isRestTimer ? 'Rest' : 'Elapsed'}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={resetTimer} style={styles.controlButton}>
          <Ionicons name="refresh" size={24} color="#8E8E93" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={toggleTimer}
          style={[styles.playButton, isRunning && styles.pauseButton]}
        >
          <Ionicons
            name={isRunning ? 'pause' : 'play'}
            size={32}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onComplete?.(elapsedTime)}
          style={styles.controlButton}
        >
          <Ionicons name="checkmark" size={24} color="#34C759" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1C1C1E',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#FF9500',
  },
});