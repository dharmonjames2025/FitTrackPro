import { 
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, limit, serverTimestamp, Timestamp,
  onSnapshot, writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Workout, WorkoutLog, WorkoutStatus, LoggedExercise, Exercise } from '../types';

export const workoutService = {
  async createWorkout(userId: string, workoutData: Omit<Workout, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const workoutRef = await addDoc(collection(db, 'workouts'), {
        ...workoutData, userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      await this.logActivity(userId, 'create_workout', { workoutId: workoutRef.id, workoutName: workoutData.name });
      return workoutRef.id;
    } catch (error: any) { throw new Error(error.message); }
  },

  async startWorkout(userId: string, workoutId: string): Promise<string> {
    try {
      const workoutDoc = await getDoc(doc(db, 'workouts', workoutId));
      if (!workoutDoc.exists()) throw new Error('Workout not found');
      const workout = { id: workoutDoc.id, ...workoutDoc.data() } as Workout;

      const workoutLog = {
        userId: userId || '',
        workoutId: workoutId || '',
        workoutName: workout.name || 'Workout',
        startedAt: Timestamp.now(),
        duration: 0,
        exercises: (workout.exercises || []).map((ex: any) => ({
          exerciseId: ex.exerciseId || '',
          exerciseName: ex.exerciseName || 'Exercise',
          sets: Array.from({ length: ex.sets || 3 }, (_, i) => ({
            setNumber: i + 1,
            reps: ex.duration ? 1 : (ex.reps || 10),
            weight: ex.weight || 0,
            duration: ex.duration || 0,
            completed: false,
          })),
          notes: ex.notes || '',
        })),
        status: 'in_progress' as const,
        notes: '',
        caloriesBurned: 0,
        createdAt: serverTimestamp() as any,
      };

      const logRef = await addDoc(collection(db, 'workoutLogs'), workoutLog);
      await this.logActivity(userId, 'start_workout', { logId: logRef.id, workoutId, workoutName: workout.name });
      return logRef.id;
    } catch (error: any) { throw new Error(error.message); }
  },

  async updateWorkoutLog(logId: string, updates: Partial<Pick<WorkoutLog, 'exercises' | 'notes' | 'caloriesBurned' | 'duration'>>): Promise<void> {
    try { await updateDoc(doc(db, 'workoutLogs', logId), updates); } catch (error: any) { throw new Error(error.message); }
  },

  async completeWorkout(logId: string, duration: number, exercises: LoggedExercise[], notes?: string, rating?: number, caloriesBurned?: number): Promise<void> {
    try {
      const batch = writeBatch(db);
      const logRef = doc(db, 'workoutLogs', logId);
      batch.update(logRef, {
        status: 'completed' as WorkoutStatus, completedAt: Timestamp.now(),
        duration: duration || 0, exercises: exercises || [], notes: notes || '',
        rating: rating || 0, caloriesBurned: caloriesBurned || 0,
      });
      const logDoc = await getDoc(logRef);
      const logData = logDoc.data();
      if (!logData) throw new Error('Workout log not found');
      
      const userRef = doc(db, 'users', logData.userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      
      if (userData) {
        const totalWorkouts = (userData.totalWorkouts || 0) + 1;
        const totalMinutes = (userData.totalMinutes || 0) + (duration || 0);
        
        // Auto-level based on total workouts
        let newLevel = userData.fitnessLevel || 'beginner';
        if (totalWorkouts >= 100) newLevel = 'advanced';
        else if (totalWorkouts >= 30) newLevel = 'intermediate';
        
        batch.update(userRef, {
          totalWorkouts,
          totalMinutes,
          fitnessLevel: newLevel,
          updatedAt: serverTimestamp(),
        });
      }
      
      await batch.commit();
      await this.logActivity(logData.userId, 'complete_workout', { logId, workoutId: logData.workoutId, duration, caloriesBurned });
      await this.checkWorkoutAchievements(logData.userId);
      await this.updateStreak(logData.userId);
    } catch (error: any) { throw new Error(error.message); }
  },

  async cancelWorkout(logId: string): Promise<void> {
    try { await updateDoc(doc(db, 'workoutLogs', logId), { status: 'abandoned' as WorkoutStatus, completedAt: Timestamp.now() }); } catch (error: any) { throw new Error(error.message); }
  },

  async deleteWorkout(workoutId: string): Promise<void> {
    try { await deleteDoc(doc(db, 'workouts', workoutId)); } catch (error: any) { throw new Error(error.message); }
  },

  getUserWorkoutsRealtime(userId: string, callback: (workouts: Workout[]) => void) {
    return onSnapshot(query(collection(db, 'workouts'), where('userId', '==', userId), where('isTemplate', '==', true), orderBy('updatedAt', 'desc')),
      (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Workout[]),
      (err) => { console.error(err); callback([]); }
    );
  },

  getPublicWorkoutsRealtime(callback: (workouts: Workout[]) => void) {
    return onSnapshot(query(collection(db, 'workouts'), where('isPublic', '==', true), where('isTemplate', '==', true), orderBy('createdAt', 'desc'), limit(50)),
      (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Workout[]),
      (err) => { console.error(err); callback([]); }
    );
  },

  getWorkoutHistoryRealtime(userId: string, callback: (logs: WorkoutLog[]) => void) {
    return onSnapshot(query(collection(db, 'workoutLogs'), where('userId', '==', userId), orderBy('startedAt', 'desc'), limit(50)),
      (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })) as WorkoutLog[]),
      (err) => { console.error(err); callback([]); }
    );
  },

  getActiveWorkoutRealtime(userId: string, callback: (log: WorkoutLog | null) => void) {
    return onSnapshot(query(collection(db, 'workoutLogs'), where('userId', '==', userId), where('status', '==', 'in_progress'), limit(1)),
      (snap) => callback(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() } as WorkoutLog),
      (err) => { console.error(err); callback(null); }
    );
  },

  async getExercises(): Promise<Exercise[]> {
    try { const snap = await getDocs(query(collection(db, 'exercises'), orderBy('name'))); return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Exercise[]; } catch { return []; }
  },

  async addCustomExercise(userId: string, exercise: Omit<Exercise, 'id' | 'createdAt'>): Promise<string> {
    try { const ref = await addDoc(collection(db, 'exercises'), { ...exercise, userId: userId || '', isCustom: true, createdAt: serverTimestamp() }); return ref.id; } catch (error: any) { throw new Error(error.message); }
  },

  async updateStreak(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      if (!(await getDoc(userRef)).exists()) return;
      const snap = await getDocs(query(collection(db, 'workoutLogs'), where('userId', '==', userId), where('status', '==', 'completed'), orderBy('completedAt', 'desc'), limit(30)));
      let streak = 0; const today = new Date();
      for (const d of snap.docs) {
        const dt = d.data().completedAt?.toDate(); if (!dt) continue;
        if (Math.floor((today.getTime() - dt.getTime()) / 86400000) === streak) streak++; else break;
      }
      await updateDoc(userRef, { streak: streak || 0 });
    } catch (e) { console.error(e); }
  },

  async checkWorkoutAchievements(userId: string): Promise<void> {
    try {
      const snap = await getDocs(query(collection(db, 'workoutLogs'), where('userId', '==', userId), where('status', '==', 'completed')));
      const ref = doc(db, 'users', userId, 'achievements', 'total_workouts');
      if ((await getDoc(ref)).exists()) await updateDoc(ref, { progress: snap.size || 0, unlockedAt: snap.size >= 100 ? Timestamp.now() : null });
    } catch (e) { console.error(e); }
  },

  async logActivity(userId: string, action: string, details: any): Promise<void> {
    try { await addDoc(collection(db, 'activityLogs'), { userId: userId || '', action: action || '', details: details || {}, timestamp: serverTimestamp() }); } catch (e) { console.error(e); }
  },

  async getWorkoutStats(userId: string, days: number = 30): Promise<any[]> {
    try {
      const start = new Date(); start.setDate(start.getDate() - (days || 30));
      const snap = await getDocs(query(collection(db, 'workoutLogs'), where('userId', '==', userId), where('status', '==', 'completed'), where('completedAt', '>=', Timestamp.fromDate(start)), orderBy('completedAt', 'asc')));
      return snap.docs.map(d => d.data());
    } catch { return []; }
  },
};