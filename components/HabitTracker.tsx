'use client';

import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Habit } from '@/lib/habitParser';
import { 
  ActionCompleteSolid, 
  ActionComplete
} from '@/components/ui/Icons';
import { celebrateCompletion, cn } from '@/lib/utils';
import { SciFiTitle, RotatedLabel, GlowingAccent } from '@/components/ui/PretextDisplay';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
}

export default function HabitTracker({ habits, onToggleHabit }: HabitTrackerProps) {
  const completedCount = habits.filter(h => h.completed).length;
  const completionPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  const handleToggleHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit && !habit.completed) {
      celebrateCompletion();
      toast.success(`${habit.name} ✓`, {
        duration: 1500,
      });
    }
    onToggleHabit(habitId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-command-surface/30 border border-command-border/40 rounded-lg overflow-hidden"
    >
      {/* Creative Header with Unique Text Orientation */}
      <div className="px-6 py-4 border-b border-command-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Vertical Progress Indicator with Pretext */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-1 h-6 bg-command-primary/60 rounded-full animate-glow-blue"></div>
              <RotatedLabel angle="rotate--90" glow="primary" className="text-xs" delay={0.05}>
                RUN
              </RotatedLabel>
            </div>
            
            {/* Ultra-thin Title with Pretext */}
            <div className="flex flex-col">
              <SciFiTitle className="text-base text-command-text uppercase leading-none" delay={0.1}>
                ROUTINE
              </SciFiTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-12 h-px bg-command-accent/40"></div>
                <GlowingAccent color="accent" className="text-xs uppercase" delay={0.15}>
                  EXEC
                </GlowingAccent>
              </div>
            </div>
          </div>
          
          {/* Rotated Counter with Pretext */}
          <div className="text-center">
            <SciFiTitle 
              orientation="rotate-6" 
              glow="primary" 
              className="text-lg" 
              delay={0.2}
            >
              {completedCount.toString()}
            </SciFiTitle>
            <div className="w-4 h-px bg-command-primary/40 mx-auto"></div>
            <GlowingAccent 
              color="primary" 
              orientation="rotate-3" 
              className="text-xs opacity-60" 
              delay={0.25}
            >
              {habits.length.toString()}
            </GlowingAccent>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-2 bg-command-background/20">
        <div className="relative h-1 bg-command-background/50 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-command-primary to-command-accent"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          {completionPercentage === 100 && (
            <motion.div
              className="absolute inset-0 bg-command-primary/20 animate-glow-blue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          )}
        </div>
      </div>

      {/* Habit List */}
      <div className="px-6 py-4">
        <div className="space-y-2">
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className={cn(
                "group flex items-center justify-between p-3 rounded-md transition-all duration-200 cursor-pointer",
                "hover:bg-command-surface/30 border border-transparent",
                habit.completed 
                  ? "bg-command-primary/5 border-command-primary/20" 
                  : "hover:border-command-border/40"
              )}
              onClick={() => handleToggleHabit(habit.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Checkbox */}
                <motion.div
                  className={cn(
                    "relative w-4 h-4 border rounded-sm transition-all duration-200 flex items-center justify-center",
                    habit.completed
                      ? "bg-command-primary border-command-primary"
                      : "border-command-border group-hover:border-command-primary/50"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence>
                    {habit.completed && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ActionCompleteSolid className="w-3 h-3 text-command-background" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Ultra-thin Habit Name */}
                <span className={cn(
                  "font-ultra font-thin text-sm transition-all duration-200 tracking-wide",
                  habit.completed 
                    ? "text-command-text line-through opacity-70" 
                    : "text-command-text group-hover:text-command-primary"
                )}>
                  {habit.name}
                </span>
              </div>

              {/* Status Indicator */}
              {habit.completed && (
                <motion.div
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-1 h-1 bg-command-primary rounded-full animate-pulse"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ultra-thin Completion Status */}
      {completionPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 py-3 bg-command-primary/5 border-t border-command-primary/20"
        >
          <div className="flex items-center gap-4">
            <div className="transform rotate-45">
              <div className="w-2 h-2 bg-command-accent rounded-full animate-glow-orange"></div>
            </div>
            <div className="flex flex-col">
              <GlowingAccent 
                color="accent" 
                className="text-sm uppercase leading-none" 
                delay={0.3}
              >
                **COMPLETE**
              </GlowingAccent>
              <div className="w-16 h-px bg-command-accent/40 mt-1"></div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}