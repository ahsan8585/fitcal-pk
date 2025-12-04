import React from 'react';
import { Home, Utensils, Dumbbell, BarChart2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'result', icon: Home, label: 'Home' },
    { id: 'meal', icon: Utensils, label: 'Food' },
    { id: 'gym', icon: Dumbbell, label: 'Gym' },
    { id: 'progress', icon: BarChart2, label: 'Stats' },
    { id: 'settings', icon: Settings, label: 'Set' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-nav-bg backdrop-blur-lg border-t border-card-border pb-safe pt-2 px-2 z-50 transition-colors duration-300">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center p-2 relative transition-colors ${isActive ? 'text-neon-blue' : 'text-muted hover:text-foreground'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 w-8 h-1 bg-neon-blue rounded-full shadow-[0_0_10px_#00f3ff]"
                />
              )}
              <tab.icon size={24} className={isActive ? 'drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]' : ''} />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;