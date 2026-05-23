import { useState, useEffect, useCallback } from 'react';
import { progressService } from '../services/progressService';
import { BodyMeasurement, ProgressPhoto } from '../types';
import { useAuth } from '../context/AuthContext';

export const useProgress = () => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    currentWeight: 0,
    initialWeight: 0,
    weightChange: 0,
    currentBodyFat: null as number | null,
    initialBodyFat: null as number | null,
    bodyFatChange: null as number | null,
  });

  useEffect(() => {
    if (!user) return;

    const unsubscribeMeasurements = progressService.getMeasurementsRealtime(
      user.id,
      (data) => {
        setMeasurements(data);
      }
    );

    const unsubscribePhotos = progressService.getProgressPhotosRealtime(
      user.id,
      (data) => {
        setProgressPhotos(data);
      }
    );

    loadStats();

    return () => {
      unsubscribeMeasurements();
      unsubscribePhotos();
    };
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    try {
      const progressStats = await progressService.getProgressStats(user.id);
      setStats(progressStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMeasurement = useCallback(async (measurement: Omit<BodyMeasurement, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    await progressService.addMeasurement(user.id, measurement);
    await loadStats();
  }, [user]);

  const addProgressPhoto = useCallback(async (photoUri: string, data: { weight?: number; bodyFat?: number; notes?: string; visibility: 'private' | 'friends' | 'public' }) => {
    if (!user) return;
    await progressService.addProgressPhoto(user.id, photoUri, data);
  }, [user]);

  const deleteMeasurement = useCallback(async (measurementId: string) => {
    await progressService.deleteMeasurement(measurementId);
    await loadStats();
  }, []);

  const deleteProgressPhoto = useCallback(async (photoId: string, photoURL: string) => {
    await progressService.deleteProgressPhoto(photoId, photoURL);
  }, []);

  return {
    measurements,
    progressPhotos,
    stats,
    loading,
    addMeasurement,
    addProgressPhoto,
    deleteMeasurement,
    deleteProgressPhoto,
    refreshStats: loadStats,
  };
};