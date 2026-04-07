'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/tasks';
import { ProjectStatus } from '@/lib/paraSystem';
import { CalendarEvent } from '@/lib/googleCalendarOAuth';
import { CheckIcon, ClockIcon, ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { safeDateString, safeToDate, isValidCalendarEvent, safeFormatTime } from '@/lib/dateUtils';
import TaskQuickAdd from './TaskQuickAdd';
import TaskItem from './TaskItem';

interface DailyTaskListProps {
  tasks: Task[];
  events: CalendarEvent[];
  projects: ProjectStatus[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export default function DailyTaskList({ 
  tasks, 
  events, 
  projects, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask 
}: DailyTaskListProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.dueDate === today);
  const overdueTasks = tasks.filter(task => 
    task.dueDate && 
    task.dueDate < today && 
    task.status !== 'completed'
  );
  const todayEvents = events.filter(event => {
    // Use safe date utilities to handle date conversion
    if (!isValidCalendarEvent(event)) {
      console.warn('Invalid calendar event:', event);
      return false;
    }
    const eventDateStr = safeDateString(event.start);
    return eventDateStr === today;
  });

  const filteredTasks = todayTasks.filter(task => {
    if (filter === 'pending') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const completedCount = todayTasks.filter(t => t.status === 'completed').length;
  const totalCount = todayTasks.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-command-surface/50 border border-command-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckIcon className="w-4 h-4 text-command-primary" />
            <span className="text-xs text-command-muted font-mono">TODAY.PROGRESS</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono text-command-primary">{completedCount}</span>
            <span className="text-sm text-command-muted">/ {totalCount}</span>
            <span className="text-xs text-command-accent ml-auto">{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-command-background/50 rounded-full h-1.5 mt-2">
            <div 
              className="h-1.5 rounded-full bg-gradient-to-r from-command-primary to-command-accent transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-command-surface/50 border border-command-secondary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-command-secondary" />
            <span className="text-xs text-command-muted font-mono">OVERDUE</span>
          </div>
          <div className="text-2xl font-mono text-command-secondary">{overdueTasks.length}</div>
        </div>

        <div className="bg-command-surface/50 border border-command-accent/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon className="w-4 h-4 text-command-accent" />
            <span className="text-xs text-command-muted font-mono">EVENTS</span>
          </div>
          <div className="text-2xl font-mono text-command-accent">{todayEvents.length}</div>
        </div>

        <div className="bg-command-surface/50 border border-command-border/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 border border-command-text rounded-sm" />
            <span className="text-xs text-command-muted font-mono">TOTAL.TIME</span>
          </div>
          <div className="text-2xl font-mono text-command-text">
            {Math.round(todayTasks.reduce((acc, task) => acc + (task.estimatedTime || 0), 0) / 60)}h
          </div>
        </div>
      </motion.div>

      {/* Overdue Tasks Alert */}
      <AnimatePresence>
        {overdueTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-command-secondary/10 border-l-4 border-command-secondary rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-command-secondary" />
              <div>
                <div className="font-mono text-sm text-command-secondary font-medium">
                  {overdueTasks.length} OVERDUE TASK{overdueTasks.length > 1 ? 'S' : ''}
                </div>
                <div className="text-xs text-command-muted">
                  Review and reschedule or complete these tasks
                </div>
              </div>
              <button 
                onClick={() => {
                  // Focus on overdue tasks - could open a modal or filter
                }}
                className="ml-auto px-3 py-1 text-xs font-mono text-command-secondary border border-command-secondary/30 rounded hover:bg-command-secondary/10 transition-colors"
              >
                REVIEW
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-lg text-command-text tracking-wider">
            TODAY.TASKS
          </h2>
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-command-panel/30 border border-command-border/30 rounded-lg p-1">
            {(['pending', 'all', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-2 py-1 text-xs font-mono rounded transition-all ${
                  filter === filterType
                    ? 'bg-command-primary/20 text-command-primary'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                {filterType.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowQuickAdd(true)}
          className="flex items-center gap-2 px-3 py-2 bg-command-primary/10 border border-command-primary/30 rounded-lg text-command-primary hover:bg-command-primary/20 transition-all group"
        >
          <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          <span className="text-xs font-mono">ADD.TASK</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredTasks
            .sort((a, b) => {
              // Sort by time, then priority
              if (a.dueTime && b.dueTime) {
                return a.dueTime.localeCompare(b.dueTime);
              }
              if (a.dueTime) return -1;
              if (b.dueTime) return 1;
              
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            })
            .map((task, index) => (
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
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-command-muted"
          >
            <div className="font-mono text-sm mb-2">
              {filter === 'completed' 
                ? 'NO.COMPLETED.TASKS.TODAY' 
                : filter === 'pending' 
                ? 'NO.PENDING.TASKS.TODAY'
                : 'NO.TASKS.SCHEDULED.TODAY'
              }
            </div>
            <div className="text-xs">
              {filter === 'pending' && 'Great job! All tasks completed or add new ones above.'}
              {filter === 'completed' && 'Complete some tasks to see them here.'}
              {filter === 'all' && 'Add tasks to get started with your daily workflow.'}
            </div>
          </motion.div>
        )}
      </div>

      {/* Today's Calendar Events */}
      {todayEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-command-surface/50 border border-command-accent/20 rounded-lg p-4"
        >
          <h3 className="font-mono text-sm text-command-accent mb-3 tracking-wider">
            TODAY.EVENTS
          </h3>
          <div className="space-y-2">
            {todayEvents.map(event => (
              <div key={event.id} className="flex items-center gap-3 py-2">
                <div className="w-2 h-2 rounded-full bg-command-accent"></div>
                <div className="flex-1">
                  <div className="text-sm text-command-text">{event.title}</div>
                  <div className="text-xs text-command-muted font-mono">
                    {(() => {
                      const startTime = safeFormatTime(event.start, { hour: '2-digit', minute: '2-digit', hour12: false });
                      const endTime = safeFormatTime(event.end, { hour: '2-digit', minute: '2-digit', hour12: false });
                      return startTime && endTime ? `${startTime} - ${endTime}` : 'Invalid time';
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