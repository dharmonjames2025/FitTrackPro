import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../../hooks/useProgress';
import { useWorkouts } from '../../hooks/useWorkouts';
import { Card } from '../../components/common/Card';
import { Chart } from '../../components/common/Chart';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { calculations } from '../../utils/calculations';
import { formatters } from '../../utils/formatters';

export const StatsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { stats, measurements, loading: progressLoading } = useProgress();
  const { workoutHistory, loading: workoutLoading } = useWorkouts();

  if (progressLoading || workoutLoading) {
    return <LoadingSpinner message="Loading statistics..." />;
  }

  const weeklyWorkouts = workoutHistory.filter(log => {
    const logDate = log.startedAt.toDate();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo && log.status === 'completed';
  });

  const totalWorkoutMinutes = weeklyWorkouts.reduce((sum, log) => sum + log.duration, 0);
  const totalCaloriesBurned = weeklyWorkouts.reduce((sum, log) => sum + (log.caloriesBurned || 0), 0);

  const workoutChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [2, 1, 3, 2, 1, 2, 1],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Statistics</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.overviewGrid}>
        <Card style={styles.overviewCard}>
          <Ionicons name="trending-down" size={24} color="#34C759" />
          <Text style={styles.overviewValue}>
            {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)} kg
          </Text>
          <Text style={styles.overviewLabel}>Weight Change</Text>
        </Card>

        <Card style={styles.overviewCard}>
          <Ionicons name="fitness" size={24} color="#007AFF" />
          <Text style={styles.overviewValue}>{weeklyWorkouts.length}</Text>
          <Text style={styles.overviewLabel}>Workouts This Week</Text>
        </Card>

        <Card style={styles.overviewCard}>
          <Ionicons name="time" size={24} color="#FF9500" />
          <Text style={styles.overviewValue}>{formatters.duration(totalWorkoutMinutes)}</Text>
          <Text style={styles.overviewLabel}>Active Time</Text>
        </Card>

        <Card style={styles.overviewCard}>
          <Ionicons name="flame" size={24} color="#FF3B30" />
          <Text style={styles.overviewValue}>{formatters.formatNumber(totalCaloriesBurned)}</Text>
          <Text style={styles.overviewLabel}>Calories Burned</Text>
        </Card>
      </View>

      {measurements.length > 0 && (
        <View style={styles.section}>
          <Chart
            type="line"
            data={workoutChartData}
            title="Weekly Workout Frequency"
            yAxisSuffix=" workouts"
          />
        </View>
      )}

      <View style={styles.section}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Body Stats</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{stats.currentWeight.toFixed(1)} kg</Text>
              <Text style={styles.summaryLabel}>Current Weight</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{stats.initialWeight.toFixed(1)} kg</Text>
              <Text style={styles.summaryLabel}>Starting Weight</Text>
            </View>
          </View>
          {stats.currentBodyFat && (
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{stats.currentBodyFat}%</Text>
                <Text style={styles.summaryLabel}>Current Body Fat</Text>
              </View>
              {stats.initialBodyFat && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>
                    {stats.bodyFatChange! > 0 ? '+' : ''}{stats.bodyFatChange?.toFixed(1)}%
                  </Text>
                  <Text style={styles.summaryLabel}>Body Fat Change</Text>
                </View>
              )}
            </View>
          )}
        </Card>
      </View>

      <View style={styles.section}>
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <Text style={styles.tipsText}>
            • Aim for 3-5 workouts per week for optimal results{'\n'}
            • Stay hydrated - drink at least 2-3 liters of water daily{'\n'}
            • Get 7-9 hours of sleep for better recovery{'\n'}
            • Track your progress consistently to stay motivated
          </Text>
        </Card>
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
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  overviewCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  summaryCard: {
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#F8F8FA',
    padding: 16,
    borderRadius: 12,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  tipsCard: {
    backgroundColor: '#F0F0FF',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 40,
  },
});