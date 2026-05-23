import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { socialService } from '../../services/socialService';
import { ChallengeParticipant, User } from '../../types';
import { LeaderboardItem } from '../../components/social/LeaderboardItem';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const LeaderboardScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'Leaderboard'>>();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { challengeId } = route.params;
  
  const [participants, setParticipants] = useState<(ChallengeParticipant & { user?: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [challengeId]);

  const loadLeaderboard = async () => {
    try {
      // Get participants
      const unsubscribe = socialService.getChallengeLeaderboardRealtime(
        challengeId,
        async (participantsData) => {
          // Get user details for each participant
          const participantsWithUsers = await Promise.all(
            participantsData.map(async (participant) => {
              const userDoc = await getDocs(query(
                collection(db, 'users'),
                where('id', '==', participant.userId)
              ));
              const userData = userDoc.docs[0]?.data() as User | undefined;
              return { ...participant, user: userData };
            })
          );
          
          setParticipants(participantsWithUsers);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading leaderboard..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.topThree}>
        {participants.slice(0, 3).map((participant, index) => (
          <View key={participant.id} style={[
            styles.topThreeItem,
            index === 0 && styles.firstPlace,
          ]}>
            <Ionicons
              name={index === 0 ? 'trophy' : index === 1 ? 'medal' : 'ribbon'}
              size={32}
              color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}
            />
            <Text style={styles.topThreeName}>
              {participant.user?.displayName || 'Unknown'}
            </Text>
            <Text style={styles.topThreeProgress}>
              {Math.round(participant.progress)}%
            </Text>
          </View>
        ))}
      </View>

      <FlatList
        data={participants.slice(3)}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <LeaderboardItem
            rank={index + 4}
            name={item.user?.displayName || 'Unknown'}
            photoURL={item.user?.photoURL}
            progress={item.progress}
            isCurrentUser={item.userId === user?.id}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No more participants</Text>
          </View>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  placeholder: {
    width: 40,
  },
  topThree: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
    gap: 12,
  },
  topThreeItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    gap: 8,
  },
  firstPlace: {
    transform: [{ scale: 1.1 }],
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  topThreeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  topThreeProgress: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});