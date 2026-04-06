'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import LiveClock from '@/components/ui/LiveClock';
import QuickNoteModal from '@/components/modals/QuickNoteModal';
import VoiceMemoModal from '@/components/modals/VoiceMemoModal';
import MarkAllCompleteModal from '@/components/modals/MarkAllCompleteModal';
import { 
  SystemTerminal, 
  TimeDay, 
  EffectSparkles, 
  DataCalendar,
  ActionNote,
  ActionVoice,
  ActionComplete,
  EffectBrain
} from '@/components/ui/Icons';
import { useKeyboardShortcuts, quickActionShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Habit } from '@/lib/habitParser';

interface TodayPanelProps {
  habits?: Habit[];
  onMarkAllComplete?: () => void;
}

export default function TodayPanel({ habits = [], onMarkAllComplete }: TodayPanelProps) {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showBrainView, setShowBrainView] = useState(false);

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
    },
    {
      ...quickActionShortcuts.brain,
      callback: () => setShowBrainView(true)
    }
  ]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-command-surface/80 backdrop-blur-sm border border-command-border rounded-xl p-6 hover:bg-command-surface transition-all duration-300"
      >
        <div className="flex items-center gap-2 mb-6">
          <SystemTerminal className="text-command-primary animate-glow" />
          <h2 className="text-xl font-semibold text-command-text">Mission Control</h2>
        </div>
        
        {/* Live Clock */}
        <LiveClock className="mb-6" />

        {/* Today's Focus */}
        <div className="space-y-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="border-l-4 border-command-primary pl-4 bg-command-primary/5 rounded-r-lg py-2"
          >
            <h3 className="text-command-text font-medium flex items-center gap-2">
              <EffectSparkles size="sm" className="text-command-primary" />
              Primary Objective
            </h3>
            <p className="text-command-muted text-sm mt-1">
              Complete dashboard pro enhancement mission
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border-l-4 border-command-accent pl-4 bg-command-accent/5 rounded-r-lg py-2"
          >
            <h3 className="text-command-text font-medium flex items-center gap-2">
              <SystemTerminal size="sm" className="text-command-accent" />
              Secondary Mission
            </h3>
            <p className="text-command-muted text-sm mt-1">
              Implement all 23 roadmap features
            </p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-command-text font-medium mb-3 flex items-center gap-2">
            <EffectSparkles size="sm" className="text-command-secondary" />
            Quick Actions
            <span className="text-xs text-command-muted font-normal ml-2">
              (⌘ shortcuts)
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNoteModal(true)}
              className="p-3 bg-command-primary/20 hover:bg-command-primary/30 rounded-lg text-command-primary font-medium transition-all duration-200 flex items-center gap-2 text-sm border border-command-primary/20"
              title="Quick Note (⌘N)"
            >
              <ActionNote size="sm" />
              Note
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVoiceModal(true)}
              className="p-3 bg-command-accent/20 hover:bg-command-accent/30 rounded-lg text-command-accent font-medium transition-all duration-200 flex items-center gap-2 text-sm border border-command-accent/20"
              title="Voice Memo (⌘M)"
            >
              <ActionVoice size="sm" />
              Voice
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCompleteModal(true)}
              className="p-3 bg-command-secondary/20 hover:bg-command-secondary/30 rounded-lg text-command-secondary font-medium transition-all duration-200 flex items-center gap-2 text-sm border border-command-secondary/20"
              title="Mark All Complete (⌘K)"
            >
              <ActionComplete size="sm" />
              Complete
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBrainView(!showBrainView)}
              className={`p-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm border ${
                showBrainView 
                  ? 'bg-command-muted/30 border-command-muted/40 text-command-text' 
                  : 'bg-command-muted/20 hover:bg-command-muted/30 border-command-muted/20 text-command-muted'
              }`}
              title="Three Brain View (⌘B)"
            >
              <EffectBrain size="sm" />
              Brain
            </motion.button>
          </div>
        </motion.div>

        {/* Brain View Toggle */}
        {showBrainView && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-3 bg-command-background/50 border border-command-border/50 rounded-lg"
          >
            <div className="text-xs text-command-muted mb-2">Three Brain System:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-command-primary/10 rounded text-command-primary">
                <div className="font-medium">Reptilian</div>
                <div className="opacity-70">Survival</div>
              </div>
              <div className="text-center p-2 bg-command-accent/10 rounded text-command-accent">
                <div className="font-medium">Limbic</div>
                <div className="opacity-70">Emotion</div>
              </div>
              <div className="text-center p-2 bg-command-secondary/10 rounded text-command-secondary">
                <div className="font-medium">Neocortex</div>
                <div className="opacity-70">Logic</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Energy & Status */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-4 border-t border-command-border"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <TimeDay className="text-command-secondary mx-auto mb-1" size="lg" />
              <div className="text-xs text-command-muted">Day Mode</div>
            </div>
            <div className="text-center">
              <EffectSparkles className="text-command-primary mx-auto mb-1" size="lg" />
              <div className="text-xs text-command-muted">High Focus</div>
            </div>
          </div>

          {/* Weather & Calendar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-command-background/50 rounded border border-command-border/50">
              <span className="text-command-text text-sm flex items-center gap-2">
                <DataCalendar size="sm" className="text-command-muted" />
                NYC Weather
              </span>
              <span className="text-command-muted text-sm">72°F ⛅</span>
            </div>
          </div>
        </motion.div>
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
        onMarkAllComplete={onMarkAllComplete || (() => {})}
      />
    </>
  );
}