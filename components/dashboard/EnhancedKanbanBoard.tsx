'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  EllipsisVerticalIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { Task } from '@/types/tasks';
import { ProjectStatus } from '@/lib/paraSystem';
import TaskItem from '@/components/Tasks/TaskItem';
import TaskQuickAdd from '@/components/Tasks/TaskQuickAdd';

interface EnhancedKanbanBoardProps {
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
  status: Task['status'];
  tasks: Task[];
  color: string;
  gradient: string;
  maxTasks?: number;
}

type BoardView = 'status' | 'priority' | 'project';

export default function EnhancedKanbanBoard({
  tasks,
  projects,
  areas,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}: EnhancedKanbanBoardProps) {
  const [boardView, setBoardView] = useState<BoardView>('status');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddColumn, setQuickAddColumn] = useState<string | null>(null);
  const [scrollX, setScrollX] = useState(0);

  // Generate columns based on board view
  const columns = useMemo((): KanbanColumn[] => {
    if (boardView === 'status') {
      return [
        {
          id: 'active',
          title: 'Active',
          status: 'active',
          tasks: tasks.filter(t => t.status === 'active'),
          color: 'command-primary',
          gradient: 'from-command-primary/20 to-command-primary/5'
        },
        {
          id: 'paused',
          title: 'Paused',
          status: 'paused',
          tasks: tasks.filter(t => t.status === 'paused'),
          color: 'command-accent',
          gradient: 'from-command-accent/20 to-command-accent/5'
        },
        {
          id: 'completed',
          title: 'Completed',
          status: 'completed',
          tasks: tasks.filter(t => t.status === 'completed').slice(0, 10), // Limit completed tasks
          color: 'command-text',
          gradient: 'from-command-text/20 to-command-text/5',
          maxTasks: 10
        },
        {
          id: 'cancelled',
          title: 'Cancelled',
          status: 'cancelled',
          tasks: tasks.filter(t => t.status === 'cancelled'),
          color: 'command-secondary',
          gradient: 'from-command-secondary/20 to-command-secondary/5'
        }
      ];
    } else if (boardView === 'priority') {
      return [
        {
          id: 'high',
          title: 'High Priority',
          status: 'active', // Default status for new tasks
          tasks: tasks.filter(t => t.priority === 'high' && t.status !== 'completed'),
          color: 'command-secondary',
          gradient: 'from-command-secondary/20 to-command-secondary/5'
        },
        {
          id: 'medium',
          title: 'Medium Priority',
          status: 'active',
          tasks: tasks.filter(t => t.priority === 'medium' && t.status !== 'completed'),
          color: 'command-primary',
          gradient: 'from-command-primary/20 to-command-primary/5'
        },
        {
          id: 'low',
          title: 'Low Priority',
          status: 'active',
          tasks: tasks.filter(t => t.priority === 'low' && t.status !== 'completed'),
          color: 'command-accent',
          gradient: 'from-command-accent/20 to-command-accent/5'
        },
        {
          id: 'completed-all',
          title: 'All Completed',
          status: 'completed',
          tasks: tasks.filter(t => t.status === 'completed').slice(0, 10),
          color: 'command-text',
          gradient: 'from-command-text/20 to-command-text/5',
          maxTasks: 10
        }
      ];
    } else {
      // Project view
      const projectColumns: KanbanColumn[] = projects.map(project => ({
        id: project.id,
        title: project.name,
        status: 'active',
        tasks: tasks.filter(t => t.projectId === project.id && t.status !== 'completed'),
        color: project.priority === 'high' ? 'command-secondary' : project.priority === 'medium' ? 'command-primary' : 'command-accent',
        gradient: project.priority === 'high' ? 'from-command-secondary/20 to-command-secondary/5' : 
                 project.priority === 'medium' ? 'from-command-primary/20 to-command-primary/5' : 'from-command-accent/20 to-command-accent/5'
      }));

      // Add unassigned and completed columns
      projectColumns.push(
        {
          id: 'unassigned',
          title: 'Unassigned',
          status: 'active',
          tasks: tasks.filter(t => !t.projectId && !t.areaId && t.status !== 'completed'),
          color: 'command-muted',
          gradient: 'from-command-muted/20 to-command-muted/5'
        },
        {
          id: 'completed-project',
          title: 'Completed',
          status: 'completed',
          tasks: tasks.filter(t => t.status === 'completed').slice(0, 10),
          color: 'command-text',
          gradient: 'from-command-text/20 to-command-text/5',
          maxTasks: 10
        }
      );

      return projectColumns;
    }
  }, [tasks, projects, boardView]);

  const handleAddTaskToColumn = (columnId: string) => {
    setQuickAddColumn(columnId);
    setShowQuickAdd(true);
  };

  const handleTaskAdd = (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Set appropriate properties based on the column
    const column = columns.find(c => c.id === quickAddColumn);
    if (column) {
      if (boardView === 'status') {
        newTask.status = column.status;
      } else if (boardView === 'priority' && column.id !== 'completed-all') {
        newTask.priority = column.id as Task['priority'];
      } else if (boardView === 'project' && column.id !== 'unassigned' && column.id !== 'completed-project') {
        newTask.projectId = column.id;
      }
    }
    onAddTask(newTask);
    setQuickAddColumn(null);
  };

  const scrollBoard = (direction: 'left' | 'right') => {
    const container = document.getElementById('kanban-container');
    if (container) {
      const scrollAmount = 320; // Width of one column plus gap
      const newScrollX = direction === 'left' 
        ? Math.max(0, scrollX - scrollAmount)
        : scrollX + scrollAmount;
      
      container.scrollTo({ left: newScrollX, behavior: 'smooth' });
      setScrollX(newScrollX);
    }
  };

  return (
    <div className="bg-command-surface/20 border border-command-border/30 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-command-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-mono text-lg text-command-text">KANBAN.BOARD</h2>
            
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-command-panel/30 border border-command-border/30 rounded-lg p-1">
              {(['status', 'priority', 'project'] as BoardView[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setBoardView(view)}
                  className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                    boardView === view
                      ? 'bg-command-primary/20 text-command-primary'
                      : 'text-command-muted hover:text-command-text'
                  }`}
                >
                  {view.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Scroll Controls */}
            <button
              onClick={() => scrollBoard('left')}
              className="p-2 text-command-muted hover:text-command-text transition-colors rounded-lg hover:bg-command-panel/20"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollBoard('right')}
              className="p-2 text-command-muted hover:text-command-text transition-colors rounded-lg hover:bg-command-panel/20"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-command-border/30"></div>
            
            <div className="text-xs text-command-muted font-mono">
              {columns.length} COLUMNS • {tasks.length} TASKS
            </div>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="h-[600px] overflow-hidden relative">
        <div
          id="kanban-container"
          className="flex gap-6 p-6 h-full overflow-x-auto overflow-y-hidden"
          style={{ minWidth: `${columns.length * 320 + (columns.length - 1) * 24}px` }}
        >
          {columns.map((column, columnIndex) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.1 }}
              className="flex flex-col w-80 bg-gradient-to-b from-command-surface/40 to-command-surface/20 border border-command-border/30 rounded-lg overflow-hidden"
            >
              {/* Column Header */}
              <div className={`bg-gradient-to-r ${column.gradient} border-b border-command-border/20 p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${column.color}`}></div>
                    <h3 className="font-mono text-sm font-medium text-command-text">
                      {column.title.toUpperCase().replace(/\s/g, '.')}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-command-muted">
                      {column.tasks.length}
                      {column.maxTasks && `/${column.maxTasks}`}
                    </span>
                    <button className="p-1 text-command-muted hover:text-command-text transition-colors">
                      <EllipsisVerticalIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Add Task Button */}
                <button
                  onClick={() => handleAddTaskToColumn(column.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-command-background/30 border border-command-border/30 rounded-lg text-command-muted hover:text-command-text hover:bg-command-background/50 transition-all group"
                >
                  <PlusIcon className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                  <span className="text-xs font-mono">ADD.TASK</span>
                </button>
              </div>

              {/* Column Content */}
              <div className="flex-1 p-3 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {column.tasks.length > 0 ? (
                    <div className="space-y-3">
                      {column.tasks
                        .sort((a, b) => {
                          // Sort by priority first
                          const priorityOrder = { high: 3, medium: 2, low: 1 };
                          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                          if (priorityDiff !== 0) return priorityDiff;
                          
                          // Then by due date
                          if (a.dueDate && b.dueDate) {
                            const dateDiff = a.dueDate.localeCompare(b.dueDate);
                            if (dateDiff !== 0) return dateDiff;
                            if (a.dueTime && b.dueTime) return a.dueTime.localeCompare(b.dueTime);
                          }
                          if (a.dueDate) return -1;
                          if (b.dueDate) return 1;
                          
                          return b.createdAt.localeCompare(a.createdAt);
                        })
                        .map((task, taskIndex) => (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: taskIndex * 0.02 }}
                            className="cursor-move"
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
                      className="flex flex-col items-center justify-center h-32 text-command-muted"
                    >
                      <div className={`w-12 h-12 rounded-full bg-${column.color}/10 flex items-center justify-center mb-2`}>
                        <div className={`w-6 h-6 rounded-full bg-${column.color}/30`}></div>
                      </div>
                      <div className="text-xs font-mono text-center">
                        EMPTY.COLUMN
                      </div>
                      <div className="text-xs opacity-75 text-center mt-1">
                        Drag tasks here or click add above
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Show More Button for limited columns */}
                {column.maxTasks && column.tasks.length >= column.maxTasks && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full mt-3 px-3 py-2 bg-command-panel/20 border border-command-border/30 rounded-lg text-command-muted hover:text-command-text transition-all"
                  >
                    <span className="text-xs font-mono">VIEW.ALL ({column.tasks.length})</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fade effects for overflow indication */}
        <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-command-background/50 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-command-background/50 to-transparent pointer-events-none"></div>
      </div>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <TaskQuickAdd
            projects={projects}
            onAdd={handleTaskAdd}
            onClose={() => {
              setShowQuickAdd(false);
              setQuickAddColumn(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}