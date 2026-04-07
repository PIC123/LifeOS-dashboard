'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'dashboard', label: 'DASHBOARD', icon: '🎛️' },
  { id: 'calendar', label: 'CALENDAR', icon: '📅' },
  { id: 'reminders', label: 'REMINDERS', icon: '📝' },
  { id: 'knowledge', label: 'KNOWLEDGE', icon: '🧠' },
  { id: 'projects', label: 'PROJECTS', icon: '🚀' },
];

export default function MobileNavigation({ currentSection, onSectionChange }: MobileNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-command-surface/95 border-t-2 border-command-primary/30 backdrop-blur-xl z-50">
        <div className="flex items-center justify-around p-3">
          {sections.slice(0, 4).map((section) => (
            <motion.button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded transition-all ${
                currentSection === section.id
                  ? 'text-command-primary'
                  : 'text-command-muted hover:text-command-text'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="font-mono text-xs tracking-wide">
                {section.label.slice(0, 3)}
              </span>
            </motion.button>
          ))}
          
          {/* More Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex flex-col items-center gap-1 p-2 rounded text-command-accent"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">⋯</span>
            <span className="font-mono text-xs tracking-wide">MORE</span>
          </motion.button>
        </div>
      </div>

      {/* Expanded Menu Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-command-background/90 backdrop-blur-md z-50"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-command-surface border-t-2 border-command-primary/30 p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-mono text-lg text-command-text tracking-wider">
                  NAVIGATION.MENU
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-command-muted hover:text-command-text text-xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      onSectionChange(section.id);
                      setIsExpanded(false);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                      currentSection === section.id
                        ? 'border-command-primary bg-command-primary/10 text-command-primary'
                        : 'border-command-border/20 bg-command-panel/20 text-command-text hover:border-command-primary/40'
                    }`}
                  >
                    <span className="text-2xl">{section.icon}</span>
                    <div className="text-left">
                      <div className="font-mono text-sm font-medium">
                        {section.label}
                      </div>
                      <div className="font-mono text-xs text-command-muted">
                        {section.id.toUpperCase()}.MODULE
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}