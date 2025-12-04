
import React, { useState } from 'react';
import { EXERCISE_DATABASE, TRANSLATIONS } from '../constants';
import { Language, Translation } from '../types';
import Card from '../components/Card';
import { Dumbbell, Clock, Flame, ChevronRight, CalendarCheck, BicepsFlexed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GymProps {
  language: Language;
}

const GymScreen: React.FC<GymProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'plan'>('library');
  const [filter, setFilter] = useState('All');
  const t = (key: keyof Translation) => TRANSLATIONS[key]?.[language] || "";

  const filters = ['All', 'Chest', 'Legs', 'Cardio', 'Abs'];
  const filteredExercises = filter === 'All' 
    ? EXERCISE_DATABASE 
    : EXERCISE_DATABASE.filter(e => e.muscleGroup === filter);

  // Simple hardcoded weekly plan
  const weeklyPlan = [
    { day: 'Mon', focus: 'Chest & Triceps', icon: '💪' },
    { day: 'Tue', focus: 'Back & Biceps', icon: '🏋️' },
    { day: 'Wed', focus: 'Rest or Cardio', icon: '🏃' },
    { day: 'Thu', focus: 'Legs & Shoulders', icon: '🦵' },
    { day: 'Fri', focus: 'Full Body', icon: '🔥' },
    { day: 'Sat', focus: 'Active Recovery', icon: '🧘' },
    { day: 'Sun', focus: 'Rest', icon: '😴' },
  ];

  return (
    <div className="p-4 pb-24 pt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {activeTab === 'library' ? t('gym_exercises') : 'Workout Planner'}
        </h2>
        
        <div className="bg-input rounded-lg p-1 flex gap-1">
           <button onClick={() => setActiveTab('library')} className={`p-2 rounded-md transition-all ${activeTab === 'library' ? 'bg-card shadow text-neon-blue' : 'text-muted'}`}>
             <Dumbbell size={20} />
           </button>
           <button onClick={() => setActiveTab('plan')} className={`p-2 rounded-md transition-all ${activeTab === 'plan' ? 'bg-card shadow text-neon-purple' : 'text-muted'}`}>
             <CalendarCheck size={20} />
           </button>
        </div>
      </div>

      {activeTab === 'library' ? (
        <>
          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  filter === f 
                    ? 'bg-neon-purple text-white shadow-[0_0_10px_rgba(188,19,254,0.4)]' 
                    : 'bg-input text-muted border border-card-border hover:bg-card-border'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <AnimatePresence mode='popLayout'>
              {filteredExercises.map((ex, index) => (
                <motion.div
                  key={ex.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-0 overflow-hidden group cursor-pointer">
                    <div className="flex">
                      <div className="w-24 bg-input flex items-center justify-center border-r border-card-border">
                         <Dumbbell className="text-muted group-hover:text-neon-purple transition-colors" size={32} />
                      </div>
                      
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-foreground">{ex.name}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded border ${
                            ex.difficulty === 'Beginner' ? 'border-green-500 text-green-500' :
                            ex.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-500' :
                            'border-red-500 text-red-500'
                          }`}>
                            {ex.difficulty}
                          </span>
                        </div>
                        
                        <p className="text-xs text-muted mb-3 line-clamp-2">{ex.description}</p>
                        
                        <div className="flex gap-3 text-xs text-muted">
                          <div className="flex items-center gap-1">
                            <Flame size={12} className="text-orange-500" />
                            <span>~{ex.caloriesBurnedPerMin * 10} cal/10min</span>
                          </div>
                          <div className="flex items-center gap-1">
                             <div className="w-2 h-2 rounded-full bg-neon-blue"></div>
                             <span>{ex.muscleGroup}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-neon-purple/20 to-blue-500/20 border-neon-purple/30 mb-6">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-neon-purple/20 rounded-full text-neon-purple">
                  <BicepsFlexed size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-foreground">Beginner Split</h3>
                   <p className="text-xs text-muted">Estimated Burn: 1500 kcal/week</p>
                </div>
             </div>
          </Card>

          {weeklyPlan.map((day, idx) => (
             <motion.div
               key={day.day}
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: idx * 0.1 }}
               className="bg-card p-4 rounded-2xl border border-card-border flex items-center justify-between"
             >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-input rounded-xl flex items-center justify-center text-2xl">
                     {day.icon}
                   </div>
                   <div>
                      <p className="text-xs font-bold text-neon-blue uppercase tracking-wider">{day.day}</p>
                      <h4 className="font-bold text-foreground">{day.focus}</h4>
                   </div>
                </div>
                <ChevronRight className="text-muted" size={20} />
             </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GymScreen;
