'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  const { isMobile, isTablet, isDesktop } = useMobile();

  const getLayoutClasses = () => {
    if (isMobile) {
      return 'px-4 py-4 space-y-4';
    } else if (isTablet) {
      return 'px-6 py-5 space-y-5';
    } else {
      return 'px-6 py-6 space-y-6';
    }
  };

  return (
    <motion.div 
      className={cn('w-full max-w-7xl mx-auto', getLayoutClasses(), className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveGrid({ children, className }: ResponsiveGridProps) {
  const { isMobile, isTablet } = useMobile();

  const getGridClasses = () => {
    if (isMobile) {
      return 'grid grid-cols-1 gap-4';
    } else if (isTablet) {
      return 'grid grid-cols-1 lg:grid-cols-2 gap-5';
    } else {
      return 'grid grid-cols-1 lg:grid-cols-3 gap-6';
    }
  };

  return (
    <motion.div 
      className={cn(getGridClasses(), className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, staggerChildren: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function MobileDrawer({ isOpen, onClose, children, title }: MobileDrawerProps) {
  const { isMobile } = useMobile();

  if (!isMobile) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      className={cn(
        'fixed inset-0 z-50 flex flex-col bg-command-surface',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: isOpen ? 0 : -50 }}
        className="flex items-center justify-between p-4 border-b border-command-border bg-command-surface/95 backdrop-blur-sm"
      >
        {title && (
          <h2 className="text-lg font-semibold text-command-text">{title}</h2>
        )}
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-command-muted hover:text-command-text hover:bg-command-background transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: isOpen ? 0 : 50, opacity: isOpen ? 1 : 0 }}
        className="flex-1 overflow-y-auto p-4"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface TouchFriendlyButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function TouchFriendlyButton({ 
  onClick, 
  children, 
  variant = 'primary',
  size = 'md',
  className,
  disabled = false
}: TouchFriendlyButtonProps) {
  const { isMobile } = useMobile();

  const getVariantClasses = () => {
    const baseClasses = 'font-medium transition-all duration-200 border';
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-command-primary/20 hover:bg-command-primary/30 text-command-primary border-command-primary/20`;
      case 'secondary':
        return `${baseClasses} bg-command-secondary/20 hover:bg-command-secondary/30 text-command-secondary border-command-secondary/20`;
      case 'accent':
        return `${baseClasses} bg-command-accent/20 hover:bg-command-accent/30 text-command-accent border-command-accent/20`;
      case 'muted':
        return `${baseClasses} bg-command-muted/20 hover:bg-command-muted/30 text-command-muted border-command-muted/20`;
      default:
        return baseClasses;
    }
  };

  const getSizeClasses = () => {
    const touchPadding = isMobile ? 'py-3 px-4' : 'py-2 px-3';
    switch (size) {
      case 'sm':
        return `${touchPadding} text-sm rounded-lg min-h-[44px]`; // 44px is Apple's recommended touch target
      case 'lg':
        return `${touchPadding} text-lg rounded-xl min-h-[48px]`;
      default:
        return `${touchPadding} text-base rounded-lg min-h-[44px]`;
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-2',
        getVariantClasses(),
        getSizeClasses(),
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </motion.button>
  );
}