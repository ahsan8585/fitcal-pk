
import { UserProfile, Gender, ActivityLevel, Goal, FoodItem, DietPreference, GeneratedRecipe, ScannedFood } from './types';
import { FOOD_DATABASE } from './constants';

export const calculateBMR = (gender: Gender, weight: number, height: number, age: number): number => {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * multipliers[activityLevel]);
};

export const calculateTargetCalories = (tdee: number, goal: Goal): number => {
  switch (goal) {
    case 'lose': return Math.round(tdee - 500);
    case 'gain': return Math.round(tdee + 500);
    case 'maintain': return tdee;
    default: return tdee;
  }
};

export const calculateMacros = (calories: number) => {
  // 40% Carb, 30% Protein, 30% Fat split (approximate for general fitness)
  return {
    protein: Math.round((calories * 0.30) / 4),
    carbs: Math.round((calories * 0.40) / 4),
    fats: Math.round((calories * 0.30) / 9),
  };
};

export const getQuote = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const generateMealPlan = (preference: DietPreference, calorieTarget: number) => {
  // Simple heuristic algorithm for demo purposes
  let availableFoods = FOOD_DATABASE;
  
  if (preference === 'veg') {
    availableFoods = availableFoods.filter(f => f.category === 'fruit' || f.category === 'drink' || f.category === 'snack' || f.name.includes('Daal') || f.name.includes('Roti') || f.name.includes('Rice') || f.name.includes('Oats'));
  } else if (preference === 'high-protein') {
    availableFoods = availableFoods.filter(f => f.protein > 5);
  }

  // Shuffle
  availableFoods = availableFoods.sort(() => 0.5 - Math.random());

  // Pick one breakfast-ish, one lunch, one dinner
  const breakfast = availableFoods.find(f => f.category === 'meal' || f.category === 'fruit') || availableFoods[0];
  const lunch = availableFoods.find(f => f.category === 'meal' && f.id !== breakfast.id) || availableFoods[1];
  const dinner = availableFoods.find(f => f.category === 'meal' && f.id !== breakfast.id && f.id !== lunch.id) || availableFoods[2];
  const snack = availableFoods.find(f => f.category === 'snack' || f.category === 'drink') || availableFoods[3];

  const totalCals = breakfast.calories + lunch.calories + dinner.calories + snack.calories;
  
  return {
    breakfast,
    lunch,
    dinner,
    snack,
    totalCals
  };
};

export const exportUserData = (profile: UserProfile, history: any[]) => {
  const data = {
    profile,
    history,
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fitcal_export_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const generateSmartRecipe = (ingredientsInput: string): GeneratedRecipe => {
  const inputs = ingredientsInput.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
  
  let totalCals = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  let detectedType: 'Smoothie' | 'Salad' | 'Cooked' | 'Snack' = 'Cooked';
  let matchedIngredients: { name: string; amount: string }[] = [];

  let fruitCount = 0;
  let vegCount = 0;
  let meatCount = 0;
  let liquidCount = 0;

  // Analyze ingredients
  inputs.forEach(input => {
    // Try to find in DB
    const dbMatch = FOOD_DATABASE.find(f => f.name.toLowerCase().includes(input));
    
    if (dbMatch) {
      totalCals += dbMatch.calories;
      totalProtein += dbMatch.protein;
      totalCarbs += dbMatch.carbs;
      totalFats += dbMatch.fats;
      matchedIngredients.push({ name: dbMatch.name, amount: dbMatch.serving });
      
      if (dbMatch.category === 'fruit') fruitCount++;
      if (dbMatch.category === 'drink') liquidCount++;
      if (dbMatch.category === 'meal' && (input.includes('chicken') || input.includes('beef') || input.includes('egg'))) meatCount++;
    } else {
      // Estimate for unknown items
      totalCals += 50; 
      matchedIngredients.push({ name: input.charAt(0).toUpperCase() + input.slice(1), amount: '1 serving' });
      
      // Heuristic typing
      if (['milk', 'yogurt', 'water', 'juice'].some(s => input.includes(s))) liquidCount++;
      if (['banana', 'apple', 'berry', 'mango'].some(s => input.includes(s))) fruitCount++;
      if (['chicken', 'mutton', 'beef', 'fish'].some(s => input.includes(s))) meatCount++;
      if (['lettuce', 'spinach', 'cucumber', 'tomato'].some(s => input.includes(s))) vegCount++;
    }
  });

  // Determine Type
  if (liquidCount > 0 && fruitCount > 0 && meatCount === 0) detectedType = 'Smoothie';
  else if (vegCount > 1 && meatCount === 0) detectedType = 'Salad';
  else if (meatCount > 0 || inputs.some(i => i.includes('rice') || i.includes('roti'))) detectedType = 'Cooked';
  else if (inputs.length === 1) detectedType = 'Snack';

  // Generate Instructions & Title
  let title = "Custom Meal";
  let instructions: string[] = [];
  const mainIng = matchedIngredients[0]?.name || "Ingredient";

  switch (detectedType) {
    case 'Smoothie':
      title = `Power ${mainIng} Smoothie`;
      instructions = [
        "Wash and chop all fruits.",
        "Add fruits and liquids into a blender.",
        "Blend on high until smooth.",
        "Pour into a glass and serve chilled."
      ];
      break;
    case 'Salad':
      title = `Fresh ${mainIng} Salad`;
      instructions = [
        "Wash all vegetables thoroughly.",
        "Chop everything into bite-sized pieces.",
        "Toss in a large bowl with salt, pepper, and lemon juice.",
        "Garnish with nuts or seeds if available."
      ];
      break;
    case 'Cooked':
      title = `Healthy ${mainIng} Delight`;
      instructions = [
        "Prepare ingredients: chop vegetables and clean meat.",
        "Heat a small amount of oil in a pan.",
        "Stir fry the main protein until cooked.",
        "Add vegetables/grains and spices. Cook for 5-10 mins.",
        "Serve hot."
      ];
      break;
    case 'Snack':
      title = `Quick ${mainIng} Snack`;
      instructions = [
        "Prepare the ingredient.",
        "Arrange on a plate.",
        "Enjoy your healthy snack!"
      ];
      break;
  }

  return {
    title,
    type: detectedType,
    ingredients: matchedIngredients,
    instructions,
    calories: Math.round(totalCals),
    macros: {
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fats: Math.round(totalFats)
    },
    prepTime: detectedType === 'Cooked' ? '20 min' : '5 min'
  };
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const analyzeFoodImage = async (imageFile: string): Promise<ScannedFood> => {
  return new Promise((resolve) => {
    // SIMULATED AI LATENCY
    setTimeout(() => {
      // MOCK DATA: In a real app, this would come from an AI Vision API
      const possibilities = [
        { name: 'Chicken Biryani', calories: 450, protein: 25, carbs: 50, fats: 15, serving: '1 Plate (300g)' },
        { name: 'Roti & Daal', calories: 340, protein: 14, carbs: 55, fats: 8, serving: '1 Bowl + 1 Roti' },
        { name: 'Chicken Karahi', calories: 420, protein: 35, carbs: 8, fats: 28, serving: '1 Serving' },
        { name: 'Samosa Chat', calories: 350, protein: 6, carbs: 45, fats: 18, serving: '1 Plate' },
        { name: 'Doodh Patti Chai', calories: 150, protein: 4, carbs: 12, fats: 8, serving: '1 Cup' }
      ];
      
      const randomFood = possibilities[Math.floor(Math.random() * possibilities.length)];
      
      resolve({
        name: randomFood.name,
        calories: randomFood.calories,
        protein: randomFood.protein,
        carbs: randomFood.carbs,
        fats: randomFood.fats,
        serving: randomFood.serving,
        imagePreview: imageFile
      });
    }, 2500);
  });
};
