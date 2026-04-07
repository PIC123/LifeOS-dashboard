'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import QuickNoteModal from '@/components/modals/QuickNoteModal';
import VoiceMemoModal from '@/components/modals/VoiceMemoModal';
import MarkAllCompleteModal from '@/components/modals/MarkAllCompleteModal';
import { 
  ActionNote,
  ActionVoice,
  ActionComplete
} from '@/components/ui/Icons';
import { useKeyboardShortcuts, quickActionShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Habit } from '@/lib/habitParser';
import { SciFiTitle, RotatedLabel, GlowingAccent } from '@/components/ui/PretextDisplay';

interface TodayPanelProps {
  habits?: Habit[];
  onMarkAllComplete?: () => void;
}

export default function TodayPanel({ habits = [], onMarkAllComplete }: TodayPanelProps) {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      ...quickActionShortcuts.note,
      callback: () => setShowNoteModal(true)
    },
    {
      ...quickActionShortcuts.voice,
      callback: () => setShowVoiceModal(true)
    },
    {
      ...quickActionShortcuts.complete,
      callback: () => setShowCompleteModal(true)
    }
  ]);

  const completedCount = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

  const quickActions = [
    {
      id: 'note',
      label: 'NOTE',
      shortcut: '⌘N',
      icon: ActionNote,
      onClick: () => setShowNoteModal(true),
      color: 'command-primary'
    },
    {
      id: 'voice',
      label: 'VOICE',
      shortcut: '⌘V',
      icon: ActionVoice,
      onClick: () => setShowVoiceModal(true),
      color: 'command-accent'
    },
    {
      id: 'complete',
      label: 'EXEC',
      shortcut: '⌘E',
      icon: ActionComplete,
      onClick: () => setShowCompleteModal(true),
      color: 'command-secondary'
    }
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="bg-command-surface/20 border border-command-border/30 rounded-lg overflow-hidden"
      >
        {/* Clean Status Header */}
        <div className="px-6 py-3 border-b border-command-border/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              {/* Simple Status Indicator */}
              <div className="w-1 h-4 bg-command-accent/60 rounded-full animate-pulse"></div>
              
              {/* Clean Header */}
              <div className="flex flex-col">
                <h3 className="font-ultra font-ultra-thin text-base text-command-text tracking-super-wide uppercase leading-none">
                  STATUS
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-8 h-px bg-command-primary/30"></div>
                  <span className="font-ultra font-thin text-xs text-command-primary tracking-ultra-wide uppercase">
                    TODAY
                  </span>
                </div>
              </div>
            </div>
            
            {/* Clean Date */}
            <div className="font-ultra font-thin text-sm text-command-primary tracking-wider">
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: '2-digit' 
              }).replace(' ', '.').toUpperCase()}
            </div>
          </div>

          {/* Progress Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-command-muted">COMPLETION</span>
              <span className="text-command-text">{Math.round(completionPercentage)}%</span>
            </div>
            <div className="relative h-1 bg-command-background/50 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-command-primary via-command-accent to-command-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Clean Quick Actions */}
        <div className="px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-1 bg-command-primary rounded-full"></div>
              <span className="font-ultra font-thin text-xs text-command-muted tracking-mega-wide uppercase">
                ACTIONS
              </span>
            </div>
            
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  onClick={action.onClick}
                  className="group w-full flex items-center justify-between py-2.5 px-3 rounded-md border border-transparent transition-all duration-200 hover:border-command-border/40 hover:bg-command-surface/20"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 flex items-center justify-center text-${action.color} group-hover:animate-pulse transition-all`}>
                      <action.icon className="w-3 h-3" />
                    </div>
                    <span className="font-ultra font-thin text-sm text-command-text tracking-ultra-wide uppercase">
                      {action.label}
                    </span>
                  </div>
                  <span className="font-ultra font-ultra-thin text-xs text-command-muted tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                    {action.shortcut}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Clean System Info */}
        <div className="px-6 py-3 bg-command-background/20 border-t border-command-border/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-command-primary rounded-full animate-pulse"></div>
              <span className="font-ultra font-ultra-thin text-xs text-command-muted tracking-ultra-wide uppercase">
                SYS.READY
              </span>
            </div>
            <div className="font-ultra font-thin text-xs text-command-primary tracking-wider">
              {new Date().toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <QuickNoteModal 
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
      />
      
      <VoiceMemoModal 
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />
      
      <MarkAllCompleteModal 
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        habits={habits}
        onMarkAllComplete={() => {
          onMarkAllComplete?.();
          setShowCompleteModal(false);
        }}
      />
    </>
  );
}