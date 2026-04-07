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
      className="bg-command-surface/80 border-2 border-command-primary/20 rounded-lg overflow-hidden"
    >
      {/* Retro Header Panel */}
      <div className="px-6 py-4 border-b-2 border-command-primary/20 bg-gradient-to-r from-command-primary/5 to-command-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Circular Status Indicator */}
            <div className="relative">
              <div className="w-8 h-8 border-2 border-command-primary/50 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-command-primary rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Panel Title */}
            <div className="flex flex-col">
              <h2 className="font-mono text-lg text-command-text tracking-wider">
                ROUTINE.EXEC
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-10 h-px bg-command-secondary/40"></div>
                <span className="font-mono text-xs text-command-secondary tracking-wide">
                  DAILY.PROTOCOL
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Display */}
          <div className="bg-command-panel/40 border border-command-border/30 rounded px-3 py-2">
            <div className="text-center">
              <div className="font-mono text-lg text-command-primary">
                {completedCount}/{habits.length}
              </div>
              <div className="font-mono text-xs text-command-muted">COMPLETE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Retro Progress Display */}
      <div className="px-6 py-3 bg-command-background/30">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-command-muted min-w-fit">PROGRESS</span>
          <div className="flex-1 relative">
            <div className="h-2 bg-command-background/50 rounded border border-command-border/30 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-command-primary via-command-secondary to-command-accent"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            {completionPercentage === 100 && (
              <motion.div
                className="absolute -inset-1 border border-command-accent/50 rounded animate-glow-orange"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
            )}
          </div>
          <span className="font-mono text-xs text-command-primary min-w-fit">
            {Math.round(completionPercentage)}%
          </span>
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
                "group flex items-center justify-between p-4 transition-all duration-200 cursor-pointer",
                "bg-command-panel/20 border border-command-border/20 hover:border-command-primary/40",
                habit.completed 
                  ? "bg-command-primary/10 border-command-primary/30 shadow-lg shadow-command-primary/10" 
                  : "hover:bg-command-panel/30"
              )}
              onClick={() => handleToggleHabit(habit.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Retro Checkbox */}
                <motion.div
                  className={cn(
                    "relative w-5 h-5 border-2 transition-all duration-200 flex items-center justify-center",
                    habit.completed
                      ? "bg-command-primary border-command-primary shadow-lg shadow-command-primary/30"
                      : "border-command-border/50 group-hover:border-command-primary/60"
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

                {/* Retro Habit Name */}
                <span className={cn(
                  "font-mono text-sm transition-all duration-200 tracking-wide",
                  habit.completed 
                    ? "text-command-text line-through opacity-70" 
                    : "text-command-text group-hover:text-command-primary"
                )}>
                  {habit.name.toUpperCase().replace(/\s/g, '.')}
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

      {/* Clean Completion Status */}
      {completionPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 py-3 bg-command-primary/5 border-t border-command-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-command-accent rounded-full animate-pulse"></div>
            <span className="font-ultra font-ultra-thin text-sm text-command-accent tracking-super-wide uppercase">
              COMPLETE
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}