'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/types/tasks';
import { ProjectStatus } from '@/lib/paraSystem';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  TagIcon,
  TrashIcon,
  PencilIcon,
  BoltIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleFilledIcon } from '@heroicons/react/24/solid';

interface TaskItemProps {
  task: Task;
  projects: ProjectStatus[];
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, projects, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const project = projects.find(p => p.id === task.projectId);
  const isOverdue = task.dueDate && task.dueDate < new Date().toISOString().split('T')[0] && task.status !== 'completed';
  const isCompleted = task.status === 'completed';

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-command-secondary border-command-secondary/30 bg-command-secondary/5';
      case 'medium': return 'text-command-accent border-command-accent/30 bg-command-accent/5';
      case 'low': return 'text-command-muted border-command-muted/30 bg-command-muted/5';
    }
  };

  const getEnergyIcon = (energy: Task['energy']) => {
    switch (energy) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
    }
  };

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'task': return '📋';
      case 'reminder': return '⏰';
      case 'event': return '📅';
      case 'habit': return '🔄';
    }
  };

  const handleToggleComplete = () => {
    onUpdate(task.id, {
      status: isCompleted ? 'active' : 'completed',
      completedAt: isCompleted ? undefined : new Date().toISOString()
    });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() !== task.title) {
      onUpdate(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className={`group relative bg-command-surface/30 border rounded-lg p-4 transition-all ${
        isCompleted 
          ? 'border-command-muted/20 opacity-60' 
          : isOverdue 
          ? 'border-command-secondary/30 bg-command-secondary/5'
          : 'border-command-border/30 hover:border-command-primary/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Toggle */}
        <button
          onClick={handleToggleComplete}
          className="flex-shrink-0 mt-1 transition-transform hover:scale-110"
        >
          {isCompleted ? (
            <CheckCircleFilledIcon className="w-5 h-5 text-command-primary" />
          ) : (
            <CheckCircleIcon className="w-5 h-5 text-command-muted hover:text-command-primary" />
          )}
        </button>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-command-background/50 border border-command-primary/30 rounded px-2 py-1 text-sm text-command-text font-medium focus:outline-none focus:ring-1 focus:ring-command-primary/50"
                autoFocus
              />
            ) : (
              <h3 
                className={`flex-1 text-sm font-medium cursor-pointer transition-colors ${
                  isCompleted 
                    ? 'text-command-muted line-through' 
                    : 'text-command-text hover:text-command-primary'
                }`}
                onClick={() => setIsEditing(true)}
              >
                {task.title}
              </h3>
            )}

            {/* Category Badge */}
            <span className="text-xs">{getCategoryIcon(task.category)}</span>
            
            {/* Priority Badge */}
            <div className={`px-2 py-1 rounded-full text-xs font-mono border ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-command-muted mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-xs text-command-muted">
            {/* Time */}
            {task.dueTime && (
              <div className="flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                <span className="font-mono">{task.dueTime}</span>
              </div>
            )}

            {/* Estimated Time */}
            {task.estimatedTime && (
              <div className="flex items-center gap-1">
                <span>⏱️</span>
                <span className="font-mono">{task.estimatedTime}m</span>
              </div>
            )}

            {/* Energy Level */}
            <div className="flex items-center gap-1" title={`${task.energy} energy required`}>
              <span>{getEnergyIcon(task.energy)}</span>
              <span className="font-mono">{task.energy.toUpperCase()}</span>
            </div>

            {/* Context */}
            {task.context && (
              <div className="flex items-center gap-1" title={`Context: ${task.context}`}>
                <MapPinIcon className="w-3 h-3" />
                <span className="font-mono">{task.context}</span>
              </div>
            )}

            {/* Project */}
            {project && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-command-accent"></div>
                <span className="font-mono">{project.name}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <TagIcon className="w-3 h-3 text-command-muted" />
              {task.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-1.5 py-0.5 text-xs font-mono bg-command-panel/30 border border-command-border/20 rounded text-command-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Overdue Warning */}
          {isOverdue && (
            <div className="flex items-center gap-1 mt-2 text-command-secondary">
              <ExclamationTriangleIcon className="w-3 h-3" />
              <span className="text-xs font-mono">OVERDUE</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-command-muted hover:text-command-accent transition-colors"
            title="Edit task"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-command-muted hover:text-command-secondary transition-colors"
            title="Delete task"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar for recurring tasks */}
      {task.recurringPattern && (
        <div className="mt-3 pt-2 border-t border-command-border/20">
          <div className="flex items-center gap-2 text-xs text-command-muted">
            <span>🔄</span>
            <span className="font-mono">
              {task.recurringPattern.type.toUpperCase()} 
              {task.recurringPattern.interval > 1 && ` (${task.recurringPattern.interval}x)`}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}