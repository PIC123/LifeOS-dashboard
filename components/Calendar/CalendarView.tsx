'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  addMonths,
  subMonths,
  isToday,
  isSameMonth
} from 'date-fns';
import { Habit } from '@/lib/habitParser';

type ViewMode = 'agenda' | 'week' | 'month';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  type: 'event' | 'reminder' | 'habit';
  color?: string;
}

interface CalendarViewProps {
  habits?: Habit[];
  events?: CalendarEvent[];
  reminders?: CalendarEvent[];
  className?: string;
}

export default function CalendarView({ 
  habits = [], 
  events = [], 
  reminders = [],
  className = '' 
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('agenda');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Combine all calendar items
  const allItems = [
    ...events,
    ...reminders,
    // Convert habits to calendar events for today
    ...habits.map(habit => ({
      id: `habit-${habit.id}`,
      title: habit.name,
      start: new Date(),
      end: new Date(),
      type: 'habit' as const,
      color: habit.completed ? '#00ffff' : '#ff6b35'
    }))
  ];

  const ViewToggle = () => (
    <div className="flex bg-command-panel/30 border border-command-border/30 rounded-lg p-1">
      {(['agenda', 'week', 'month'] as ViewMode[]).map((mode) => (
        <motion.button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`px-4 py-2 font-mono text-xs tracking-wider uppercase transition-all ${
            viewMode === mode
              ? 'bg-command-primary text-command-background'
              : 'text-command-muted hover:text-command-text'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {mode}
        </motion.button>
      ))}
    </div>
  );

  const AgendaView = () => {
    const todayItems = allItems.filter(item => 
      isSameDay(item.start, selectedDate)
    );

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-lg text-command-text tracking-wider">
            AGENDA.{format(selectedDate, 'MMM.dd').toUpperCase()}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 86400000))}
              className="w-8 h-8 border border-command-border/30 rounded flex items-center justify-center hover:border-command-primary/50 transition-all"
            >
              <span className="text-command-muted">←</span>
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 font-mono text-xs text-command-accent border border-command-accent/30 rounded hover:bg-command-accent/10 transition-all"
            >
              TODAY
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 86400000))}
              className="w-8 h-8 border border-command-border/30 rounded flex items-center justify-center hover:border-command-primary/50 transition-all"
            >
              <span className="text-command-muted">→</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {todayItems.length === 0 ? (
            <div className="text-center py-8 text-command-muted font-mono text-sm">
              NO.SCHEDULED.ITEMS
            </div>
          ) : (
            todayItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-command-panel/20 border border-command-border/20 rounded p-3 hover:border-command-primary/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color || '#00ffff' }}
                  />
                  <div className="flex-1">
                    <div className="font-mono text-sm text-command-text">
                      {item.title}
                    </div>
                    <div className="font-mono text-xs text-command-muted">
                      {format(item.start, 'HH:mm')} • {item.type.toUpperCase()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  };

  const WeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-lg text-command-text tracking-wider">
            WEEK.{format(weekStart, 'MMM.dd')}.{format(weekEnd, 'dd').toUpperCase()}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="w-8 h-8 border border-command-border/30 rounded flex items-center justify-center hover:border-command-primary/50 transition-all"
            >
              <span className="text-command-muted">←</span>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 font-mono text-xs text-command-accent border border-command-accent/30 rounded hover:bg-command-accent/10 transition-all"
            >
              THIS.WEEK
            </button>
            <button
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
              className="w-8 h-8 border border-command-border/30 rounded flex items-center justify-center hover:border-command-primary/50 transition-all"
            >
              <span className="text-command-muted">→</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayItems = allItems.filter(item => isSameDay(item.start, day));
            const isCurrentDay = isToday(day);
            
            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`min-h-24 border border-command-border/20 rounded p-2 ${
                  isCurrentDay 
                    ? 'bg-command-primary/10 border-command-primary/30' 
                    : 'bg-command-panel/10 hover:bg-command-panel/20'
                } transition-all cursor-pointer`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`font-mono text-xs mb-1 ${
                  isCurrentDay ? 'text-command-primary' : 'text-command-muted'
                }`}>
                  {format(day, 'EEE').toUpperCase()}
                </div>
                <div className={`font-mono text-sm mb-2 ${
                  isCurrentDay ? 'text-command-primary font-bold' : 'text-command-text'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="w-full h-1 rounded"
                      style={{ backgroundColor: item.color || '#00ffff' }}
                    />
                  ))}
                  {dayItems.length > 3 && (
                    <div className="font-mono text-xs text-command-muted">
                      +{dayItems.length - 3}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const MonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const weeks = eachWeekOfInterval(
      { start: monthStart, end: monthEnd },
      { weekStartsOn: 1 }
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-lg text-command-text tracking-wider">
            {format(currentDate, 'MMMM.yyyy').toUpperCase()}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="w-8 h-8 border border-command-border/30 rounded flex items-center justify-center hover:border-command-primary/50 transition-all"
            >
              <span className="text-command-muted">←</span>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 font-mono text-xs text-command-accent border border-command-accent/30 rounded hover:bg-command-accent/10 transition-all"
            >
              THIS.MONTH
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="w-8 h-8 border border-command-border/30 rounded flex items-center justify-center hover:border-command-primary/50 transition-all"
            >
              <span className="text-command-muted">→</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="p-2 text-center">
              <span className="font-mono text-xs text-command-muted tracking-wider">
                {day.toUpperCase()}
              </span>
            </div>
          ))}
          
          {weeks.map((weekStart, weekIndex) => {
            const days = eachDayOfInterval({
              start: weekStart,
              end: endOfWeek(weekStart, { weekStartsOn: 1 })
            });
            
            return days.map((day, dayIndex) => {
              const dayItems = allItems.filter(item => isSameDay(item.start, day));
              const isCurrentDay = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                  className={`h-16 border border-command-border/10 p-1 ${
                    isCurrentDay
                      ? 'bg-command-primary/10 border-command-primary/30'
                      : isCurrentMonth 
                      ? 'bg-command-panel/5 hover:bg-command-panel/10'
                      : 'bg-command-background/50 opacity-50'
                  } transition-all cursor-pointer`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className={`font-mono text-xs ${
                    isCurrentDay 
                      ? 'text-command-primary font-bold' 
                      : isCurrentMonth 
                      ? 'text-command-text' 
                      : 'text-command-muted'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {dayItems.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: item.color || '#00ffff' }}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            });
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-command-surface/80 border-2 border-command-secondary/20 rounded-lg p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-command-secondary rounded-full animate-pulse"></div>
          <h2 className="font-mono text-lg text-command-text tracking-wider">
            CALENDAR.SYSTEM
          </h2>
        </div>
        <ViewToggle />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'agenda' && <AgendaView />}
          {viewMode === 'week' && <WeekView />}
          {viewMode === 'month' && <MonthView />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}