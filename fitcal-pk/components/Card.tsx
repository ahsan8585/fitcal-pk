import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', delay = 0, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-card backdrop-blur-md border border-card-border rounded-2xl shadow-xl p-5 transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;