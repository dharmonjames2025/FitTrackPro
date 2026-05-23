export const calculations = {
  // Calculate BMI
  bmi(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  },

  // Get BMI category
  bmiCategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  },

  // Calculate BMR using Mifflin-St Jeor Equation
  bmr(weightKg: number, heightCm: number, age: number, gender: 'male' | 'female'): number {
    if (gender === 'male') {
      return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    }
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  },

  // Calculate TDEE (Total Daily Energy Expenditure)
  tdee(bmr: number, activityLevel: string): number {
    const multipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extreme: 1.9,
    };
    return bmr * (multipliers[activityLevel] || 1.2);
  },

  // Calculate macronutrient split
  macroSplit(calories: number, ratio: { protein: number; carbs: number; fats: number }) {
    return {
      protein: Math.round((calories * ratio.protein) / 4), // 4 calories per gram
      carbs: Math.round((calories * ratio.carbs) / 4),     // 4 calories per gram
      fats: Math.round((calories * ratio.fats) / 9),        // 9 calories per gram
    };
  },

  // Calculate one rep max using Brzycki formula
  oneRepMax(weight: number, reps: number): number {
    if (reps === 1) return weight;
    if (reps > 36) return 0;
    return weight * (36 / (37 - reps));
  },

  // Calculate workout volume
  workoutVolume(sets: number, reps: number, weight: number): number {
    return sets * reps * weight;
  },

  // Estimate calories burned during workout
  caloriesBurned(met: number, weightKg: number, durationMinutes: number): number {
    return Math.round(met * weightKg * (durationMinutes / 60));
  },

  // Calculate streak
  calculateStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;
    
    const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());
    let streak = 1;
    let currentDate = new Date(sortedDates[0]);
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      const nextDate = new Date(sortedDates[i]);
      
      if (this.isSameDay(prevDate, nextDate)) {
        streak++;
        currentDate = nextDate;
      } else {
        break;
      }
    }
    
    return streak;
  },

  // Check if two dates are the same day
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  },

  // Calculate age from date of birth
  age(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  // Calculate weight change percentage
  weightChangePercentage(initialWeight: number, currentWeight: number): number {
    return ((currentWeight - initialWeight) / initialWeight) * 100;
  },

  // Calculate recommended water intake (in ml)
  waterIntake(weightKg: number): number {
    return Math.round(weightKg * 33); // 33ml per kg of body weight
  },
};