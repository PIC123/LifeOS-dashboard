'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatTime, formatDate, getTimeOfDay } from '@/lib/utils';

interface LiveClockProps {
  className?: string;
  showSeconds?: boolean;
  showDate?: boolean;
}

export default function LiveClock({ 
  className = '', 
  showSeconds = true, 
  showDate = true 
}: LiveClockProps) {
  const [time, setTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-12 bg-command-surface rounded mb-2" />
        {showDate && <div className="h-6 bg-command-surface rounded" />}
      </div>
    );
  }

  const timeOfDay = getTimeOfDay();
  const timeString = formatTime(time);
  const dateString = formatDate(time);

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌇';
      case 'night': return '🌙';
      default: return '⏰';
    }
  };

  return (
    <motion.div 
      className={`${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'smooth' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <motion.span 
          className="text-2xl"
          key={timeOfDay}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getTimeIcon()}
        </motion.span>
        <div className="font-mono font-bold text-command-primary">
          <motion.span
            key={timeString}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-4xl tracking-wider"
          >
            {showSeconds ? timeString : timeString.slice(0, -3)}
          </motion.span>
        </div>
      </div>

      {showDate && (
        <motion.div 
          className="text-command-muted text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {dateString}
        </motion.div>
      )}

      <motion.div 
        className="mt-2 text-sm text-command-muted capitalize"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        Good {timeOfDay}
      </motion.div>
    </motion.div>
  );
}