import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'fitness',
    title: 'Track Your Workouts',
    description: 'Log your exercises, sets, reps, and weights. Monitor your progress over time with detailed insights.',
    color: '#007AFF',
  },
  {
    id: '2',
    icon: 'restaurant',
    title: 'Monitor Nutrition',
    description: 'Track your meals, calories, and macros. Stay on top of your nutrition goals with easy logging.',
    color: '#FF9500',
  },
  {
    id: '3',
    icon: 'trophy',
    title: 'Join Challenges',
    description: 'Compete with friends, earn achievements, and stay motivated on your fitness journey.',
    color: '#34C759',
  },
  {
    id: '4',
    icon: 'people',
    title: 'Connect with Trainers',
    description: 'Get personalized workout plans and nutrition guidance from certified trainers.',
    color: '#5856D6',
  },
];

export const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        data={slides}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={80} color={item.color} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentIndex ? '#007AFF' : '#E5E5EA' },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={currentIndex === slides.length - 1 ? () => navigation.navigate('Login') : scrollTo}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons
            name={currentIndex === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 1,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  slide: {
    width,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});