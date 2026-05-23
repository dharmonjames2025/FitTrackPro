import React, { useState, useEffect } from 'react';
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
import { trainerService } from '../../services/trainerService';
import { TrainingProgram } from '../../types';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Chart } from '../../components/common/Chart';
import { formatters } from '../../utils/formatters';

export const ClientDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'ClientDetail'>>();
  const navigation = useNavigation();
  const { clientId } = route.params;
  
  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      const unsubscribe = trainerService.getClientProgramRealtime(
        clientId,
        (data) => {
          setProgram(data);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error loading client data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading client details..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Client Details</Text>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => {}}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <Card style={styles.clientCard}>
        <View style={styles.clientHeader}>
          <Avatar name="Client Name" size={64} />
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>Client Name</Text>
            <Text style={styles.clientStatus}>Active Client</Text>
          </View>
        </View>
      </Card>

      {program ? (
        <View style={styles.programSection}>
          <Card style={styles.programCard}>
            <Text style={styles.programTitle}>{program.name}</Text>
            <Text style={styles.programDescription}>{program.description}</Text>
            
            <View style={styles.programStats}>
              <View style={styles.programStat}>
                <Text style={styles.programStatValue}>{program.duration} weeks</Text>
                <Text style={styles.programStatLabel}>Duration</Text>
              </View>
              <View style={styles.programStat}>
                <Text style={styles.programStatValue}>{program.workouts.length}</Text>
                <Text style={styles.programStatLabel}>Workouts</Text>
              </View>
            </View>

            <View style={styles.programProgress}>
              <Text style={styles.progressLabel}>Program Progress</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
              <Text style={styles.progressText}>60% Complete</Text>
            </View>

            <View style={styles.programActions}>
              <Button
                title="View Full Program"
onPress={() => (navigation as any).navigate('ProgramDetail', { programId: program.id })}
                variant="primary"
                size="medium"
              />
              <Button
                title="Update Program"
                onPress={() => {}}
                variant="outline"
                size="medium"
              />
            </View>
          </Card>
        </View>
      ) : (
        <EmptyState
          icon="document-text-outline"
          title="No Program Assigned"
          message="Create a training program for this client"
          action={
            <Button
              title="Create Program"
              onPress={() => {}}
              variant="primary"
            />
          }
        />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <View style={styles.activityInfo}>
              <Text style={styles.activityText}>Completed workout</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="restaurant" size={20} color="#FF9500" />
            <View style={styles.activityInfo}>
              <Text style={styles.activityText}>Logged nutrition</Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
          </View>
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
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientCard: {
    marginHorizontal: 24,
    marginTop: 20,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  clientStatus: {
    fontSize: 14,
    color: '#34C759',
    marginTop: 4,
  },
  programSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  programCard: {
    padding: 20,
  },
  programTitle: {
    fontSize: 18,
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
  programStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  programStat: {
    flex: 1,
    backgroundColor: '#F8F8FA',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  programStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  programStatLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  programProgress: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
  },
  programActions: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  activityCard: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  activityTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  bottomPadding: {
    height: 40,
  },
});