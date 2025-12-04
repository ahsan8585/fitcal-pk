
import { FoodItem, Exercise, Translation, Badge } from './types';

export const FOOD_DATABASE: FoodItem[] = [
  { id: '1', name: 'Chicken Biryani', calories: 290, protein: 18, carbs: 35, fats: 10, serving: '1 Plate (200g)', category: 'meal' },
  { id: '2', name: 'Roti (Whole Wheat)', calories: 120, protein: 4, carbs: 24, fats: 1, serving: '1 Medium', category: 'meal' },
  { id: '3', name: 'Daal Mash', calories: 180, protein: 10, carbs: 28, fats: 4, serving: '1 Bowl', category: 'meal' },
  { id: '4', name: 'Boiled Rice', calories: 130, protein: 3, carbs: 28, fats: 0.3, serving: '1 Bowl', category: 'meal' },
  { id: '5', name: 'Chicken Karahi', calories: 350, protein: 25, carbs: 8, fats: 22, serving: '1 Serving', category: 'meal' },
  { id: '6', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fats: 0.3, serving: '1 Medium', category: 'fruit' },
  { id: '7', name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fats: 0.3, serving: '1 Medium', category: 'fruit' },
  { id: '8', name: 'Dates (Khajoor)', calories: 23, protein: 0.2, carbs: 6, fats: 0, serving: '1 Piece', category: 'fruit' },
  { id: '9', name: 'Almonds (Badam)', calories: 7, protein: 0.3, carbs: 0.3, fats: 0.6, serving: '1 Piece', category: 'snack' },
  { id: '10', name: 'Milk (Full Cream)', calories: 150, protein: 8, carbs: 12, fats: 8, serving: '1 Glass (250ml)', category: 'drink' },
  { id: '11', name: 'Mango Shake', calories: 280, protein: 6, carbs: 45, fats: 8, serving: '1 Glass', category: 'drink' },
  { id: '12', name: 'Protein Shake', calories: 120, protein: 24, carbs: 3, fats: 1, serving: '1 Scoop', category: 'drink' },
  { id: '13', name: 'Oats', calories: 150, protein: 5, carbs: 27, fats: 3, serving: '1 Bowl (cooked)', category: 'meal' },
  { id: '14', name: 'Yogurt (Dahi)', calories: 60, protein: 4, carbs: 5, fats: 3, serving: '1/2 Cup', category: 'snack' },
  { id: '15', name: 'Peanuts', calories: 160, protein: 7, carbs: 5, fats: 14, serving: '1 Handful (28g)', category: 'snack' },
  { id: '16', name: 'Naan', calories: 260, protein: 9, carbs: 45, fats: 5, serving: '1 Piece', category: 'meal' },
  { id: '17', name: 'Samosa', calories: 260, protein: 4, carbs: 24, fats: 17, serving: '1 Piece (Large)', category: 'snack' },
  { id: '18', name: 'Paratha', calories: 300, protein: 6, carbs: 35, fats: 15, serving: '1 Medium', category: 'meal' },
  { id: '19', name: 'Chai (Milk Tea)', calories: 120, protein: 4, carbs: 10, fats: 6, serving: '1 Cup', category: 'drink' },
  { id: '20', name: 'Chapli Kabab', calories: 280, protein: 20, carbs: 5, fats: 20, serving: '1 Piece', category: 'meal' },
  { id: '21', name: 'French Fries', calories: 312, protein: 3, carbs: 41, fats: 15, serving: '1 Medium Pack', category: 'snack' },
  { id: '22', name: 'Zinger Burger', calories: 550, protein: 25, carbs: 50, fats: 28, serving: '1 Burger', category: 'meal' },
];

export const EXERCISE_DATABASE: Exercise[] = [
  { id: '1', name: 'Pushups', muscleGroup: 'Chest', caloriesBurnedPerMin: 7, difficulty: 'Beginner', description: 'Hands shoulder-width apart, keep back straight.' },
  { id: '2', name: 'Squats', muscleGroup: 'Legs', caloriesBurnedPerMin: 8, difficulty: 'Beginner', description: 'Feet shoulder-width apart, lower hips back and down.' },
  { id: '3', name: 'Plank', muscleGroup: 'Core', caloriesBurnedPerMin: 4, difficulty: 'Intermediate', description: 'Hold body straight supported by forearms and toes.' },
  { id: '4', name: 'Crunches', muscleGroup: 'Abs', caloriesBurnedPerMin: 5, difficulty: 'Beginner', description: 'Lie on back, lift shoulders towards knees.' },
  { id: '5', name: 'Walking', muscleGroup: 'Cardio', caloriesBurnedPerMin: 4, difficulty: 'Beginner', description: 'Brisk pace walking.' },
  { id: '6', name: 'Jogging', muscleGroup: 'Cardio', caloriesBurnedPerMin: 10, difficulty: 'Intermediate', description: 'Light running pace.' },
  { id: '7', name: 'Burpees', muscleGroup: 'Full Body', caloriesBurnedPerMin: 11, difficulty: 'Advanced', description: 'Squat, jump back to plank, pushup, jump forward, jump up.' },
  { id: '8', name: 'Lunges', muscleGroup: 'Legs', caloriesBurnedPerMin: 6, difficulty: 'Intermediate', description: 'Step forward, lower hips until both knees are 90 degrees.' },
];

export const TRANSLATIONS: Translation = {
  welcome_title: { en: "Welcome to FitCal PK", hinglish: "FitCal PK mein Khushamdeed" },
  welcome_subtitle: { en: "Your personal fitness companion", hinglish: "Apka apna fitness saathi" },
  start_btn: { en: "Let's Get Started", hinglish: "Shuru Karein" },
  gender: { en: "Gender", hinglish: "Jins (Gender)" },
  age: { en: "Age", hinglish: "Umar" },
  height: { en: "Height", hinglish: "Qad" },
  weight: { en: "Weight", hinglish: "Wazan" },
  calculate: { en: "Calculate Plan", hinglish: "Plan Banayein" },
  daily_cals: { en: "Daily Calories", hinglish: "Rozana ki Calories" },
  maintenance: { en: "Maintenance", hinglish: "Wazan Barqarar" },
  lose: { en: "Weight Loss", hinglish: "Wazan Kam" },
  gain: { en: "Weight Gain", hinglish: "Wazan Zyada" },
  motivation_1: { en: "Consistency is magic!", hinglish: "Consistency hi asli magic hai!" },
  motivation_2: { en: "Build that body!", hinglish: "Chalo bhai, body banao! 💪" },
  motivation_3: { en: "Today's workout, tomorrow's result!", hinglish: "Aaj ka workout, kal ka result!" },
  search_food: { en: "Search Food...", hinglish: "Khana dhoondein..." },
  gym_exercises: { en: "Gym & Exercises", hinglish: "Gym aur Warzish" },
  progress: { en: "My Progress", hinglish: "Meri Progress" },
  settings: { en: "Settings", hinglish: "Settings" },
  bmi_label: { en: "Your BMI", hinglish: "Apka BMI" },
  protein: { en: "Protein", hinglish: "Protein" },
  carbs: { en: "Carbs", hinglish: "Carbs" },
  fats: { en: "Fats", hinglish: "Fats" },
  favorites: { en: "Favorites", hinglish: "Pasandida" },
  all_foods: { en: "All Foods", hinglish: "Sab Khanay" },
  cat_all: { en: "All", hinglish: "Sab" },
  cat_meal: { en: "Meals", hinglish: "Khana" },
  cat_snack: { en: "Snacks", hinglish: "Snacks" },
  cat_drink: { en: "Drinks", hinglish: "Peena" },
  cat_fruit: { en: "Fruits", hinglish: "Phal" },
  browse_foods: { en: "Browse Foods", hinglish: "Khana Dekhein" },
  no_favorites: { en: "No favorites yet", hinglish: "Koi pasandida nahi" },
  favorites_desc: { en: "Heart your top meals for quick access!", hinglish: "Apne pasandida khanon ko heart karein!" },
  what_is_bmr: { en: "What is BMR?", hinglish: "BMR Kya Hai?" },
  bmr_explanation: { en: "Basal Metabolic Rate: Calories your body burns at complete rest. Calculated using Mifflin-St Jeor equation.", hinglish: "Basal Metabolic Rate: Wo calories jo jism aaram karte waqt jalata hai. Ye Mifflin-St Jeor formula se hisaab lagaya gaya hai." },
  what_is_tdee: { en: "What is TDEE?", hinglish: "TDEE Kya Hai?" },
  tdee_explanation: { en: "Total Daily Energy Expenditure: Your BMR multiplied by your activity level. This is your maintenance calorie amount.", hinglish: "Total Daily Energy Expenditure: Apka BMR aur harkat (activity) mila kar. Ye wo calories hain jinse wazan barqarar rehta hai." },
};

export const MOTIVATIONAL_QUOTES = [
  "Chalo bhai, body banao! 💪",
  "Consistency is the real magic!",
  "Aaj ka workout, kal ka result!",
  "Water peete raho 💧",
  "No Pain, No Gain!",
  "Himmat mat haarna!",
];

export const WATER_MOTIVATION = {
  low: { en: "Drink up! Your body needs fuel.", hinglish: "Pani piyo bhai, body ko zaroorat hai 💧" },
  mid: { en: "Halfway there! Keep going.", hinglish: "Adha goal pura! Thora aur... 😎" },
  high: { en: "Almost done! Stay hydrated.", hinglish: "Bas thora sa reh gaya! Great job 💪" },
  done: { en: "Hydration Goal Smashed! 🏆", hinglish: "Kya baat hai! Hydration Hero! 🏆" }
};

export const BADGES: Badge[] = [
  { id: '1', name: 'First Steps', description: 'Logged first workout', icon: '🏃‍♂️', unlocked: true },
  { id: '2', name: 'Hydration Hero', description: 'Hit water goal 7 days in a row', icon: '💧', unlocked: false },
  { id: '3', name: 'Protein Pro', description: 'Hit protein goal 3 days', icon: '🥩', unlocked: false },
  { id: '4', name: 'Early Bird', description: 'Logged activity before 8AM', icon: '🌅', unlocked: false },
];

export const AI_KNOWLEDGE_BASE = [
  {
    keywords: ['hello', 'hi', 'salam', 'hey', 'kaise', 'how are you'],
    responses: {
      en: "Hello! 👋 I'm doing great. Tell me, what should we focus on today? Diet or Workout?",
      hinglish: "Salam! 👋 Main bilkul theek hoon. Batayein, aaj hum kis chez par focus karein? Diet ya Workout?"
    }
  },
  {
    keywords: ['thanks', 'shukriya', 'thank you', 'great'],
    responses: {
      en: "You're welcome! Happy to help. Any other questions? 😊",
      hinglish: "You're welcome! Khushi hui ke main madad kar saka. Koi aur sawal? 😊"
    }
  },
  {
    keywords: ['bye', 'allah hafiz', 'tata', 'goodbye'],
    responses: {
      en: "Goodbye! Take care and don't miss your workout! 👋",
      hinglish: "Allah Hafiz! Apna khayal rakhein aur workout miss mat karna! 👋"
    }
  },
  {
    keywords: ['weight loss', 'wazan kam', 'fat loss', 'mota', 'slim', 'patla'],
    responses: {
      en: "For weight loss, the formula is simple: **Calorie Deficit**. \n1. Eat 300-500 calories less than maintenance. \n2. Reduce sugar and oily foods. \n3. Do cardio or walk for 30 mins daily. 🏃‍♂️",
      hinglish: "Weight loss ka simple formula hai: **Calorie Deficit**. \n1. Apni maintenance calories se 300-500 kam khayein. \n2. Meetha (sugar) aur oily khana band karein. \n3. Rozana 30 min walk ya cardio karein. 🏃‍♂️"
    }
  },
  {
    keywords: ['gain', 'wazan barhana', 'mota hona', 'muscle', 'bulk', 'kamzor'],
    responses: {
      en: "**Calorie Surplus** is key for weight gain. \n1. Eat 300-500 calories more than maintenance. \n2. Increase Protein (Chicken, Eggs, Milk). \n3. Do Heavy weight training to build muscle, not fat. 💪",
      hinglish: "Weight gain ke liye **Calorie Surplus** zaroori hai. \n1. Maintenance se 300-500 zyada calories khayein. \n2. Protein zyada lein (Chicken, Eggs, Milk). \n3. Heavy weight training karein taake muscle banay, fat nahi. 💪"
    }
  },
  {
    keywords: ['biryani', 'chawal', 'rice'],
    responses: {
      en: "Biryani is love, but it has calories! 🍛 One plate (200g) = 300-400 calories. \nTip: Control your portion and take more Raita/Salad.",
      hinglish: "Biryani pyar hai lekin calories bhi! 🍛 Ek plate (200g) = 300-400 calories. \nTip: Portion control karein aur Raita/Salad zyada lein."
    }
  },
  {
    keywords: ['roti', 'bread', 'wheat'],
    responses: {
      en: "One medium Roti has ~100-120 calories. For weight loss, avoid white flour (maida) and use whole wheat. 🌾",
      hinglish: "Ek darmiyani Roti mein ~100-120 calories hoti hain. Weight loss ke liye maida avoid karein aur whole wheat (chakki ka atta) use karein. 🌾"
    }
  },
  {
    keywords: ['protein', 'anda', 'egg', 'chicken', 'gosht'],
    responses: {
      en: "Protein is essential for muscle repair. \nBest sources: Boiled Eggs (Whites), Chicken Breast, Daal, and Fish. Include protein in every meal! 🥚",
      hinglish: "Protein muscle repair ke liye zaroori hai. \nBest sources: Ublay huay Anday (Whites), Chicken Breast, Daal, aur Fish. Har meal mein protein hona chahiye! 🥚"
    }
  },
  {
    keywords: ['sugar', 'meetha', 'cheeni', 'coke', 'pepsi'],
    responses: {
      en: "Sugar means empty calories. It's the biggest enemy of weight loss. Eat fruits if you crave something sweet! 🍎",
      hinglish: "Cheeni (Sugar) empty calories hain. Weight loss mein ye sab se bara dushman hai. Fruits khayein agar meetha khane ka dil kare! 🍎"
    }
  },
  {
    keywords: ['chai', 'tea'],
    responses: {
      en: "Tea is best without sugar! ☕ One cup of milk tea can have 100+ calories if sugary. You can use Stevia.",
      hinglish: "Chai baghair cheeni ke best hai! ☕ Ek cup doodh patti mein 100+ calories ho sakti hain agar cheeni zyada ho. Stevia use kar sakte hain."
    }
  },
  {
    keywords: ['abs', 'pait', 'six pack', 'belly'],
    responses: {
      en: "Abs are made in the kitchen! 🥗 Just doing crunches won't reduce belly fat. You need to lower overall body fat % via diet and cardio.",
      hinglish: "Abs kitchen mein bante hain! 🥗 Sirf crunches karne se pait kam nahi hoga. Overall body fat % kam karna parega diet aur cardio ke zariye."
    }
  },
  {
    keywords: ['chest', 'pushup', 'bench'],
    responses: {
      en: "For Chest: \n1. Pushups (Best for home). \n2. Bench Press. \n3. Chest Flys. \nFocus on form, not weight!",
      hinglish: "Chest ke liye: \n1. Pushups (Ghar pe best). \n2. Bench Press. \n3. Chest Flys. \nForm par focus karein, weight par nahi!"
    }
  },
  {
    keywords: ['legs', 'squat', 'tang'],
    responses: {
      en: "Never skip Leg Day! 🦵 Squats and Lunges are best. They boost testosterone and help overall body growth.",
      hinglish: "Never skip Leg Day! 🦵 Squats aur Lunges best hain. Ye testosterone boost karte hain aur puri body ki growth mein madad karte hain."
    }
  },
  {
    keywords: ['bicep', 'dole', 'arms'],
    responses: {
      en: "For Biceps, do Dumbbell Curls and Hammer Curls. But don't forget Triceps (back of arm), they make up 70% of arm size! 💪",
      hinglish: "Biceps ke liye Dumbbell Curls aur Hammer Curls karein. Lekin Triceps (back of arm) ko mat bhoolna, wo arm ka 70% size banate hain! 💪"
    }
  },
  {
    keywords: ['pani', 'water', 'drink'],
    responses: {
      en: "Hydration is key! 💧 Drinking 3-4 liters of water daily boosts metabolism and clears skin.",
      hinglish: "Hydration key hai! 💧 Din mein 3-4 liter paani peene se metabolism tez hota hai aur skin bhi saaf hoti hai."
    }
  },
  {
    keywords: ['neend', 'sleep', 'sona'],
    responses: {
      en: "7-8 hours of sleep is necessary for recovery. If you don't sleep, muscles won't grow! 😴",
      hinglish: "Recovery ke liye 7-8 ghantay ki neend zaroori hai. Agar soenge nahi to muscle grow nahi karega! 😴"
    }
  }
];

export const FALLBACK_RESPONSES = {
  en: [
    "Good question! But currently, I only know about Diet and Fitness. Ask something else? 🤔",
    "I didn't quite get that. Could you ask in simpler words? (e.g., 'Weight loss tips' or 'Biryani calories')",
    "My focus is on fitness. Ask me about food or gym! 💪",
    "That's a bit tricky. Can we talk about diet or exercise?"
  ],
  hinglish: [
    "Acha sawal hai! Lekin filhal main sirf Diet aur Fitness ke baray mein janta hoon. Kuch aur poochein? 🤔",
    "Samajh nahi aya, thora aasan alfaz mein poochein? (e.g., 'Weight loss tips' ya 'Biryani calories')",
    "Mera focus fitness par hai. Aap khaney ya gym ke baray mein poochein! 💪",
    "Ye thora mushkil sawal hai. Kya hum diet ya exercise ki baat kar sakte hain?"
  ]
};
    