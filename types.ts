
export type Language = 'en' | 'hinglish';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';
export type Theme = 'light' | 'dark';
export type DietPreference = 'anything' | 'veg' | 'non-veg' | 'high-protein';

export interface UserProfile {
  name: string;
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
  goal: Goal;
  bmr: number;
  tdee: number;
  targetCalories: number;
  dietPreference?: DietPreference;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  serving: string;
  category: 'meal' | 'snack' | 'drink' | 'fruit';
  isVeg?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  caloriesBurnedPerMin: number; // Approx
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

export interface Translation {
  [key: string]: {
    en: string;
    hinglish: string;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface WaterLog {
  date: string; // YYYY-MM-DD
  amount: number; // ml
}

export interface SleepLog {
  date: string;
  hours: number;
}

export interface GeneratedRecipe {
  title: string;
  type: 'Smoothie' | 'Salad' | 'Cooked' | 'Snack';
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  calories: number;
  macros: { protein: number; carbs: number; fats: number };
  prepTime: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface WaterStats {
  intake: number; // ml
  goal: number; // ml
  streak: number; // days
  lastLogDate: string;
}

export interface ScannedFood {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  serving: string;
  imagePreview: string;
}