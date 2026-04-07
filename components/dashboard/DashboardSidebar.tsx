'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen,
  Brain, 
  MessageSquare,
  CheckSquare,
  BarChart3
} from 'lucide-react';

export type DashboardView = 'projects' | 'knowledge' | 'memory' | 'tasks';

interface DashboardSidebarProps {
  currentView: DashboardView;
  collapsed: boolean;
  onViewChange: (view: DashboardView) => void;
  stats: {
    activeProjects: number;
    totalTasks: number;
    recentNotes: number;
    memoryDays: number;
  };
}

const navigationItems = [
  {
    id: 'projects' as DashboardView,
    label: 'Projects',
    icon: FolderOpen,
    color: 'text-cyan-400',
  },
  {
    id: 'knowledge' as DashboardView,
    label: 'Knowledge',
    icon: Brain,
    color: 'text-purple-400',
  },
  {
    id: 'memory' as DashboardView,
    label: 'Memory',
    icon: MessageSquare,
    color: 'text-green-400',
  },
  {
    id: 'tasks' as DashboardView,
    label: 'Tasks',
    icon: CheckSquare,
    color: 'text-orange-400',
  },
];

export default function DashboardSidebar({
  currentView,
  collapsed,
  onViewChange,
  stats
}: DashboardSidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      className="bg-zinc-900 border-r border-zinc-800 h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-black rounded-full"></div>
              </div>
              <div>
                <div className="font-mono text-sm font-bold text-white tracking-wider">
                  COMMAND CENTER
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  Personal Dashboard
                </div>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto"
            >
              <div className="w-3 h-3 bg-black rounded-full"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? item.color : ''}`} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Stats */}
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-t border-zinc-800"
          >
            <div className="flex items-center space-x-2 mb-3">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs text-zinc-400 tracking-wider">
                OVERVIEW
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Active Projects</span>
                <span className="font-mono text-cyan-400">{stats.activeProjects}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Tasks</span>
                <span className="font-mono text-orange-400">{stats.totalTasks}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Knowledge Notes</span>
                <span className="font-mono text-purple-400">{stats.recentNotes}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Memory Days</span>
                <span className="font-mono text-green-400">{stats.memoryDays}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2 text-xs text-zinc-500"
            >
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}