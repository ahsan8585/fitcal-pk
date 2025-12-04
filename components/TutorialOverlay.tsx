
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { Target, Utensils, Zap, X } from 'lucide-react';

interface TutorialOverlayProps {
  onComplete: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Your Daily Goal 🎯",
      desc: "This is your calculated BMR & Calorie Target. Stick to this number to reach your weight goals!",
      icon: Target,
      position: "top-1/4", // Approximate position over the calorie card
      align: "center"
    },
    {
      title: "Explore Features 🚀",
      desc: "Use the bottom bar to find Desi Food Plans, Gym Workouts, and track your Weight Progress.",
      icon: Utensils,
      position: "bottom-24", // Just above the bottom nav
      align: "center"
    },
    {
      title: "Stay Consistent! 💪",
      desc: "Consistency is key. Start by logging your first meal or workout today. Good luck!",
      icon: Zap,
      position: "top-1/3",
      align: "center"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center">
      {/* Backdrop with hole punch effect simulation (semi-transparent dark) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleNext}
      />

      {/* Skip Button */}
      <button 
        onClick={onComplete}
        className="absolute top-10 right-6 text-white/50 hover:text-white z-[70] flex items-center gap-1 text-sm font-bold uppercase tracking-widest"
      >
        Skip <X size={16} />
      </button>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`absolute ${currentStep.position} w-11/12 max-w-sm z-[70]`}
        >
          <div className="bg-card/95 border border-neon-blue/30 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,243,255,0.15)] relative overflow-hidden">
             {/* Decorative BG */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             
             <div className="relative z-10 text-center">
               <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-full flex items-center justify-center mb-4 border border-white/10">
                 <Icon size={32} className="text-neon-blue" />
               </div>

               <h3 className="text-2xl font-bold text-foreground mb-2">{currentStep.title}</h3>
               <p className="text-muted text-sm leading-relaxed mb-6">
                 {currentStep.desc}
               </p>

               <div className="flex items-center justify-center gap-2 mb-6">
                 {steps.map((_, i) => (
                   <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-neon-blue' : 'w-2 bg-card-border'}`} 
                   />
                 ))}
               </div>

               <Button onClick={handleNext} fullWidth>
                 {step === steps.length - 1 ? "Let's Go!" : "Next"}
               </Button>
             </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TutorialOverlay;
