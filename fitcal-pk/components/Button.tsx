import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-xl font-bold transition-all duration-300 relative overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-[0_0_15px_rgba(188,19,254,0.5)] border border-transparent hover:shadow-[0_0_25px_rgba(188,19,254,0.8)]",
    secondary: "bg-transparent border border-neon-blue text-neon-blue hover:bg-neon-blue/10",
    danger: "bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500/40"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;