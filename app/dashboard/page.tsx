'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import TodayFocusView from '@/components/dashboard/views/TodayFocusView';
import ProjectsView from '@/components/dashboard/views/ProjectsView';
import CalendarView from '@/components/dashboard/views/CalendarView';
import TasksView from '@/components/dashboard/views/TasksView';
import DashboardSettings from '@/components/dashboard/DashboardSettings';

// Hooks
import { useCalendar } from '@/hooks/useCalendar';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';

// Types
export type DashboardView = 'today' | 'projects' | 'calendar' | 'tasks';

interface DashboardState {
  currentView: DashboardView;
  sidebarCollapsed: boolean;
  showSettings: boolean;
  loading: boolean;
}

export default function UnifiedDashboard() {
  const [state, setState] = useState<DashboardState>({
    currentView: 'today',
    sidebarCollapsed: false,
    showSettings: false,
    loading: true,
  });

  // Data hooks
  const { events, reminders, loading: calendarLoading } = useCalendar({
    timeMin: new Date(),
    timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  
  const { projects, areas, loading: projectsLoading } = useProjects();
  const { tasks, stats, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks();

  // Update loading state
  useEffect(() => {
    setState(prev => ({ 
      ...prev, 
      loading: calendarLoading || projectsLoading || tasksLoading 
    }));
  }, [calendarLoading, projectsLoading, tasksLoading]);

  // Navigation helpers
  const navigateToView = (view: DashboardView) => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const toggleSettings = () => {
    setState(prev => ({ ...prev, showSettings: !prev.showSettings }));
  };

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-command-background flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-command-primary/30 border-t-command-primary rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-command-primary text-xl font-mono tracking-wider">
            INITIALIZING.LIFEOS...
          </div>
          <div className="text-command-muted text-sm font-mono mt-2">
            Loading workspace data
          </div>
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

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className={`bg-command-surface border-r border-command-border/30 transition-all duration-300 ${
            state.sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <DashboardSidebar
            currentView={state.currentView}
            collapsed={state.sidebarCollapsed}
            onNavigate={navigateToView}
            onToggleCollapse={toggleSidebar}
            stats={stats}
          />
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader
            currentView={state.currentView}
            onNavigate={navigateToView}
            onToggleSettings={toggleSettings}
            stats={stats}
          />

          {/* Dashboard Stats Bar */}
          <DashboardStats
            tasks={tasks}
            events={events}
            projects={projects}
            stats={stats}
          />

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state.currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="h-full p-6 overflow-y-auto"
              >
                {state.currentView === 'today' && (
                  <TodayFocusView
                    tasks={tasks}
                    events={events}
                    projects={projects}
                    onAddTask={addTask}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                  />
                )}

                {state.currentView === 'projects' && (
                  <ProjectsView
                    projects={projects}
                    areas={areas}
                    tasks={tasks}
                    onAddTask={addTask}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                  />
                )}

                {state.currentView === 'calendar' && (
                  <CalendarView
                    tasks={tasks}
                    events={events}
                    reminders={reminders}
                    onAddTask={addTask}
                    onUpdateTask={updateTask}
                  />
                )}

                {state.currentView === 'tasks' && (
                  <TasksView
                    tasks={tasks}
                    projects={projects}
                    areas={areas}
                    onAddTask={addTask}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Settings Overlay */}
        <AnimatePresence>
          {state.showSettings && (
            <DashboardSettings
              onClose={toggleSettings}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}