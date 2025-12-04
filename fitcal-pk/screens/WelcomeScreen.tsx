import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Language, Translation } from '../types';
import { TRANSLATIONS } from '../constants';
import { Globe, Activity } from 'lucide-react';

interface WelcomeProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeProps> = ({ language, setLanguage, onStart }) => {
  const t = (key: keyof Translation) => TRANSLATIONS[key]?.[language] || "";

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#0f0f13]"></div>

      <div className="relative z-10 pt-10 flex justify-end">
         <button 
           onClick={() => setLanguage(language === 'en' ? 'hinglish' : 'en')}
           className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
         >
           <Globe size={16} className="text-neon-blue" />
           <span className="text-sm font-bold uppercase">{language}</span>
         </button>
      </div>

      <div className="relative z-10 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-2 inline-flex items-center gap-2 px-3 py-1 bg-neon-green/20 border border-neon-green/50 rounded-full text-neon-green text-xs font-bold tracking-widest uppercase"
        >
          <Activity size={14} />
          Pakistan's #1 Fitness App
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-extrabold leading-tight mb-4"
        >
          {language === 'en' ? 'Transform' : 'Badal Dein'} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
            {language === 'en' ? 'Your Body' : 'Apna Jism'}
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-lg mb-8 max-w-xs"
        >
          {t('welcome_subtitle')}
        </motion.p>

        <Button onClick={onStart} fullWidth className="text-lg">
          {t('start_btn')}
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;