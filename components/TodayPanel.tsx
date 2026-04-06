'use client';

import { motion } from 'framer-motion';
import LiveClock from '@/components/ui/LiveClock';
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

export default function TodayPanel() {
  return (
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
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-command-primary/20 hover:bg-command-primary/30 rounded-lg text-command-primary font-medium transition-all duration-200 flex items-center gap-2 text-sm border border-command-primary/20"
          >
            <ActionNote size="sm" />
            Note
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-command-accent/20 hover:bg-command-accent/30 rounded-lg text-command-accent font-medium transition-all duration-200 flex items-center gap-2 text-sm border border-command-accent/20"
          >
            <ActionVoice size="sm" />
            Voice
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-command-secondary/20 hover:bg-command-secondary/30 rounded-lg text-command-secondary font-medium transition-all duration-200 flex items-center gap-2 text-sm border border-command-secondary/20"
          >
            <ActionComplete size="sm" />
            Complete
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-command-muted/20 hover:bg-command-muted/30 rounded-lg text-command-muted font-medium transition-all duration-200 flex items-center gap-2 text-sm border border-command-muted/20"
          >
            <EffectBrain size="sm" />
            Brain
          </motion.button>
        </div>
      </motion.div>

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
  );
}