import { 
  collection, doc, addDoc, updateDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp, onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { NutritionLog, Meal, Food } from '../types';

export const nutritionService = {
  async createOrUpdateNutritionLog(userId: string, date: string, meal: Omit<Meal, 'id'>): Promise<void> {
    try {
      const q = query(collection(db, 'nutritionLogs'), where('userId', '==', userId), where('date', '==', date));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        const newMeal: Meal = { ...meal, id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
        await addDoc(collection(db, 'nutritionLogs'), {
          userId, date, meals: [newMeal],
          totalCalories: meal.foods.reduce((s, f) => s + f.calories, 0),
          totalProtein: meal.foods.reduce((s, f) => s + f.protein, 0),
          totalCarbs: meal.foods.reduce((s, f) => s + f.carbs, 0),
          totalFats: meal.foods.reduce((s, f) => s + f.fats, 0),
          waterIntake: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        });
      } else {
        const logDoc = snapshot.docs[0];
        const existing = logDoc.data() as NutritionLog;
        const newMeal: Meal = { ...meal, id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
        const meals = [...existing.meals, newMeal];
        await updateDoc(doc(db, 'nutritionLogs', logDoc.id), {
          meals, updatedAt: serverTimestamp(),
          totalCalories: meals.reduce((s, m) => s + m.totalCalories, 0),
          totalProtein: meals.reduce((s, m) => s + m.totalProtein, 0),
          totalCarbs: meals.reduce((s, m) => s + m.totalCarbs, 0),
          totalFats: meals.reduce((s, m) => s + m.totalFats, 0),
        });
      }
    } catch (e: any) { throw new Error(e.message); }
  },

  async updateWaterIntake(userId: string, date: string, amount: number): Promise<void> {
    const q = query(collection(db, 'nutritionLogs'), where('userId', '==', userId), where('date', '==', date));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const d = snapshot.docs[0].data();
      await updateDoc(doc(db, 'nutritionLogs', snapshot.docs[0].id), { waterIntake: (d.waterIntake || 0) + amount, updatedAt: serverTimestamp() });
    } else {
      await addDoc(collection(db, 'nutritionLogs'), { userId, date, meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0, waterIntake: amount, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
  },

  getNutritionLogRealtime(userId: string, date: string, callback: (log: NutritionLog | null) => void) {
    return onSnapshot(query(collection(db, 'nutritionLogs'), where('userId', '==', userId), where('date', '==', date)), (snap) => {
      callback(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() } as NutritionLog);
    }, (err) => { console.error(err); callback(null); });
  },

  getNutritionLogsRealtime(userId: string, start: string, end: string, callback: (logs: NutritionLog[]) => void) {
    return onSnapshot(query(collection(db, 'nutritionLogs'), where('userId', '==', userId), where('date', '>=', start), where('date', '<=', end), orderBy('date', 'asc')), (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })) as NutritionLog[]);
    }, (err) => { console.error(err); callback([]); });
  },

  async deleteMeal(userId: string, date: string, mealId: string): Promise<void> {
    const q = query(collection(db, 'nutritionLogs'), where('userId', '==', userId), where('date', '==', date));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0].data() as NutritionLog;
      const meals = d.meals.filter(m => m.id !== mealId);
      await updateDoc(doc(db, 'nutritionLogs', snap.docs[0].id), {
        meals, updatedAt: serverTimestamp(),
        totalCalories: meals.reduce((s, m) => s + m.totalCalories, 0),
        totalProtein: meals.reduce((s, m) => s + m.totalProtein, 0),
        totalCarbs: meals.reduce((s, m) => s + m.totalCarbs, 0),
        totalFats: meals.reduce((s, m) => s + m.totalFats, 0),
      });
    }
  },

  async searchFoods(query: string): Promise<Food[]> {
    const foods: Food[] = [
      // Proteins - Cooked
      { id: '1', name: 'Chicken Breast (grilled)', servingSize: 100, calories: 165, protein: 31, carbs: 0, fats: 3.6 },
      { id: '2', name: 'Chicken Thigh (roasted)', servingSize: 100, calories: 209, protein: 26, carbs: 0, fats: 11 },
      { id: '3', name: 'Chicken Wings (fried)', servingSize: 100, calories: 290, protein: 18, carbs: 8, fats: 20 },
      { id: '4', name: 'Salmon (pan-fried)', servingSize: 100, calories: 208, protein: 20, carbs: 0, fats: 13 },
      { id: '5', name: 'Tuna (canned in water)', servingSize: 100, calories: 116, protein: 26, carbs: 0, fats: 1 },
      { id: '6', name: 'Tuna (canned in oil)', servingSize: 100, calories: 198, protein: 29, carbs: 0, fats: 8 },
      { id: '7', name: 'Eggs (scrambled, 2 large)', servingSize: 100, calories: 155, protein: 13, carbs: 1.1, fats: 11 },
      { id: '8', name: 'Eggs (fried)', servingSize: 100, calories: 196, protein: 13, carbs: 0.8, fats: 15 },
      { id: '9', name: 'Eggs (boiled)', servingSize: 100, calories: 155, protein: 13, carbs: 1.1, fats: 11 },
      { id: '10', name: 'Beef Steak (grilled)', servingSize: 100, calories: 271, protein: 25, carbs: 0, fats: 19 },
      { id: '11', name: 'Ground Beef (pan-cooked)', servingSize: 100, calories: 250, protein: 26, carbs: 0, fats: 17 },
      { id: '12', name: 'Pork Chop (grilled)', servingSize: 100, calories: 231, protein: 25, carbs: 0, fats: 14 },
      { id: '13', name: 'Pork Belly (fried)', servingSize: 100, calories: 518, protein: 9, carbs: 0, fats: 53 },
      { id: '14', name: 'Shrimp (boiled)', servingSize: 100, calories: 99, protein: 24, carbs: 0.2, fats: 0.3 },
      { id: '15', name: 'Bangus (milkfish, fried)', servingSize: 100, calories: 190, protein: 21, carbs: 0, fats: 11 },
      { id: '16', name: 'Tilapia (fried)', servingSize: 100, calories: 175, protein: 26, carbs: 0, fats: 7 },
      { id: '17', name: 'Sardines (canned)', servingSize: 100, calories: 208, protein: 25, carbs: 0, fats: 11 },
      { id: '18', name: 'Tofu (fried)', servingSize: 100, calories: 190, protein: 17, carbs: 4, fats: 12 },
      // Rice & Grains
      { id: '19', name: 'White Rice (steamed)', servingSize: 100, calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
      { id: '20', name: 'Brown Rice (steamed)', servingSize: 100, calories: 123, protein: 2.7, carbs: 25.6, fats: 1 },
      { id: '21', name: 'Fried Rice', servingSize: 100, calories: 163, protein: 4.5, carbs: 22, fats: 6 },
      { id: '22', name: 'Garlic Rice', servingSize: 100, calories: 150, protein: 3, carbs: 26, fats: 4 },
      { id: '23', name: 'Java Rice', servingSize: 100, calories: 170, protein: 4, carbs: 28, fats: 5 },
      { id: '24', name: 'Oatmeal (cooked)', servingSize: 100, calories: 71, protein: 2.5, carbs: 12, fats: 1.5 },
      { id: '25', name: 'Quinoa (cooked)', servingSize: 100, calories: 120, protein: 4.4, carbs: 21, fats: 1.9 },
      { id: '26', name: 'Corn Rice', servingSize: 100, calories: 110, protein: 2, carbs: 24, fats: 0.5 },
      // Filipino Dishes
      { id: '27', name: 'Chicken Adobo', servingSize: 100, calories: 190, protein: 22, carbs: 3, fats: 10 },
      { id: '28', name: 'Pork Adobo', servingSize: 100, calories: 230, protein: 20, carbs: 2, fats: 16 },
      { id: '29', name: 'Pork Sinigang', servingSize: 100, calories: 175, protein: 18, carbs: 8, fats: 8 },
      { id: '30', name: 'Beef Tapa', servingSize: 100, calories: 220, protein: 24, carbs: 5, fats: 12 },
      { id: '31', name: 'Lumpiang Shanghai', servingSize: 100, calories: 250, protein: 12, carbs: 20, fats: 14 },
      { id: '32', name: 'Pancit Canton', servingSize: 100, calories: 180, protein: 8, carbs: 25, fats: 6 },
      { id: '33', name: 'Pancit Bihon', servingSize: 100, calories: 160, protein: 6, carbs: 24, fats: 5 },
      { id: '34', name: 'Lechon Kawali', servingSize: 100, calories: 350, protein: 20, carbs: 0, fats: 30 },
      { id: '35', name: 'Tinola', servingSize: 100, calories: 85, protein: 12, carbs: 3, fats: 3 },
      { id: '36', name: 'Nilaga (beef soup)', servingSize: 100, calories: 120, protein: 15, carbs: 5, fats: 4 },
      { id: '37', name: 'Kare-Kare', servingSize: 100, calories: 280, protein: 18, carbs: 8, fats: 20 },
      { id: '38', name: 'Bicol Express', servingSize: 100, calories: 300, protein: 16, carbs: 5, fats: 25 },
      { id: '39', name: 'Dinuguan', servingSize: 100, calories: 200, protein: 18, carbs: 4, fats: 13 },
      { id: '40', name: 'Menudo', servingSize: 100, calories: 170, protein: 16, carbs: 8, fats: 8 },
      { id: '41', name: 'Afritada', servingSize: 100, calories: 185, protein: 18, carbs: 6, fats: 10 },
      { id: '42', name: 'Mechado', servingSize: 100, calories: 200, protein: 20, carbs: 5, fats: 12 },
      { id: '43', name: 'Caldereta', servingSize: 100, calories: 210, protein: 18, carbs: 7, fats: 13 },
      { id: '44', name: 'Sisig', servingSize: 100, calories: 350, protein: 22, carbs: 2, fats: 28 },
      { id: '45', name: 'Pinakbet', servingSize: 100, calories: 60, protein: 3, carbs: 8, fats: 2 },
      { id: '46', name: 'Chopsuey', servingSize: 100, calories: 80, protein: 6, carbs: 7, fats: 3 },
      { id: '47', name: 'Laing', servingSize: 100, calories: 200, protein: 5, carbs: 6, fats: 18 },
      // Pasta & Noodles
      { id: '48', name: 'Spaghetti (boiled)', servingSize: 100, calories: 131, protein: 5, carbs: 25, fats: 1.1 },
      { id: '49', name: 'Spaghetti Bolognese', servingSize: 100, calories: 150, protein: 7, carbs: 20, fats: 5 },
      { id: '50', name: 'Carbonara', servingSize: 100, calories: 250, protein: 10, carbs: 22, fats: 14 },
      { id: '51', name: 'Instant Noodles (cooked)', servingSize: 100, calories: 190, protein: 4, carbs: 26, fats: 8 },
      { id: '52', name: 'Macaroni Soup (Sopas)', servingSize: 100, calories: 95, protein: 6, carbs: 12, fats: 3 },
      { id: '53', name: 'Palabok', servingSize: 100, calories: 180, protein: 8, carbs: 22, fats: 7 },
      { id: '54', name: 'Spaghetti (Filipino style)', servingSize: 100, calories: 160, protein: 6, carbs: 24, fats: 5 },
      // Vegetables - Cooked
      { id: '55', name: 'Broccoli (steamed)', servingSize: 100, calories: 34, protein: 2.8, carbs: 6.6, fats: 0.4 },
      { id: '56', name: 'Ginisang Ampalaya', servingSize: 100, calories: 45, protein: 2, carbs: 5, fats: 2 },
      { id: '57', name: 'Boiled Okra', servingSize: 100, calories: 22, protein: 1.9, carbs: 3.6, fats: 0.2 },
      { id: '58', name: 'Steamed Kangkong', servingSize: 100, calories: 19, protein: 2.6, carbs: 3.1, fats: 0.2 },
      { id: '59', name: 'Ginisang Sayote', servingSize: 100, calories: 30, protein: 1.5, carbs: 5, fats: 0.5 },
      { id: '60', name: 'Ensaladang Talong', servingSize: 100, calories: 40, protein: 1, carbs: 6, fats: 1 },
      { id: '61', name: 'Coleslaw', servingSize: 100, calories: 70, protein: 1, carbs: 7, fats: 4 },
      { id: '62', name: 'Steamed Cabbage', servingSize: 100, calories: 23, protein: 1.3, carbs: 5.2, fats: 0.1 },
      // Breakfast
      { id: '63', name: 'Pandesal (1 piece)', servingSize: 25, calories: 75, protein: 2, carbs: 14, fats: 1.5 },
      { id: '64', name: 'Tapsilog', servingSize: 100, calories: 280, protein: 18, carbs: 30, fats: 10 },
      { id: '65', name: 'Longsilog', servingSize: 100, calories: 300, protein: 16, carbs: 28, fats: 14 },
      { id: '66', name: 'Tocino', servingSize: 100, calories: 250, protein: 14, carbs: 15, fats: 15 },
      { id: '67', name: 'Hotdog (fried)', servingSize: 100, calories: 290, protein: 10, carbs: 4, fats: 26 },
      { id: '68', name: 'Corned Beef (canned)', servingSize: 100, calories: 250, protein: 15, carbs: 1, fats: 21 },
      { id: '69', name: 'Spam (fried)', servingSize: 100, calories: 310, protein: 12, carbs: 2, fats: 29 },
      { id: '70', name: 'Daing na Bangus', servingSize: 100, calories: 210, protein: 22, carbs: 1, fats: 13 },
      // Soups
      { id: '71', name: 'Bulalo', servingSize: 100, calories: 130, protein: 14, carbs: 2, fats: 8 },
      { id: '72', name: 'Miso Soup', servingSize: 100, calories: 35, protein: 2, carbs: 3, fats: 1 },
      { id: '73', name: 'Arroz Caldo', servingSize: 100, calories: 100, protein: 7, carbs: 14, fats: 2 },
      { id: '74', name: 'Goto', servingSize: 100, calories: 110, protein: 8, carbs: 15, fats: 2 },
      // Fast Food
      { id: '75', name: 'Fried Chicken (1 pc)', servingSize: 100, calories: 260, protein: 20, carbs: 8, fats: 17 },
      { id: '76', name: 'Burger Patty', servingSize: 100, calories: 295, protein: 17, carbs: 24, fats: 15 },
      { id: '77', name: 'French Fries', servingSize: 100, calories: 312, protein: 3.4, carbs: 41, fats: 15 },
      { id: '78', name: 'Pizza (cheese)', servingSize: 100, calories: 266, protein: 11, carbs: 33, fats: 10 },
      // Snacks
      { id: '79', name: 'Banana Cue', servingSize: 100, calories: 180, protein: 1, carbs: 35, fats: 5 },
      { id: '80', name: 'Turon', servingSize: 100, calories: 220, protein: 2, carbs: 30, fats: 10 },
      { id: '81', name: 'Halo-Halo', servingSize: 100, calories: 150, protein: 3, carbs: 25, fats: 4 },
      { id: '82', name: 'Puto', servingSize: 100, calories: 140, protein: 3, carbs: 28, fats: 2 },
      { id: '83', name: 'Kutsinta', servingSize: 100, calories: 120, protein: 2, carbs: 27, fats: 1 },
      { id: '84', name: 'Bibingka', servingSize: 100, calories: 200, protein: 5, carbs: 30, fats: 7 },
      { id: '85', name: 'Ensaymada', servingSize: 100, calories: 280, protein: 6, carbs: 35, fats: 13 },
      { id: '86', name: 'Chicharon', servingSize: 100, calories: 540, protein: 60, carbs: 0, fats: 32 },
      // Fruits
      { id: '87', name: 'Banana (lakatan)', servingSize: 100, calories: 89, protein: 1.1, carbs: 22.8, fats: 0.3 },
      { id: '88', name: 'Mango (ripe)', servingSize: 100, calories: 60, protein: 0.8, carbs: 15, fats: 0.4 },
      { id: '89', name: 'Avocado', servingSize: 100, calories: 160, protein: 2, carbs: 8.5, fats: 14.7 },
      { id: '90', name: 'Apple', servingSize: 100, calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
      { id: '91', name: 'Papaya', servingSize: 100, calories: 43, protein: 0.5, carbs: 11, fats: 0.3 },
      { id: '92', name: 'Pineapple', servingSize: 100, calories: 50, protein: 0.5, carbs: 13, fats: 0.1 },
      // Others
      { id: '93', name: 'Sweet Potato (boiled)', servingSize: 100, calories: 86, protein: 1.6, carbs: 20.1, fats: 0.1 },
      { id: '94', name: 'Greek Yogurt', servingSize: 100, calories: 59, protein: 10, carbs: 3.6, fats: 0.7 },
      { id: '95', name: 'Peanut Butter', servingSize: 100, calories: 588, protein: 25, carbs: 20, fats: 50 },
      { id: '96', name: 'Cheese (Cheddar)', servingSize: 100, calories: 403, protein: 25, carbs: 1.3, fats: 33 },
      { id: '97', name: 'Whole Milk', servingSize: 100, calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3 },
      { id: '98', name: 'Orange Juice', servingSize: 100, calories: 45, protein: 0.7, carbs: 10.4, fats: 0.2 },
      { id: '99', name: 'Coconut Water', servingSize: 100, calories: 19, protein: 0.7, carbs: 3.7, fats: 0.2 },
      { id: '100', name: 'Buko Juice', servingSize: 100, calories: 25, protein: 0.5, carbs: 5, fats: 0.5 },
    ];

    return foods.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
  },
};