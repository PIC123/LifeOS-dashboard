'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/tasks';
import { CalendarEvent } from '@/lib/googleCalendarOAuth';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, addMonths, subMonths, startOfMonth, endOfMonth, isSameDay, isToday, isPast, isFuture } from 'date-fns';
import { safeDateString, safeToDate, normalizeCalendarEvent, isValidCalendarEvent, safeFormatTime } from '@/lib/dateUtils';
import TaskQuickAdd from '../Tasks/TaskQuickAdd';

interface CalendarIntegrationProps {
  tasks: Task[];
  events: CalendarEvent[];
  reminders: CalendarEvent[];
  viewMode?: 'calendar' | 'week' | 'month';
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

interface CalendarDay {
  date: Date;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  tasks: Task[];
  events: CalendarEvent[];
  hasItems: boolean;
}

export default function CalendarIntegration({ 
  tasks, 
  events, 
  reminders, 
  viewMode = 'calendar',
  onAddTask, 
  onUpdateTask 
}: CalendarIntegrationProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showOAuthSetup, setShowOAuthSetup] = useState(false);

  const calendarDays = useMemo(() => {
    let start: Date, end: Date;

    if (viewMode === 'week') {
      start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
      end = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else {
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
      // Extend to show full weeks
      start = startOfWeek(start, { weekStartsOn: 1 });
      end = endOfWeek(end, { weekStartsOn: 1 });
    }

    const days = eachDayOfInterval({ start, end });

    return days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const dayTasks = tasks.filter(task => task.dueDate === dateStr);
      const dayEvents = events.filter(event => {
        // Use safe date utilities to handle date conversion
        if (!isValidCalendarEvent(event)) {
          console.warn('Invalid calendar event:', event);
          return false;
        }
        const eventDateStr = safeDateString(event.start);
        return eventDateStr === dateStr;
      });

      return {
        date,
        isToday: isToday(date),
        isPast: isPast(date) && !isToday(date),
        isFuture: isFuture(date),
        tasks: dayTasks,
        events: dayEvents,
        hasItems: dayTasks.length > 0 || dayEvents.length > 0
      } as CalendarDay;
    });
  }, [currentDate, tasks, events, viewMode]);

  const navigate = (direction: 'prev' | 'next') => {
    if (viewMode === 'week') {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    }
  };

  const todayTasks = tasks.filter(task => 
    task.dueDate === new Date().toISOString().split('T')[0] && 
    task.status !== 'completed'
  );

  const upcomingEvents = events.filter(event => {
    const eventStartDate = safeToDate(event.start);
    if (!eventStartDate) {
      console.warn('Invalid start date in event:', event);
      return false;
    }
    const eventStart = eventStartDate.getTime();
    const now = new Date().getTime();
    const nextDay = now + 24 * 60 * 60 * 1000;
    return eventStart >= now && eventStart <= nextDay;
  }).slice(0, 3);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-lg text-command-text tracking-wider">
            CALENDAR.INTEGRATION
          </h2>
          
          {/* OAuth Status */}
          <div className="flex items-center gap-2">
            {events.length === 0 ? (
              <button
                onClick={() => setShowOAuthSetup(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-command-secondary border border-command-secondary/30 rounded hover:bg-command-secondary/10 transition-colors"
              >
                <Cog6ToothIcon className="w-3 h-3" />
                SETUP.OAUTH
              </button>
            ) : (
              <div className="flex items-center gap-1 text-xs font-mono text-command-primary">
                <div className="w-2 h-2 bg-command-primary rounded-full animate-pulse"></div>
                CALENDAR.SYNCED
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('prev')}
              className="p-1 text-command-muted hover:text-command-text transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="font-mono text-sm text-command-text min-w-0 text-center px-4">
              {viewMode === 'week' 
                ? `WEEK ${format(currentDate, 'MMM dd, yyyy')}`
                : format(currentDate, 'MMMM yyyy').toUpperCase()
              }
            </div>
            
            <button
              onClick={() => navigate('next')}
              className="p-1 text-command-muted hover:text-command-text transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center gap-2 px-3 py-2 bg-command-primary/10 border border-command-primary/30 rounded-lg text-command-primary hover:bg-command-primary/20 transition-all group"
          >
            <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="text-xs font-mono">ADD.TASK</span>
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <div className="bg-command-surface/30 border border-command-border/30 rounded-lg p-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                <div key={day} className="text-xs font-mono text-command-muted text-center py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              <AnimatePresence mode="wait">
                {calendarDays.map((day, index) => (
                  <motion.div
                    key={day.date.toISOString()}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.01 }}
                    onClick={() => setSelectedDate(day.date)}
                    className={`
                      relative p-2 min-h-24 border rounded cursor-pointer transition-all hover:scale-105
                      ${day.isToday 
                        ? 'border-command-primary bg-command-primary/10' 
                        : day.hasItems 
                        ? 'border-command-accent/30 bg-command-accent/5'
                        : 'border-command-border/20 hover:border-command-border/40 hover:bg-command-panel/10'
                      }
                      ${day.isPast ? 'opacity-60' : ''}
                      ${selectedDate && isSameDay(day.date, selectedDate) ? 'ring-1 ring-command-primary/50' : ''}
                    `}
                  >
                    {/* Day Number */}
                    <div className={`text-xs font-mono mb-1 ${
                      day.isToday ? 'text-command-primary font-bold' : 'text-command-text'
                    }`}>
                      {format(day.date, 'd')}
                    </div>

                    {/* Tasks & Events Indicators */}
                    <div className="space-y-1">
                      {day.tasks.slice(0, 2).map(task => (
                        <div
                          key={task.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
                            task.status === 'completed'
                              ? 'bg-command-muted/20 text-command-muted line-through'
                              : task.priority === 'high'
                              ? 'bg-command-secondary/20 text-command-secondary'
                              : 'bg-command-primary/20 text-command-primary'
                          }`}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      
                      {day.events.slice(0, 1).map(event => (
                        <div
                          key={event.id}
                          className="text-xs px-1 py-0.5 bg-command-accent/20 text-command-accent rounded truncate"
                          title={event.title}
                        >
                          📅 {event.title}
                        </div>
                      ))}

                      {/* More items indicator */}
                      {(day.tasks.length + day.events.length) > 3 && (
                        <div className="text-xs text-command-muted">
                          +{(day.tasks.length + day.events.length) - 3} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Today's Focus */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-command-surface/50 border border-command-primary/20 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <ClockIcon className="w-4 h-4 text-command-primary" />
              <h3 className="font-mono text-sm text-command-primary tracking-wider">TODAY.FOCUS</h3>
            </div>
            
            <div className="space-y-2">
              {todayTasks.length > 0 ? (
                todayTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => onUpdateTask(task.id, {
                        status: task.status === 'completed' ? 'active' : 'completed',
                        completedAt: task.status === 'completed' ? undefined : new Date().toISOString()
                      })}
                      className="w-3 h-3 text-command-primary"
                    />
                    <span className={`text-xs ${
                      task.status === 'completed' 
                        ? 'text-command-muted line-through' 
                        : 'text-command-text'
                    }`}>
                      {task.title}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-command-muted">No tasks for today</div>
              )}
              
              {todayTasks.length > 3 && (
                <div className="text-xs text-command-muted">
                  +{todayTasks.length - 3} more tasks
                </div>
              )}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-command-surface/50 border border-command-accent/20 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-4 h-4 text-command-accent" />
                <h3 className="font-mono text-sm text-command-accent tracking-wider">UPCOMING</h3>
              </div>
              
              <div className="space-y-2">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="text-xs">
                    <div className="text-command-text">{event.title}</div>
                    <div className="text-command-muted font-mono">
                      {(() => {
                        const startTime = safeFormatTime(event.start, { hour: '2-digit', minute: '2-digit', hour12: false });
                        const endTime = safeFormatTime(event.end, { hour: '2-digit', minute: '2-digit', hour12: false });
                        return startTime && endTime ? `${startTime} - ${endTime}` : 'Invalid time';
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Selected Day Details */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-command-surface/50 border border-command-border/30 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-command-text rounded-full"></div>
                <h3 className="font-mono text-sm text-command-text tracking-wider">
                  {format(selectedDate, 'MMM dd').toUpperCase()}
                </h3>
              </div>
              
              {(() => {
                const selectedDay = calendarDays.find(day => isSameDay(day.date, selectedDate));
                if (!selectedDay || (!selectedDay.tasks.length && !selectedDay.events.length)) {
                  return <div className="text-xs text-command-muted">No items this day</div>;
                }
                
                return (
                  <div className="space-y-2">
                    {selectedDay.tasks.map(task => (
                      <div key={task.id} className="text-xs">
                        <div className={`text-command-text ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </div>
                        {task.dueTime && (
                          <div className="text-command-muted font-mono">{task.dueTime}</div>
                        )}
                      </div>
                    ))}
                    {selectedDay.events.map(event => (
                      <div key={event.id} className="text-xs">
                        <div className="text-command-accent">{event.title}</div>
                        <div className="text-command-muted font-mono">
                          {(() => {
                            const startTime = safeFormatTime(event.start, { hour: '2-digit', minute: '2-digit', hour12: false });
                            const endTime = safeFormatTime(event.end, { hour: '2-digit', minute: '2-digit', hour12: false });
                            return startTime && endTime ? `${startTime} - ${endTime}` : 'Invalid time';
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* OAuth Setup Info */}
          {events.length === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-command-secondary/10 border border-command-secondary/20 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Cog6ToothIcon className="w-4 h-4 text-command-secondary" />
                <h3 className="font-mono text-sm text-command-secondary tracking-wider">SETUP.REQUIRED</h3>
              </div>
              
              <div className="text-xs text-command-muted mb-3">
                Connect Google Calendar to see your events here and enable smart scheduling.
              </div>
              
              <button
                onClick={() => window.open('/calendar-setup', '_blank')}
                className="w-full px-3 py-2 text-xs font-mono text-command-secondary border border-command-secondary/30 rounded hover:bg-command-secondary/10 transition-colors"
              >
                SETUP.CALENDAR
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <TaskQuickAdd
            projects={[]} // We'll pass projects from parent component
            onAdd={onAddTask}
            onClose={() => setShowQuickAdd(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}