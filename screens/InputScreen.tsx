
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import { UserProfile, Gender, ActivityLevel, Goal, Language, Translation } from '../types';
import { TRANSLATIONS } from '../constants';
import { calculateBMR, calculateTDEE, calculateTargetCalories } from '../utils';
import { Ruler, Weight, User, Activity as ActivityIcon, Target, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';

interface InputProps {
  onComplete: (profile: UserProfile) => void;
  language: Language;
}

const InputScreen: React.FC<InputProps> = ({ onComplete, language }) => {
  const [gender, setGender] = useState<Gender>('male');
  
  // States as strings to handle input, but we'll parse them
  const [age, setAge] = useState<string>('25');
  
  const [height, setHeight] = useState<string>('170');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  
  const [weight, setWeight] = useState<string>('70');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');

  const t = (key: keyof Translation) => TRANSLATIONS[key]?.[language] || "";

  // Handlers for Unit Toggles
  const toggleHeightUnit = () => {
    const current = parseFloat(height) || 0;
    if (heightUnit === 'cm') {
      // CM to FT
      setHeight((current * 0.0328084).toFixed(1));
      setHeightUnit('ft');
    } else {
      // FT to CM
      setHeight(Math.round(current * 30.48).toString());
      setHeightUnit('cm');
    }
  };

  const toggleWeightUnit = () => {
    const current = parseFloat(weight) || 0;
    if (weightUnit === 'kg') {
      // KG to LBS
      setWeight(Math.round(current * 2.20462).toString());
      setWeightUnit('lbs');
    } else {
      // LBS to KG
      setWeight(Math.round(current / 2.20462).toString());
      setWeightUnit('kg');
    }
  };

  const handleCalculate = () => {
    let ageNum = parseInt(age);
    let heightNum = parseFloat(height);
    let weightNum = parseFloat(weight);

    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) return;

    // Normalize to CM and KG for calculation
    if (heightUnit === 'ft') {
      heightNum = Math.round(heightNum * 30.48);
    }

    if (weightUnit === 'lbs') {
      weightNum = weightNum / 2.20462;
    }

    const bmr = calculateBMR(gender, weightNum, heightNum, ageNum);
    const tdee = calculateTDEE(bmr, activity);
    const target = calculateTargetCalories(tdee, goal);

    onComplete({
      name: 'User',
      gender,
      age: ageNum,
      height: heightNum,
      weight: weightNum,
      activityLevel: activity,
      goal,
      bmr,
      tdee,
      targetCalories: target
    });
  };

  const SliderInput = ({ 
    label, 
    value, 
    unit, 
    onValueChange, 
    onUnitToggle, 
    min, 
    max, 
    step,
    icon: Icon,
    colorClass = "text-neon-blue" 
  }: any) => {
    
    // Calculate percentage for gradient background
    const percentage = Math.min(Math.max(((parseFloat(value) - min) / (max - min)) * 100, 0), 100);
    
    const handleIncrement = () => {
      const current = parseFloat(value) || 0;
      const next = Math.min(current + step, max);
      onValueChange(next.toFixed(step < 1 ? 1 : 0));
    };

    const handleDecrement = () => {
      const current = parseFloat(value) || 0;
      const prev = Math.max(current - step, min);
      onValueChange(prev.toFixed(step < 1 ? 1 : 0));
    };

    return (
      <div className="mb-6 bg-card/50 backdrop-blur-md p-6 rounded-3xl border border-card-border shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
             <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-')}/10 border border-${colorClass.replace('text-', '')}/20`}>
                <Icon size={20} className={colorClass} />
             </div>
             <span className="font-bold text-foreground tracking-wide uppercase text-sm">{label}</span>
          </div>
          <button 
            onClick={onUnitToggle}
            className="px-3 py-1.5 rounded-lg bg-input border border-card-border text-[10px] font-bold text-muted hover:text-foreground hover:border-foreground/20 transition-all uppercase tracking-wider"
          >
            Switch to {unit === 'cm' ? 'FT' : unit === 'ft' ? 'CM' : unit === 'kg' ? 'LBS' : 'KG'}
          </button>
        </div>

        <div className="flex justify-center items-baseline gap-1 mb-8 relative">
           <input
             type="number"
             value={value}
             onChange={(e) => onValueChange(e.target.value)}
             className="bg-transparent text-6xl font-black text-center w-full focus:outline-none text-foreground border-none p-0 m-0 appearance-none z-10 relative"
             style={{ textShadow: '0 0 30px rgba(0,0,0,0.05)' }}
           />
           <span className="text-xl font-bold text-muted absolute right-8 bottom-4 pointer-events-none opacity-50">{unit}</span>
        </div>

        <div className="flex items-center gap-4 relative">
           <button 
             onClick={handleDecrement}
             className="w-12 h-12 rounded-2xl bg-input border border-card-border flex items-center justify-center text-foreground hover:bg-card-border active:scale-95 transition-all shadow-sm z-20"
           >
             <Minus size={20} />
           </button>

           <div className="flex-1 relative h-12 flex items-center justify-center">
              {/* Custom Track Background */}
              <div className="absolute w-full h-4 bg-input rounded-full overflow-hidden border border-white/5 shadow-inner">
                 <motion.div 
                   className={`h-full ${colorClass.replace('text-', 'bg-')}`} 
                   initial={{ width: 0 }}
                   animate={{ width: `${percentage}%` }}
                   transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                 />
              </div>

              {/* Ticks */}
              <div className="absolute w-[98%] flex justify-between px-1 pointer-events-none opacity-30 z-0">
                 {[0, 25, 50, 75, 100].map(i => (
                    <div key={i} className="w-0.5 h-2 bg-foreground/50 rounded-full" />
                 ))}
              </div>

              {/* Native Range Input */}
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className="w-full absolute z-30 opacity-0 cursor-pointer h-12"
              />
           </div>

           <button 
             onClick={handleIncrement}
             className="w-12 h-12 rounded-2xl bg-input border border-card-border flex items-center justify-center text-foreground hover:bg-card-border active:scale-95 transition-all shadow-sm z-20"
           >
             <Plus size={20} />
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 pt-12 pb-24">
       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
         <h2 className="text-3xl font-bold mb-2 text-foreground">Your Body</h2>
         <p className="text-muted">Enter your stats to get started</p>
       </motion.div>

       <Card className="mb-6">
         {/* Gender Selection */}
         <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setGender('male')}
              className={`flex-1 py-4 rounded-xl border-2 transition-all font-semibold flex flex-col items-center gap-2 ${gender === 'male' ? 'border-neon-blue bg-neon-blue/10 text-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.2)]' : 'border-card-border text-muted hover:bg-input'}`}
            >
              <span className="text-2xl">👨</span>
              Male
            </button>
            <button 
              onClick={() => setGender('female')}
              className={`flex-1 py-4 rounded-xl border-2 transition-all font-semibold flex flex-col items-center gap-2 ${gender === 'female' ? 'border-neon-purple bg-neon-purple/10 text-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.2)]' : 'border-card-border text-muted hover:bg-input'}`}
            >
              <span className="text-2xl">👩</span>
              Female
            </button>
         </div>

         {/* Age Input (Simple Stepper) */}
         <div className="mb-8">
            <label className="block text-muted text-sm mb-2 ml-1 font-bold uppercase tracking-wider flex items-center gap-2">
              <User size={16} /> {t('age')}
            </label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setAge((parseInt(age) - 1).toString())}
                className="w-12 h-12 rounded-xl bg-input border border-card-border flex items-center justify-center text-foreground hover:bg-card-border"
              >
                <ChevronDown />
              </button>
              <div className="flex-1 bg-input/50 rounded-xl h-12 flex items-center justify-center text-xl font-bold text-foreground border border-card-border">
                {age} <span className="text-xs text-muted ml-1">yrs</span>
              </div>
              <button 
                onClick={() => setAge((parseInt(age) + 1).toString())}
                className="w-12 h-12 rounded-xl bg-input border border-card-border flex items-center justify-center text-foreground hover:bg-card-border"
              >
                <ChevronUp />
              </button>
            </div>
         </div>

         {/* Height Slider */}
         <SliderInput
           label={t('height')}
           value={height}
           unit={heightUnit}
           onValueChange={setHeight}
           onUnitToggle={toggleHeightUnit}
           min={heightUnit === 'cm' ? 100 : 3.0}
           max={heightUnit === 'cm' ? 250 : 8.5}
           step={heightUnit === 'cm' ? 1 : 0.1}
           icon={Ruler}
           colorClass="text-neon-blue"
         />

         {/* Weight Slider */}
         <SliderInput
           label={t('weight')}
           value={weight}
           unit={weightUnit}
           onValueChange={setWeight}
           onUnitToggle={toggleWeightUnit}
           min={weightUnit === 'kg' ? 30 : 60}
           max={weightUnit === 'kg' ? 200 : 450}
           step={1}
           icon={Weight}
           colorClass="text-neon-purple"
         />
       </Card>

       <Card delay={0.1} className="mb-6">
          <label className="block text-muted text-sm mb-2 ml-1 font-bold uppercase tracking-wider">Activity Level</label>
          <div className="relative mb-6">
            <ActivityIcon className="absolute left-4 top-3.5 text-neon-green" size={20} />
            <select 
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="w-full bg-input border border-card-border rounded-xl py-3 pl-12 pr-4 text-foreground focus:outline-none focus:border-neon-green appearance-none font-medium"
            >
              <option value="sedentary">Sedentary (Little exercise)</option>
              <option value="light">Light (1-3 days/week)</option>
              <option value="moderate">Moderate (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="very_active">Very Active (Physical job)</option>
            </select>
            <ChevronDown className="absolute right-4 top-3.5 text-muted pointer-events-none" size={16} />
          </div>

          <label className="block text-muted text-sm mb-2 ml-1 font-bold uppercase tracking-wider">Goal</label>
          <div className="relative">
            <Target className="absolute left-4 top-3.5 text-red-500" size={20} />
            <select 
              value={goal}
              onChange={(e) => setGoal(e.target.value as Goal)}
              className="w-full bg-input border border-card-border rounded-xl py-3 pl-12 pr-4 text-foreground focus:outline-none focus:border-red-500 appearance-none font-medium"
            >
              <option value="lose">{t('lose')}</option>
              <option value="maintain">{t('maintenance')}</option>
              <option value="gain">{t('gain')}</option>
            </select>
            <ChevronDown className="absolute right-4 top-3.5 text-muted pointer-events-none" size={16} />
          </div>
       </Card>

       <Button onClick={handleCalculate} fullWidth className="mt-4 shadow-lg shadow-neon-blue/20">
         {t('calculate')}
       </Button>
    </div>
  );
};

export default InputScreen;
