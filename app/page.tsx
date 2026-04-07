'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import HabitTracker from '@/components/HabitTracker';
import TodayPanel from '@/components/TodayPanel';
import CalendarView from '@/components/Calendar/CalendarView';
import { mockHabitsData, type Habit } from '@/lib/habitParser';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils';
import { useMobile, useSwipe } from '@/hooks/useMobile';
import { useCalendar } from '@/hooks/useCalendar';

export default function RetroFuturisticDashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mounted, setMounted] = useState(false);
  const { isMobile } = useMobile();
  
  // Calendar integration
  const { events, reminders, loading: calendarLoading } = useCalendar({
    timeMin: new Date(),
    timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
  });

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

  const completedCount = habits.filter(h => h.completed).length;
  const completionPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-command-background flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-command-primary text-xl font-mono"
        >
          INITIALIZING.COMMAND.CENTER...
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

      {/* Retro-Futuristic Dashboard */}
      <main className="relative p-8">
        {/* Dashboard Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
          
          {/* Main Habit Control Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-12 lg:col-span-8"
          >
            <HabitTracker 
              habits={habits} 
              onToggleHabit={toggleHabit} 
            />
          </motion.div>

          {/* Status & Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-12 lg:col-span-4 space-y-6"
          >
            <TodayPanel 
              habits={habits}
              onMarkAllComplete={() => {
                setHabits(prev => prev.map(h => ({ ...h, completed: true })));
              }}
            />
          </motion.div>

          {/* Calendar Integration Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-12"
          >
            <CalendarView 
              habits={habits}
              events={events}
              reminders={reminders}
            />
          </motion.div>

          {/* Project Status Display */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-12 lg:col-span-8 bg-command-surface/80 border-2 border-command-primary/20 rounded-lg p-6"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-command-secondary rounded-full animate-pulse"></div>
                <h2 className="font-mono text-lg text-command-text tracking-wider">ACTIVE.PROJECTS</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-command-accent rounded-full"></div>
                <span className="font-mono text-xs text-command-muted">STATUS.MONITOR</span>
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-command-panel/30 border border-command-primary/30 rounded p-4 hover:border-command-primary/60 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-command-text">LIFEOS.DASHBOARD</span>
                  <div className="text-command-primary font-mono text-sm">95%</div>
                </div>
                <div className="w-full bg-command-background/50 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-command-primary to-command-accent h-2 rounded-full" style={{width: '95%'}}></div>
                </div>
                <div className="text-xs text-command-muted font-mono">PERSONAL.COMMAND.CENTER</div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-command-panel/30 border border-command-secondary/30 rounded p-4 hover:border-command-secondary/60 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-command-text">HEALTH.ROUTINE</span>
                  <div className="text-command-secondary font-mono text-sm">67%</div>
                </div>
                <div className="w-full bg-command-background/50 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-command-secondary to-command-accent h-2 rounded-full" style={{width: '67%'}}></div>
                </div>
                <div className="text-xs text-command-muted font-mono">MORNING.OPTIMIZATION</div>
              </motion.div>
            </div>
          </motion.div>

          {/* System Monitor Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="col-span-12 lg:col-span-4 bg-command-surface/80 border-2 border-command-accent/20 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-command-accent rounded-full animate-glow-orange"></div>
              <h3 className="font-mono text-lg text-command-text tracking-wider">SYS.MONITOR</h3>
            </div>
            
            {/* Circular Progress Display */}
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-command-background rounded-full"></div>
                <div className="absolute inset-0 border-4 border-command-accent rounded-full"
                     style={{
                       background: `conic-gradient(from 0deg, #ffaa00 ${completionPercentage * 3.6}deg, transparent ${completionPercentage * 3.6}deg)`
                     }}>
                </div>
                <div className="absolute inset-2 bg-command-surface rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-mono text-lg text-command-accent">{Math.round(completionPercentage)}</div>
                    <div className="font-mono text-xs text-command-muted">%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-command-muted">TASKS.COMPLETE</span>
                <span className="text-command-primary">{completedCount}/{habits.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-command-muted">SYS.UPTIME</span>
                <span className="text-command-secondary">24:07:32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-command-muted">NET.STATUS</span>
                <span className="text-command-accent">SYNC.OK</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Navigation Hint */}
        {isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-8"
          >
            <div className="bg-command-surface/50 border border-command-border/30 rounded-lg px-4 py-2">
              <span className="font-mono text-xs text-command-muted">SWIPE.NAVIGATION.ENABLED</span>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}