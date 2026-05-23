// File: src/screens/social/FeedScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const FeedScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const q = query(collection(db, 'socialPosts'), orderBy('createdAt', 'desc'), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => { console.log('Feed loading, index may be building...'); });
    return () => unsub();
  }, []);

  const handlePost = async () => {
    if (!content.trim()) { Alert.alert('Error', 'Write something first'); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, 'socialPosts'), {
        userId: user?.id,
        userName: user?.displayName,
        userPhotoURL: user?.photoURL || '',
        content,
        likes: [],
        comments: [],
        visibility: 'public',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setContent('');
      setShowCreate(false);
    } catch (e: any) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return 'Just now';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Community Feed</Text>
        <TouchableOpacity onPress={() => setShowCreate(true)}>
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.post}>
            <View style={styles.postHeader}>
              {item.userPhotoURL ? (
                <Image source={{ uri: item.userPhotoURL }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>{item.userName?.charAt(0)?.toUpperCase() || '?'}</Text>
                </View>
              )}
              <View style={styles.postHeaderInfo}>
                <Text style={styles.userName}>{item.userName}</Text>
                <Text style={styles.time}>{formatDate(item.createdAt)}</Text>
              </View>
            </View>
            <Text style={styles.content}>{item.content}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.action}>
                <Ionicons name="heart-outline" size={18} color="#8E8E93" />
                <Text style={styles.actionText}>{item.likes?.length || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.action}>
                <Ionicons name="chatbubble-outline" size={18} color="#8E8E93" />
                <Text style={styles.actionText}>{item.comments?.length || 0}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={60} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptyText}>Be the first to share something!</Text>
            <Button title="Create Post" onPress={() => setShowCreate(true)} variant="primary" size="medium" style={{ marginTop: 16 }} />
          </View>
        }
      />

      <Modal visible={showCreate} onClose={() => setShowCreate(false)} title="Create Post">
        <View style={{ gap: 16 }}>
          <View style={styles.createHeader}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.smallAvatar} />
            ) : (
              <View style={[styles.smallAvatar, styles.avatarPlaceholder]}>
                <Text style={styles.smallAvatarText}>{user?.displayName?.charAt(0)?.toUpperCase() || '?'}</Text>
              </View>
            )}
            <Text style={styles.createName}>{user?.displayName}</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Share your fitness journey..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={5}
            placeholderTextColor="#C7C7CC"
            textAlignVertical="top"
          />
          <Button title="Post" onPress={handlePost} loading={loading} size="large" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFF' },
  title: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
  list: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  post: { marginBottom: 12 },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  postHeaderInfo: { flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarPlaceholder: { backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  userName: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  time: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  content: { fontSize: 15, color: '#1C1C1E', lineHeight: 22 },
  actions: { flexDirection: 'row', gap: 20, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13, color: '#8E8E93' },
  input: { backgroundColor: '#F2F2F7', borderRadius: 12, padding: 16, fontSize: 16, color: '#1C1C1E', minHeight: 120 },
  createHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  smallAvatar: { width: 36, height: 36, borderRadius: 18 },
  smallAvatarText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  createName: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  empty: { alignItems: 'center', padding: 40, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1C1C1E', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },
});