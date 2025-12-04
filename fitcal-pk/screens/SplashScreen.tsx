import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface SplashProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-neon-purple blur-[60px] opacity-20 animate-pulse-slow rounded-full"></div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative bg-gradient-to-tr from-card to-input p-8 rounded-3xl border border-card-border shadow-2xl"
        >
          <Activity size={80} className="text-neon-green" />
        </motion.div>
      </div>
      
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple tracking-wider"
      >
        FitCal PK
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-muted text-sm font-light tracking-widest uppercase"
      >
        Powered by Ahsan Mirza
      </motion.p>
      
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="h-1 bg-gradient-to-r from-neon-green to-neon-blue mt-8 rounded-full"
      />
    </div>
  );
};

export default SplashScreen;