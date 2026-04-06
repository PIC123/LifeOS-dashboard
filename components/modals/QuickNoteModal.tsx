'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { ActionNote, NavClose, EffectSparkles } from '@/components/ui/Icons';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils';

interface Note {
  id: string;
  content: string;
  tags: string[];
  timestamp: number;
}

interface QuickNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickNoteModal({ isOpen, onClose }: QuickNoteModalProps) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSave = () => {
    if (!content.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    const note: Note = {
      id: crypto.randomUUID(),
      content: content.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      timestamp: Date.now()
    };

    const existingNotes = loadFromLocalStorage<Note[]>('lifeos-notes', []);
    const updatedNotes = [note, ...existingNotes];
    saveToLocalStorage('lifeos-notes', updatedNotes);

    toast.success('Note saved! 📝', { duration: 2000 });
    setContent('');
    setTags('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog as={motion.div} open={isOpen} onClose={onClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full max-w-md bg-command-surface border border-command-border rounded-xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <ActionNote className="text-command-primary animate-glow" size="lg" />
                  <Dialog.Title className="text-xl font-semibold text-command-text">
                    Quick Note
                  </Dialog.Title>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg text-command-muted hover:text-command-text hover:bg-command-background transition-all"
                >
                  <NavClose size="md" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-command-text mb-2">
                    Note Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What's on your mind?"
                    rows={6}
                    className="w-full px-4 py-3 bg-command-background border border-command-border rounded-lg text-command-text placeholder-command-muted focus:border-command-primary focus:ring-2 focus:ring-command-primary/20 transition-all resize-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-command-text mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="work, ideas, personal"
                    className="w-full px-4 py-3 bg-command-background border border-command-border rounded-lg text-command-text placeholder-command-muted focus:border-command-primary focus:ring-2 focus:ring-command-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-command-background border border-command-border text-command-muted rounded-lg hover:border-command-muted transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!content.trim()}
                  className="flex-1 px-4 py-3 bg-command-primary text-white rounded-lg hover:bg-command-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <EffectSparkles size="sm" />
                  Save Note
                </motion.button>
              </div>

              <div className="mt-4 text-xs text-command-muted text-center">
                Press Cmd/Ctrl + Enter to save quickly
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}