import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LoggedSet } from '../../types';

interface SetInputProps {
  set: LoggedSet;
  onUpdate: (updatedSet: LoggedSet) => void;
  onToggleComplete: () => void;
}

export const SetInput: React.FC<SetInputProps> = ({
  set,
  onUpdate,
  onToggleComplete,
}) => {
  const handleRepsChange = (text: string) => {
    const reps = parseInt(text) || 0;
    onUpdate({ ...set, reps });
  };

  const handleWeightChange = (text: string) => {
    const weight = parseFloat(text) || 0;
    onUpdate({ ...set, weight });
  };

  return (
    <View style={[styles.container, set.completed && styles.completed]}>
      <TouchableOpacity
        onPress={onToggleComplete}
        style={styles.checkbox}
      >
        <Ionicons
          name={set.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={set.completed ? '#34C759' : '#C7C7CC'}
        />
      </TouchableOpacity>
      
      <Text style={styles.setNumber}>Set {set.setNumber}</Text>
      
      <View style={styles.inputs}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={set.reps.toString()}
            onChangeText={handleRepsChange}
            keyboardType="numeric"
            placeholder="Reps"
            placeholderTextColor="#C7C7CC"
          />
          <Text style={styles.inputLabel}>reps</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={set.weight?.toString() || ''}
            onChangeText={handleWeightChange}
            keyboardType="decimal-pad"
            placeholder="Weight"
            placeholderTextColor="#C7C7CC"
          />
          <Text style={styles.inputLabel}>kg</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  completed: {
    backgroundColor: '#F0FFF0',
    borderColor: '#34C759',
  },
  checkbox: {
    marginRight: 12,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    width: 50,
  },
  inputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    paddingVertical: 8,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
});