'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new unified dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-command-background flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-8 h-8 border-2 border-command-primary/30 border-t-command-primary rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-command-primary text-xl font-mono tracking-wider mb-2">
          REDIRECTING.TO.DASHBOARD...
        </div>
        <div className="text-command-muted text-sm font-mono">
          Upgrading to unified interface
        </div>
      </motion.div>
    </div>
  );
}