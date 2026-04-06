'use client';

import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => {
        const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
        const metaMatch = s.metaKey === undefined || s.metaKey === event.metaKey;
        const ctrlMatch = s.ctrlKey === undefined || s.ctrlKey === event.ctrlKey;
        const shiftMatch = s.shiftKey === undefined || s.shiftKey === event.shiftKey;
        const altMatch = s.altKey === undefined || s.altKey === event.altKey;

        return keyMatch && metaMatch && ctrlMatch && shiftMatch && altMatch;
      });

      if (shortcut) {
        event.preventDefault();
        shortcut.callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Common shortcut configurations
export const quickActionShortcuts = {
  note: { key: 'n', metaKey: true, description: 'Quick Note (⌘N)' },
  voice: { key: 'm', metaKey: true, description: 'Voice Memo (⌘M)' },
  complete: { key: 'k', metaKey: true, description: 'Mark All Complete (⌘K)' },
  brain: { key: 'b', metaKey: true, description: 'Brain View (⌘B)' },
  help: { key: '?', shiftKey: true, description: 'Show Shortcuts (?)' }
};