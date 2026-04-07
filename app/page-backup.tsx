'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import HabitTracker from '@/components/HabitTracker';
import TodayPanel from '@/components/TodayPanel';
import ResponsiveLayout, { ResponsiveGrid } from '@/components/ui/ResponsiveLayout';
import { SystemRocket, StatusOnline, StatusCloud } from '@/components/ui/Icons';
import { mockHabitsData, type Habit } from '@/lib/habitParser';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils';
import { useMobile, useSwipe } from '@/hooks/useMobile';
import { SciFiTitle, RotatedLabel, GlowingAccent } from '@/components/ui/PretextDisplay';

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'habits' | 'today'>('main');
  const { isMobile } = useMobile();

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

  // Swipe gestures for mobile navigation
  useSwipe(
    () => {
      // Swipe left - next view
      if (currentView === 'main') setCurrentView('habits');
      else if (currentView === 'habits') setCurrentView('today');
    },
    () => {
      // Swipe right - previous view
      if (currentView === 'today') setCurrentView('habits');
      else if (currentView === 'habits') setCurrentView('main');
    }
  );

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
    <div className="min-h-screen bg-command-background text-command-text relative overflow-hidden">
      {/* Ambient Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border border-command-primary rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-command-secondary rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-command-accent rounded-full animate-pulse delay-500"></div>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#e0e6ed',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontFamily: 'mono',
          }
        }}
      />

      {/* Retro-Futuristic Header Panel */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative border-b-2 border-command-primary/30 bg-command-surface/90 backdrop-blur-xl z-10"
      >
        {/* Header Border Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-command-primary/10 via-transparent to-command-secondary/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            
            {/* Main Command Logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-8"
            >
              {/* Circular Status Display */}
              <div className="relative">
                <div className="w-16 h-16 border-2 border-command-primary/50 rounded-full flex items-center justify-center animate-pulse-ring">
                  <div className="w-8 h-8 border border-command-secondary/70 rounded-full animate-rotate">
                    <div className="w-full h-full relative">
                      <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-command-secondary transform -translate-x-0.5"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Title */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2 h-2 bg-command-primary rounded-full animate-glow-cyan"></div>
                  <h1 className="font-mono text-2xl font-bold text-command-text tracking-widest">
                    LIFEOS.COMMAND
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-px bg-command-secondary"></div>
                  <span className="font-mono text-xs text-command-secondary tracking-wider">
                    PERSONAL.MISSION.CONTROL
                  </span>
                  <div className="w-12 h-px bg-command-secondary"></div>
                </div>
              </div>
            </motion.div>
            
            {/* System Status Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-6"
            >
              {/* Status Grid */}
              <div className="grid grid-cols-2 gap-3 bg-command-panel/50 border border-command-border/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-command-primary animate-pulse rounded-full"></div>
                  <div className="text-xs">
                    <div className="text-command-muted">SYS</div>
                    <div className="text-command-primary font-mono">ONLINE</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-command-secondary animate-pulse rounded-full"></div>
                  <div className="text-xs">
                    <div className="text-command-muted">NET</div>
                    <div className="text-command-secondary font-mono">SYNC</div>
                  </div>
                </div>
              </div>

              {/* Time Display */}
              <div className="bg-command-panel/50 border border-command-border/30 rounded-lg p-3">
                <div className="text-xs text-command-muted mb-1">LOCAL.TIME</div>
                <div className="font-mono text-sm text-command-accent tracking-wider">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Dashboard */}
      <main>
        <ResponsiveLayout>
          <ResponsiveGrid>
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
          </ResponsiveGrid>
        </ResponsiveLayout>

        {/* Mobile Navigation Hint */}
        {isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mt-8"
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-command-surface/50 border border-command-border/50"
            >
              <div className="text-xs text-command-muted">👆 Swipe left/right to navigate</div>
            </motion.div>
          </motion.div>
        )}
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