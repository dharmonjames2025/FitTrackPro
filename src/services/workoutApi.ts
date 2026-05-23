import { Exercise } from '../types';

// Wger API is free but sometimes slow, so we have a full local fallback
const WGER_API = 'https://wger.de/api/v2';

export const workoutApi = {
  async getExercises(): Promise<Exercise[]> {
    // Try API first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      
      const response = await fetch(
        `${WGER_API}/exercise/?language=2&limit=50`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((ex: any) => ({
            id: ex.id?.toString() || String(Math.random()),
            name: ex.name || 'Unknown Exercise',
            category: 'compound' as const,
            muscleGroup: 'full_body' as const,
            equipment: ex.equipment || [],
            description: ex.description || '',
            instructions: [],
            isCustom: false,
            createdAt: null as any,
          }));
        }
      }
    } catch (error) {
      console.log('API unavailable, using local exercises');
    }

    // Local fallback
    return getLocalExercises();
  },

  async searchExercises(query: string): Promise<Exercise[]> {
    const exercises = await this.getExercises();
    return exercises.filter(ex => 
      ex.name.toLowerCase().includes(query.toLowerCase())
    );
  },
};

function getLocalExercises(): Exercise[] {
  return [
    // Chest
    { id: '1', name: 'Bench Press', category: 'compound', muscleGroup: 'chest', equipment: ['barbell', 'bench'], description: 'Lie on flat bench, lower bar to chest, press up', instructions: [], isCustom: false, createdAt: null as any },
    { id: '2', name: 'Push-ups', category: 'bodyweight', muscleGroup: 'chest', equipment: [], description: 'Classic bodyweight push-up', instructions: [], isCustom: false, createdAt: null as any },
    { id: '3', name: 'Dumbbell Flyes', category: 'isolation', muscleGroup: 'chest', equipment: ['dumbbells', 'bench'], description: 'Open arms wide, bring dumbbells together above chest', instructions: [], isCustom: false, createdAt: null as any },
    { id: '4', name: 'Incline Bench Press', category: 'compound', muscleGroup: 'chest', equipment: ['barbell', 'incline bench'], description: 'Bench press on an incline bench', instructions: [], isCustom: false, createdAt: null as any },
    
    // Back
    { id: '5', name: 'Pull-ups', category: 'bodyweight', muscleGroup: 'back', equipment: ['pull-up bar'], description: 'Hang from bar, pull yourself up until chin over bar', instructions: [], isCustom: false, createdAt: null as any },
    { id: '6', name: 'Deadlift', category: 'compound', muscleGroup: 'back', equipment: ['barbell'], description: 'Lift barbell from ground to standing position', instructions: [], isCustom: false, createdAt: null as any },
    { id: '7', name: 'Barbell Row', category: 'compound', muscleGroup: 'back', equipment: ['barbell'], description: 'Bend over, pull barbell to chest', instructions: [], isCustom: false, createdAt: null as any },
    { id: '8', name: 'Lat Pulldown', category: 'isolation', muscleGroup: 'back', equipment: ['cable machine'], description: 'Pull bar down to chest while seated', instructions: [], isCustom: false, createdAt: null as any },
    
    // Shoulders
    { id: '9', name: 'Overhead Press', category: 'compound', muscleGroup: 'shoulders', equipment: ['barbell'], description: 'Press barbell from shoulders to overhead', instructions: [], isCustom: false, createdAt: null as any },
    { id: '10', name: 'Lateral Raises', category: 'isolation', muscleGroup: 'shoulders', equipment: ['dumbbells'], description: 'Raise dumbbells out to sides', instructions: [], isCustom: false, createdAt: null as any },
    { id: '11', name: 'Front Raises', category: 'isolation', muscleGroup: 'shoulders', equipment: ['dumbbells'], description: 'Raise dumbbells in front of body', instructions: [], isCustom: false, createdAt: null as any },
    
    // Arms
    { id: '12', name: 'Bicep Curls', category: 'isolation', muscleGroup: 'biceps', equipment: ['dumbbells'], description: 'Curl dumbbells from waist to shoulders', instructions: [], isCustom: false, createdAt: null as any },
    { id: '13', name: 'Tricep Dips', category: 'bodyweight', muscleGroup: 'triceps', equipment: ['dip bars'], description: 'Lower body between parallel bars, push up', instructions: [], isCustom: false, createdAt: null as any },
    { id: '14', name: 'Hammer Curls', category: 'isolation', muscleGroup: 'biceps', equipment: ['dumbbells'], description: 'Curl with neutral grip (palms facing each other)', instructions: [], isCustom: false, createdAt: null as any },
    
    // Legs
    { id: '15', name: 'Squat', category: 'compound', muscleGroup: 'legs', equipment: ['barbell', 'rack'], description: 'Barbell on shoulders, squat down and stand up', instructions: [], isCustom: false, createdAt: null as any },
    { id: '16', name: 'Leg Press', category: 'compound', muscleGroup: 'legs', equipment: ['leg press machine'], description: 'Push platform away while seated', instructions: [], isCustom: false, createdAt: null as any },
    { id: '17', name: 'Lunges', category: 'bodyweight', muscleGroup: 'legs', equipment: [], description: 'Step forward and lower back knee toward ground', instructions: [], isCustom: false, createdAt: null as any },
    { id: '18', name: 'Calf Raises', category: 'isolation', muscleGroup: 'legs', equipment: [], description: 'Rise up on toes, lower back down', instructions: [], isCustom: false, createdAt: null as any },
    
    // Core
    { id: '19', name: 'Plank', category: 'bodyweight', muscleGroup: 'abs', equipment: [], description: 'Hold push-up position on forearms', instructions: [], isCustom: false, createdAt: null as any },
    { id: '20', name: 'Crunches', category: 'bodyweight', muscleGroup: 'abs', equipment: [], description: 'Lie on back, curl shoulders toward knees', instructions: [], isCustom: false, createdAt: null as any },
    { id: '21', name: 'Russian Twists', category: 'bodyweight', muscleGroup: 'abs', equipment: [], description: 'Sit with legs raised, twist torso side to side', instructions: [], isCustom: false, createdAt: null as any },
    { id: '22', name: 'Leg Raises', category: 'bodyweight', muscleGroup: 'abs', equipment: [], description: 'Lie flat, raise legs to 90 degrees', instructions: [], isCustom: false, createdAt: null as any },
    
    // Cardio
    { id: '23', name: 'Running', category: 'cardio', muscleGroup: 'full_body', equipment: [], description: 'Run at steady pace or intervals', instructions: [], isCustom: false, createdAt: null as any },
    { id: '24', name: 'Jumping Jacks', category: 'cardio', muscleGroup: 'full_body', equipment: [], description: 'Jump while spreading arms and legs', instructions: [], isCustom: false, createdAt: null as any },
    { id: '25', name: 'Burpees', category: 'cardio', muscleGroup: 'full_body', equipment: [], description: 'Squat, kick back, push-up, jump up', instructions: [], isCustom: false, createdAt: null as any },
    { id: '26', name: 'High Knees', category: 'cardio', muscleGroup: 'full_body', equipment: [], description: 'Run in place bringing knees high', instructions: [], isCustom: false, createdAt: null as any },
    { id: '27', name: 'Mountain Climbers', category: 'cardio', muscleGroup: 'full_body', equipment: [], description: 'In push-up position, alternate bringing knees to chest', instructions: [], isCustom: false, createdAt: null as any },
    
    // Glutes
    { id: '28', name: 'Hip Thrust', category: 'compound', muscleGroup: 'glutes', equipment: ['bench', 'barbell'], description: 'Thrust hips upward with barbell across lap', instructions: [], isCustom: false, createdAt: null as any },
    { id: '29', name: 'Glute Bridge', category: 'bodyweight', muscleGroup: 'glutes', equipment: [], description: 'Lie on back, lift hips toward ceiling', instructions: [], isCustom: false, createdAt: null as any },
    
    // Stretching
    { id: '30', name: 'Hamstring Stretch', category: 'stretching', muscleGroup: 'legs', equipment: [], description: 'Sit with one leg extended, reach toward toes', instructions: [], isCustom: false, createdAt: null as any },
    { id: '31', name: 'Shoulder Stretch', category: 'stretching', muscleGroup: 'shoulders', equipment: [], description: 'Pull arm across chest', instructions: [], isCustom: false, createdAt: null as any },
    { id: '32', name: 'Childs Pose', category: 'stretching', muscleGroup: 'full_body', equipment: [], description: 'Kneel and fold forward with arms extended', instructions: [], isCustom: false, createdAt: null as any },
    { id: '33', name: 'Cat-Cow Stretch', category: 'stretching', muscleGroup: 'back', equipment: [], description: 'On all fours, alternate arching and rounding back', instructions: [], isCustom: false, createdAt: null as any },
  ];
}