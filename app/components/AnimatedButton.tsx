"use client"

import { motion } from "framer-motion";
import { Geist_Mono } from "./fonts";

type AnimatedButtonProps = {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  color?: 'black' | 'white';
  link?: string;
}

const AnimatedButton = ({ size = 'medium', text = 'Enter Sagacity', link = '/' }: AnimatedButtonProps) => {
  // Size-based classes
  const sizeClasses = {
    small: {
      padding: 'p-2',
      margin: 'm-[2px]',
      text: 'text-sm',
    },
    medium: {
      padding: 'p-4',
      margin: 'm-[2px]',
      text: 'text-xl',
    },
    large: {
      padding: 'p-6',
      margin: 'm-[2px]',
      text: 'text-2xl', 
    },
  };

  return (
    <motion.a 
      href={link} 
      className="relative overflow-hidden group"
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, #ff0080, #7928ca, #1e88e5, #43a047, #ff9800, #ff0080)",
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% center", "100% center", "0% center"],
        }}
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Infinity,
        }}
      />    
      <div 
            className={`relative p-[2px] ${sizeClasses[size].margin} transition-all duration-300 group-hover:shadow-[0_0_5px_2px_rgba(255,255,255,0.5)]`}
      >
        <div className={`bg-black  ${sizeClasses[size].padding} flex items-center justify-center space-x-3`}>
          <span className={`${Geist_Mono.className} text-white ${sizeClasses[size].text}`}>{text}</span>
        </div>
      </div>
    </motion.a>
  );
};

export default AnimatedButton; 