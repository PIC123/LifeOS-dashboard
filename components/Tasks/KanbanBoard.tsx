'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/tasks';
import { ProjectStatus } from '@/lib/paraSystem';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import TaskItem from './TaskItem';
import TaskQuickAdd from './TaskQuickAdd';

interface KanbanBoardProps {
  tasks: Task[];
  projects: ProjectStatus[];
  areas: ProjectStatus[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  type: 'project' | 'area' | 'inbox' | 'status';
  tasks: Task[];
  project?: ProjectStatus;
  color: string;
}

type ViewMode = 'projects' | 'status' | 'priority';

export default function KanbanBoard({ 
  tasks, 
  projects, 
  areas, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask 
}: KanbanBoardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('projects');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Task['status'] | 'all'>('all');

  const filteredTasks = tasks.filter(task => 
    filterStatus === 'all' || task.status === filterStatus
  );

  const columns = useMemo(() => {
    const cols: KanbanColumn[] = [];

    if (viewMode === 'projects') {
      // PARA Projects columns
      projects.forEach(project => {
        const projectTasks = filteredTasks.filter(task => task.projectId === project.id);
        cols.push({
          id: project.id,
          title: project.name,
          type: 'project',
          tasks: projectTasks,
          project,
          color: getProjectColor(project.priority)
        });
      });

      // Areas columns
      areas.forEach(area => {
        const areaTasks = filteredTasks.filter(task => task.areaId === area.id);
        if (areaTasks.length > 0) {
          cols.push({
            id: area.id,
            title: area.name,
            type: 'area',
            tasks: areaTasks,
            project: area,
            color: 'border-command-accent/30'
          });
        }
      });

      // Inbox for unassigned tasks
      const inboxTasks = filteredTasks.filter(task => !task.projectId && !task.areaId);
      if (inboxTasks.length > 0) {
        cols.push({
          id: 'inbox',
          title: 'Inbox',
          type: 'inbox',
          tasks: inboxTasks,
          color: 'border-command-muted/30'
        });
      }
    } else if (viewMode === 'status') {
      // Status-based columns
      const statuses: Task['status'][] = ['active', 'paused', 'completed'];
      statuses.forEach(status => {
        const statusTasks = filteredTasks.filter(task => task.status === status);
        if (statusTasks.length > 0) {
          cols.push({
            id: status,
            title: status.charAt(0).toUpperCase() + status.slice(1),
            type: 'status',
            tasks: statusTasks,
            color: getStatusColor(status)
          });
        }
      });
    } else if (viewMode === 'priority') {
      // Priority-based columns
      const priorities: Task['priority'][] = ['high', 'medium', 'low'];
      priorities.forEach(priority => {
        const priorityTasks = filteredTasks.filter(task => task.priority === priority);
        if (priorityTasks.length > 0) {
          cols.push({
            id: priority,
            title: `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`,
            type: 'status',
            tasks: priorityTasks,
            color: getPriorityColor(priority)
          });
        }
      });
    }

    return cols;
  }, [viewMode, filteredTasks, projects, areas]);

  const getProjectColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'border-command-secondary/30';
      case 'medium': return 'border-command-primary/30';
      case 'low': return 'border-command-accent/30';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'active': return 'border-command-primary/30';
      case 'paused': return 'border-command-accent/30';
      case 'completed': return 'border-command-muted/30';
      case 'cancelled': return 'border-command-secondary/30';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-command-secondary/30';
      case 'medium': return 'border-command-accent/30';
      case 'low': return 'border-command-muted/30';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-lg text-command-text tracking-wider">
            KANBAN.BOARD
          </h2>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-command-panel/30 border border-command-border/30 rounded-lg p-1">
            {(['projects', 'status', 'priority'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                  viewMode === mode
                    ? 'bg-command-primary/20 text-command-primary border border-command-primary/30'
                    : 'text-command-muted hover:text-command-text hover:bg-command-panel/20'
                }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-command-muted" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Task['status'] | 'all')}
              className="bg-command-background/50 border border-command-border/30 rounded px-2 py-1 text-xs text-command-text focus:outline-none focus:ring-1 focus:ring-command-primary/50"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
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

      {/* Stats Bar */}
      <div className="flex items-center gap-4 mb-6 text-xs text-command-muted">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-command-primary rounded-full"></div>
          <span className="font-mono">{columns.length} COLUMNS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-command-accent rounded-full"></div>
          <span className="font-mono">{filteredTasks.length} TASKS</span>
        </div>
        {viewMode === 'projects' && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-command-secondary rounded-full"></div>
            <span className="font-mono">{projects.length} PROJECTS</span>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-max pb-4">
          <AnimatePresence mode="popLayout">
            {columns.map((column, index) => (
              <motion.div
                key={column.id}
                layout
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col w-80 h-full"
              >
                {/* Column Header */}
                <div className={`bg-command-surface/50 border-2 ${column.color} rounded-t-lg p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-mono text-sm text-command-text font-medium">
                      {column.title.toUpperCase().replace(/\s/g, '.')}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-command-muted">
                        {column.tasks.length}
                      </span>
                      {column.project && (
                        <div className="text-xs font-mono text-command-accent">
                          {column.project.progress}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Progress Bar */}
                  {column.project && column.type === 'project' && (
                    <div className="w-full bg-command-background/50 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full bg-gradient-to-r from-command-primary to-command-accent transition-all duration-500"
                        style={{ width: `${column.project.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Column Content */}
                <div className={`flex-1 bg-command-surface/30 border-l-2 border-r-2 border-b-2 ${column.color} rounded-b-lg p-3 overflow-y-auto`}>
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {column.tasks
                        .sort((a, b) => {
                          // Sort by priority first, then by due date
                          const priorityOrder = { high: 3, medium: 2, low: 1 };
                          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                          if (priorityDiff !== 0) return priorityDiff;
                          
                          if (a.dueDate && b.dueDate) {
                            return a.dueDate.localeCompare(b.dueDate);
                          }
                          if (a.dueDate) return -1;
                          if (b.dueDate) return 1;
                          return 0;
                        })
                        .map((task, taskIndex) => (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: taskIndex * 0.05 }}
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

                    {column.tasks.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-command-muted"
                      >
                        <div className="text-xs font-mono mb-1">EMPTY.COLUMN</div>
                        <div className="text-xs opacity-75">No tasks here</div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {columns.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center w-full h-64 text-center text-command-muted"
            >
              <div>
                <div className="font-mono text-lg mb-2">NO.COLUMNS.FOUND</div>
                <div className="text-xs">
                  {filterStatus !== 'all' 
                    ? `No tasks with status: ${filterStatus.toUpperCase()}`
                    : viewMode === 'projects' 
                    ? 'Create projects or add tasks to see them here'
                    : 'Add tasks to populate the board'
                  }
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

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