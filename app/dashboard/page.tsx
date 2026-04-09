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
  mobileMenuOpen: boolean;
}

interface DashboardData {
  knowledge?: KnowledgeData;
  memory?: MemoryData;
}

export default function PersonalCommandCenter() {
  console.log(`🎬 PersonalCommandCenter component started`);
  
  const [state, setState] = useState<DashboardState>({
    currentView: 'knowledge',
    sidebarCollapsed: false,
    mobileMenuOpen: false,
  });
  
  console.log(`🎭 Component state initialized:`, state);

  const [data, setData] = useState<DashboardData>({});

  // Debug logging for state changes
  useEffect(() => {
    console.log(`🔄 Data state changed:`, {
      hasKnowledge: !!data.knowledge,
      hasMemory: !!data.memory,
      knowledgeStats: data.knowledge?.stats,
      memoryStats: data.memory?.stats
    });
  }, [data]);

  // Simplified data loading - only essential systems
  const { projects, areas, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks();
  
  console.log(`⏳ Hook loading states:`, {
    projectsLoading,
    tasksLoading,
    currentView: state.currentView
  });

  // Note: Knowledge and Memory views load data independently

  // Load additional data for focused views
  const loadViewData = useCallback(async (view: DashboardView) => {
    console.log(`🔄 loadViewData called for view: ${view}`);
    
    const baseUrl = typeof window === 'undefined' ? 'http://localhost:3000' : '';
    
    try {
      switch (view) {
        case 'knowledge':
          console.log(`🌐 Fetching knowledge data from /api/zettelkasten?view=overview`);
          const response = await fetch(`${baseUrl}/api/zettelkasten?view=overview`);
          console.log(`📡 Knowledge API response status: ${response.status}`);
          
          if (!response.ok) {
            console.error(`❌ Knowledge API error: ${response.status} ${response.statusText}`);
            return;
          }
          
          const result = await response.json();
          console.log(`📥 Knowledge API result structure:`, {
            success: result.success,
            hasRecentNotes: !!result.recentNotes,
            hasMaps: !!result.maps,
            hasInbox: !!result.inbox,
            hasStats: !!result.stats,
            noteCount: result.recentNotes?.length,
            mapCount: result.maps?.length,
            inboxCount: result.inbox?.length
          });
          
          if (result.success !== false) {
            console.log(`💾 Setting knowledge data in state`);
            setData(prev => {
              const newState = { ...prev, knowledge: result };
              console.log(`🔄 New state after knowledge update - knowledge exists: ${!!newState.knowledge}`);
              return newState;
            });
          } else {
            console.warn(`⚠️ Knowledge API returned success: false`);
          }
          break;
        case 'memory':
          console.log(`🌐 Fetching memory data from /api/memory?view=overview`);
          const memResponse = await fetch(`${baseUrl}/api/memory?view=overview`);
          console.log(`📡 Memory API response status: ${memResponse.status}`);
          
          if (!memResponse.ok) {
            console.error(`❌ Memory API error: ${memResponse.status} ${memResponse.statusText}`);
            return;
          }
          
          const memResult = await memResponse.json();
          console.log(`📥 Memory API result structure:`, {
            success: memResult.success,
            hasRecentMemories: !!memResult.recentMemories,
            hasInsights: !!memResult.insights,
            hasStats: !!memResult.stats,
            memoriesCount: memResult.recentMemories?.length,
            insightsCount: memResult.insights?.length
          });
          
          if (memResult.success !== false) {
            console.log(`💾 Setting memory data in state`);
            setData(prev => {
              const newState = { ...prev, memory: memResult };
              console.log(`🔄 New state after memory update - memory exists: ${!!newState.memory}`);
              return newState;
            });
          } else {
            console.warn(`⚠️ Memory API returned success: false`);
          }
          break;
        default:
          console.log(`ℹ️ No data loading needed for view: ${view}`);
      }
    } catch (error) {
      console.error(`💥 Error loading ${view} data:`, error);
    }
  }, []);

  console.log(`📍 useEffect setup ready`);

  // Load data on mount and view change
  useEffect(() => {
    console.log(`🚀 useEffect triggered for view: ${state.currentView}`);
    if (typeof window !== 'undefined') {
      console.log(`✅ Running in browser context`);
      loadViewData(state.currentView);
    } else {
      console.log(`⚠️ Running in server context - skipping data load`);
    }
  }, [state.currentView, loadViewData]);



  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const toggleMobileMenu = () => {
    setState(prev => ({ ...prev, mobileMenuOpen: !prev.mobileMenuOpen }));
  };

  const closeMobileMenu = () => {
    setState(prev => ({ ...prev, mobileMenuOpen: false }));
  };

  // Close mobile menu when view changes
  const handleViewChange = (view: DashboardView) => {
    console.log(`🔄 View change requested: ${state.currentView} → ${view}`);
    setState(prev => {
      const newState = { ...prev, currentView: view, mobileMenuOpen: false };
      console.log(`🎯 New state after view change:`, newState);
      return newState;
    });
  };

  // Calculate stats for sidebar
  const sidebarStats = {
    activeProjects: projects?.filter(p => p.status === 'ACTIVE')?.length || 0,
    totalTasks: tasks?.length || 0,
    recentNotes: data.knowledge?.stats?.totalNotes || 0,
    memoryDays: data.memory?.stats?.totalDays || 0,
  };

  // Only show loading screen for views that depend on projects/tasks
  const shouldShowLoading = (projectsLoading && state.currentView === 'projects') || 
                           (tasksLoading && state.currentView === 'tasks');

  console.log(`🔍 Loading check:`, {
    shouldShowLoading,
    projectsLoading,
    tasksLoading,
    currentView: state.currentView
  });

  if (shouldShowLoading) {
    console.log(`⏸️ Returning early due to loading state`);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-cyan-400 font-mono">Loading {state.currentView}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-x-hidden">
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
        onMobileMenuToggle={toggleMobileMenu}
        sidebarCollapsed={state.sidebarCollapsed}
        mobileMenuOpen={state.mobileMenuOpen}
      />

      <div className="flex relative">
        {/* Mobile Backdrop */}
        {state.mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <DashboardSidebar
          collapsed={state.sidebarCollapsed}
          mobileOpen={state.mobileMenuOpen}
          currentView={state.currentView}
          onViewChange={handleViewChange}
          onClose={closeMobileMenu}
          stats={sidebarStats}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 
          md:${state.sidebarCollapsed ? 'ml-16' : 'ml-64'}
          ${state.mobileMenuOpen ? 'pointer-events-none md:pointer-events-auto' : ''}
        `}>
          <div className="p-4 md:p-6">
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
                    {(() => {
                      console.log(`🎯 Rendering KnowledgeView with data:`, data.knowledge);
                      console.log(`📊 Knowledge data exists: ${!!data.knowledge}`);
                      if (data.knowledge) {
                        console.log(`📋 Knowledge data structure:`, Object.keys(data.knowledge));
                        console.log(`📈 Knowledge stats:`, data.knowledge.stats);
                      }
                      return <KnowledgeView data={data.knowledge} />;
                    })()}
                  </ErrorBoundary>
                )}
                {state.currentView === 'memory' && (
                  <ErrorBoundary variant="view" name="Memory">
                    {(() => {
                      console.log(`🎯 Rendering MemoryView with data:`, data.memory);
                      console.log(`📊 Memory data exists: ${!!data.memory}`);
                      if (data.memory) {
                        console.log(`📋 Memory data structure:`, Object.keys(data.memory));
                        console.log(`📈 Memory stats:`, data.memory.stats);
                      }
                      return <MemoryView data={data.memory} />;
                    })()}
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