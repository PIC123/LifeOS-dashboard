'use client';

import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  RectangleStackIcon, 
  CalendarIcon, 
  CheckCircleIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolid, 
  RectangleStackIcon as RectangleStackSolid, 
  CalendarIcon as CalendarSolid, 
  CheckCircleIcon as CheckCircleSolid
} from '@heroicons/react/24/solid';
import { TaskStats } from '@/types/tasks';
import { DashboardView } from '@/app/dashboard/page';

interface DashboardHeaderProps {
  currentView: DashboardView;
  onNavigate: (view: DashboardView) => void;
  onToggleSettings: () => void;
  stats: TaskStats;
}

const viewConfig = {
  today: {
    title: 'Today Focus',
    subtitle: 'Your daily command center',
    icon: HomeIcon,
    activeIcon: HomeSolid,
    gradient: 'from-command-primary to-command-accent'
  },
  projects: {
    title: 'Projects',
    subtitle: 'PARA project management',
    icon: RectangleStackIcon,
    activeIcon: RectangleStackSolid,
    gradient: 'from-command-accent to-command-secondary'
  },
  calendar: {
    title: 'Calendar',
    subtitle: 'Timeline and scheduling',
    icon: CalendarIcon,
    activeIcon: CalendarSolid,
    gradient: 'from-command-secondary to-command-primary'
  },
  tasks: {
    title: 'Tasks',
    subtitle: 'All task management',
    icon: CheckCircleIcon,
    activeIcon: CheckCircleSolid,
    gradient: 'from-command-primary to-command-secondary'
  }
};

export default function DashboardHeader({
  currentView,
  onNavigate,
  onToggleSettings,
  stats
}: DashboardHeaderProps) {
  const currentConfig = viewConfig[currentView];
  const CurrentIcon = currentConfig.activeIcon;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-command-surface/90 backdrop-blur-xl border-b border-command-border/30"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left: Current View Info */}
          <div className="flex items-center gap-4">
            <motion.div
              key={currentView}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-2 rounded-lg bg-gradient-to-br ${currentConfig.gradient} bg-opacity-20`}
            >
              <CurrentIcon className="w-6 h-6 text-command-text" />
            </motion.div>
            
            <div>
              <motion.h1 
                key={`title-${currentView}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="font-mono text-xl font-bold text-command-text tracking-wider"
              >
                LIFEOS.{currentConfig.title.toUpperCase()}
              </motion.h1>
              <motion.p 
                key={`subtitle-${currentView}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-sm text-command-muted font-mono"
              >
                {currentConfig.subtitle}
              </motion.p>
            </div>
          </div>

          {/* Center: View Navigation */}
          <div className="flex items-center gap-2 bg-command-panel/30 border border-command-border/30 rounded-lg p-1">
            {(Object.entries(viewConfig) as [DashboardView, typeof viewConfig[DashboardView]][]).map(([view, config]) => {
              const Icon = currentView === view ? config.activeIcon : config.icon;
              return (
                <button
                  key={view}
                  onClick={() => onNavigate(view)}
                  className={`relative flex items-center gap-2 px-3 py-2 font-mono text-xs rounded-md transition-all ${
                    currentView === view
                      ? 'bg-command-primary/20 text-command-primary border border-command-primary/30'
                      : 'text-command-muted hover:text-command-text hover:bg-command-panel/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{config.title.toUpperCase()}</span>
                  
                  {/* Active indicator */}
                  {currentView === view && (
                    <motion.div
                      layoutId="activeView"
                      className="absolute inset-0 bg-command-primary/10 border border-command-primary/20 rounded-md"
                      initial={false}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Quick Stats & Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-command-primary rounded-full"></div>
                <span className="text-command-muted">Today:</span>
                <span className="text-command-primary font-mono">{stats.todayTasks}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-command-secondary rounded-full"></div>
                <span className="text-command-muted">High Pri:</span>
                <span className="text-command-secondary font-mono">{stats.highPriorityTasks}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-command-accent rounded-full"></div>
                <span className="text-command-muted">Complete:</span>
                <span className="text-command-accent font-mono">{stats.completionRate}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-command-muted hover:text-command-accent transition-colors rounded-lg hover:bg-command-panel/20">
                <BellIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={onToggleSettings}
                className="p-2 text-command-muted hover:text-command-text transition-colors rounded-lg hover:bg-command-panel/20"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 w-full bg-command-background/50 rounded-full h-1"
        >
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: stats.completionRate / 100 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className={`h-1 rounded-full bg-gradient-to-r ${currentConfig.gradient} origin-left`}
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>
      </div>
    </motion.header>
  );
}