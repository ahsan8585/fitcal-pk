
import React, { useState, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import InputScreen from './screens/InputScreen';
import ResultScreen from './screens/ResultScreen';
import MealPlanScreen from './screens/MealPlanScreen';
import GymScreen from './screens/GymScreen';
import ProgressScreen from './screens/ProgressScreen';
import SettingsScreen from './screens/SettingsScreen';
import AiAssistantScreen from './screens/AiAssistantScreen'; // Import
import BottomNav from './components/BottomNav';
import TutorialOverlay from './components/TutorialOverlay';
import { UserProfile, Language, Theme } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Bot, MessageCircle } from 'lucide-react';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  
  // Initialize theme from localStorage to avoid flicker
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('fitcal_theme');
      return (savedTheme as Theme) || 'dark';
    }
    return 'dark';
  });

  const [currentTab, setCurrentTab] = useState('result');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAi, setShowAi] = useState(false); // State for AI Modal

  // Load state from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('fitcal_profile');
    const savedLang = localStorage.getItem('fitcal_lang');
    const tutorialDone = localStorage.getItem('fitcal_tutorial_done');

    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    if (savedLang) setLanguage(savedLang as Language);
    
    // Show tutorial if user has a profile but hasn't seen it yet
    if (savedProfile && !tutorialDone) {
      setShowTutorial(true);
    }
  }, []);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('fitcal_lang', language);
  }, [language]);

  // Save theme preference and update document class
  useEffect(() => {
    localStorage.setItem('fitcal_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('fitcal_profile', JSON.stringify(profile));
    
    // Trigger tutorial for new users
    setShowTutorial(true);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('fitcal_tutorial_done', 'true');
  };

  const handleReset = () => {
    localStorage.removeItem('fitcal_profile');
    localStorage.removeItem('fitcal_tutorial_done');
    setUserProfile(null);
    setShowTutorial(false);
  };

  if (showSplash) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </div>
    );
  }

  // If no user profile, show onboarding flow
  if (!userProfile) {
    return (
      <div className={`${theme === 'dark' ? 'dark' : ''} bg-background min-h-screen transition-colors duration-300`}>
         <div className="relative max-w-md mx-auto h-screen overflow-hidden bg-background shadow-2xl">
           <AnimatePresence mode="wait">
              {!userProfile && (
                 <WelcomeInputFlow 
                   language={language} 
                   setLanguage={setLanguage} 
                   onComplete={handleProfileComplete} 
                 />
              )}
           </AnimatePresence>
        </div>
      </div>
    );
  }

  // Main App Interface
  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} flex justify-center bg-black min-h-screen transition-colors duration-300`}>
      <div className="w-full max-w-md h-screen bg-background relative shadow-2xl overflow-y-auto overflow-x-hidden transition-colors duration-300">
        
        {/* Tutorial Overlay */}
        <AnimatePresence>
          {showTutorial && (
            <TutorialOverlay onComplete={handleTutorialComplete} />
          )}
        </AnimatePresence>

        {/* AI Assistant Modal */}
        <AnimatePresence>
          {showAi && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 flex justify-center pointer-events-none"
            >
              <div className="w-full max-w-md h-full pointer-events-auto">
                 <AiAssistantScreen onClose={() => setShowAi(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="min-h-screen">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentTab === 'result' && <ResultScreen profile={userProfile} language={language} />}
              {currentTab === 'meal' && <MealPlanScreen language={language} />}
              {currentTab === 'gym' && <GymScreen language={language} />}
              {currentTab === 'progress' && <ProgressScreen />}
              {currentTab === 'settings' && (
                <SettingsScreen 
                  language={language} 
                  setLanguage={setLanguage} 
                  theme={theme}
                  setTheme={setTheme}
                  onReset={handleReset} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* AI Floating Action Button */}
        <div className="fixed bottom-24 right-4 z-40">
           <div className="max-w-md mx-auto relative">
             <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={() => setShowAi(true)}
               className="w-14 h-14 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_20px_rgba(188,19,254,0.5)] flex items-center justify-center text-white border-2 border-white/20 relative group"
             >
               <Bot size={28} className="group-hover:rotate-12 transition-transform" />
               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-background"></span>
             </motion.button>
           </div>
        </div>

        <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
    </div>
  );
};

// Helper component to manage Welcome -> Input transition
const WelcomeInputFlow = ({ language, setLanguage, onComplete }: any) => {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <WelcomeScreen language={language} setLanguage={setLanguage} onStart={() => setStarted(true)} />;
  }
  return <InputScreen language={language} onComplete={onComplete} />;
}

export default App;
