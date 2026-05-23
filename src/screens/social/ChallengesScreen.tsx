// File: src/screens/social/ChallengesScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const ChallengesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [metric, setMetric] = useState('workouts');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const q = query(collection(db, 'challenges'), where('status', '==', 'active'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleCreate = async () => {
    if (!name.trim() || !goal.trim()) { Alert.alert('Error', 'Fill all fields'); return; }
    setLoading(true);
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      await addDoc(collection(db, 'challenges'), {
        name, description, goal: parseInt(goal) || 100, metric,
        type: 'individual', status: 'active',
        startDate: Timestamp.now(), endDate: Timestamp.fromDate(endDate),
        participants: 1, createdBy: user?.id,
        rules: ['Complete the goal before the deadline'],
        createdAt: serverTimestamp(),
      });
      setName(''); setDescription(''); setGoal('');
      setShowCreate(false);
      Alert.alert('Success', 'Challenge created!');
    } catch (e: any) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Challenges</Text>
        <TouchableOpacity onPress={() => setShowCreate(true)}>
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={challenges}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.challengeName}>{item.name}</Text>
            <Text style={styles.challengeDesc}>{item.description}</Text>
            <View style={styles.meta}>
              <Text style={styles.metaText}>🎯 Goal: {item.goal} {item.metric}</Text>
              <Text style={styles.metaText}>👥 {item.participants} joined</Text>
            </View>
            <Button title="Join Challenge" onPress={() => Alert.alert('Joined!', 'You joined this challenge!')} size="small" />
          </Card>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="trophy-outline" size={60} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>No Active Challenges</Text>
            <Text style={styles.emptyText}>Create one or wait for others!</Text>
          </View>
        }
      />

      <Modal visible={showCreate} onClose={() => setShowCreate(false)} title="Create Challenge">
        <View style={{ gap: 12 }}>
          <Input label="Challenge Name" value={name} onChangeText={setName} placeholder="e.g., 30-Day Pushup" required />
          <Input label="Description" value={description} onChangeText={setDescription} placeholder="Describe the challenge" />
          <Input label="Goal (number)" value={goal} onChangeText={setGoal} placeholder="e.g., 100" keyboardType="numeric" required />
          <Input label="Metric" value={metric} onChangeText={setMetric} placeholder="workouts, minutes, calories" />
          <Button title="Create Challenge" onPress={handleCreate} loading={loading} size="large" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFF' },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  list: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  card: { marginBottom: 12 },
  challengeName: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  challengeDesc: { fontSize: 14, color: '#8E8E93', marginBottom: 12 },
  meta: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metaText: { fontSize: 13, color: '#8E8E93' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1C1C1E', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },
});