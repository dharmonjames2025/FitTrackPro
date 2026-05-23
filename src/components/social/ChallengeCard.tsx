import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Challenge } from '../../types';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { formatters } from '../../utils/formatters';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress?: () => void;
  onJoin?: () => void;
  progress?: number;
  isJoined?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPress,
  onJoin,
  progress = 0,
  isJoined = false,
}) => {
  const statusColors = {
    upcoming: '#FF9500',
    active: '#34C759',
    completed: '#007AFF',
    cancelled: '#FF3B30',
  };

  const statusColor = statusColors[challenge.status];

  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{challenge.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {challenge.status}
            </Text>
          </View>
        </View>
        {challenge.prize && (
          <View style={styles.prize}>
            <Ionicons name="trophy" size={16} color="#FFD700" />
            <Text style={styles.prizeText}>{challenge.prize}</Text>
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {challenge.description}
      </Text>

      <View style={styles.details}>
        <View style={styles.detail}>
          <Ionicons name="people" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>
            {challenge.participants} participants
          </Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name="flag" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>
            Goal: {challenge.goal} {challenge.metric}
          </Text>
        </View>
      </View>

      {isJoined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Your Progress</Text>
            <Text style={styles.progressValue}>{Math.round(progress)}%</Text>
          </View>
          <ProgressBar progress={progress} color="#34C759" />
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.dateText}>
          {formatters.shortDate(challenge.startDate.toDate())} -{' '}
          {formatters.shortDate(challenge.endDate.toDate())}
        </Text>
        {!isJoined && challenge.status === 'active' && onJoin && (
          <TouchableOpacity onPress={onJoin} style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Challenge</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  prize: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  prizeText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  joinButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});