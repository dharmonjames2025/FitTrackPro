import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';
import { SocialPost, Comment, Challenge, ChallengeParticipant } from '../types';

export const socialService = {
  // Create a social post
  async createPost(postData: Omit<SocialPost, 'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'socialPosts'), {
        ...postData,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Like/unlike a post
  async toggleLike(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(db, 'socialPosts', postId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) throw new Error('Post not found');
      
      const postData = postDoc.data();
      const likes = postData.likes || [];
      
      if (likes.includes(userId)) {
        await updateDoc(postRef, {
          likes: arrayRemove(userId)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(userId)
        });
        
        // Send notification to post owner
        if (postData.userId !== userId) {
          await this.createNotification(postData.userId, {
            type: 'social_like',
            title: 'New Like',
            message: 'Someone liked your post!',
            data: { postId }
          });
        }
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Add comment to post
  async addComment(postId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<void> {
    try {
      const newComment: Comment = {
        ...comment,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: serverTimestamp() as any,
      };
      
      const postRef = doc(db, 'socialPosts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
        updatedAt: serverTimestamp(),
      });
      
      // Notify post owner
      const postDoc = await getDoc(postRef);
      if (postDoc.exists() && postDoc.data().userId !== comment.userId) {
        await this.createNotification(postDoc.data().userId, {
          type: 'social_comment',
          title: 'New Comment',
          message: `${comment.userName} commented on your post`,
          data: { postId }
        });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Get social feed (real-time)
  getFeedRealtime(userId: string, callback: (posts: SocialPost[]) => void) {
    const q = query(
      collection(db, 'socialPosts'),
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SocialPost[];
      callback(posts);
    }, (error) => {
      console.error('Error fetching feed:', error);
      callback([]);
    });
  },

  // Create a challenge
  async createChallenge(challengeData: Omit<Challenge, 'id' | 'participants' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'challenges'), {
        ...challengeData,
        participants: 0,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Join a challenge
  async joinChallenge(challengeId: string, userId: string): Promise<void> {
    try {
      // Add participant
      await addDoc(collection(db, 'challengeParticipants'), {
        challengeId,
        userId,
        progress: 0,
        joinedAt: Timestamp.now(),
      });

      // Update challenge participant count
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, {
        participants: (await getDoc(challengeRef)).data()?.participants + 1 || 1,
      });

      // Notify challenge creator
      const challengeDoc = await getDoc(challengeRef);
      if (challengeDoc.exists()) {
        await this.createNotification(challengeDoc.data().createdBy, {
          type: 'challenge_invite',
          title: 'New Participant',
          message: 'Someone joined your challenge!',
          data: { challengeId }
        });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Update challenge progress
  async updateChallengeProgress(challengeId: string, userId: string, progress: number): Promise<void> {
    try {
      const q = query(
        collection(db, 'challengeParticipants'),
        where('challengeId', '==', challengeId),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const participantDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'challengeParticipants', participantDoc.id), {
          progress,
          completedAt: progress >= 100 ? Timestamp.now() : null,
        });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Get active challenges (real-time)
  getActiveChallengesRealtime(callback: (challenges: Challenge[]) => void) {
    const q = query(
      collection(db, 'challenges'),
      where('status', '==', 'active'),
      orderBy('startDate', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const challenges = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Challenge[];
      callback(challenges);
    }, (error) => {
      console.error('Error fetching challenges:', error);
      callback([]);
    });
  },

  // Get challenge leaderboard
  getChallengeLeaderboardRealtime(challengeId: string, callback: (participants: ChallengeParticipant[]) => void) {
    const q = query(
      collection(db, 'challengeParticipants'),
      where('challengeId', '==', challengeId),
      orderBy('progress', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const participants = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChallengeParticipant[];
      callback(participants);
    }, (error) => {
      console.error('Error fetching leaderboard:', error);
      callback([]);
    });
  },

  // Create notification
  async createNotification(userId: string, notification: { type: string; title: string; message: string; data?: any }): Promise<void> {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        ...notification,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Error creating notification:', error);
    }
  },

  // Get user notifications (real-time)
  getNotificationsRealtime(userId: string, callback: (notifications: any[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(notifications);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      callback([]);
    });
  },

  // Mark notification as read
  async markNotificationRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};