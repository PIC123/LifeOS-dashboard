'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import DailyTaskList from '@/components/Tasks/DailyTaskList';
import KanbanBoard from '@/components/Tasks/KanbanBoard';
import CalendarIntegration from '@/components/Calendar/CalendarIntegration';
import { useCalendar } from '@/hooks/useCalendar';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';

type ViewMode = 'today' | 'kanban' | 'calendar' | 'week' | 'month';

export default function TaskFocusedDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [mounted, setMounted] = useState(false);
  
  // Calendar integration
  const { events, reminders, loading: calendarLoading } = useCalendar({
    timeMin: new Date(),
    timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  
  // Projects (PARA system)
  const { projects, areas, loading: projectsLoading } = useProjects();
  
  // Tasks management
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-command-background flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-command-primary text-xl font-mono"
        >
          INITIALIZING.TASK.CENTER...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-command-background text-command-text">
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

      {/* Simplified Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b-2 border-command-primary/30 bg-command-surface/90 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-3 h-3 bg-command-primary rounded-full animate-pulse"></div>
              <h1 className="font-mono text-xl font-bold text-command-text tracking-wider">
                LIFEOS.TASKS
              </h1>
            </motion.div>
            
            {/* View Mode Toggle */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-command-panel/30 border border-command-border/30 rounded-lg p-1"
            >
              {(['today', 'kanban', 'calendar', 'week', 'month'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 font-mono text-xs rounded transition-all ${
                    viewMode === mode
                      ? 'bg-command-primary/20 text-command-primary border border-command-primary/30'
                      : 'text-command-muted hover:text-command-text hover:bg-command-panel/20'
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="text-xs text-command-muted">
                <div>TODAY</div>
                <div className="text-command-primary font-mono">
                  {tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length}
                </div>
              </div>
              <div className="text-xs text-command-muted">
                <div>ACTIVE</div>
                <div className="text-command-secondary font-mono">
                  {tasks.filter(t => t.status === 'active').length}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'today' && (
            <DailyTaskList 
              tasks={tasks}
              events={events}
              projects={projects}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          )}

          {viewMode === 'kanban' && (
            <KanbanBoard
              tasks={tasks}
              projects={projects}
              areas={areas}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          )}

          {viewMode === 'calendar' && (
            <CalendarIntegration
              tasks={tasks}
              events={events}
              reminders={reminders}
              onAddTask={addTask}
              onUpdateTask={updateTask}
            />
          )}

          {(viewMode === 'week' || viewMode === 'month') && (
            <CalendarIntegration
              tasks={tasks}
              events={events}
              reminders={reminders}
              viewMode={viewMode}
              onAddTask={addTask}
              onUpdateTask={updateTask}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}