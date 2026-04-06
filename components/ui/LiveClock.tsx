'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LiveClockProps {
  className?: string;
  showSeconds?: boolean;
  showDate?: boolean;
}

export default function LiveClock({ 
  className = '', 
  showSeconds = false, 
  showDate = false 
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
      <div className={`${className}`}>
        <div className="h-4 w-16 bg-command-surface/20 rounded animate-pulse" />
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return {
      time: date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }),
      seconds: date.toLocaleTimeString('en-US', { 
        hour12: false,
        second: '2-digit'
      }).split(':')[2],
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit' 
      }).replace(' ', '.').toUpperCase()
    };
  };

  const { time: timeStr, seconds, date } = formatTime(time);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 ${className}`}
    >
      <div className="flex items-center gap-1 font-mono text-xs">
        <motion.span
          key={timeStr}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="text-command-primary tracking-wider"
        >
          {timeStr}
        </motion.span>
        {showSeconds && (
          <motion.span
            key={seconds}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.7 }}
            className="text-command-muted text-xs"
          >
            {seconds}
          </motion.span>
        )}
      </div>
      {showDate && (
        <>
          <div className="w-px h-3 bg-command-border opacity-50"></div>
          <span className="font-mono text-xs text-command-muted tracking-wide">
            {date}
          </span>
        </>
      )}
    </motion.div>
  );
}