import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
   TextInput,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useProgress } from '../../hooks/useProgress';
import { ProgressPhoto } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatters } from '../../utils/formatters';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = (SCREEN_WIDTH - 72) / 2;

export const ProgressPhotosScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { progressPhotos, loading, addProgressPhoto, deleteProgressPhoto } = useProgress();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [uploadData, setUploadData] = useState({
    weight: '',
    bodyFat: '',
    notes: '',
    visibility: 'private' as 'private' | 'friends' | 'public',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    try {
      await addProgressPhoto(selectedImage, {
        weight: uploadData.weight ? parseFloat(uploadData.weight) : undefined,
        bodyFat: uploadData.bodyFat ? parseFloat(uploadData.bodyFat) : undefined,
        notes: uploadData.notes,
        visibility: uploadData.visibility,
      });
      
      setShowUploadModal(false);
      setSelectedImage(null);
      setUploadData({
        weight: '',
        bodyFat: '',
        notes: '',
        visibility: 'private',
      });
      Alert.alert('Success', 'Progress photo uploaded successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload photo');
    }
  };

  const handleDelete = (photoId: string, photoURL: string) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this progress photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProgressPhoto(photoId, photoURL);
              if (selectedPhoto?.id === photoId) {
                setSelectedPhoto(null);
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete photo');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading photos..." />;
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
        <Text style={styles.title}>Progress Photos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowUploadModal(true)}
        >
          <Ionicons name="camera" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {progressPhotos.length > 0 ? (
        <View style={styles.photoGrid}>
          {progressPhotos.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              style={styles.photoContainer}
              onPress={() => setSelectedPhoto(photo)}
              onLongPress={() => handleDelete(photo.id, photo.photoURL)}
            >
              <Image
                source={{ uri: photo.photoURL }}
                style={styles.photo}
                resizeMode="cover"
              />
              <View style={styles.photoOverlay}>
                <Text style={styles.photoDate}>
                  {formatters.shortDate(photo.date)}
                </Text>
                {photo.weight && (
                  <Text style={styles.photoWeight}>{photo.weight} kg</Text>
                )}
              </View>
              {photo.visibility !== 'private' && (
                <View style={styles.visibilityBadge}>
                  <Ionicons
                    name={photo.visibility === 'public' ? 'earth' : 'people'}
                    size={12}
                    color="#FFFFFF"
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <EmptyState
          icon="images-outline"
          title="No Progress Photos"
          message="Take progress photos to visually track your transformation"
          action={
            <Button
              title="Take First Photo"
              onPress={() => setShowUploadModal(true)}
              variant="primary"
            />
          }
        />
      )}

      {/* Photo Detail Modal */}
      <Modal
        visible={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        title="Photo Details"
      >
        {selectedPhoto && (
          <View style={styles.detailContainer}>
            <Image
              source={{ uri: selectedPhoto.photoURL }}
              style={styles.detailImage}
              resizeMode="contain"
            />
            <View style={styles.detailInfo}>
              <Text style={styles.detailDate}>
                {formatters.date(selectedPhoto.date)}
              </Text>
              {selectedPhoto.weight && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Weight:</Text>
                  <Text style={styles.detailValue}>{selectedPhoto.weight} kg</Text>
                </View>
              )}
              {selectedPhoto.bodyFat && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Body Fat:</Text>
                  <Text style={styles.detailValue}>{selectedPhoto.bodyFat}%</Text>
                </View>
              )}
              {selectedPhoto.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.detailLabel}>Notes:</Text>
                  <Text style={styles.detailNotes}>{selectedPhoto.notes}</Text>
                </View>
              )}
              <Button
                title="Delete Photo"
                onPress={() => {
                  setSelectedPhoto(null);
                  handleDelete(selectedPhoto.id, selectedPhoto.photoURL);
                }}
                variant="danger"
                size="medium"
                style={styles.deleteButton}
              />
            </View>
          </View>
        )}
      </Modal>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedImage(null);
        }}
        title="Upload Progress Photo"
      >
        <View style={styles.uploadContainer}>
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.changeImageText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageOptions}>
              <TouchableOpacity
                style={styles.imageOption}
                onPress={takePhoto}
              >
                <Ionicons name="camera" size={32} color="#007AFF" />
                <Text style={styles.imageOptionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imageOption}
                onPress={pickImage}
              >
                <Ionicons name="images" size={32} color="#007AFF" />
                <Text style={styles.imageOptionText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={uploadData.weight}
              onChangeText={(text) => setUploadData({ ...uploadData, weight: text })}
              keyboardType="decimal-pad"
              placeholder="Current weight"
              placeholderTextColor="#C7C7CC"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Body Fat (%)</Text>
            <TextInput
              style={styles.input}
              value={uploadData.bodyFat}
              onChangeText={(text) => setUploadData({ ...uploadData, bodyFat: text })}
              keyboardType="decimal-pad"
              placeholder="Current body fat percentage"
              placeholderTextColor="#C7C7CC"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={uploadData.notes}
              onChangeText={(text) => setUploadData({ ...uploadData, notes: text })}
              placeholder="Any notes about this photo..."
              placeholderTextColor="#C7C7CC"
              multiline
            />
          </View>

          <View style={styles.visibilityContainer}>
            <Text style={styles.inputLabel}>Visibility</Text>
            <View style={styles.visibilityOptions}>
              {['private', 'friends', 'public'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.visibilityOption,
                    uploadData.visibility === option && styles.visibilityOptionActive,
                  ]}
                  onPress={() => setUploadData({ ...uploadData, visibility: option as any })}
                >
                  <Ionicons
                    name={
                      option === 'private' ? 'lock-closed' :
                      option === 'friends' ? 'people' : 'earth'
                    }
                    size={16}
                    color={uploadData.visibility === option ? '#FFFFFF' : '#8E8E93'}
                  />
                  <Text style={[
                    styles.visibilityText,
                    uploadData.visibility === option && styles.visibilityTextActive,
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button
            title="Upload Photo"
            onPress={handleUpload}
            size="large"
            style={styles.uploadButton}
            disabled={!selectedImage}
          />
        </View>
      </Modal>

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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 8,
  },
  photoContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  photoDate: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  photoWeight: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 2,
  },
  visibilityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    gap: 16,
  },
  detailImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  detailInfo: {
    gap: 8,
  },
  detailDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  notesContainer: {
    paddingTop: 8,
  },
  detailNotes: {
    fontSize: 14,
    color: '#1C1C1E',
    marginTop: 4,
    lineHeight: 20,
  },
  deleteButton: {
    marginTop: 16,
  },
  uploadContainer: {
    gap: 16,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  imageOption: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F8FA',
    borderRadius: 16,
    minWidth: 120,
    gap: 8,
  },
  imageOptionText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  selectedImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  changeImageButton: {
    marginTop: 12,
    padding: 8,
  },
  changeImageText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 12,
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
  visibilityContainer: {
    marginBottom: 16,
  },
  visibilityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  visibilityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    gap: 4,
  },
  visibilityOptionActive: {
    backgroundColor: '#007AFF',
  },
  visibilityText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  visibilityTextActive: {
    color: '#FFFFFF',
  },
  uploadButton: {
    marginTop: 16,
  },
  bottomPadding: {
    height: 40,
  },
});