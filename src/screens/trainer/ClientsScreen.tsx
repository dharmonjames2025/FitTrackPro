import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { trainerService } from '../../services/trainerService';
import { TrainerClient } from '../../types';
import { ClientCard } from '../../components/trainer/ClientCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const ClientsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<TrainerClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.isTrainer) {
      loadClients();
    }
  }, [user]);

  const loadClients = async () => {
    if (!user) return;

    const unsubscribe = trainerService.getTrainerClientsRealtime(
      user.id,
      (data) => {
        setClients(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user?.isTrainer) {
    return (
      <EmptyState
        icon="people-outline"
        title="Trainer Features"
        message="Become a trainer to manage clients and create programs"
      />
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading clients..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Clients</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={clients}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ClientCard
            client={item}
            onPress={() => navigation.navigate('ClientDetail', { clientId: item.clientId })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No Clients Yet"
            message="You haven't added any clients yet"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
});