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
    <div className="min-h-screen bg-command-background text-command-text font-sans">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#2a2a2a',
            color: '#ffffff',
            border: '1px solid #3a3a3a',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            fontFamily: 'mono',
          }
        }}
      />

      {/* Minimalist Sci-Fi Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="border-b border-command-border/20 bg-command-background/95 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Creative Logo Section */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="flex items-center gap-8"
            >
              {/* Vertical Text */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-1 h-8 bg-command-primary/80 rounded-full animate-glow-blue"></div>
                  <div className="w-1 h-6 bg-command-accent/80 rounded-full animate-glow-orange"></div>
                  <div className="w-1 h-4 bg-command-text/60 rounded-full animate-pulse"></div>
                </div>
                <RotatedLabel angle="rotate--90" glow="primary" delay={0.05}>
                  SYS
                </RotatedLabel>
              </div>

              {/* Main Title - Ultra Thin & Tall with Pretext */}
              <div className="flex flex-col">
                <SciFiTitle className="text-lg text-command-text uppercase leading-none" delay={0.1}>
                  LIFEOS
                </SciFiTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-px bg-command-primary/40"></div>
                  <GlowingAccent color="accent" className="text-xs uppercase" delay={0.15}>
                    COMMAND
                  </GlowingAccent>
                </div>
              </div>
            </motion.div>
            
            {/* Rotated Status Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-8"
            >
              {/* Status Grid with Pretext */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-command-primary rounded-full animate-pulse" />
                    <RotatedLabel angle="normal" className="text-command-muted text-xs" delay={0.2}>
                      SYS
                    </RotatedLabel>
                  </div>
                  <GlowingAccent color="primary" className="text-xs" delay={0.25}>
                    ONLINE
                  </GlowingAccent>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-command-accent rounded-full animate-pulse" />
                    <RotatedLabel angle="normal" className="text-command-muted text-xs" delay={0.3}>
                      NET
                    </RotatedLabel>
                  </div>
                  <GlowingAccent color="accent" className="text-xs" delay={0.35}>
                    SYNC
                  </GlowingAccent>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="h-8 w-px bg-command-border/30"></div>

              {/* Rotated Time with Pretext */}
              <SciFiTitle 
                orientation="rotate-12" 
                glow="primary" 
                className="text-sm" 
                delay={0.4}
              >
                {new Date().toLocaleTimeString('en-US', { 
                  hour12: false, 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </SciFiTitle>
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