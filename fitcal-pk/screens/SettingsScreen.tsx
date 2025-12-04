
import React from 'react';
import Card from '../components/Card';
import { Language, Theme } from '../types';
import { exportUserData } from '../utils';
import { Globe, Moon, Sun, Shield, LogOut, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsProps {
  language: Language;
  setLanguage: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  onReset: () => void;
}

const SettingsScreen: React.FC<SettingsProps> = ({ language, setLanguage, theme, setTheme, onReset }) => {
  const handleExport = () => {
    // Mock user profile retrieval for export
    const profile = JSON.parse(localStorage.getItem('fitcal_profile') || '{}');
    const history = JSON.parse(localStorage.getItem('fitcal_chat_history') || '[]');
    exportUserData(profile, history);
  };

  return (
    <div className="p-4 pt-12">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Settings</h2>

      <div className="space-y-4">
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="text-neon-blue" />
            <span className="text-foreground">Language</span>
          </div>
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hinglish' : 'en')}
            className="px-3 py-1 bg-input rounded text-sm font-bold uppercase hover:bg-card-border transition-colors text-foreground"
          >
            {language}
          </button>
        </Card>

        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
               <Moon className="text-purple-400" />
            ) : (
               <Sun className="text-orange-400" />
            )}
            <span className="text-foreground">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <button 
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
             className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center bg-input ${theme === 'dark' ? 'justify-end' : 'justify-start'}`}
          >
             <motion.div 
               layout
               transition={{ type: "spring", stiffness: 700, damping: 30 }}
               className={`w-6 h-6 rounded-full shadow-md flex items-center justify-center ${theme === 'dark' ? 'bg-neon-purple' : 'bg-orange-400'}`}
             >
                {theme === 'dark' ? (
                  <Moon size={12} className="text-white fill-current" />
                ) : (
                  <Sun size={12} className="text-white fill-current" />
                )}
             </motion.div>
          </button>
        </Card>

        <Card className="flex items-center justify-between" onClick={handleExport}>
          <div className="flex items-center gap-3">
            <Download className="text-neon-green" />
            <span className="text-foreground">Export Data (JSON)</span>
          </div>
        </Card>

        <Card className="flex items-center justify-between" onClick={() => window.alert("Privacy Policy: Data stored locally on your device.")}>
          <div className="flex items-center gap-3">
            <Shield className="text-gray-400" />
            <span className="text-foreground">Privacy Policy</span>
          </div>
        </Card>

        <button onClick={onReset} className="w-full mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all">
          <LogOut size={20} />
          <span>Reset App Data</span>
        </button>
        
        <p className="text-center text-xs text-muted mt-8">FitCal PK v2.1.0 <br/> Built by Ahsan Mirza</p>
      </div>
    </div>
  );
};

export default SettingsScreen;
