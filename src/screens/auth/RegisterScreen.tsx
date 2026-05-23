import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { validators } from '../../utils/validators';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string | null } = {
      displayName: validators.displayName(displayName),
      email: validators.email(email),
      password: validators.password(password),
      confirmPassword: password !== confirmPassword ? 'Passwords do not match' : null,
      terms: !acceptTerms ? 'You must accept the terms and conditions' : null,
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== null);
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await register(email, password, displayName);
      Alert.alert(
        'Welcome!',
        'Your account has been created successfully.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'An error occurred during registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join FitTrack Pro and start your fitness journey
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your full name"
            autoCapitalize="words"
            error={errors.displayName}
            icon="person-outline"
            required
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            icon="mail-outline"
            required
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            isPassword
            autoComplete="new-password"
            error={errors.password}
            icon="lock-closed-outline"
            required
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            isPassword
            autoComplete="new-password"
            error={errors.confirmPassword}
            icon="lock-closed-outline"
            required
          />

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <Ionicons
              name={acceptTerms ? 'checkbox' : 'square-outline'}
              size={24}
              color={acceptTerms ? '#007AFF' : '#8E8E93'}
            />
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            size="large"
            style={styles.registerButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Button
            title="Log In"
            onPress={() => navigation.navigate('Login')}
            variant="secondary"
            size="small"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  termsLink: {
    color: '#007AFF',
    fontWeight: '500',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginLeft: 36,
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});