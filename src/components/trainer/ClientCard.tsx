import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrainerClient } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { formatters } from '../../utils/formatters';

interface ClientCardProps {
  client: TrainerClient;
  onPress?: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onPress }) => {
  const statusColors = {
    active: '#34C759',
    inactive: '#8E8E93',
    pending: '#FF9500',
  };

  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.content}>
        <Avatar name={client.clientName} size={48} />
        <View style={styles.info}>
          <Text style={styles.name}>{client.clientName}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusColors[client.status] }]} />
            <Text style={[styles.statusText, { color: statusColors[client.status] }]}>
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </Text>
          </View>
          {client.startDate && (
            <Text style={styles.date}>
              Since {formatters.shortDate(client.startDate.toDate())}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#8E8E93',
  },
});