
import React, { useState, useEffect } from 'react';
import { FOOD_DATABASE, TRANSLATIONS } from '../constants';
import { Language, Translation, FoodItem, DietPreference, GeneratedRecipe, ScannedFood } from '../types';
import { generateMealPlan, generateSmartRecipe } from '../utils';
import Card from '../components/Card';
import Button from '../components/Button';
import SmartScanner from '../components/SmartScanner';
import { Search, Plus, Coffee, Utensils, Zap, Heart, Apple, X, Flame, Check, Mic, Sparkles, ChefHat, RefreshCw, Scroll, Clock, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MealPlanProps {
  language: Language;
}

const MealPlanScreen: React.FC<MealPlanProps> = ({ language }) => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'all' | 'favorites'>('all');
  const [category, setCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fitcal_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  // Modal & Toast State
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  // AI Plan State
  const [showAiPlan, setShowAiPlan] = useState(false);
  const [dietPref, setDietPref] = useState<DietPreference>('anything');
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  
  // Recipe Creator State
  const [showRecipeCreator, setShowRecipeCreator] = useState(false);
  const [recipeInput, setRecipeInput] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);

  // Smart Scanner State
  const [showScanner, setShowScanner] = useState(false);

  // Voice Search State
  const [isListening, setIsListening] = useState(false);

  const t = (key: keyof Translation) => TRANSLATIONS[key]?.[language] || "";

  useEffect(() => {
    localStorage.setItem('fitcal_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const addToLog = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    setSelectedFood(null);
  };

  const handleScanSave = (scannedFood: ScannedFood) => {
    // Logic to add scanned food to log
    // For now just show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice search not supported in this browser.");
      return;
    }
    
    setIsListening(true);
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language === 'hinglish' ? 'ur-PK' : 'en-US';
    recognition.onresult = (event: any) => {
      setSearch(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const plan = generateMealPlan(dietPref, 2000); 
      setGeneratedPlan(plan);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCreateRecipe = () => {
    if(!recipeInput.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const recipe = generateSmartRecipe(recipeInput);
      setGeneratedRecipe(recipe);
      setIsGenerating(false);
    }, 1500);
  };

  const filteredFood = FOOD_DATABASE.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesView = view === 'all' || favorites.includes(f.id);
    const matchesCategory = category === 'all' || f.category === category;
    return matchesSearch && matchesView && matchesCategory;
  });

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'drink': return <Coffee size={16} className="text-blue-400" />;
      case 'snack': return <Zap size={16} className="text-yellow-400" />;
      case 'fruit': return <Apple size={16} className="text-red-400" />;
      default: return <Utensils size={16} className="text-green-400" />;
    }
  };

  const categories = [
    { id: 'all', label: 'cat_all', icon: null },
    { id: 'meal', label: 'cat_meal', icon: Utensils },
    { id: 'snack', label: 'cat_snack', icon: Zap },
    { id: 'drink', label: 'cat_drink', icon: Coffee },
    { id: 'fruit', label: 'cat_fruit', icon: Apple },
  ];

  return (
    <div className="p-4 pb-24 pt-12 relative">
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          key={view}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          {view === 'favorites' ? t('favorites') : 'Desi Food Database'}
        </motion.h2>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowScanner(true)}
            className="bg-input border border-card-border p-2 rounded-xl text-foreground hover:text-neon-green hover:border-neon-green transition-all"
            title="Scan Meal"
          >
            <Camera size={20} />
          </button>
          <button 
            onClick={() => setShowRecipeCreator(true)}
            className="bg-input border border-card-border p-2 rounded-xl text-foreground hover:text-neon-green hover:border-neon-green transition-all"
            title="Smart Recipe Creator"
          >
            <ChefHat size={20} />
          </button>
          <button 
            onClick={() => setShowAiPlan(true)}
            className="bg-gradient-to-r from-neon-blue to-neon-purple p-2 rounded-xl text-white shadow-lg shadow-neon-blue/20 animate-pulse-slow"
            title="AI Meal Plan"
          >
            <Sparkles size={20} />
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-muted" size={20} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isListening ? "Listening..." : t('search_food')}
            className={`w-full bg-input border ${isListening ? 'border-neon-green' : 'border-card-border'} rounded-full py-3 pl-12 pr-4 text-foreground focus:outline-none focus:border-neon-blue transition-colors placeholder-muted`}
          />
        </div>
        <button 
          onClick={handleVoiceSearch}
          className={`p-3 rounded-full border border-card-border transition-all ${isListening ? 'bg-neon-green/20 text-neon-green animate-pulse' : 'bg-input text-muted hover:text-foreground'}`}
        >
          <Mic size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('all')}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
            view === 'all' 
              ? 'bg-neon-blue text-black shadow-lg shadow-neon-blue/20' 
              : 'bg-input text-muted hover:text-foreground'
          }`}
        >
          {t('all_foods')}
        </button>
        <button
          onClick={() => setView('favorites')}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            view === 'favorites' 
              ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/20' 
              : 'bg-input text-muted hover:text-foreground'
          }`}
        >
          <Heart size={14} className={view === 'favorites' ? 'fill-current' : ''} />
          {t('favorites')}
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              category === cat.id 
                ? 'bg-foreground text-background shadow-md' 
                : 'bg-input text-muted border border-card-border hover:bg-card-border'
            }`}
          >
            {cat.icon && <cat.icon size={14} />}
            {t(cat.label as keyof Translation)}
          </button>
        ))}
      </div>

      {/* Food List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredFood.map((item) => {
            const isFav = favorites.includes(item.id);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedFood(item)}
              >
                <Card className="flex items-center justify-between p-4 group hover:border-neon-blue/50 transition-colors cursor-pointer relative overflow-hidden">
                  <div className="flex items-center gap-4 z-10">
                    <div className="w-12 h-12 rounded-xl bg-input flex items-center justify-center text-2xl">
                      {item.category === 'fruit' ? '🍎' : item.category === 'drink' ? '🥛' : item.category === 'snack' ? '🥜' : '🍛'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-neon-blue transition-colors">{item.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        {getCategoryIcon(item.category)}
                        <span>{item.serving}</span>
                        <span className="w-1 h-1 bg-muted rounded-full"></span>
                        <span className="text-neon-green">{item.calories} cal</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 z-10">
                    <button 
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isFav 
                          ? 'bg-neon-purple/20 text-neon-purple' 
                          : 'bg-input text-muted hover:text-neon-purple'
                      }`}
                    >
                      <Heart size={18} className={isFav ? 'fill-current' : ''} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center text-neon-blue hover:bg-neon-blue hover:text-black transition-all">
                      <Plus size={18} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredFood.length === 0 && (
          <div className="text-center py-10 text-muted">
            <Utensils size={40} className="mx-auto mb-4 opacity-50" />
            <p>No foods found. Try a different search!</p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl z-[60] flex items-center gap-3 font-bold"
          >
            <div className="w-5 h-5 bg-neon-green rounded-full flex items-center justify-center">
              <Check size={12} className="text-black" />
            </div>
            Logged Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food Detail Modal */}
      <AnimatePresence>
        {selectedFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFood(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full max-w-sm rounded-3xl p-6 relative border border-card-border shadow-2xl overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-neon-blue/20 rounded-full blur-[80px]"></div>
              
              <button 
                onClick={() => setSelectedFood(null)}
                className="absolute top-4 right-4 p-2 bg-input rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="relative z-10 flex flex-col items-center">
                 <motion.div 
                   layoutId={`food-icon-${selectedFood.id}`}
                   className="w-24 h-24 bg-input rounded-2xl flex items-center justify-center text-6xl shadow-inner mb-6"
                 >
                    {selectedFood.category === 'fruit' ? '🍎' : selectedFood.category === 'drink' ? '🥛' : selectedFood.category === 'snack' ? '🥜' : '🍛'}
                 </motion.div>

                 <h2 className="text-2xl font-bold text-foreground text-center mb-1">{selectedFood.name}</h2>
                 <p className="text-muted text-sm mb-6">{selectedFood.serving}</p>

                 <div className="grid grid-cols-3 gap-3 w-full mb-8">
                    <div className="bg-input/50 p-3 rounded-2xl text-center border border-card-border">
                       <div className="text-neon-purple font-bold text-xl">{selectedFood.protein}g</div>
                       <div className="text-[10px] text-muted uppercase tracking-wider font-bold mt-1">Protein</div>
                    </div>
                    <div className="bg-input/50 p-3 rounded-2xl text-center border border-card-border">
                       <div className="text-neon-blue font-bold text-xl">{selectedFood.carbs}g</div>
                       <div className="text-[10px] text-muted uppercase tracking-wider font-bold mt-1">Carbs</div>
                    </div>
                    <div className="bg-input/50 p-3 rounded-2xl text-center border border-card-border">
                       <div className="text-neon-green font-bold text-xl">{selectedFood.fats}g</div>
                       <div className="text-[10px] text-muted uppercase tracking-wider font-bold mt-1">Fats</div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between w-full bg-input/30 p-4 rounded-2xl border border-card-border mb-6">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                          <Flame size={20} />
                       </div>
                       <div className="text-sm font-bold text-muted">Energy</div>
                    </div>
                    <div className="text-2xl font-black text-foreground">{selectedFood.calories} <span className="text-sm font-medium text-muted">kcal</span></div>
                 </div>

                 <Button onClick={addToLog} fullWidth>
                   Add to Log
                 </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <SmartScanner 
            onClose={() => setShowScanner(false)} 
            onSave={handleScanSave}
            language={language}
          />
        )}
      </AnimatePresence>

      {/* AI Recipe Creator Modal */}
      <AnimatePresence>
        {showRecipeCreator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md"
          >
             <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-card w-full max-w-md sm:rounded-3xl rounded-t-3xl p-6 relative border-t sm:border border-card-border shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                  <ChefHat className="text-neon-green" />
                  Recipe Creator
                </h3>
                <button 
                  onClick={() => {
                    setShowRecipeCreator(false); 
                    setGeneratedRecipe(null);
                    setRecipeInput('');
                  }} 
                  className="p-2 bg-input rounded-full hover:bg-red-500/20 text-muted hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>

              {!generatedRecipe ? (
                <div className="space-y-6">
                   <p className="text-muted">Enter ingredients you have, and we'll create a healthy Pakistani-style recipe for you.</p>
                   
                   <div>
                     <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Your Ingredients</label>
                     <textarea
                       value={recipeInput}
                       onChange={(e) => setRecipeInput(e.target.value)}
                       placeholder="e.g. Chicken, Rice, Yogurt, Onion..."
                       className="w-full h-32 bg-input border border-card-border rounded-2xl p-4 text-foreground focus:outline-none focus:border-neon-green resize-none"
                     />
                     <p className="text-xs text-muted mt-2 text-right">{recipeInput.length > 0 ? recipeInput.split(',').length : 0} items</p>
                   </div>

                   <Button onClick={handleCreateRecipe} fullWidth disabled={isGenerating || !recipeInput.trim()}>
                     {isGenerating ? <span className="flex items-center justify-center gap-2"><RefreshCw className="animate-spin" /> Cooking Magic...</span> : "Create Recipe"}
                   </Button>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="text-center">
                     <span className="inline-block px-3 py-1 bg-neon-green/20 text-neon-green text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
                        {generatedRecipe.type}
                     </span>
                     <h2 className="text-2xl font-black text-foreground mb-2">{generatedRecipe.title}</h2>
                     <div className="flex justify-center gap-4 text-sm text-muted">
                        <span className="flex items-center gap-1"><Clock size={14} /> {generatedRecipe.prepTime}</span>
                        <span className="flex items-center gap-1"><Flame size={14} className="text-orange-500" /> {generatedRecipe.calories} kcal</span>
                     </div>
                   </div>

                   {/* Macros */}
                   <div className="grid grid-cols-3 gap-2">
                      <div className="bg-input/50 p-2 rounded-xl text-center">
                        <span className="block text-neon-purple font-bold">{generatedRecipe.macros.protein}g</span>
                        <span className="text-[10px] text-muted uppercase">Pro</span>
                      </div>
                      <div className="bg-input/50 p-2 rounded-xl text-center">
                        <span className="block text-neon-blue font-bold">{generatedRecipe.macros.carbs}g</span>
                        <span className="text-[10px] text-muted uppercase">Carb</span>
                      </div>
                      <div className="bg-input/50 p-2 rounded-xl text-center">
                        <span className="block text-neon-green font-bold">{generatedRecipe.macros.fats}g</span>
                        <span className="text-[10px] text-muted uppercase">Fat</span>
                      </div>
                   </div>

                   <div className="space-y-4">
                     <div>
                       <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                         <Utensils size={16} className="text-neon-blue" /> Ingredients
                       </h4>
                       <ul className="space-y-2">
                         {generatedRecipe.ingredients.map((ing, i) => (
                           <li key={i} className="flex justify-between text-sm border-b border-card-border pb-1 last:border-0">
                             <span className="text-muted capitalize">{ing.name}</span>
                             <span className="font-bold text-foreground">{ing.amount}</span>
                           </li>
                         ))}
                       </ul>
                     </div>

                     <div>
                       <h4 className="font-bold text-foreground flex items-center gap-2 mb-2">
                         <Scroll size={16} className="text-neon-purple" /> Instructions
                       </h4>
                       <ol className="list-decimal pl-4 space-y-2 text-sm text-muted">
                         {generatedRecipe.instructions.map((step, i) => (
                           <li key={i} className="pl-1">{step}</li>
                         ))}
                       </ol>
                     </div>
                   </div>

                   <div className="flex gap-3">
                     <button 
                       onClick={() => {setGeneratedRecipe(null); setRecipeInput('')}}
                       className="flex-1 py-3 bg-input rounded-xl font-bold text-muted hover:text-foreground transition-colors"
                     >
                       New Recipe
                     </button>
                     <Button 
                       onClick={() => {
                         setShowRecipeCreator(false); 
                         setGeneratedRecipe(null);
                         setRecipeInput('');
                         setShowToast(true); 
                         setTimeout(() => setShowToast(false), 2000)
                       }} 
                       className="flex-1"
                     >
                       Log Meal
                     </Button>
                   </div>
                </div>
              )}
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Meal Plan Modal */}
      <AnimatePresence>
        {showAiPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-card w-full max-w-md sm:rounded-3xl rounded-t-3xl p-6 relative border-t sm:border border-card-border shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                  <Sparkles className="text-neon-purple" />
                  Smart Meal Plan
                </h3>
                <button onClick={() => {setShowAiPlan(false); setGeneratedPlan(null)}} className="p-2 bg-input rounded-full hover:bg-red-500/20 text-muted hover:text-red-500">
                  <X size={20} />
                </button>
              </div>

              {!generatedPlan ? (
                <div className="space-y-6">
                   <p className="text-muted">Let AI generate a balanced daily meal plan for you based on Pakistani foods.</p>
                   
                   <div>
                     <label className="block text-sm font-bold text-foreground mb-3">Dietary Preference</label>
                     <div className="grid grid-cols-2 gap-3">
                       {['anything', 'veg', 'non-veg', 'high-protein'].map((pref) => (
                         <button
                           key={pref}
                           onClick={() => setDietPref(pref as DietPreference)}
                           className={`p-3 rounded-xl border font-semibold text-sm capitalize ${dietPref === pref ? 'bg-neon-blue/20 border-neon-blue text-neon-blue' : 'bg-input border-card-border text-muted'}`}
                         >
                           {pref.replace('-', ' ')}
                         </button>
                       ))}
                     </div>
                   </div>

                   <Button onClick={handleGeneratePlan} fullWidth disabled={isGenerating}>
                     {isGenerating ? <span className="flex items-center justify-center gap-2"><RefreshCw className="animate-spin" /> Generating...</span> : "Generate My Plan"}
                   </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-sm text-neon-green font-bold">Total: ~{generatedPlan.totalCals} kcal</p>
                    <button onClick={handleGeneratePlan} className="text-xs flex items-center gap-1 text-neon-blue hover:underline">
                      <RefreshCw size={12} /> Regenerate
                    </button>
                  </div>

                  {[
                    { label: "Breakfast", item: generatedPlan.breakfast, color: "text-orange-400" },
                    { label: "Lunch", item: generatedPlan.lunch, color: "text-yellow-400" },
                    { label: "Snack", item: generatedPlan.snack, color: "text-blue-400" },
                    { label: "Dinner", item: generatedPlan.dinner, color: "text-purple-400" }
                  ].map((meal, idx) => (
                     <motion.div 
                       key={idx} 
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: idx * 0.1 }}
                       className="bg-input/50 p-4 rounded-xl border border-card-border flex items-center justify-between"
                     >
                       <div>
                         <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${meal.color}`}>{meal.label}</p>
                         <h4 className="font-bold text-foreground">{meal.item.name}</h4>
                         <p className="text-xs text-muted">{meal.item.serving}</p>
                       </div>
                       <div className="text-right">
                         <span className="block font-bold text-foreground">{meal.item.calories}</span>
                         <span className="text-[10px] text-muted">kcal</span>
                       </div>
                     </motion.div>
                  ))}

                  <Button onClick={() => {setShowAiPlan(false); setShowToast(true); setTimeout(() => setShowToast(false), 2000)}} fullWidth>
                    Accept & Log All
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealPlanScreen;
