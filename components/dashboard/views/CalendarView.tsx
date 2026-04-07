'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import { Task } from '@/types/tasks';
import { CalendarEvent } from '@/lib/googleCalendarOAuth';
import TaskItem from '@/components/Tasks/TaskItem';
import TaskQuickAdd from '@/components/Tasks/TaskQuickAdd';

interface CalendarViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  reminders: CalendarEvent[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

type CalendarViewMode = 'month' | 'week' | 'day';

export default function CalendarView({
  tasks,
  events,
  reminders,
  onAddTask,
  onUpdateTask
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get calendar data for current view
  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month's trailing days
    for (let i = startingDayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dateStr: prevDate.toISOString().split('T')[0]
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      days.push({
        date: currentDay,
        isCurrentMonth: true,
        dateStr: currentDay.toISOString().split('T')[0]
      });
    }
    
    // Next month's leading days
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let i = days.length; i < totalCells; i++) {
      const nextDate: Date = new Date(year, month, lastDay.getDate() + (i - days.length + 1));
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dateStr: nextDate.toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  const monthDays = getMonthData(currentDate);
  const today = new Date().toISOString().split('T')[0];

  // Get tasks and events for a specific date
  const getDateData = (dateStr: string) => {
    const dateTasks = tasks.filter(task => task.dueDate === dateStr);
    const dateEvents = events.filter(event => {
      try {
        return new Date(event.start).toISOString().split('T')[0] === dateStr;
      } catch {
        return false;
      }
    });
    return { tasks: dateTasks, events: dateEvents };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-mono font-bold text-command-text mb-2">
              CALENDAR.VIEW
            </h1>
            <p className="text-command-muted text-sm">
              Task timeline and event scheduling
            </p>
          </div>
          
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 text-command-muted hover:text-command-text transition-colors rounded-lg hover:bg-command-panel/20"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="px-4 py-2 bg-command-panel/20 rounded-lg">
              <div className="font-mono text-lg text-command-text">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
              </div>
            </div>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 text-command-muted hover:text-command-text transition-colors rounded-lg hover:bg-command-panel/20"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-command-panel/30 border border-command-border/30 rounded-lg p-1">
            {[
              { mode: 'month', icon: Squares2X2Icon, label: 'MONTH' },
              { mode: 'week', icon: ViewColumnsIcon, label: 'WEEK' },
              { mode: 'day', icon: ListBulletIcon, label: 'DAY' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as CalendarViewMode)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded transition-all ${
                  viewMode === mode
                    ? 'bg-command-primary/20 text-command-primary border border-command-primary/30'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-command-primary/10 border border-command-primary/30 rounded-lg text-command-primary hover:bg-command-primary/20 transition-all group"
          >
            <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="font-mono text-sm">SCHEDULE</span>
          </button>
        </div>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-command-surface/20 border border-command-border/30 rounded-lg overflow-hidden"
      >
        {/* Calendar Header */}
        <div className="grid grid-cols-7 bg-command-surface/40 border-b border-command-border/20">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="p-4 text-center border-r border-command-border/20 last:border-r-0">
              <div className="font-mono text-xs text-command-muted">{day}</div>
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7">
          {monthDays.map((day, index) => {
            const dateData = getDateData(day.dateStr);
            const isToday = day.dateStr === today;
            const hasItems = dateData.tasks.length > 0 || dateData.events.length > 0;
            
            return (
              <motion.div
                key={day.dateStr}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                onClick={() => setSelectedDate(selectedDate === day.dateStr ? null : day.dateStr)}
                className={`min-h-[120px] border-r border-b border-command-border/20 last:border-r-0 p-2 cursor-pointer transition-all hover:bg-command-panel/10 ${
                  !day.isCurrentMonth ? 'opacity-50' : ''
                } ${isToday ? 'bg-command-primary/5 border-command-primary/30' : ''} ${
                  selectedDate === day.dateStr ? 'bg-command-accent/10' : ''
                }`}
              >
                {/* Date Number */}
                <div className={`text-sm font-mono mb-2 ${
                  isToday 
                    ? 'text-command-primary font-bold' 
                    : day.isCurrentMonth 
                    ? 'text-command-text' 
                    : 'text-command-muted'
                }`}>
                  {day.date.getDate()}
                </div>

                {/* Tasks and Events */}
                <div className="space-y-1">
                  {dateData.tasks.slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      className={`text-xs p-1 rounded truncate ${
                        task.priority === 'high' 
                          ? 'bg-command-secondary/20 text-command-secondary' 
                          : task.priority === 'medium' 
                          ? 'bg-command-primary/20 text-command-primary' 
                          : 'bg-command-accent/20 text-command-accent'
                      }`}
                    >
                      {task.status === 'completed' ? '✓ ' : ''}
                      {task.title}
                    </div>
                  ))}

                  {dateData.events.slice(0, 1).map(event => (
                    <div
                      key={event.id}
                      className="text-xs p-1 bg-command-text/20 text-command-text rounded truncate"
                    >
                      📅 {event.title}
                    </div>
                  ))}

                  {/* Show more indicator */}
                  {(dateData.tasks.length > 2 || dateData.events.length > 1) && (
                    <div className="text-xs text-command-muted">
                      +{Math.max(0, dateData.tasks.length - 2) + Math.max(0, dateData.events.length - 1)} more
                    </div>
                  )}
                </div>

                {/* Today indicator */}
                {isToday && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-command-primary rounded-full animate-pulse"></div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Date Details */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-command-surface/20 border border-command-border/30 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-lg text-command-text">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }).toUpperCase()}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-command-muted hover:text-command-text"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tasks */}
              <div>
                <h4 className="font-mono text-sm text-command-accent mb-3">TASKS</h4>
                {getDateData(selectedDate).tasks.length > 0 ? (
                  <div className="space-y-2">
                    {getDateData(selectedDate).tasks.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        projects={[]}
                        onUpdate={onUpdateTask}
                        onDelete={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-command-muted">
                    <div className="font-mono text-sm">NO.TASKS</div>
                    <div className="text-xs">No tasks scheduled for this date</div>
                  </div>
                )}
              </div>

              {/* Events */}
              <div>
                <h4 className="font-mono text-sm text-command-primary mb-3">EVENTS</h4>
                {getDateData(selectedDate).events.length > 0 ? (
                  <div className="space-y-3">
                    {getDateData(selectedDate).events.map(event => (
                      <div key={event.id} className="bg-command-panel/20 border border-command-border/30 rounded-lg p-3">
                        <div className="text-sm text-command-text">{event.title}</div>
                        <div className="text-xs text-command-muted font-mono mt-1">
                          {(() => {
                            try {
                              const start = new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              const end = new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              return `${start} - ${end}`;
                            } catch {
                              return 'Time unavailable';
                            }
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-command-muted">
                    <div className="font-mono text-sm">NO.EVENTS</div>
                    <div className="text-xs">No events scheduled for this date</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <TaskQuickAdd
            projects={[]}
            onAdd={onAddTask}
            onClose={() => setShowQuickAdd(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}