import React, { useEffect, useRef } from 'react';
import {
  View, Text, Modal as RNModal, StyleSheet, TouchableOpacity,
  Animated, Dimensions, PanResponder,
} from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Modal: React.FC<ModalProps> = ({ visible, onClose, title, children }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
    }
  }, [visible]);

  const close = () => {
    Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 200, useNativeDriver: true }).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 5 && Math.abs(gs.dy) > Math.abs(gs.dx),
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 100) {
          close();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
        }
      },
    })
  ).current;

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={close} />
        <Animated.View style={[styles.content, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
          <View style={styles.handle} />
          {title && <Text style={styles.title}>{title}</Text>}
          <View style={styles.body}>{children}</View>
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  content: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: SCREEN_HEIGHT * 0.85 },
  handle: { width: 40, height: 5, backgroundColor: '#D1D1D6', borderRadius: 3, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', textAlign: 'center', marginBottom: 16, paddingHorizontal: 24 },
  body: { flex: 1, paddingHorizontal: 20, paddingBottom: 30 },
});