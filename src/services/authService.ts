import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';
import { storageService } from './storageService';

export const authService = {
  async register(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;
      
      await updateProfile(firebaseUser, { displayName });
      
      const userData: Omit<User, 'id'> = {
        email: firebaseUser.email!,
        displayName,
        fitnessLevel: 'beginner',
        fitnessGoals: [],
        isTrainer: false,
        darkMode: false,
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        lastLoginAt: serverTimestamp() as any,
        isActive: true,
        totalWorkouts: 0,
        totalMinutes: 0,
        streak: 0,
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      await this.createInitialAchievements(firebaseUser.uid);
      
      return { id: firebaseUser.uid, ...userData } as User;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        const userData: Omit<User, 'id'> = {
          email: userCredential.user.email!,
          displayName: userCredential.user.displayName || 'User',
          fitnessLevel: 'beginner',
          fitnessGoals: [],
          isTrainer: false,
          darkMode: false,
          createdAt: serverTimestamp() as any,
          updatedAt: serverTimestamp() as any,
          lastLoginAt: serverTimestamp() as any,
          isActive: true,
          totalWorkouts: 0,
          totalMinutes: 0,
          streak: 0,
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
        await this.createInitialAchievements(userCredential.user.uid);
        return { id: userCredential.user.uid, ...userData } as User;
      }
      
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLoginAt: serverTimestamp()
      });
      
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      if (data.displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: data.displayName });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async uploadProfilePicture(userId: string, uri: string): Promise<string> {
    try {
      const photoURL = await storageService.uploadProfilePicture(userId, uri);
      await updateDoc(doc(db, 'users', userId), {
        photoURL,
        updatedAt: serverTimestamp(),
      });
      return photoURL;
    } catch (error: any) {
      console.error('Upload failed, using local URI:', error);
      await updateDoc(doc(db, 'users', userId), {
        photoURL: uri,
        updatedAt: serverTimestamp(),
      });
      return uri;
    }
  },

  async createInitialAchievements(userId: string): Promise<void> {
    const achievements = [
      { userId, type: 'workout_streak', title: 'Workout Streak', description: 'Complete workouts for 7 consecutive days', icon: 'flame', progress: 0, maxProgress: 7, createdAt: serverTimestamp() },
      { userId, type: 'total_workouts', title: 'Workout Warrior', description: 'Complete 100 workouts', icon: 'fitness', progress: 0, maxProgress: 100, createdAt: serverTimestamp() },
      { userId, type: 'personal_record', title: 'Record Breaker', description: 'Set 10 personal records', icon: 'trophy', progress: 0, maxProgress: 10, createdAt: serverTimestamp() },
      { userId, type: 'nutrition_streak', title: 'Nutrition Master', description: 'Log meals for 30 consecutive days', icon: 'restaurant', progress: 0, maxProgress: 30, createdAt: serverTimestamp() },
    ];
    for (const achievement of achievements) {
      await setDoc(doc(db, 'users', userId, 'achievements', achievement.type), achievement);
    }
  },

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return auth.onAuthStateChanged(callback);
  }
};