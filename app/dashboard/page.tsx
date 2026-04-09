'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ErrorBoundary from '@/components/ErrorBoundary';

// New focused views
import ProjectsView from '@/components/dashboard/views/ProjectsView';
import KnowledgeView, { type KnowledgeData } from '@/components/dashboard/views/KnowledgeView';
import MemoryView, { type MemoryData } from '@/components/dashboard/views/MemoryView';
import TasksView from '@/components/dashboard/views/TasksView';

// Hooks (simplified)
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';

// Types
export type DashboardView = 'projects' | 'knowledge' | 'memory' | 'tasks';

interface DashboardState {
  currentView: DashboardView;
  sidebarCollapsed: boolean;
}

interface DashboardData {
  knowledge?: KnowledgeData;
  memory?: MemoryData;
}

export default function PersonalCommandCenter() {
  const [state, setState] = useState<DashboardState>({
    currentView: 'projects',
    sidebarCollapsed: false,
  });

  const [data, setData] = useState<DashboardData>({});

  // Simplified data loading - only essential systems
  const { projects, areas, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks();

  // Derive loading state — no useEffect needed
  const loading = projectsLoading || tasksLoading;

  // Load additional data for focused views
  const loadViewData = useCallback(async (view: DashboardView) => {
    try {
      switch (view) {
        case 'knowledge':
          if (!data.knowledge) {
            const response = await fetch('/api/zettelkasten?view=overview');
            const result = await response.json();
            if (result.success !== false) {
              setData(prev => ({ ...prev, knowledge: result }));
            }
          }
          break;
        case 'memory':
          if (!data.memory) {
            const response = await fetch('/api/memory?view=overview');
            const result = await response.json();
            if (result.success !== false) {
              setData(prev => ({ ...prev, memory: result }));
            }
          }
          break;
      }
    } catch (error) {
      console.error(`Error loading ${view} data:`, error);
    }
  }, [data.knowledge, data.memory]);

  // Load data when view changes
  useEffect(() => {
    loadViewData(state.currentView);
  }, [state.currentView, loadViewData]);

  const handleViewChange = (view: DashboardView) => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  // Calculate stats for sidebar
  const sidebarStats = {
    activeProjects: projects?.filter(p => p.status === 'ACTIVE')?.length || 0,
    totalTasks: tasks?.length || 0,
    recentNotes: data.knowledge?.stats?.totalNotes || 0,
    memoryDays: data.memory?.stats?.totalDays || 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-cyan-400 font-mono">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            border: '1px solid #00ffff',
            color: '#ffffff',
            fontFamily: 'monospace',
          },
        }}
      />

      {/* Header */}
      <DashboardHeader 
        currentView={state.currentView}
        onViewChange={handleViewChange}
        onSidebarToggle={toggleSidebar}
        sidebarCollapsed={state.sidebarCollapsed}
      />

      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar
          collapsed={state.sidebarCollapsed}
          currentView={state.currentView}
          onViewChange={handleViewChange}
          stats={sidebarStats}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          state.sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <div className="p-6">
            {/* Stats Overview */}
            <ErrorBoundary variant="view" name="Stats">
              <DashboardStats
                projects={projects}
                tasks={tasks}
                knowledge={data.knowledge}
                memory={data.memory}
              />
            </ErrorBoundary>

            {/* View Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                {state.currentView === 'projects' && (
                  <ErrorBoundary variant="view" name="Projects">
                    <ProjectsView
                      projects={projects}
                      areas={areas}
                      tasks={tasks}
                      onAddTask={addTask}
                      onUpdateTask={updateTask}
                      onDeleteTask={deleteTask}
                    />
                  </ErrorBoundary>
                )}
                {state.currentView === 'knowledge' && (
                  <ErrorBoundary variant="view" name="Knowledge">
                    <KnowledgeView data={data.knowledge} />
                  </ErrorBoundary>
                )}
                {state.currentView === 'memory' && (
                  <ErrorBoundary variant="view" name="Memory">
                    <MemoryView data={data.memory} />
                  </ErrorBoundary>
                )}
                {state.currentView === 'tasks' && (
                  <ErrorBoundary variant="view" name="Tasks">
                    <TasksView
                      tasks={tasks}
                      projects={projects}
                      areas={areas}
                      onAddTask={addTask}
                      onUpdateTask={updateTask}
                      onDeleteTask={deleteTask}
                    />
                  </ErrorBoundary>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}