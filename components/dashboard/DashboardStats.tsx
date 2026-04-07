'use client';

import { motion } from 'framer-motion';
import { 
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { Task, TaskStats } from '@/types/tasks';
import { ProjectStatus } from '@/lib/paraSystem';
import { CalendarEvent } from '@/lib/googleCalendarOAuth';

interface DashboardStatsProps {
  tasks: Task[];
  events: CalendarEvent[];
  projects: ProjectStatus[];
  stats: TaskStats;
}

export default function DashboardStats({
  tasks,
  events,
  projects,
  stats
}: DashboardStatsProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(event => {
    try {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === today;
    } catch {
      return false;
    }
  });

  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  
  const todayTimeEstimate = tasks
    .filter(t => t.dueDate === today && t.status !== 'completed')
    .reduce((acc, task) => acc + (task.estimatedTime || 0), 0);

  const statCards = [
    {
      id: 'today-tasks',
      label: 'Today Tasks',
      value: stats.todayTasks,
      icon: ClockIcon,
      color: 'command-primary',
      sublabel: `${Math.round(todayTimeEstimate / 60)}h estimated`
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: stats.overdueTasks,
      icon: ExclamationTriangleIcon,
      color: 'command-secondary',
      sublabel: 'need attention'
    },
    {
      id: 'completed',
      label: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircleIcon,
      color: 'command-accent',
      sublabel: `${stats.completionRate}% rate`
    },
    {
      id: 'events',
      label: 'Events Today',
      value: todayEvents.length,
      icon: CalendarIcon,
      color: 'command-text',
      sublabel: 'scheduled'
    },
    {
      id: 'projects',
      label: 'Active Projects',
      value: activeProjects,
      icon: ChartBarIcon,
      color: 'command-accent',
      sublabel: 'in progress'
    },
    {
      id: 'performance',
      label: 'Performance',
      value: stats.completionRate,
      icon: TrophyIcon,
      color: stats.completionRate >= 80 ? 'command-accent' : stats.completionRate >= 60 ? 'command-primary' : 'command-secondary',
      sublabel: '% complete',
      isPercentage: true
    }
  ];

  return (
    <div className="bg-command-surface/30 border-b border-command-border/30 px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative bg-command-panel/20 border border-${stat.color}/20 rounded-lg p-3 hover:bg-command-panel/30 transition-all group cursor-pointer`}
            >
              {/* Background Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 bg-${stat.color}/10 rounded-md`}>
                    <Icon className={`w-3.5 h-3.5 text-${stat.color}`} />
                  </div>
                  
                  {/* Trend indicator - could be enhanced with actual trend data */}
                  <div className="w-1.5 h-1.5 bg-current rounded-full opacity-30"></div>
                </div>

                {/* Value */}
                <div className="mb-1">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1, type: 'spring', bounce: 0.4 }}
                    className={`text-lg font-mono font-bold text-${stat.color}`}
                  >
                    {stat.value}{stat.isPercentage ? '%' : ''}
                  </motion.div>
                </div>

                {/* Label */}
                <div>
                  <div className="text-xs font-mono text-command-text font-medium tracking-wider">
                    {stat.label.toUpperCase()}
                  </div>
                  <div className="text-xs text-command-muted mt-0.5">
                    {stat.sublabel}
                  </div>
                </div>

                {/* Micro Progress Bar for Performance */}
                {stat.id === 'performance' && (
                  <div className="mt-2 w-full bg-command-background/30 rounded-full h-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      className={`h-1 rounded-full bg-${stat.color}`}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions Bar - appears on hover */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 0, height: 0 }}
        whileHover={{ opacity: 1, height: 'auto' }}
        className="mt-4 pt-4 border-t border-command-border/20"
      >
        <div className="flex items-center justify-between text-xs text-command-muted">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-command-accent rounded-full animate-pulse"></div>
              <span className="font-mono">SYSTEM.HEALTHY</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-mono">LAST.SYNC:</span>
              <span className="text-command-text">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-2 py-1 text-command-muted hover:text-command-accent transition-colors font-mono">
              REFRESH
            </button>
            <button className="px-2 py-1 text-command-muted hover:text-command-accent transition-colors font-mono">
              EXPORT
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}