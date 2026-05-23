import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Food } from '../../types';
import { nutritionService } from '../../services/nutritionService';

interface FoodSearchProps {
  onSelectFood: (food: Food) => void;
}

export const FoodSearch: React.FC<FoodSearchProps> = ({ onSelectFood }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Show popular foods when first opened
  useEffect(() => {
    loadPopularFoods();
  }, []);

  const loadPopularFoods = async () => {
    setLoading(true);
    try {
      const foods = await nutritionService.searchFoods('');
      setResults(foods.slice(0, 10));
      setShowAll(true);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 1) {
      loadPopularFoods();
      return;
    }
    setLoading(true);
    try {
      const foods = await nutritionService.searchFoods(text);
      setResults(foods);
      setShowAll(false);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#8E8E93" />
        <TextInput style={styles.input} placeholder="Search foods..." value={query} onChangeText={handleSearch} placeholderTextColor="#C7C7CC" autoFocus />
        {loading && <ActivityIndicator size="small" color="#007AFF" />}
      </View>
      
      {showAll && !query && <Text style={styles.sectionTitle}>Popular Foods</Text>}
      
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {results.map(item => (
          <TouchableOpacity key={item.id} style={styles.item} onPress={() => onSelectFood(item)}>
            <View style={styles.itemLeft}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.serving}>{item.servingSize}g serving</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.calories}>{item.calories} cal</Text>
              <Text style={styles.macros}>P:{item.protein}g C:{item.carbs}g F:{item.fats}g</Text>
            </View>
          </TouchableOpacity>
        ))}
        {!loading && results.length === 0 && (
          <View style={styles.empty}><Text style={styles.emptyText}>No foods found</Text></View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 8, paddingHorizontal: 10, marginBottom: 8 },
  input: { flex: 1, fontSize: 14, paddingVertical: 8, marginLeft: 6, color: '#1C1C1E' },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#8E8E93', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  list: { flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  itemLeft: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', color: '#1C1C1E' },
  serving: { fontSize: 11, color: '#8E8E93', marginTop: 2 },
  itemRight: { alignItems: 'flex-end' },
  calories: { fontSize: 13, fontWeight: '600', color: '#FF9500' },
  macros: { fontSize: 10, color: '#8E8E93', marginTop: 2 },
  empty: { padding: 30, alignItems: 'center' },
  emptyText: { color: '#8E8E93', fontSize: 14 },
});