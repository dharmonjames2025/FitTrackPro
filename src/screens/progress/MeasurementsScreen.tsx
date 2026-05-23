import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../../hooks/useProgress';
import { BodyMeasurement } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Chart } from '../../components/common/Chart';
import { formatters } from '../../utils/formatters';
import { validators } from '../../utils/validators';

export const MeasurementsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { measurements, loading, addMeasurement, deleteMeasurement } = useProgress();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string | null } = {
      weight: validators.measurement(parseFloat(formData.weight), 'Weight'),
      bodyFat: validators.measurement(parseFloat(formData.bodyFat), 'Body fat'),
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== null);
  };

  const handleAdd = async () => {
    if (!validate()) return;

    try {
      await addMeasurement({
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(formData.weight),
        bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
        chest: formData.chest ? parseFloat(formData.chest) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
        arms: formData.arms ? parseFloat(formData.arms) : undefined,
        thighs: formData.thighs ? parseFloat(formData.thighs) : undefined,
        notes: formData.notes,
      });
      
      setShowAddModal(false);
      setFormData({
        weight: '',
        bodyFat: '',
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        thighs: '',
        notes: '',
      });
      Alert.alert('Success', 'Measurement added successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add measurement');
    }
  };

  const getWeightChartData = () => {
    const lastMeasurements = measurements.slice(-10);
    return {
      labels: lastMeasurements.map(m => {
        const date = new Date(m.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          data: lastMeasurements.map(m => m.weight),
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  if (loading) {
    return <LoadingSpinner message="Loading measurements..." />;
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
        <Text style={styles.title}>Body Measurements</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {measurements.length > 0 && (
        <View style={styles.chartSection}>
          <Chart
            type="line"
            data={getWeightChartData()}
            title="Weight Progress"
            yAxisSuffix=" kg"
          />
        </View>
      )}

      <View style={styles.measurementsList}>
        {measurements.length > 0 ? (
          measurements.map((measurement) => (
            <Card key={measurement.id} style={styles.measurementCard}>
              <View style={styles.measurementHeader}>
                <Text style={styles.measurementDate}>
                  {formatters.date(measurement.date)}
                </Text>
                <TouchableOpacity onPress={() => {
                  Alert.alert(
                    'Delete Measurement',
                    'Are you sure you want to delete this measurement?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => deleteMeasurement(measurement.id),
                      },
                    ]
                  );
                }}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              <View style={styles.measurementGrid}>
                <MeasurementItem label="Weight" value={measurement.weight} unit="kg" />
                {measurement.bodyFat && (
                  <MeasurementItem label="Body Fat" value={measurement.bodyFat} unit="%" />
                )}
                {measurement.chest && (
                  <MeasurementItem label="Chest" value={measurement.chest} unit="cm" />
                )}
                {measurement.waist && (
                  <MeasurementItem label="Waist" value={measurement.waist} unit="cm" />
                )}
                {measurement.hips && (
                  <MeasurementItem label="Hips" value={measurement.hips} unit="cm" />
                )}
                {measurement.arms && (
                  <MeasurementItem label="Arms" value={measurement.arms} unit="cm" />
                )}
                {measurement.thighs && (
                  <MeasurementItem label="Thighs" value={measurement.thighs} unit="cm" />
                )}
              </View>
              {measurement.notes && (
                <Text style={styles.notes}>{measurement.notes}</Text>
              )}
            </Card>
          ))
        ) : (
          <EmptyState
            icon="analytics-outline"
            title="No Measurements"
            message="Start tracking your body measurements to see progress"
            action={
              <Button
                title="Add First Measurement"
                onPress={() => setShowAddModal(true)}
                variant="primary"
              />
            }
          />
        )}
      </View>

      <Modal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Measurement"
      >
        <View style={styles.form}>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight (kg) *</Text>
              <TextInput
                style={styles.input}
                value={formData.weight}
                onChangeText={(text) => setFormData({ ...formData, weight: text })}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor="#C7C7CC"
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Body Fat (%)</Text>
              <TextInput
                style={styles.input}
                value={formData.bodyFat}
                onChangeText={(text) => setFormData({ ...formData, bodyFat: text })}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Chest (cm)</Text>
              <TextInput
                style={styles.input}
                value={formData.chest}
                onChangeText={(text) => setFormData({ ...formData, chest: text })}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor="#C7C7CC"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Waist (cm)</Text>
              <TextInput
                style={styles.input}
                value={formData.waist}
                onChangeText={(text) => setFormData({ ...formData, waist: text })}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Hips (cm)</Text>
              <TextInput
                style={styles.input}
                value={formData.hips}
                onChangeText={(text) => setFormData({ ...formData, hips: text })}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor="#C7C7CC"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Arms (cm)</Text>
              <TextInput
                style={styles.input}
                value={formData.arms}
                onChangeText={(text) => setFormData({ ...formData, arms: text })}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Thighs (cm)</Text>
            <TextInput
              style={styles.input}
              value={formData.thighs}
              onChangeText={(text) => setFormData({ ...formData, thighs: text })}
              keyboardType="decimal-pad"
              placeholder="0.0"
              placeholderTextColor="#C7C7CC"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Any additional notes..."
              placeholderTextColor="#C7C7CC"
              multiline
            />
          </View>

          <Button
            title="Save Measurement"
            onPress={handleAdd}
            size="large"
            style={styles.saveButton}
          />
        </View>
      </Modal>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const MeasurementItem: React.FC<{ label: string; value: number; unit: string }> = ({ label, value, unit }) => (
  <View style={styles.measurementItem}>
    <Text style={styles.measurementLabel}>{label}</Text>
    <Text style={styles.measurementValue}>
      {value} <Text style={styles.measurementUnit}>{unit}</Text>
    </Text>
  </View>
);

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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  measurementsList: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  measurementCard: {
    marginBottom: 12,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  measurementDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  measurementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  measurementItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F8FA',
    padding: 12,
    borderRadius: 8,
  },
  measurementLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  measurementUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8E8E93',
  },
  notes: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    marginTop: 16,
  },
  bottomPadding: {
    height: 40,
  },
});