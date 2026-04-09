'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RectangleStackIcon,
  PlusIcon,
  FolderIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Task } from '@/types/tasks';
import { ProjectStatus } from '@/lib/paraSystem';
import TaskItem from '@/components/Tasks/TaskItem';
import TaskQuickAdd from '@/components/Tasks/TaskQuickAdd';

interface ProjectsViewProps {
  projects: ProjectStatus[];
  areas: ProjectStatus[];
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

type ViewMode = 'grid' | 'kanban' | 'list';
type FilterType = 'all' | 'projects' | 'areas' | 'active' | 'paused';

export default function ProjectsView({
  projects,
  areas,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}: ProjectsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Combine projects and areas
  const allItems = [...projects, ...areas];
  
  // Filter items
  const filteredItems = allItems.filter(item => {
    if (filter === 'projects') return item.type === 'project';
    if (filter === 'areas') return item.type === 'area';
    if (filter === 'active') return item.status === 'ACTIVE';
    if (filter === 'paused') return item.status === 'PAUSED';
    return true;
  });

  // Get tasks for selected project
  const selectedProjectTasks = selectedProject 
    ? tasks.filter(task => task.projectId === selectedProject || task.areaId === selectedProject)
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'command-primary';
      case 'PAUSED': return 'command-accent';
      case 'COMPLETE': return 'command-text';
      case 'PLANNING': return 'command-secondary';
      default: return 'command-muted';
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'command-secondary';
      case 'medium': return 'command-primary';
      case 'low': return 'command-accent';
    }
  };

  const ProjectCard = ({ item }: { item: ProjectStatus }) => {
    const itemTasks = tasks.filter(task => task.projectId === item.id || task.areaId === item.id);
    const completedTasks = itemTasks.filter(t => t.status === 'completed').length;
    const totalTasks = itemTasks.length;
    const activeHours = itemTasks
      .filter(t => t.status !== 'completed')
      .reduce((acc, task) => acc + (task.estimatedTime || 0), 0) / 60;

    return (
      <motion.div
        layout
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedProject(selectedProject === item.id ? null : item.id)}
        className={`relative bg-command-surface/40 border rounded-lg p-3 md:p-4 cursor-pointer transition-all touch-manipulation ${
          selectedProject === item.id
            ? `border-${getStatusColor(item.status)}/50 bg-${getStatusColor(item.status)}/10`
            : 'border-command-border/30 hover:border-command-primary/30 active:border-command-primary/50'
        }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 space-y-3 sm:space-y-0">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`p-1.5 md:p-2 bg-${getStatusColor(item.status)}/10 rounded-lg`}>
              {item.type === 'project' ? (
                <RectangleStackIcon className={`w-4 h-4 md:w-5 md:h-5 text-${getStatusColor(item.status)}`} />
              ) : (
                <FolderIcon className={`w-4 h-4 md:w-5 md:h-5 text-${getStatusColor(item.status)}`} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-mono text-sm md:text-base font-medium text-command-text truncate">
                {item.name}
              </h3>
              <div className="flex items-center gap-1 md:gap-2 mt-1 flex-wrap">
                <span className={`px-2 py-0.5 text-xs font-mono rounded bg-${getStatusColor(item.status)}/10 text-${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <span className={`px-2 py-0.5 text-xs font-mono rounded bg-${getPriorityColor(item.priority)}/10 text-${getPriorityColor(item.priority)}`}>
                  {item.priority.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right sm:text-right">
            <div className={`text-lg md:text-xl font-mono font-bold text-${getStatusColor(item.status)}`}>
              {item.progress}%
            </div>
            <div className="text-xs text-command-muted">complete</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-command-muted mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-command-background/30 rounded-full h-2 mb-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${item.progress}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-2 rounded-full bg-gradient-to-r from-${getStatusColor(item.status)} to-${getPriorityColor(item.priority)}`}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-center">
            <div className="font-mono text-command-text">{totalTasks}</div>
            <div className="text-command-muted">tasks</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-command-accent">{completedTasks}</div>
            <div className="text-command-muted">done</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-command-primary">{Math.round(activeHours)}h</div>
            <div className="text-command-muted">left</div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-3 pt-3 border-t border-command-border/20 text-xs text-command-muted text-center">
          Updated: {item.lastUpdated}
        </div>

        {/* Selection Indicator */}
        {selectedProject === item.id && (
          <motion.div
            layoutId="selectedProject"
            className={`absolute inset-0 border-2 border-${getStatusColor(item.status)}/50 rounded-lg pointer-events-none`}
            initial={false}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-mono font-bold text-command-text mb-2">
            PARA.PROJECTS
          </h1>
          <p className="text-command-muted text-sm hidden sm:block">
            Projects, Areas, Resources & Archives
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-command-panel/30 border border-command-border/30 rounded-lg p-1">
            {(['grid', 'kanban', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2 md:px-3 py-1.5 text-xs font-mono rounded transition-all touch-manipulation ${
                  viewMode === mode
                    ? 'bg-command-primary/20 text-command-primary'
                    : 'text-command-muted hover:text-command-text active:bg-command-primary/10'
                }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-command-primary/10 border border-command-primary/30 rounded-lg text-command-primary hover:bg-command-primary/20 active:bg-command-primary/30 transition-all group touch-manipulation min-h-[44px]"
          >
            <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="font-mono text-sm">NEW.TASK</span>
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
      >
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-command-muted" />
          <span className="text-xs font-mono text-command-muted">FILTER:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto scrollbar-hide">
          {(['all', 'projects', 'areas', 'active', 'paused'] as FilterType[]).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-2 md:px-3 py-1.5 text-xs font-mono rounded transition-all whitespace-nowrap touch-manipulation ${
                filter === filterType
                  ? 'bg-command-accent/20 text-command-accent'
                  : 'text-command-muted hover:text-command-text hover:bg-command-panel/20 active:bg-command-accent/10'
              }`}
            >
              {filterType.toUpperCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Projects Grid */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProjectCard item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-command-surface/30 border border-command-border/30 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 bg-${getStatusColor(item.status)}/10 rounded`}>
                          {item.type === 'project' ? (
                            <RectangleStackIcon className={`w-4 h-4 text-${getStatusColor(item.status)}`} />
                          ) : (
                            <FolderIcon className={`w-4 h-4 text-${getStatusColor(item.status)}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-mono text-sm font-medium text-command-text">{item.name}</h3>
                          <p className="text-xs text-command-muted">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-mono text-${getStatusColor(item.status)}`}>
                            {item.progress}%
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Kanban mode would go here - simplified for now */}
            {viewMode === 'kanban' && (
              <div className="bg-command-surface/20 border border-command-border/30 rounded-lg p-6 text-center">
                <RectangleStackIcon className="w-12 h-12 text-command-muted mx-auto mb-4" />
                <div className="font-mono text-command-text">KANBAN.MODE</div>
                <div className="text-sm text-command-muted">Enhanced kanban view coming soon</div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Project Details Sidebar */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key={selectedProject}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-command-surface/20 border border-command-border/30 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center gap-2 pb-3 border-b border-command-border/20">
                  <EyeIcon className="w-4 h-4 text-command-accent" />
                  <span className="font-mono text-sm text-command-accent">PROJECT.DETAILS</span>
                </div>

                {/* Project Tasks */}
                <div>
                  <h4 className="font-mono text-xs text-command-muted mb-3 tracking-wider">
                    TASKS ({selectedProjectTasks.length})
                  </h4>
                  
                  {selectedProjectTasks.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {selectedProjectTasks.map(task => (
                        <div key={task.id} className="text-xs">
                          <TaskItem
                            task={task}
                            projects={projects}
                            onUpdate={onUpdateTask}
                            onDelete={onDeleteTask}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-command-muted">
                      <CheckCircleIcon className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-mono text-xs">NO.TASKS</div>
                      <button
                        onClick={() => setShowQuickAdd(true)}
                        className="mt-2 px-3 py-1 text-xs font-mono text-command-primary border border-command-primary/30 rounded hover:bg-command-primary/10 transition-colors"
                      >
                        ADD.TASK
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-command-surface/20 border border-command-border/30 rounded-lg p-6 text-center"
              >
                <ChartBarIcon className="w-12 h-12 text-command-muted mx-auto mb-4" />
                <div className="font-mono text-command-text mb-2">SELECT.PROJECT</div>
                <div className="text-sm text-command-muted">
                  Click on a project card to view details and tasks
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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