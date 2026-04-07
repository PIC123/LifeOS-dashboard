'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon, 
  PlusIcon,
  FireIcon,
  BoltIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Task } from '@/types/tasks';
import { ProjectStatus } from '@/lib/paraSystem';
import { CalendarEvent } from '@/lib/googleCalendarOAuth';
import TaskItem from '@/components/Tasks/TaskItem';
import TaskQuickAdd from '@/components/Tasks/TaskQuickAdd';

interface TodayFocusViewProps {
  tasks: Task[];
  events: CalendarEvent[];
  projects: ProjectStatus[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export default function TodayFocusView({
  tasks,
  events,
  projects,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}: TodayFocusViewProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [focusMode, setFocusMode] = useState<'all' | 'high' | 'urgent'>('all');

  // Process today's data
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.dueDate === today);
  const overdueTasks = tasks.filter(task => 
    task.dueDate && 
    task.dueDate < today && 
    task.status !== 'completed'
  );

  const todayEvents = events.filter(event => {
    try {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === today;
    } catch {
      return false;
    }
  });

  // Filter tasks based on focus mode
  const filteredTasks = [...overdueTasks, ...todayTasks].filter(task => {
    if (focusMode === 'high') return task.priority === 'high';
    if (focusMode === 'urgent') return task.priority === 'high' || overdueTasks.includes(task);
    return true;
  });

  // Sort tasks by importance and time
  const sortedTasks = filteredTasks.sort((a, b) => {
    // Overdue first
    const aOverdue = overdueTasks.includes(a);
    const bOverdue = overdueTasks.includes(b);
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // Then by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by time
    if (a.dueTime && b.dueTime) return a.dueTime.localeCompare(b.dueTime);
    if (a.dueTime) return -1;
    if (b.dueTime) return 1;

    return 0;
  });

  const completedToday = todayTasks.filter(t => t.status === 'completed').length;
  const totalToday = todayTasks.length;
  const completionPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  // Time estimation
  const remainingTime = sortedTasks
    .filter(t => t.status !== 'completed')
    .reduce((acc, task) => acc + (task.estimatedTime || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Focus Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-mono font-bold text-command-text mb-2">
            TODAY'S.FOCUS
          </h1>
          <p className="text-command-muted text-sm">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Focus Mode Toggle */}
          <div className="flex items-center gap-1 bg-command-panel/30 border border-command-border/30 rounded-lg p-1">
            {(['all', 'high', 'urgent'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFocusMode(mode)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-all ${
                  focusMode === mode
                    ? 'bg-command-primary/20 text-command-primary border border-command-primary/30'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                {mode === 'all' && '📋 ALL'}
                {mode === 'high' && '🔥 HIGH'}
                {mode === 'urgent' && '⚡ URGENT'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-command-primary/10 border border-command-primary/30 rounded-lg text-command-primary hover:bg-command-primary/20 transition-all group"
          >
            <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="font-mono text-sm">QUICK.ADD</span>
          </button>
        </div>
      </motion.div>

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-command-surface/40 border border-command-primary/20 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-command-primary/10 rounded-lg">
              <ClockIcon className="w-5 h-5 text-command-primary" />
            </div>
            <div>
              <div className="font-mono text-sm text-command-primary">Today's Progress</div>
              <div className="text-xs text-command-muted">Task completion status</div>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-mono font-bold text-command-text">
              {completedToday}
            </span>
            <span className="text-command-muted">/ {totalToday}</span>
            <span className="text-command-primary text-sm ml-auto">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          
          <div className="w-full bg-command-background/30 rounded-full h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-2 rounded-full bg-gradient-to-r from-command-primary to-command-accent"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-command-surface/40 border border-command-secondary/20 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-command-secondary/10 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-command-secondary" />
            </div>
            <div>
              <div className="font-mono text-sm text-command-secondary">Needs Attention</div>
              <div className="text-xs text-command-muted">Overdue + high priority</div>
            </div>
          </div>
          
          <div className="text-2xl font-mono font-bold text-command-text mb-2">
            {overdueTasks.length + tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length}
          </div>
          
          {overdueTasks.length > 0 && (
            <div className="text-xs text-command-secondary">
              {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-command-surface/40 border border-command-accent/20 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-command-accent/10 rounded-lg">
              <ClockIcon className="w-5 h-5 text-command-accent" />
            </div>
            <div>
              <div className="font-mono text-sm text-command-accent">Time Estimate</div>
              <div className="text-xs text-command-muted">Remaining work</div>
            </div>
          </div>
          
          <div className="text-2xl font-mono font-bold text-command-text mb-2">
            {Math.round(remainingTime / 60)}h {remainingTime % 60}m
          </div>
          
          <div className="text-xs text-command-muted">
            {todayEvents.length} calendar event{todayEvents.length !== 1 ? 's' : ''} today
          </div>
        </motion.div>
      </div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-command-surface/20 border border-command-border/30 rounded-lg"
      >
        <div className="p-4 border-b border-command-border/20">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-lg text-command-text">
              TASK.QUEUE
            </h2>
            <div className="text-sm text-command-muted">
              {sortedTasks.filter(t => t.status !== 'completed').length} pending
            </div>
          </div>
        </div>

        <div className="p-4">
          <AnimatePresence mode="popLayout">
            {sortedTasks.length > 0 ? (
              <div className="space-y-3">
                {sortedTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskItem
                      task={task}
                      projects={projects}
                      onUpdate={onUpdateTask}
                      onDelete={onDeleteTask}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-command-muted"
              >
                <div className="font-mono text-lg mb-2">
                  🎯 FOCUS.ACHIEVED
                </div>
                <div className="text-sm">
                  {focusMode === 'all' 
                    ? 'No tasks scheduled for today'
                    : focusMode === 'high'
                    ? 'No high priority tasks'
                    : 'No urgent tasks requiring attention'
                  }
                </div>
                <button
                  onClick={() => setShowQuickAdd(true)}
                  className="mt-4 px-4 py-2 bg-command-primary/10 border border-command-primary/30 rounded-lg text-command-primary hover:bg-command-primary/20 transition-all"
                >
                  Add New Task
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Today's Events (if any) */}
      {todayEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-command-surface/20 border border-command-accent/20 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <CalendarIcon className="w-5 h-5 text-command-accent" />
            <h3 className="font-mono text-sm text-command-accent">TODAY.CALENDAR</h3>
          </div>
          
          <div className="grid gap-3">
            {todayEvents.map(event => (
              <div key={event.id} className="flex items-center gap-3 p-3 bg-command-panel/20 rounded-lg">
                <div className="w-3 h-3 bg-command-accent rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-command-text">{event.title}</div>
                  <div className="text-xs text-command-muted font-mono">
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
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <TaskQuickAdd
            projects={projects}
            onAdd={onAddTask}
            onClose={() => setShowQuickAdd(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}