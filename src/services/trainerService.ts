import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { TrainerClient, TrainingProgram } from '../types';

export const trainerService = {
  // Send client request
  async sendClientRequest(trainerId: string, clientId: string, clientName: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'trainerClients'), {
        trainerId,
        clientId,
        clientName,
        status: 'pending',
        startDate: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Accept/reject client request
  async updateClientStatus(clientId: string, status: 'active' | 'inactive'): Promise<void> {
    try {
      await updateDoc(doc(db, 'trainerClients', clientId), {
        status,
        startDate: status === 'active' ? serverTimestamp() : undefined,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Get trainer's clients (real-time)
  getTrainerClientsRealtime(trainerId: string, callback: (clients: TrainerClient[]) => void) {
    const q = query(
      collection(db, 'trainerClients'),
      where('trainerId', '==', trainerId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const clients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TrainerClient[];
      callback(clients);
    }, (error) => {
      console.error('Error fetching clients:', error);
      callback([]);
    });
  },

  // Create training program
  async createProgram(programData: Omit<TrainingProgram, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'trainingPrograms'), {
        ...programData,
        createdAt: serverTimestamp(),
      });
      
      // Update client's programId
      const q = query(
        collection(db, 'trainerClients'),
        where('trainerId', '==', programData.trainerId),
        where('clientId', '==', programData.clientId)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        await updateDoc(doc(db, 'trainerClients', snapshot.docs[0].id), {
          programId: docRef.id,
        });
      }
      
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Get client's program (real-time)
  getClientProgramRealtime(clientId: string, callback: (program: TrainingProgram | null) => void) {
    const q = query(
      collection(db, 'trainingPrograms'),
      where('clientId', '==', clientId),
      where('status', '==', 'active'),
      limit(1)
    );

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(null);
      } else {
        const doc = snapshot.docs[0];
        callback({ id: doc.id, ...doc.data() } as TrainingProgram);
      }
    }, (error) => {
      console.error('Error fetching program:', error);
      callback(null);
    });
  },

  // Update program status
  async updateProgramStatus(programId: string, status: 'active' | 'completed' | 'paused'): Promise<void> {
    try {
      await updateDoc(doc(db, 'trainingPrograms', programId), { status });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};