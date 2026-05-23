import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../common/Avatar';

interface LeaderboardItemProps {
  rank: number;
  name: string;
  photoURL?: string;
  progress: number;
  isCurrentUser?: boolean;
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  rank,
  name,
  photoURL,
  progress,
  isCurrentUser = false,
}) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#8E8E93';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return 'trophy';
      case 2: return 'medal';
      case 3: return 'ribbon';
      default: return null;
    }
  };

  return (
    <View style={[styles.container, isCurrentUser && styles.currentUser]}>
      <View style={styles.rankContainer}>
        {getRankIcon(rank) ? (
          <Ionicons name={getRankIcon(rank) as any} size={24} color={getRankColor(rank)} />
        ) : (
          <Text style={[styles.rankText, { color: getRankColor(rank) }]}>{rank}</Text>
        )}
      </View>

      <Avatar uri={photoURL} name={name} size={40} />
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{name}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
        </View>
      </View>

      <Text style={styles.progressText}>{Math.round(progress)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  currentUser: {
    backgroundColor: '#F0F0FF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  rankContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F2F2F7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    minWidth: 40,
    textAlign: 'right',
  },
});