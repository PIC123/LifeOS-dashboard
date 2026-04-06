'use client';

import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Habit } from '@/lib/habitParser';
import { 
  ActionCompleteSolid, 
  ActionComplete, 
  AchievementStreak, 
  AchievementTrophy, 
  EffectSparkles,
  TimeDay
} from '@/components/ui/Icons';
import { celebrateCompletion, cn } from '@/lib/utils';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
}

export default function HabitTracker({ habits, onToggleHabit }: HabitTrackerProps) {
  const completedCount = habits.filter(h => h.completed).length;
  const completionPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
  const isFullyComplete = completionPercentage === 100;

  const handleToggleHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit && !habit.completed) {
      celebrateCompletion();
      toast.success(`${habit.name} completed! 🎉`, {
        duration: 2000,
      });
    }
    onToggleHabit(habitId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "bg-command-surface/80 backdrop-blur-sm border border-command-border rounded-xl p-6 transition-all duration-300",
        isFullyComplete && "animate-glow"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TimeDay className="text-command-secondary animate-pulse" />
          <h2 className="text-xl font-semibold text-command-text">Morning Routine</h2>
        </div>
        <div className="text-right">
          <motion.div 
            key={completedCount}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-command-secondary"
          >
            {completedCount}/{habits.length}
          </motion.div>
          <div className="text-sm text-command-muted">
            {completionPercentage.toFixed(0)}% Complete
          </div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center mb-6">
        <motion.div 
          className="relative w-28 h-28"
          whileHover={{ scale: 1.05 }}
        >
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#374151"
              strokeWidth="6"
              fill="none"
              className="opacity-30"
            />
            {/* Progress ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={282.7}
              strokeDashoffset={282.7 - (completionPercentage * 2.827)}
              className="transition-all duration-700 ease-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              key={completionPercentage}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xl font-bold text-command-secondary"
            >
              {completionPercentage.toFixed(0)}%
            </motion.span>
          </div>
          {isFullyComplete && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2"
            >
              <EffectSparkles className="text-command-accent animate-pulse" size="lg" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Habit List */}
      <div className="space-y-3">
        <AnimatePresence>
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 cursor-pointer group border",
                habit.completed 
                  ? "bg-command-secondary/10 border-command-secondary/30 hover:bg-command-secondary/15" 
                  : "bg-command-background/50 border-command-border/50 hover:border-command-primary/30 hover:bg-command-surface/30"
              )}
              onClick={() => handleToggleHabit(habit.id)}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Checkbox */}
              <motion.div 
                className={cn(
                  "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
                  habit.completed 
                    ? 'bg-command-secondary border-command-secondary shadow-lg' 
                    : 'border-command-border group-hover:border-command-primary'
                )}
                whileTap={{ scale: 0.9 }}
              >
                {habit.completed ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <ActionCompleteSolid className="text-white" size="md" />
                  </motion.div>
                ) : (
                  <ActionComplete className="text-command-muted group-hover:text-command-primary opacity-0 group-hover:opacity-100 transition-opacity" size="sm" />
                )}
              </motion.div>

              {/* Habit Details */}
              <div className="flex-1">
                <div className={cn(
                  "font-medium text-lg transition-all duration-200",
                  habit.completed 
                    ? 'text-command-secondary' 
                    : 'text-command-text group-hover:text-command-primary'
                )}>
                  {habit.name}
                </div>
                <div className="text-sm text-command-muted">
                  Target: {habit.target}
                </div>
                {habit.description && (
                  <div className="text-xs text-command-muted/80 mt-1">
                    {habit.description}
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <motion.div 
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200",
                  habit.completed ? 'bg-command-secondary animate-pulse' : 'bg-command-muted/50'
                )}
                animate={{ scale: habit.completed ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5, repeat: habit.completed ? 1 : 0 }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 pt-4 border-t border-command-border"
      >
        <div className="grid grid-cols-3 gap-6 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-command-primary/10 border border-command-primary/20"
          >
            <AchievementStreak className="mx-auto mb-2 text-command-primary" size="lg" />
            <div className="text-lg font-bold text-command-primary">7</div>
            <div className="text-xs text-command-muted">Day Streak</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-command-accent/10 border border-command-accent/20"
          >
            <AchievementTrophy className="mx-auto mb-2 text-command-accent" size="lg" />
            <div className="text-lg font-bold text-command-accent">21</div>
            <div className="text-xs text-command-muted">Best Streak</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-command-secondary/10 border border-command-secondary/20"
          >
            <EffectSparkles className="mx-auto mb-2 text-command-secondary" size="lg" />
            <div className="text-lg font-bold text-command-secondary">85%</div>
            <div className="text-xs text-command-muted">Weekly Rate</div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}