import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label: string;
  error?: string | null;
  isPassword?: boolean;
  icon?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  icon,
  required = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        error && styles.error
      ]}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={error ? '#FF3B30' : '#8E8E93'}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor="#C7C7CC"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 12,
  },
  focused: {
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
  },
  error: {
    borderColor: '#FF3B30',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    paddingVertical: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});