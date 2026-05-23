import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../../types/navigation';
import { ProgramWorkout } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ProgramBuilder } from '../../components/trainer/ProgramBuilder';

export const ProgramScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'ProgramDetail'>>();
  const navigation = useNavigation();
  const { programId } = route.params;
  
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProgram = (programData: any) => {
    console.log('Saving program:', programData);
    Alert.alert('Success', 'Program saved successfully!');
    setIsEditing(false);
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? 'Edit Program' : 'Training Program'}
        </Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons
            name={isEditing ? 'close' : 'create-outline'}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <ProgramBuilder onSave={handleSaveProgram} />
      ) : (
        <View style={styles.content}>
          <Card style={styles.programInfo}>
            <Text style={styles.programName}>4-Week Strength Program</Text>
            <Text style={styles.programDescription}>
              A comprehensive strength training program designed to build muscle and increase strength over 4 weeks.
            </Text>
            
            <View style={styles.programMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
                <Text style={styles.metaText}>4 weeks</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="fitness-outline" size={16} color="#8E8E93" />
                <Text style={styles.metaText}>12 workouts</Text>
              </View>
            </View>
          </Card>

          <View style={styles.weekSection}>
            <Text style={styles.sectionTitle}>Weekly Schedule</Text>
            
            {[1, 2, 3, 4].map((week) => (
              <Card key={week} style={styles.weekCard}>
                <Text style={styles.weekTitle}>Week {week}</Text>
                <View style={styles.daysGrid}>
                  {daysOfWeek.map((day, index) => (
                    <View key={day} style={styles.dayItem}>
                      <Text style={styles.dayName}>{day}</Text>
                      <View style={[
                        styles.dayWorkout,
                        { backgroundColor: index % 2 === 0 ? '#34C75920' : '#FF950020' },
                      ]}>
                        <Text style={styles.dayWorkoutText}>
                          {index % 2 === 0 ? 'Upper Body' : 'Lower Body'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Start Program"
              onPress={() => {}}
              size="large"
            />
          </View>
        </View>
      )}

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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  programInfo: {
    marginHorizontal: 24,
    marginTop: 20,
    padding: 20,
  },
  programName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  programDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  programMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  weekSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  weekCard: {
    marginBottom: 12,
    padding: 16,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  daysGrid: {
    gap: 8,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F8FA',
    borderRadius: 8,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    width: 40,
  },
  dayWorkout: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayWorkoutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  bottomPadding: {
    height: 40,
  },
});