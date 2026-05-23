import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  onPress?: () => void;
  showBadge?: boolean;
  badgeColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 48,
  onPress,
  showBadge = false,
  badgeColor = '#34C759',
}) => {
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (name?: string) => {
    if (!name) return '#007AFF';
    const colors = ['#007AFF', '#5856D6', '#FF9500', '#34C759', '#FF3B30', '#AF52DE'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container onPress={onPress} style={styles.container}>
      <View style={[styles.avatarContainer, { width: size, height: size, borderRadius: size / 2 }]}>
        {uri ? (
          <Image
            source={{ uri }}
            style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          />
        ) : (
          <View
            style={[
              styles.initialsContainer,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: getRandomColor(name),
              },
            ]}
          >
            <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
              {getInitials(name)}
            </Text>
          </View>
        )}
      </View>
      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: badgeColor,
              width: size * 0.3,
              height: size * 0.3,
              borderRadius: size * 0.15,
              right: -size * 0.05,
              bottom: -size * 0.05,
            },
          ]}
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarContainer: {
    overflow: 'hidden',
    backgroundColor: '#E5E5EA',
  },
  image: {
    resizeMode: 'cover',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});