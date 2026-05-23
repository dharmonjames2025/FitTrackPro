import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { BodyMeasurement, ProgressPhoto } from '../types';
import { storageService } from './storageService';

export const progressService = {
  // Add body measurement
  async addMeasurement(userId: string, measurement: Omit<BodyMeasurement, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'bodyMeasurements'), {
        ...measurement,
        userId,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Get measurements (real-time)
  getMeasurementsRealtime(userId: string, callback: (measurements: BodyMeasurement[]) => void) {
    const q = query(
      collection(db, 'bodyMeasurements'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
    );

    return onSnapshot(q, (snapshot) => {
      const measurements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BodyMeasurement[];
      callback(measurements);
    }, (error) => {
      console.error('Error fetching measurements:', error);
      callback([]);
    });
  },

  // Delete measurement
  async deleteMeasurement(measurementId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'bodyMeasurements', measurementId));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Add progress photo
  async addProgressPhoto(userId: string, photoUri: string, data: { weight?: number; bodyFat?: number; notes?: string; visibility: 'private' | 'friends' | 'public' }): Promise<string> {
    try {
      const photoURL = await storageService.uploadProgressPhoto(userId, photoUri);
      
      const docRef = await addDoc(collection(db, 'progressPhotos'), {
        userId,
        photoURL,
        date: new Date().toISOString().split('T')[0],
        weight: data.weight,
        bodyFat: data.bodyFat,
        notes: data.notes,
        visibility: data.visibility || 'private',
        createdAt: serverTimestamp(),
      });
      
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Get progress photos (real-time)
  getProgressPhotosRealtime(userId: string, callback: (photos: ProgressPhoto[]) => void) {
    const q = query(
      collection(db, 'progressPhotos'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
    );

    return onSnapshot(q, (snapshot) => {
      const photos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProgressPhoto[];
      callback(photos);
    }, (error) => {
      console.error('Error fetching progress photos:', error);
      callback([]);
    });
  },

  // Delete progress photo
  async deleteProgressPhoto(photoId: string, photoURL: string): Promise<void> {
    try {
      // Extract path from URL
      const path = photoURL.split('/').pop()?.split('?')[0];
      if (path) {
        await storageService.deleteFile(`progress_photos/${path}`);
      }
      await deleteDoc(doc(db, 'progressPhotos', photoId));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Get progress stats
  async getProgressStats(userId: string): Promise<{
    currentWeight: number;
    initialWeight: number;
    weightChange: number;
    currentBodyFat: number | null;
    initialBodyFat: number | null;
    bodyFatChange: number | null;
  }> {
    try {
      const q = query(
        collection(db, 'bodyMeasurements'),
        where('userId', '==', userId),
        orderBy('date', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const measurements = snapshot.docs.map(doc => doc.data()) as BodyMeasurement[];
      
      if (measurements.length === 0) {
        return {
          currentWeight: 0,
          initialWeight: 0,
          weightChange: 0,
          currentBodyFat: null,
          initialBodyFat: null,
          bodyFatChange: null,
        };
      }

      const first = measurements[0];
      const last = measurements[measurements.length - 1];
      
      return {
        currentWeight: last.weight,
        initialWeight: first.weight,
        weightChange: last.weight - first.weight,
        currentBodyFat: last.bodyFat || null,
        initialBodyFat: first.bodyFat || null,
        bodyFatChange: (last.bodyFat && first.bodyFat) ? last.bodyFat - first.bodyFat : null,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
};