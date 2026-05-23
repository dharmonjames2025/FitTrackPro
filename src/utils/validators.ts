export const validators = {
  email(email: string): string | null {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
  },

  password(password: string): string | null {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain an uppercase letter';
    if (!/(?=.*[0-9])/.test(password)) return 'Password must contain a number';
    if (!/(?=.*[!@#$%^&*])/.test(password)) return 'Password must contain a special character';
    return null;
  },

  displayName(name: string): string | null {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name contains invalid characters';
    return null;
  },

  workoutName(name: string): string | null {
    if (!name) return 'Workout name is required';
    if (name.length < 3) return 'Workout name must be at least 3 characters';
    if (name.length > 100) return 'Workout name must be less than 100 characters';
    return null;
  },

  exerciseWeight(weight: number | undefined): string | null {
    if (weight !== undefined) {
      if (isNaN(weight)) return 'Weight must be a number';
      if (weight < 0) return 'Weight cannot be negative';
      if (weight > 1000) return 'Weight seems too high (max 1000 kg)';
    }
    return null;
  },

  reps(reps: number): string | null {
    if (!reps && reps !== 0) return 'Reps are required';
    if (isNaN(reps)) return 'Reps must be a number';
    if (reps < 1) return 'Reps must be at least 1';
    if (reps > 100) return 'Reps must be less than 100';
    if (!Number.isInteger(reps)) return 'Reps must be a whole number';
    return null;
  },

  sets(sets: number): string | null {
    if (!sets) return 'Sets are required';
    if (sets < 1) return 'Sets must be at least 1';
    if (sets > 20) return 'Sets must be less than 20';
    return null;
  },

  measurement(value: number | undefined, fieldName: string): string | null {
    if (value !== undefined) {
      if (isNaN(value)) return `${fieldName} must be a number`;
      if (value < 0) return `${fieldName} cannot be negative`;
      if (value > 500) return `${fieldName} seems too high`;
    }
    return null;
  },

  dateOfBirth(date: string): string | null {
    if (!date) return null;
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) return 'You must be at least 13 years old';
    if (age > 120) return 'Please enter a valid date of birth';
    return null;
  },

  height(height: number | undefined): string | null {
    if (height !== undefined) {
      if (isNaN(height)) return 'Height must be a number';
      if (height < 50) return 'Height must be at least 50 cm';
      if (height > 300) return 'Height must be less than 300 cm';
    }
    return null;
  },

  weight(weight: number | undefined): string | null {
    if (weight !== undefined) {
      if (isNaN(weight)) return 'Weight must be a number';
      if (weight < 20) return 'Weight must be at least 20 kg';
      if (weight > 500) return 'Weight must be less than 500 kg';
    }
    return null;
  },
};