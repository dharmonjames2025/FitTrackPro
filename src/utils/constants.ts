export const CONSTANTS = {
  APP_NAME: 'FitTrack Pro',
  APP_VERSION: '1.0.0',
  
  COLORS: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    info: '#5AC8FA',
    light: '#F2F2F7',
    dark: '#1C1C1E',
    gray: '#8E8E93',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  FONTS: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  SIZES: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  },

  SPACING: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  BORDER_RADIUS: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },

  ACTIVITY_LEVELS: [
    { label: 'Sedentary', value: 'sedentary', description: 'Little or no exercise' },
    { label: 'Light', value: 'light', description: 'Exercise 1-3 times/week' },
    { label: 'Moderate', value: 'moderate', description: 'Exercise 4-5 times/week' },
    { label: 'Active', value: 'active', description: 'Daily exercise or intense 3-4 times/week' },
    { label: 'Extreme', value: 'extreme', description: 'Intense exercise 6-7 times/week' },
  ],

  FITNESS_GOALS: [
    'Lose Weight',
    'Build Muscle',
    'Improve Endurance',
    'Increase Flexibility',
    'General Fitness',
    'Strength Training',
    'Rehabilitation',
    'Competition Prep',
  ],

  REST_TIMES: [
    { label: '30 seconds', value: 30 },
    { label: '45 seconds', value: 45 },
    { label: '1 minute', value: 60 },
    { label: '1.5 minutes', value: 90 },
    { label: '2 minutes', value: 120 },
    { label: '3 minutes', value: 180 },
    { label: '5 minutes', value: 300 },
  ],

  MEAL_REMINDERS: [
    { label: '6:00 AM', value: '06:00' },
    { label: '7:00 AM', value: '07:00' },
    { label: '8:00 AM', value: '08:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '1:00 PM', value: '13:00' },
    { label: '6:00 PM', value: '18:00' },
    { label: '7:00 PM', value: '19:00' },
    { label: '8:00 PM', value: '20:00' },
  ],

  CHALLENGE_METRICS: [
    { label: 'Workouts', value: 'workouts' },
    { label: 'Calories', value: 'calories' },
    { label: 'Minutes', value: 'minutes' },
    { label: 'Distance (km)', value: 'distance' },
  ],

  DEFAULT_MACROS: {
    protein: 0.3, // 30%
    carbs: 0.4,   // 40%
    fats: 0.3,    // 30%
  },

  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  PAGINATION: {
    PAGE_SIZE: 20,
    INITIAL_PAGE: 1,
  },
};