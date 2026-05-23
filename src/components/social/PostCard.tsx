import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SocialPost } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { formatters } from '../../utils/formatters';

interface PostCardProps {
  post: SocialPost;
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  isLiked?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onLike,
  onComment,
  isLiked = false,
}) => {
  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <Avatar uri={post.userPhotoURL} name={post.userName} size={40} />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.timestamp}>
            {formatters.relativeTime(post.createdAt.toDate())}
          </Text>
        </View>
      </View>

      {post.content && (
        <Text style={styles.content}>{post.content}</Text>
      )}

      {post.mediaURLs && post.mediaURLs.length > 0 && (
        <Image
          source={{ uri: post.mediaURLs[0] }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={onLike} style={styles.actionButton}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? '#FF3B30' : '#8E8E93'}
          />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {post.likes.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onComment} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#8E8E93" />
          <Text style={styles.actionText}>{post.comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  content: {
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  likedText: {
    color: '#FF3B30',
  },
});