
import React from 'react';
import { UserProfile, Language, Translation } from '../types';
import { TRANSLATIONS, MOTIVATIONAL_QUOTES } from '../constants';
import { calculateMacros, getQuote } from '../utils';
import Card from '../components/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Flame, Droplet, Zap, Trophy, BicepsFlexed, Info, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultProps {
  profile: UserProfile;
  language: Language;
}

const ResultScreen: React.FC<ResultProps> = ({ profile, language }) => {
  const t = (key: keyof Translation) => TRANSLATIONS[key]?.[language] || "";
  const macros = calculateMacros(profile.targetCalories);
  const quote = React.useMemo(() => getQuote(MOTIVATIONAL_QUOTES), []);

  const data = [
    { name: 'Protein', value: macros.protein, color: '#bc13fe' }, // Neon Purple
    { name: 'Carbs', value: macros.carbs, color: '#00f3ff' },   // Neon Blue
    { name: 'Fats', value: macros.fats, color: '#0aff00' },     // Neon Green
  ];

  return (
    <div className="p-4 pb-24 pt-10">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Hello, Fit Warrior! <BicepsFlexed size={24} className="text-neon-blue" />
          </h2>
          <p className="text-sm text-neon-green">{quote}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center font-bold text-white shadow-lg">
          AM
        </div>
      </motion.div>

      {/* Main Calorie Circle */}
      <Card className="mb-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-neon-blue/20 rounded-full blur-3xl"></div>
        <div className="text-center relative z-10">
          <p className="text-muted text-sm uppercase tracking-widest mb-2">{t('daily_cals')}</p>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted">
            {profile.targetCalories}
          </h1>
          <p className="text-xs text-muted mt-2">kCal / Day</p>
        </div>
      </Card>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card delay={0.1} className="text-center p-3! flex flex-col items-center">
          <div className="bg-neon-purple/20 p-2 rounded-full mb-2">
            <Zap size={20} className="text-neon-purple" />
          </div>
          <span className="text-xl font-bold text-foreground">{macros.protein}g</span>
          <span className="text-xs text-muted">{t('protein')}</span>
        </Card>
        <Card delay={0.2} className="text-center p-3! flex flex-col items-center">
          <div className="bg-neon-blue/20 p-2 rounded-full mb-2">
            <Flame size={20} className="text-neon-blue" />
          </div>
          <span className="text-xl font-bold text-foreground">{macros.carbs}g</span>
          <span className="text-xs text-muted">{t('carbs')}</span>
        </Card>
        <Card delay={0.3} className="text-center p-3! flex flex-col items-center">
          <div className="bg-neon-green/20 p-2 rounded-full mb-2">
            <Droplet size={20} className="text-neon-green" />
          </div>
          <span className="text-xl font-bold text-foreground">{macros.fats}g</span>
          <span className="text-xs text-muted">{t('fats')}</span>
        </Card>
      </div>

      {/* Chart */}
      <Card delay={0.4} className="mb-6 h-64">
        <h3 className="text-sm font-bold text-muted mb-4">Macro Breakdown</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '8px', color: 'var(--text-color)' }}
              itemStyle={{ color: 'var(--text-color)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* BMR Info */}
      <Card delay={0.5} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/20 p-3 rounded-full">
            <Trophy size={20} className="text-orange-500" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">BMR Base</h4>
            <p className="text-xs text-muted">Basal Metabolic Rate</p>
          </div>
        </div>
        <span className="text-xl font-bold text-foreground">{Math.round(profile.bmr)}</span>
      </Card>

      {/* Educational Section */}
      <Card delay={0.6} className="mt-6 bg-input/30 border-dashed">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-neon-blue/10 p-2 rounded-full mt-1 shrink-0">
             <Info className="text-neon-blue" size={16} />
          </div>
          <div>
             <h4 className="font-bold text-foreground text-sm mb-1">{t('what_is_bmr')}</h4>
             <p className="text-xs text-muted leading-relaxed">{t('bmr_explanation')}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-neon-purple/10 p-2 rounded-full mt-1 shrink-0">
             <Activity className="text-neon-purple" size={16} />
          </div>
          <div>
             <h4 className="font-bold text-foreground text-sm mb-1">{t('what_is_tdee')}</h4>
             <p className="text-xs text-muted leading-relaxed">{t('tdee_explanation')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultScreen;
    