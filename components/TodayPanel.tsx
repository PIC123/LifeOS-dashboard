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
        {/* Creative Status Header */}
        <div className="px-6 py-4 border-b border-command-border/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              {/* Vertical Status Line with Pretext */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-1 h-4 bg-command-accent/80 rounded-full animate-glow-orange"></div>
                <RotatedLabel angle="rotate--90" glow="accent" className="text-xs" delay={0.05}>
                  NOW
                </RotatedLabel>
              </div>
              
              {/* Ultra-thin Header with Pretext */}
              <div className="flex flex-col">
                <SciFiTitle className="text-base text-command-text uppercase leading-none" delay={0.1}>
                  STATUS
                </SciFiTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-10 h-px bg-command-primary/40"></div>
                  <GlowingAccent color="primary" className="text-xs uppercase" delay={0.15}>
                    TODAY
                  </GlowingAccent>
                </div>
              </div>
            </div>
            
            {/* Rotated Date with Pretext */}
            <SciFiTitle 
              orientation="rotate--6" 
              glow="primary" 
              className="text-sm" 
              delay={0.2}
            >
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: '2-digit' 
              }).replace(' ', '.').toUpperCase()}
            </SciFiTitle>
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

        {/* Ultra-thin Quick Actions */}
        <div className="px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="transform rotate-45">
                <div className="w-1 h-1 bg-command-primary rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-px bg-command-primary/30"></div>
                <RotatedLabel angle="normal" className="text-xs text-command-muted" delay={0.25}>
                  ACTIONS
                </RotatedLabel>
              </div>
            </div>
            
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  onClick={action.onClick}
                  className="group w-full flex items-center justify-between py-3 px-3 rounded-md border border-transparent transition-all duration-200 hover:border-command-border/40 hover:bg-command-surface/20"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 flex items-center justify-center text-${action.color} group-hover:animate-pulse transform group-hover:rotate-12 transition-transform`}>
                      <action.icon className="w-3 h-3" />
                    </div>
                    <SciFiTitle className="text-sm text-command-text uppercase" delay={index * 0.1 + 0.3}>
                      {action.label}
                    </SciFiTitle>
                  </div>
                  <GlowingAccent 
                    color="primary" 
                    orientation="rotate--6" 
                    className="text-xs opacity-0 group-hover:opacity-100 transition-all" 
                    delay={index * 0.05 + 0.4}
                  >
                    {action.shortcut}
                  </GlowingAccent>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Ultra-thin System Info */}
        <div className="px-6 py-3 bg-command-background/20 border-t border-command-border/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="transform rotate-45">
                <div className="w-1 h-1 bg-command-primary rounded-full animate-pulse"></div>
              </div>
              <GlowingAccent color="primary" className="text-xs text-command-muted uppercase" delay={0.5}>
                SYS.READY
              </GlowingAccent>
            </div>
            <SciFiTitle 
              orientation="rotate-3" 
              glow="primary" 
              className="text-xs" 
              delay={0.55}
            >
              {new Date().toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              })}
            </SciFiTitle>
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