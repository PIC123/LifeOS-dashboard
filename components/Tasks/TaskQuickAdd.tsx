'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/types/tasks';
import { ProjectStatus } from '@/lib/paraSystem';
import { XMarkIcon, PlusIcon, ClockIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

interface TaskQuickAddProps {
  projects: ProjectStatus[];
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export default function TaskQuickAdd({ projects, onAdd, onClose }: TaskQuickAddProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [category, setCategory] = useState<Task['category']>('task');
  const [energy, setEnergy] = useState<Task['energy']>('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  const [projectId, setProjectId] = useState('');
  const [context, setContext] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      status: 'active',
      priority,
      category,
      energy,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
      projectId: projectId || undefined,
      context: context.trim() || undefined,
      tags,
    };

    onAdd(newTask);
    onClose();
  };

  const quickTimeButtons = [
    { label: '15m', value: '15' },
    { label: '30m', value: '30' },
    { label: '1h', value: '60' },
    { label: '2h', value: '120' },
  ];

  const contextOptions = [
    { label: 'Laptop', value: 'laptop' },
    { label: 'Phone', value: 'phone' },
    { label: 'Home', value: 'home' },
    { label: 'Office', value: 'office' },
    { label: 'Anywhere', value: 'anywhere' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-command-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-command-surface border-2 border-command-primary/20 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-command-border/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-command-primary rounded-full animate-pulse"></div>
            <h2 className="font-mono text-lg text-command-text tracking-wider">
              ADD.NEW.TASK
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-command-muted hover:text-command-text transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono text-command-muted mb-2 tracking-wider">
              TASK.TITLE *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-command-background/50 border border-command-border/30 rounded-lg px-4 py-3 text-command-text placeholder-command-muted/50 focus:outline-none focus:ring-2 focus:ring-command-primary/50 focus:border-command-primary/50"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono text-command-muted mb-2 tracking-wider">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details..."
              rows={2}
              className="w-full bg-command-background/50 border border-command-border/30 rounded-lg px-4 py-3 text-command-text placeholder-command-muted/50 focus:outline-none focus:ring-2 focus:ring-command-primary/50 focus:border-command-primary/50 resize-none"
            />
          </div>

          {/* Quick Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-mono text-command-muted mb-2 tracking-wider">
                PRIORITY
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="w-full bg-command-background/50 border border-command-border/30 rounded-lg px-3 py-2 text-command-text focus:outline-none focus:ring-2 focus:ring-command-primary/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-mono text-command-muted mb-2 tracking-wider">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Task['category'])}
                className="w-full bg-command-background/50 border border-command-border/30 rounded-lg px-3 py-2 text-command-text focus:outline-none focus:ring-2 focus:ring-command-primary/50"
              >
                <option value="task">Task</option>
                <option value="reminder">Reminder</option>
                <option value="habit">Habit</option>
                <option value="event">Event</option>
              </select>
            </div>

            {/* Energy Level */}
            <div>
              <label className="block text-xs font-mono text-command-muted mb-2 tracking-wider">
                ENERGY
              </label>
              <select
                value={energy}
                onChange={(e) => setEnergy(e.target.value as Task['energy'])}
                className="w-full bg-command-background/50 border border-command-border/30 rounded-lg px-3 py-2 text-command-text focus:outline-none focus:ring-2 focus:ring-command-primary/50"
              >
                <option value="low">🌱 Low</option>
                <option value="medium">⚡ Medium</option>
                <option value="high">🔥 High</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-command-muted mb-2 tracking-wider">
                DUE.DATE
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-command-muted" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-command-background/50 border border-command-border/30 rounded-lg pl-10 pr-4 py-3 text-command-text focus:outline-none focus:ring-2 focus:ring-command-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-command-muted mb-2 tracking-wider">
                TIME
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-command-muted" />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full bg-command-background/50 border border-command-border/30 rounded-lg pl-10 pr-4 py-3 text-command-text focus:outline-none focus:ring-2 focus:ring-command-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-xs font-mono text-command-muted mb-2 tracking-wider">
              ESTIMATED.TIME (minutes)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="0"
                min="0"
                className="flex-1 bg-command-background/50 border border-command-border/30 rounded-lg px-4 py-2 text-command-text placeholder-command-muted/50 focus:outline-none focus:ring-2 focus:ring-command-primary/50"
              />
              {quickTimeButtons.map(btn => (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => setEstimatedTime(btn.value)}
                  className="px-3 py-2 text-xs font-mono text-command-muted border border-command-border/30 rounded hover:bg-command-panel/20 hover:text-command-text transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project & Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-command-muted mb-2 tracking-wider">
                PROJECT
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-command-background/50 border border-command-border/30 rounded-lg px-4 py-2 text-command-text focus:outline-none focus:ring-2 focus:ring-command-primary/50"
              >
                <option value="">No project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-command-muted mb-2 tracking-wider">
                CONTEXT
              </label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full bg-command-background/50 border border-command-border/30 rounded-lg px-4 py-2 text-command-text focus:outline-none focus:ring-2 focus:ring-command-primary/50"
              >
                <option value="">Select context</option>
                {contextOptions.map(ctx => (
                  <option key={ctx.value} value={ctx.value}>
                    {ctx.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-mono text-command-muted mb-2 tracking-wider">
              TAGS
            </label>
            <div className="relative">
              <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-command-muted" />
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="development, urgent, review (comma separated)"
                className="w-full bg-command-background/50 border border-command-border/30 rounded-lg pl-10 pr-4 py-3 text-command-text placeholder-command-muted/50 focus:outline-none focus:ring-2 focus:ring-command-primary/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-command-border/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-command-muted hover:text-command-text transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-command-primary/20 border border-command-primary/30 rounded-lg text-command-primary hover:bg-command-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="font-mono text-sm">CREATE.TASK</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}