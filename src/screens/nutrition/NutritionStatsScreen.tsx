import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNutrition } from '../../hooks/useNutrition';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Chart } from '../../components/common/Chart';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const screenWidth = Dimensions.get('window').width;

export const NutritionStatsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const { nutritionHistory, loading } = useNutrition();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  if (loading) {
    return <LoadingSpinner message="Loading statistics..." />;
  }

  const getChartData = () => {
    const last7Days = nutritionHistory.slice(-7);
    return {
      labels: last7Days.map(log => {
        const date = new Date(log.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      datasets: [
        {
          data: last7Days.map(log => log.totalCalories),
          color: (opacity = 1) => `rgba(255, 149, 0, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const getMacroData = () => {
    const last7Days = nutritionHistory.slice(-7);
    return {
      labels: last7Days.map(log => {
        const date = new Date(log.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      datasets: [
        {
          data: last7Days.map(log => log.totalProtein),
        },
        {
          data: last7Days.map(log => log.totalCarbs),
        },
        {
          data: last7Days.map(log => log.totalFats),
        },
      ],
    };
  };

  const averages = nutritionHistory.length > 0
    ? {
        calories: Math.round(nutritionHistory.reduce((sum, log) => sum + log.totalCalories, 0) / nutritionHistory.length),
        protein: Math.round(nutritionHistory.reduce((sum, log) => sum + log.totalProtein, 0) / nutritionHistory.length),
        carbs: Math.round(nutritionHistory.reduce((sum, log) => sum + log.totalCarbs, 0) / nutritionHistory.length),
        fats: Math.round(nutritionHistory.reduce((sum, log) => sum + log.totalFats, 0) / nutritionHistory.length),
      }
    : { calories: 0, protein: 0, carbs: 0, fats: 0 };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Nutrition Stats</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'week' && styles.periodTextActive]}>
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>
            Month
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.averagesGrid}>
        <Card style={styles.averageCard}>
          <Text style={styles.averageValue}>{averages.calories}</Text>
          <Text style={styles.averageLabel}>Avg Calories</Text>
        </Card>
        <Card style={styles.averageCard}>
          <Text style={styles.averageValue}>{averages.protein}g</Text>
          <Text style={styles.averageLabel}>Avg Protein</Text>
        </Card>
        <Card style={styles.averageCard}>
          <Text style={styles.averageValue}>{averages.carbs}g</Text>
          <Text style={styles.averageLabel}>Avg Carbs</Text>
        </Card>
        <Card style={styles.averageCard}>
          <Text style={styles.averageValue}>{averages.fats}g</Text>
          <Text style={styles.averageLabel}>Avg Fats</Text>
        </Card>
      </View>

      <View style={styles.chartSection}>
        <Chart
          type="line"
          data={getChartData()}
          title="Calorie Intake"
          yAxisSuffix=" cal"
        />
      </View>

      <View style={styles.chartSection}>
        <Chart
          type="bar"
          data={getMacroData()}
          title="Macro Breakdown"
          yAxisSuffix="g"
        />
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
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  averagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  averageCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  averageValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  averageLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  chartSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  bottomPadding: {
    height: 40,
  },
});