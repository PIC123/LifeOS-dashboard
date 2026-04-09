'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Squares2X2Icon,
  ListBulletIcon,
  CalendarIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Task } from '@/types/tasks';
import { ProjectStatus } from '@/lib/paraSystem';
import TaskItem from '@/components/Tasks/TaskItem';
import TaskQuickAdd from '@/components/Tasks/TaskQuickAdd';
import EnhancedKanbanBoard from '@/components/dashboard/EnhancedKanbanBoard';

interface TasksViewProps {
  tasks: Task[];
  projects: ProjectStatus[];
  areas: ProjectStatus[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

type ViewMode = 'kanban' | 'list' | 'calendar';
type FilterStatus = 'all' | 'active' | 'completed' | 'paused' | 'cancelled';
type FilterPriority = 'all' | 'high' | 'medium' | 'low';

export default function TasksView({
  tasks,
  projects,
  areas,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}: TasksViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;

    // Priority filter
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Sort tasks for list view
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First by status (active first)
    const statusOrder = { active: 4, paused: 3, completed: 2, cancelled: 1 };
    const statusDiff = statusOrder[b.status] - statusOrder[a.status];
    if (statusDiff !== 0) return statusDiff;

    // Then by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by due date
    if (a.dueDate && b.dueDate) {
      const dateDiff = a.dueDate.localeCompare(b.dueDate);
      if (dateDiff !== 0) return dateDiff;

      // If same date, sort by time
      if (a.dueTime && b.dueTime) {
        return a.dueTime.localeCompare(b.dueTime);
      }
      if (a.dueTime) return -1;
      if (b.dueTime) return 1;
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    // Finally by creation date
    return b.createdAt.localeCompare(a.createdAt);
  });

  const getFilterCounts = () => {
    return {
      all: tasks.length,
      active: tasks.filter(t => t.status === 'active').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      paused: tasks.filter(t => t.status === 'paused').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length
    };
  };

  const filterCounts = getFilterCounts();

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-mono font-bold text-command-text mb-2">
            TASK.MANAGEMENT
          </h1>
          <p className="text-command-muted text-sm hidden sm:block">
            Complete task overview and management
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-command-panel/30 border border-command-border/30 rounded-lg p-1">
            {[
              { mode: 'kanban', icon: Squares2X2Icon, label: 'KANBAN' },
              { mode: 'list', icon: ListBulletIcon, label: 'LIST' },
              { mode: 'calendar', icon: CalendarIcon, label: 'CALENDAR' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-xs font-mono rounded transition-all touch-manipulation ${
                  viewMode === mode
                    ? 'bg-command-primary/20 text-command-primary border border-command-primary/30'
                    : 'text-command-muted hover:text-command-text active:bg-command-primary/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-command-primary/10 border border-command-primary/30 rounded-lg text-command-primary hover:bg-command-primary/20 active:bg-command-primary/30 transition-all group touch-manipulation min-h-[44px]"
          >
            <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="font-mono text-sm">NEW.TASK</span>
          </button>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-command-surface/30 border border-command-border/30 rounded-lg p-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-command-muted" />
              <input
                type="text"
                placeholder="Search tasks, tags, descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-command-background/50 border border-command-border/30 rounded-lg pl-10 pr-4 py-2 text-command-text placeholder-command-muted/50 focus:outline-none focus:ring-2 focus:ring-command-primary/50"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-command-muted" />
            <div className="flex items-center gap-1">
              {(Object.keys(filterCounts) as FilterStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                    filterStatus === status
                      ? 'bg-command-accent/20 text-command-accent'
                      : 'text-command-muted hover:text-command-text hover:bg-command-panel/20'
                  }`}
                >
                  {status.toUpperCase()} ({filterCounts[status]})
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1">
            {(['all', 'high', 'medium', 'low'] as FilterPriority[]).map((priority) => (
              <button
                key={priority}
                onClick={() => setFilterPriority(priority)}
                className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                  filterPriority === priority
                    ? 'bg-command-secondary/20 text-command-secondary'
                    : 'text-command-muted hover:text-command-text hover:bg-command-panel/20'
                }`}
              >
                {priority === 'all' ? 'ALL PRI' : priority.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="min-h-[600px]"
      >
        <AnimatePresence mode="wait">
          {viewMode === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <EnhancedKanbanBoard
                tasks={filteredTasks}
                projects={projects}
                areas={areas}
                onAddTask={onAddTask}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            </motion.div>
          )}

          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-command-surface/20 border border-command-border/30 rounded-lg"
            >
              <div className="p-4 border-b border-command-border/20">
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-lg text-command-text">
                    TASK.LIST
                  </h2>
                  <div className="text-sm text-command-muted">
                    {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                    {filteredTasks.length !== tasks.length && ` of ${tasks.length}`}
                  </div>
                </div>
              </div>

              <div className="p-4">
                {sortedTasks.length > 0 ? (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {sortedTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -300 }}
                          transition={{ delay: index * 0.02 }}
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
                  </div>
                ) : (
                  <div className="text-center py-12 text-command-muted">
                    <div className="font-mono text-lg mb-2">
                      📝 NO.TASKS.FOUND
                    </div>
                    <div className="text-sm">
                      {searchQuery
                        ? `No tasks match "${searchQuery}"`
                        : filterStatus !== 'all' || filterPriority !== 'all'
                        ? 'No tasks match the selected filters'
                        : 'No tasks created yet'
                      }
                    </div>
                    {(!searchQuery && filterStatus === 'all' && filterPriority === 'all') && (
                      <button
                        onClick={() => setShowQuickAdd(true)}
                        className="mt-4 px-4 py-2 bg-command-primary/10 border border-command-primary/30 rounded-lg text-command-primary hover:bg-command-primary/20 transition-all"
                      >
                        Create Your First Task
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {viewMode === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-command-surface/20 border border-command-border/30 rounded-lg p-8 text-center"
            >
              <CalendarIcon className="w-16 h-16 text-command-muted mx-auto mb-4" />
              <div className="font-mono text-xl text-command-text mb-2">
                CALENDAR.VIEW
              </div>
              <div className="text-command-muted mb-6">
                Enhanced calendar view with task scheduling coming soon
              </div>
              <div className="grid grid-cols-7 gap-2 text-xs">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                  <div key={day} className="p-2 bg-command-panel/20 rounded text-command-muted text-center">
                    {day}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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