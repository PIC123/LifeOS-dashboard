'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import HabitTracker from '@/components/HabitTracker';
import TodayPanel from '@/components/TodayPanel';
import { SystemRocket, StatusOnline, StatusCloud } from '@/components/ui/Icons';
import { mockHabitsData, type Habit } from '@/lib/habitParser';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils';

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load habits from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedHabits = loadFromLocalStorage('lifeos-habits', mockHabitsData.habits);
    setHabits(savedHabits);
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    if (mounted && habits.length > 0) {
      saveToLocalStorage('lifeos-habits', habits);
    }
  }, [habits, mounted]);

  const toggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-command-background flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-command-primary text-xl"
        >
          Initializing Command Center...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-command-background text-command-text font-sans">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e3f',
            color: '#e2e8f0',
            border: '1px solid #374151',
          }
        }}
      />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b border-command-border bg-command-surface/50 backdrop-blur-sm p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-1">
                <SystemRocket className="text-command-primary animate-glow" size="lg" />
                <h1 className="text-3xl font-bold text-command-text">
                  LifeOS Command Center
                </h1>
              </div>
              <p className="text-command-muted">
                Personal mission control • v2.0.0-pro
              </p>
            </motion.div>
            
            {/* Status Indicators */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-command-secondary rounded-full"
                />
                <StatusOnline className="text-command-secondary" size="sm" />
                <span className="text-sm text-command-muted font-medium">ONLINE</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-command-primary rounded-full" />
                <StatusCloud className="text-command-primary" size="sm" />
                <span className="text-sm text-command-muted font-medium">SYNC OK</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column - Main Habit Tracking */}
          <div className="lg:col-span-2 space-y-6">
            <HabitTracker 
              habits={habits} 
              onToggleHabit={toggleHabit} 
            />
            
            {/* Project Status Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-command-surface/80 backdrop-blur-sm border border-command-border rounded-xl p-6 hover:bg-command-surface transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-command-text mb-4 flex items-center gap-2">
                <SystemRocket size="md" className="text-command-accent" />
                Active Projects
              </h2>
              <div className="space-y-3">
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center justify-between p-4 bg-command-background/50 rounded-lg border border-command-border/50 hover:border-command-primary/30 transition-all"
                >
                  <div>
                    <div className="text-command-text font-medium">LifeOS Dashboard Pro</div>
                    <div className="text-sm text-command-muted">Professional command center implementation</div>
                  </div>
                  <div className="text-command-secondary font-bold text-lg">95%</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center justify-between p-4 bg-command-background/50 rounded-lg border border-command-border/50 hover:border-command-accent/30 transition-all"
                >
                  <div>
                    <div className="text-command-text font-medium">Morning Routine Optimization</div>
                    <div className="text-sm text-command-muted">Habit tracking and analytics</div>
                  </div>
                  <div className="text-command-accent font-bold text-lg">78%</div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Today Panel & Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <TodayPanel 
              habits={habits}
              onMarkAllComplete={() => {
                setHabits(prev => prev.map(h => ({ ...h, completed: true })));
              }}
            />
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="border-t border-command-border bg-command-surface/30 backdrop-blur-sm p-4 mt-12"
      >
        <div className="max-w-7xl mx-auto text-center text-command-muted text-sm">
          LifeOS Command Center • Powered by AI & Coffee • {new Date().getFullYear()}
        </div>
      </motion.footer>
    </div>
  );
}