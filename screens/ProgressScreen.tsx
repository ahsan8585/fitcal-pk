
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Flame, Droplet, Moon, Footprints, Plus, Minus, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodayDate } from '../utils';
import { WATER_MOTIVATION, BADGES } from '../constants';

const ProgressScreen = () => {
  // Water State with persistence
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2500);
  const [streak, setStreak] = useState(0);
  
  // Notification State
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const [sleepHours, setSleepHours] = useState(7);
  const [steps, setSteps] = useState(6540);
  const [showSplash, setShowSplash] = useState(false);
  
  const weightData = [
    { day: 'Mon', weight: 70 },
    { day: 'Tue', weight: 69.8 },
    { day: 'Wed', weight: 69.5 },
    { day: 'Thu', weight: 69.9 },
    { day: 'Fri', weight: 69.4 },
    { day: 'Sat', weight: 69.2 },
    { day: 'Sun', weight: 69.0 },
  ];

  // Initialize Water Tracker & Midnight Logic
  useEffect(() => {
    const today = getTodayDate();
    const storedDate = localStorage.getItem('water_last_date');
    const storedIntake = localStorage.getItem('water_intake');
    const storedGoal = localStorage.getItem('water_goal');
    const storedStreak = localStorage.getItem('water_streak');
    
    // Restore Goal
    if (storedGoal) setWaterGoal(parseInt(storedGoal));
    if (storedStreak) setStreak(parseInt(storedStreak));

    // Check Midnight Reset
    if (storedDate !== today) {
      setWaterIntake(0);
      localStorage.setItem('water_last_date', today);
      localStorage.setItem('water_intake', '0');
      // If previous day wasn't logged, maybe break streak? (Simplified for now)
    } else {
      if (storedIntake) setWaterIntake(parseInt(storedIntake));
    }

    // Check Notifications Permission
    if ('Notification' in window && Notification.permission === 'granted') {
       setNotificationsEnabled(true);
    }
  }, []);

  // Persistence Effect
  useEffect(() => {
    localStorage.setItem('water_intake', waterIntake.toString());
    localStorage.setItem('water_goal', waterGoal.toString());
    localStorage.setItem('water_streak', streak.toString());
  }, [waterIntake, waterGoal, streak]);

  // Mock Notification Interval
  useEffect(() => {
    let interval: any;
    if (notificationsEnabled) {
      interval = setInterval(() => {
        if (Notification.permission === 'granted') {
          new Notification("Paani pe lo! 💧", {
             body: "Hydration is key for better gains!",
             icon: "https://cdn-icons-png.flaticon.com/512/3105/3105807.png"
          });
        }
      }, 7200000); // 2 hours
    }
    return () => clearInterval(interval);
  }, [notificationsEnabled]);

  const toggleNotifications = () => {
    if (!('Notification' in window)) {
      alert("This browser does not support notifications.");
      return;
    }
    if (Notification.permission === 'granted') {
       setNotificationsEnabled(!notificationsEnabled);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          new Notification("Notifications Enabled!", { body: "We'll remind you to drink water." });
        }
      });
    }
  };

  const handleAddWater = () => {
    const newIntake = Math.min(waterIntake + 250, 5000);
    setWaterIntake(newIntake);
    
    // Trigger Splash
    setShowSplash(true);
    setTimeout(() => setShowSplash(false), 800);

    // Update Streak if goal reached first time today
    if (waterIntake < waterGoal && newIntake >= waterGoal) {
      setStreak(s => s + 1);
      // Play sound or vibrate if possible (navigator.vibrate([200]))
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  };

  const progressPercentage = Math.min((waterIntake / waterGoal) * 100, 100);
  
  const getMotivationalMessage = () => {
    if (progressPercentage === 100) return WATER_MOTIVATION.done.hinglish;
    if (progressPercentage > 50) return WATER_MOTIVATION.high.hinglish;
    if (progressPercentage > 20) return WATER_MOTIVATION.mid.hinglish;
    return WATER_MOTIVATION.low.hinglish;
  };

  // Circular Progress Props
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="p-4 pb-24 pt-12">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold text-foreground">Health & Stats</h2>
         <button onClick={toggleNotifications} className="p-2 bg-input rounded-full text-muted hover:text-neon-blue transition-colors">
            {notificationsEnabled ? <Bell size={20} className="text-neon-blue" /> : <BellOff size={20} />}
         </button>
      </div>

      {/* Hero Water Tracker */}
      <Card className="mb-8 relative overflow-hidden bg-gradient-to-br from-card to-blue-900/10 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
         <div className="flex flex-col items-center justify-center py-4 relative z-10">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
              <Droplet className="text-neon-blue fill-current animate-bounce" size={20} /> Daily Hydration
            </h3>

            {/* Circular Progress */}
            <div className="relative w-48 h-48 mb-6">
               <svg height={radius * 2 * 1.5} width={radius * 2 * 1.5} className="transform -rotate-90 origin-center scale-125">
                 <circle
                   stroke="var(--input-bg)"
                   strokeWidth={stroke}
                   r={normalizedRadius}
                   cx={radius * 1.5}
                   cy={radius * 1.5}
                   fill="transparent"
                 />
                 <motion.circle
                   stroke="#00f3ff"
                   strokeWidth={stroke}
                   strokeLinecap="round"
                   strokeDasharray={circumference + ' ' + circumference}
                   initial={{ strokeDashoffset: circumference }}
                   animate={{ strokeDashoffset }}
                   transition={{ duration: 1, ease: "easeOut" }}
                   r={normalizedRadius}
                   cx={radius * 1.5}
                   cy={radius * 1.5}
                   fill="transparent"
                 />
               </svg>
               
               {/* Center Text */}
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-foreground">{waterIntake}</span>
                  <span className="text-xs text-muted font-bold uppercase tracking-widest">/ {waterGoal} ml</span>
               </div>

               {/* Splash Effect */}
               <AnimatePresence>
                 {showSplash && (
                   <motion.div 
                     initial={{ scale: 0.5, opacity: 1 }}
                     animate={{ scale: 1.5, opacity: 0 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 rounded-full border-4 border-neon-blue/50"
                   />
                 )}
               </AnimatePresence>
            </div>

            <p className="text-sm text-neon-blue font-medium mb-6 text-center italic">
              "{getMotivationalMessage()}"
            </p>

            <div className="flex gap-4 w-full px-4">
               <button 
                 onClick={() => setWaterIntake(Math.max(0, waterIntake - 250))}
                 className="p-4 rounded-2xl bg-input hover:bg-card-border text-muted transition-colors"
               >
                 <Minus size={24} />
               </button>
               
               <motion.button 
                 whileTap={{ scale: 0.95 }}
                 onClick={handleAddWater}
                 className="flex-1 bg-gradient-to-r from-neon-blue to-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 overflow-hidden relative"
               >
                 <span className="relative z-10 flex items-center gap-2">
                   <Plus size={20} /> Add Glass (250ml)
                 </span>
                 {/* Liquid BG Effect */}
                 <div className="absolute inset-0 bg-white/10 translate-y-full hover:translate-y-0 transition-transform duration-500 rounded-2xl"></div>
               </motion.button>
            </div>
         </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 p-4! flex flex-col items-center justify-center min-h-[120px]">
           <div className="p-2 bg-orange-500/20 rounded-full mb-2">
              <Flame className="text-orange-500" size={24} />
           </div>
           <h3 className="text-2xl font-black text-foreground">{streak}</h3>
           <p className="text-[10px] text-muted uppercase tracking-wider font-bold">Day Streak</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30 p-4! flex flex-col items-center justify-center min-h-[120px]">
           <div className="p-2 bg-green-500/20 rounded-full mb-2">
              <Footprints className="text-green-500" size={24} />
           </div>
           <h3 className="text-2xl font-black text-foreground">{steps}</h3>
           <p className="text-[10px] text-muted uppercase tracking-wider font-bold">Steps</p>
        </Card>
      </div>

      {/* Badges Section */}
      <div className="mb-8">
        <h3 className="font-bold mb-4 text-foreground flex items-center gap-2">
          <Award className="text-yellow-500" /> Badges & Achievements
        </h3>
        <div className="grid grid-cols-4 gap-2">
           {BADGES.map((badge, i) => (
             <motion.div 
               key={badge.id}
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className={`aspect-square rounded-2xl flex flex-col items-center justify-center border p-1 text-center cursor-pointer transition-all ${
                 badge.unlocked 
                   ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-sm' 
                   : 'bg-input border-card-border grayscale opacity-50'
               }`}
               onClick={() => alert(`${badge.name}: ${badge.description}`)}
             >
                <div className="text-2xl mb-1 drop-shadow-md">{badge.icon}</div>
                {badge.unlocked && (
                  <div className="w-2 h-2 rounded-full bg-neon-green mb-1"></div>
                )}
             </motion.div>
           ))}
        </div>
      </div>

      {/* Sleep Tracker (Mini) */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center gap-2 text-foreground">
            <Moon className="text-purple-400" size={18} />
            Sleep Monitor
          </h3>
          <span className="font-bold text-foreground">{sleepHours} hrs</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="12" 
          step="0.5" 
          value={sleepHours}
          onChange={(e) => setSleepHours(parseFloat(e.target.value))}
          className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-muted mt-2">
          <span>0h</span>
          <span className="text-purple-400 font-bold">Goal: 8h</span>
          <span>12h</span>
        </div>
      </Card>

      {/* Weight Chart */}
      <Card className="h-72 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold flex items-center gap-2 text-foreground">
            <TrendingUp size={18} className="text-neon-green" />
            Weight Log
          </h3>
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={weightData}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0aff00" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0aff00" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '8px', color: 'var(--text-color)' }}
              itemStyle={{ color: '#0aff00' }}
            />
            <Area type="monotone" dataKey="weight" stroke="#0aff00" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default ProgressScreen;
