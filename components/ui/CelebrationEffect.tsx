'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiParticle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
}

interface CelebrationEffectProps {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number;
}

export default function CelebrationEffect({ 
  isActive, 
  onComplete, 
  duration = 3000 
}: CelebrationEffectProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  
  // Pre-generate sparkle positions to avoid calling Math.random during render
  const [sparklePositions, setSparklePositions] = useState<Array<{id: number; x: number; y: number; delay: number}>>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isActive) {
      const positions = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 2,
      }));
      setSparklePositions(positions);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    const newParticles: ConfettiParticle[] = [];

    // Generate confetti particles
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: `particle-${i}`,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 200,
        velocityY: Math.random() * 300 + 100,
      });
    }

    setParticles(newParticles);

    // Clean up after duration
    const timeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timeout);
  }, [isActive, duration, onComplete]);

  const particleVariants = {
    initial: (particle: ConfettiParticle) => ({
      x: particle.x,
      y: particle.y,
      rotate: particle.rotation,
      opacity: 1,
    }),
    animate: (particle: ConfettiParticle) => ({
      x: particle.x + particle.velocityX,
      y: window.innerHeight + 100,
      rotate: particle.rotation + 720,
      opacity: 0,
      transition: {
        duration: 2.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              custom={particle}
              // @ts-expect-error - Complex Framer Motion variants typing issue  
              variants={particleVariants}
              initial="initial"
              animate="animate"
              className="absolute"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                borderRadius: '50%',
              }}
            />
          ))}
          
          {/* Celebration Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0.5, 1.2, 1, 0.8],
              y: [50, -20, -40, -60]
            }}
            transition={{ 
              duration: 2.5,
              times: [0, 0.2, 0.8, 1]
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold text-command-text bg-command-surface/90 px-6 py-3 rounded-xl border border-command-border shadow-2xl">
                All Habits Complete!
              </div>
              <div className="text-lg text-command-accent mt-2 bg-command-surface/90 px-4 py-2 rounded-lg">
                Amazing work! 🚀
              </div>
            </div>
          </motion.div>

          {/* Sparkle Effects */}
          {sparklePositions.map((sparkle) => (
            <motion.div
              key={`sparkle-${sparkle.id}`}
              initial={{ 
                opacity: 0,
                scale: 0,
                x: sparkle.x,
                y: sparkle.y,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 1.5,
                delay: sparkle.delay,
                repeat: 1,
              }}
              className="absolute text-command-accent text-2xl pointer-events-none"
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

interface MilestoneToastProps {
  milestone: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function MilestoneToast({ 
  milestone, 
  message, 
  isVisible, 
  onClose 
}: MilestoneToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -100, x: '-50%' }}
          className="fixed top-4 left-1/2 z-50 bg-gradient-to-r from-command-primary to-command-secondary text-white px-6 py-4 rounded-xl shadow-2xl border border-white/20"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-2xl"
            >
              🏆
            </motion.div>
            <div>
              <div className="font-bold text-lg">{milestone}</div>
              <div className="text-white/90 text-sm">{message}</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="ml-4 text-white/70 hover:text-white transition-colors"
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}