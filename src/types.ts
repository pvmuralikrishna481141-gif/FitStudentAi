export interface UserProfile {
  age: number;
  gender: string;
  weight: number; // kg
  height: number; // cm
  goal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'endurance';
  dietaryPreference: string; // e.g., vegetarian, vegan, halal, no-restrictions
  culturalBackground?: string;
  budget: 'low' | 'medium' | 'high';
  availableEquipment: string[]; // e.g., gym, dumbbells, bodyweight
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
}

export interface Meal {
  name: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  instructions: string;
  budgetNote?: string;
}

export interface Workout {
  name: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    duration?: string;
    notes?: string;
  }[];
  durationMinutes: number;
  focusArea: string;
}

export interface DayPlan {
  day: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snack?: Meal;
  };
  workout: Workout | null;
}

export interface FullPlan {
  weeklyPlan: DayPlan[];
  generalAdvice: string;
}
