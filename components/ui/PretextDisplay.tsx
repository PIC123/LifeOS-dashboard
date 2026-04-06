'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Import Pretext
const pretext = require('pretext');

interface PretextDisplayProps {
  content: string;
  className?: string;
  orientation?: 'normal' | 'rotate-90' | 'rotate-180' | 'rotate-270' | 'rotate-45' | 'rotate-12' | 'rotate-6' | 'rotate-3' | 'rotate--90' | 'rotate--6' | 'rotate--12';
  weight?: 'ultra-thin' | 'extra-thin' | 'thin' | 'normal';
  tracking?: 'normal' | 'wide' | 'ultra-wide' | 'mega-wide' | 'super-wide';
  glow?: 'none' | 'blue' | 'orange' | 'primary' | 'accent';
  animate?: boolean;
  delay?: number;
}

export default function PretextDisplay({
  content,
  className = '',
  orientation = 'normal',
  weight = 'thin',
  tracking = 'wide',
  glow = 'none',
  animate = true,
  delay = 0
}: PretextDisplayProps) {
  const [rendered, setRendered] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      // Process the content with Pretext
      const processed = pretext(content);
      setRendered(processed);
    } catch (error) {
      console.warn('Pretext processing failed, using raw content:', error);
      setRendered(content);
    }
  }, [content]);

  const getOrientationClass = () => {
    switch (orientation) {
      case 'rotate-90': return 'transform rotate-90 origin-center';
      case 'rotate-180': return 'transform rotate-180 origin-center';
      case 'rotate-270': return 'transform rotate-270 origin-center';
      case 'rotate-45': return 'transform rotate-45 origin-center';
      case 'rotate-12': return 'transform rotate-12 origin-center';
      case 'rotate-6': return 'transform rotate-6 origin-center';
      case 'rotate-3': return 'transform rotate-3 origin-center';
      case 'rotate--90': return 'transform -rotate-90 origin-center';
      case 'rotate--6': return 'transform -rotate-6 origin-center';
      case 'rotate--12': return 'transform -rotate-12 origin-center';
      default: return '';
    }
  };

  const getWeightClass = () => {
    switch (weight) {
      case 'ultra-thin': return 'font-ultra font-ultra-thin';
      case 'extra-thin': return 'font-ultra font-extra-thin';
      case 'thin': return 'font-ultra font-thin';
      default: return '';
    }
  };

  const getTrackingClass = () => {
    switch (tracking) {
      case 'ultra-wide': return 'tracking-ultra-wide';
      case 'mega-wide': return 'tracking-mega-wide';
      case 'super-wide': return 'tracking-super-wide';
      case 'wide': return 'tracking-wide';
      default: return '';
    }
  };

  const getGlowClass = () => {
    switch (glow) {
      case 'blue': return 'animate-glow-blue';
      case 'orange': return 'animate-glow-orange';
      case 'primary': return 'text-command-primary animate-glow-blue';
      case 'accent': return 'text-command-accent animate-glow-orange';
      default: return '';
    }
  };

  const combinedClasses = cn(
    getWeightClass(),
    getTrackingClass(),
    getOrientationClass(),
    getGlowClass(),
    'text-command-text',
    className
  );

  if (!mounted) {
    return (
      <div className={cn('animate-pulse bg-command-surface/20 rounded', className)}>
        <div className="h-4 w-16 bg-command-surface/40 rounded"></div>
      </div>
    );
  }

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: orientation.includes('rotate') ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        className={combinedClasses}
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    );
  }

  return (
    <div 
      className={combinedClasses}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

// Convenience components for common use cases
export const SciFiTitle = ({ children, ...props }: { children: string } & Omit<PretextDisplayProps, 'content'>) => (
  <PretextDisplay 
    content={children}
    weight="ultra-thin"
    tracking="super-wide"
    {...props}
  />
);

export const RotatedLabel = ({ children, angle = 'rotate--90', ...props }: { children: string; angle?: PretextDisplayProps['orientation'] } & Omit<PretextDisplayProps, 'content' | 'orientation'>) => (
  <PretextDisplay 
    content={children}
    orientation={angle}
    weight="ultra-thin"
    tracking="mega-wide"
    {...props}
  />
);

export const GlowingAccent = ({ children, color = 'primary', ...props }: { children: string; color?: 'primary' | 'accent' } & Omit<PretextDisplayProps, 'content' | 'glow'>) => (
  <PretextDisplay 
    content={children}
    glow={color}
    weight="extra-thin"
    tracking="ultra-wide"
    {...props}
  />
);