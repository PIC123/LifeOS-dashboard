'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  RectangleStackIcon, 
  CalendarIcon, 
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { TaskStats } from '@/types/tasks';
import { DashboardView } from '@/app/dashboard/page';

interface DashboardSidebarProps {
  currentView: DashboardView;
  collapsed: boolean;
  onNavigate: (view: DashboardView) => void;
  onToggleCollapse: () => void;
  stats: TaskStats;
}

const navigationItems = [
  {
    id: 'today' as DashboardView,
    label: 'Today Focus',
    icon: HomeIcon,
    description: 'Daily dashboard'
  },
  {
    id: 'projects' as DashboardView,
    label: 'Projects',
    icon: RectangleStackIcon,
    description: 'PARA system'
  },
  {
    id: 'calendar' as DashboardView,
    label: 'Calendar',
    icon: CalendarIcon,
    description: 'Timeline view'
  },
  {
    id: 'tasks' as DashboardView,
    label: 'Tasks',
    icon: CheckCircleIcon,
    description: 'Task management'
  }
];

export default function DashboardSidebar({
  currentView,
  collapsed,
  onNavigate,
  onToggleCollapse,
  stats
}: DashboardSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-command-border/20">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-command-primary to-command-accent rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-command-background rounded-full animate-pulse"></div>
              </div>
              <div>
                <div className="font-mono text-sm font-bold text-command-text tracking-wider">
                  LIFEOS
                </div>
                <div className="text-xs text-command-muted font-mono">
                  v2.1.0
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-command-muted hover:text-command-text transition-colors rounded-md hover:bg-command-panel/20"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-4 h-4" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                  isActive 
                    ? 'bg-command-primary/10 text-command-primary border border-command-primary/20' 
                    : 'text-command-muted hover:text-command-text hover:bg-command-panel/20'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-command-primary' : ''
                }`} />
                
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 text-left overflow-hidden"
                    >
                      <div className="font-mono text-sm font-medium">
                        {item.label}
                      </div>
                      <div className="text-xs opacity-70">
                        {item.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-command-primary rounded-r-full"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Stats Panel */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="p-3 border-t border-command-border/20"
          >
            <div className="bg-command-panel/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <ChartBarIcon className="w-4 h-4 text-command-accent" />
                <span className="font-mono text-xs text-command-muted tracking-wider">
                  QUICK.STATS
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-command-muted flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    Today
                  </span>
                  <span className="font-mono text-command-primary">{stats.todayTasks}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-command-muted flex items-center gap-1">
                    <ExclamationTriangleIcon className="w-3 h-3" />
                    Overdue
                  </span>
                  <span className="font-mono text-command-secondary">{stats.overdueTasks}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-command-muted">Complete</span>
                  <span className="font-mono text-command-accent">{stats.completionRate}%</span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full bg-command-background/30 rounded-full h-1.5 mt-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.completionRate}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-1.5 rounded-full bg-gradient-to-r from-command-primary to-command-accent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="p-3 border-t border-command-border/20">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div className="text-xs text-command-muted font-mono">
                SYSTEM.STATUS: <span className="text-command-accent">ONLINE</span>
              </div>
              <div className="text-xs text-command-muted/50 font-mono mt-1">
                Last sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-2 h-2 bg-command-accent rounded-full animate-pulse"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}