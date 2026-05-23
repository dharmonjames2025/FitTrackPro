import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Achievement } from '../../types';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const AchievementsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    try {
      const q = query(
        collection(db, 'users', user!.id, 'achievements')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Achievement[];
      setAchievements(data);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      workout_streak: 'flame',
      total_workouts: 'fitness',
      weight_lost: 'trending-down',
      personal_record: 'trophy',
      challenge_winner: 'medal',
      nutrition_streak: 'restaurant',
      early_bird: 'sunny',
      night_owl: 'moon',
    };
    return icons[type] || 'ribbon';
  };

  const getAchievementColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      workout_streak: '#FF9500',
      total_workouts: '#007AFF',
      weight_lost: '#34C759',
      personal_record: '#FFD700',
      challenge_winner: '#AF52DE',
      nutrition_streak: '#FF3B30',
      early_bird: '#FF9500',
      night_owl: '#5856D6',
    };
    return colors[type] || '#8E8E93';
  };

  if (loading) {
    return <LoadingSpinner message="Loading achievements..." />;
  }

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
        <View style={styles.placeholder} />
      </View>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryTitle}>Your Progress</Text>
          <Text style={styles.summaryValue}>
            {unlockedCount} / {achievements.length}
          </Text>
          <ProgressBar
            progress={(unlockedCount / achievements.length) * 100}
            color="#FFD700"
            height={8}
          />
        </View>
      </Card>

      <View style={styles.achievementsGrid}>
        {achievements.map((achievement) => {
          const isUnlocked = !!achievement.unlockedAt;
          const progress = (achievement.progress / achievement.maxProgress) * 100;

          return (
            <Card
  key={achievement.id}
  style={{
    ...styles.achievementCard,
    ...(isUnlocked ? styles.achievementUnlocked : {}),
  } as any}
>
              <View style={[
                styles.achievementIcon,
                { backgroundColor: getAchievementColor(achievement.type) + '20' },
              ]}>
                <Ionicons
                  name={getAchievementIcon(achievement.type) as any}
                  size={32}
                  color={getAchievementColor(achievement.type)}
                />
              </View>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              <View style={styles.progressContainer}>
                <ProgressBar progress={progress} color={isUnlocked ? '#FFD700' : '#007AFF'} />
                <Text style={styles.progressText}>
                  {achievement.progress} / {achievement.maxProgress}
                </Text>
              </View>
              {isUnlocked && (
                <View style={styles.unlockedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#FFD700" />
                  <Text style={styles.unlockedText}>Unlocked</Text>
                </View>
              )}
            </Card>
          );
        })}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
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
  summaryCard: {
    marginHorizontal: 24,
    marginTop: 20,
  },
  summaryContent: {
    alignItems: 'center',
    gap: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  achievementCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 20,
    opacity: 0.7,
  },
  achievementUnlocked: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  progressContainer: {
    width: '100%',
    gap: 4,
  },
  progressText: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unlockedText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});