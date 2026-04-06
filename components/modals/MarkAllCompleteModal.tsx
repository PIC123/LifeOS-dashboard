'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { ActionComplete, NavClose, EffectSparkles, AchievementTrophy } from '@/components/ui/Icons';
import { Habit } from '@/lib/habitParser';

interface MarkAllCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  onMarkAllComplete: () => void;
}

export default function MarkAllCompleteModal({ 
  isOpen, 
  onClose, 
  habits, 
  onMarkAllComplete 
}: MarkAllCompleteModalProps) {
  const uncompletedHabits = habits.filter(h => !h.completed);
  const completedCount = habits.length - uncompletedHabits.length;
  const isAlreadyComplete = uncompletedHabits.length === 0;

  const handleMarkAllComplete = () => {
    if (isAlreadyComplete) {
      toast.success('All habits already completed! 🎉');
      onClose();
      return;
    }

    onMarkAllComplete();
    
    // Celebration toast with confetti effect
    toast.success(`🎉 Amazing! All ${habits.length} habits completed!`, {
      duration: 4000,
      style: {
        background: '#10b981',
        color: 'white',
        fontWeight: 'bold',
      }
    });
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog as={motion.div} open={isOpen} onClose={onClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full max-w-md bg-command-surface border border-command-border rounded-xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    {isAlreadyComplete ? (
                      <AchievementTrophy className="text-command-accent" size="lg" />
                    ) : (
                      <ActionComplete className="text-command-secondary animate-glow" size="lg" />
                    )}
                  </motion.div>
                  <Dialog.Title className="text-xl font-semibold text-command-text">
                    {isAlreadyComplete ? 'Already Complete!' : 'Mark All Complete'}
                  </Dialog.Title>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg text-command-muted hover:text-command-text hover:bg-command-background transition-all"
                >
                  <NavClose size="md" />
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Status Display */}
                <div className="bg-command-background/50 rounded-lg p-4 border border-command-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-command-text font-medium">Current Progress</span>
                    <div className="flex items-center gap-2">
                      <EffectSparkles 
                        className={completedCount === habits.length ? 'text-command-accent' : 'text-command-muted'} 
                        size="sm" 
                      />
                      <span className="text-command-text font-bold">
                        {completedCount}/{habits.length}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-command-border rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedCount / habits.length) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-command-secondary to-command-primary rounded-full"
                    />
                  </div>
                </div>

                {/* Habits to Complete */}
                {!isAlreadyComplete && (
                  <div>
                    <h4 className="text-sm font-medium text-command-text mb-3">
                      Habits to complete ({uncompletedHabits.length}):
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uncompletedHabits.map((habit, index) => (
                        <motion.div
                          key={habit.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-2 bg-command-background/30 rounded border border-command-border/30"
                        >
                          <ActionComplete className="text-command-muted" size="sm" />
                          <span className="text-command-text text-sm">{habit.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Celebration Message for Completed */}
                {isAlreadyComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="mb-4"
                    >
                      <EffectSparkles className="text-command-accent mx-auto" size="xl" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-command-text mb-2">
                      Perfect Day! 🎉
                    </h3>
                    <p className="text-command-muted">
                      You've completed all your habits for today. Keep up the amazing work!
                    </p>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-command-background border border-command-border text-command-muted rounded-lg hover:border-command-muted transition-all"
                  >
                    {isAlreadyComplete ? 'Close' : 'Cancel'}
                  </motion.button>
                  
                  {!isAlreadyComplete && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMarkAllComplete}
                      className="flex-1 px-4 py-3 bg-command-secondary text-white rounded-lg hover:bg-command-secondary/90 transition-all flex items-center justify-center gap-2"
                    >
                      <EffectSparkles size="sm" />
                      Complete All ({uncompletedHabits.length})
                    </motion.button>
                  )}
                </div>

                <div className="text-xs text-command-muted text-center">
                  {isAlreadyComplete 
                    ? "Come back tomorrow for new challenges!" 
                    : "This will mark all remaining habits as complete"
                  }
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}