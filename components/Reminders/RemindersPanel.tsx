'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reminder } from '@/lib/remindersSystem';

interface RemindersPanelProps {
  className?: string;
}

export default function RemindersPanel({ className = '' }: RemindersPanelProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/reminders');
      const data = await response.json();
      
      if (data.success) {
        setReminders(data.reminders);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'all') return !reminder.completed;
    return !reminder.completed && reminder.priority === filter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-command-secondary';
      case 'medium': return 'text-command-primary';
      case 'low': return 'text-command-accent';
      default: return 'text-command-text';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return '🏃';
      case 'work': return '💼';
      case 'project': return '🚀';
      case 'personal': return '👤';
      case 'follow-up': return '📞';
      default: return '📝';
    }
  };

  const FilterTabs = () => (
    <div className="flex bg-command-panel/30 border border-command-border/30 rounded-lg p-1 mb-4">
      {(['all', 'high', 'medium', 'low'] as const).map((filterOption) => (
        <motion.button
          key={filterOption}
          onClick={() => setFilter(filterOption)}
          className={`px-3 py-1 font-mono text-xs tracking-wider uppercase transition-all ${
            filter === filterOption
              ? 'bg-command-primary text-command-background'
              : 'text-command-muted hover:text-command-text'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {filterOption}
        </motion.button>
      ))}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-command-surface/80 border-2 border-command-primary/20 rounded-lg p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-command-primary rounded-full animate-pulse"></div>
          <h2 className="font-mono text-lg text-command-text tracking-wider">
            REMINDERS.SYSTEM
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-command-secondary rounded-full"></div>
          <span className="font-mono text-xs text-command-muted">
            {filteredReminders.length} ACTIVE
          </span>
        </div>
      </div>

      <FilterTabs />

      {/* Reminders List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="font-mono text-sm text-command-muted">LOADING.REMINDERS...</div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredReminders.map((reminder, index) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05 }}
                className="bg-command-panel/20 border border-command-border/20 rounded p-4 hover:border-command-primary/40 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <motion.button
                    onClick={() => toggleComplete(reminder.id)}
                    className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center transition-all ${
                      reminder.completed
                        ? 'bg-command-primary border-command-primary'
                        : 'border-command-border/50 hover:border-command-primary/60'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {reminder.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-command-background text-xs"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{getCategoryIcon(reminder.category)}</span>
                      <h3 className={`font-mono text-sm font-medium ${
                        reminder.completed ? 'line-through opacity-60' : ''
                      }`}>
                        {reminder.title}
                      </h3>
                      <span className={`font-mono text-xs px-2 py-0.5 rounded ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className={`text-xs text-command-muted mb-2 ${
                      reminder.completed ? 'line-through opacity-60' : ''
                    }`}>
                      {reminder.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-mono text-command-muted">
                      <span>
                        {reminder.category.toUpperCase()}
                      </span>
                      <span>
                        {reminder.createdDate.split('-').slice(1).join('.')}
                      </span>
                      <span>
                        SRC: {reminder.source.toUpperCase()}
                      </span>
                    </div>

                    {reminder.context && (
                      <div className="mt-2 text-xs text-command-accent font-mono">
                        → {reminder.context}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredReminders.length === 0 && (
            <div className="text-center py-8">
              <div className="font-mono text-sm text-command-muted">
                {filter === 'all' ? 'NO.ACTIVE.REMINDERS' : `NO.${filter.toUpperCase()}.PRIORITY.REMINDERS`}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}