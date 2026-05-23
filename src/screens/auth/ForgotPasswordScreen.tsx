// File: src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) { Alert.alert('Error', 'Enter your email'); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
      </TouchableOpacity>

      {sent ? (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail" size={50} color="#34C759" />
          </View>
          <Text style={styles.title}>Email Sent!</Text>
          <Text style={styles.subtitle}>Check your email for password reset instructions.</Text>
          <Button title="Back to Login" onPress={() => navigation.navigate('Login')} variant="primary" size="large" style={styles.button} />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={50} color="#007AFF" />
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your email and we'll send you a reset link.</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#8E8E93"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
          </View>

          <Button title="Send Reset Link" onPress={handleReset} loading={loading} size="large" style={styles.button} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingTop: 60 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  content: { flex: 1, alignItems: 'center', paddingTop: 60 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F0FF', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#1C1C1E', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#8E8E93', textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 16, paddingHorizontal: 16, width: '100%', marginBottom: 24, borderWidth: 2, borderColor: '#E5E5EA' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 17, color: '#1C1C1E', paddingVertical: 18 },
  button: { width: '100%' },
});