'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SystemCpu, 
  StatusBattery, 
  StatusCloud, 
  DataChart,
  EffectSparkles
} from '@/components/ui/Icons';

interface SystemMetrics {
  memoryUsage: number;
  cpuUsage: number;
  batteryLevel: number;
  networkStatus: 'online' | 'offline' | 'slow';
  syncStatus: 'active' | 'syncing' | 'error';
  lastBackup: Date;
  uptime: number;
}

export default function SystemStatus() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    memoryUsage: 0,
    cpuUsage: 0,
    batteryLevel: 100,
    networkStatus: 'online',
    syncStatus: 'active',
    lastBackup: new Date(),
    uptime: 0
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        memoryUsage: Math.random() * 40 + 40, // 40-80%
        cpuUsage: Math.random() * 30 + 10, // 10-40%
        batteryLevel: Math.random() * 30 + 70, // 70-100%
        networkStatus: 'online',
        syncStatus: Math.random() > 0.9 ? 'syncing' : 'active',
        lastBackup: new Date(Date.now() - Math.random() * 300000), // Last 5 min
        uptime: Date.now() - (Date.now() - Math.random() * 86400000) // Last 24h
      });
    };

    // Initial update
    updateMetrics();

    // Update every 5 seconds
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
        return 'text-command-secondary';
      case 'syncing':
        return 'text-command-accent animate-pulse';
      case 'error':
      case 'offline':
        return 'text-red-500';
      case 'slow':
        return 'text-command-accent';
      default:
        return 'text-command-muted';
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 60) return 'bg-command-accent';
    return 'bg-command-secondary';
  };

  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatLastBackup = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-command-surface/80 backdrop-blur-sm border border-command-border rounded-xl p-6 hover:bg-command-surface transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <SystemCpu className="text-command-primary animate-glow" />
          <h2 className="text-xl font-semibold text-command-text">System Status</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-command-muted hover:text-command-text transition-colors"
        >
          {isExpanded ? 'Less' : 'More'} →
        </motion.button>
      </div>

      {/* Quick Status Indicators */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between p-3 bg-command-background/50 rounded-lg border border-command-border/50"
        >
          <div className="flex items-center space-x-2">
            <StatusCloud className={getStatusColor(metrics.networkStatus)} size="sm" />
            <span className="text-sm text-command-text">Network</span>
          </div>
          <span className={`text-sm font-medium ${getStatusColor(metrics.networkStatus)}`}>
            {metrics.networkStatus.toUpperCase()}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between p-3 bg-command-background/50 rounded-lg border border-command-border/50"
        >
          <div className="flex items-center space-x-2">
            <EffectSparkles className={getStatusColor(metrics.syncStatus)} size="sm" />
            <span className="text-sm text-command-text">Sync</span>
          </div>
          <span className={`text-sm font-medium ${getStatusColor(metrics.syncStatus)}`}>
            {metrics.syncStatus.toUpperCase()}
          </span>
        </motion.div>
      </div>

      {/* Resource Usage */}
      <div className="space-y-3">
        {/* Memory Usage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-command-muted">Memory Usage</span>
            <span className="text-sm font-medium text-command-text">
              {metrics.memoryUsage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-command-border/30 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metrics.memoryUsage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${getUsageColor(metrics.memoryUsage)}`}
            />
          </div>
        </div>

        {/* CPU Usage */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-command-muted">CPU Usage</span>
            <span className="text-sm font-medium text-command-text">
              {metrics.cpuUsage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-command-border/30 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metrics.cpuUsage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className={`h-full rounded-full ${getUsageColor(metrics.cpuUsage)}`}
            />
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="mt-4 pt-4 border-t border-command-border space-y-3">
          {/* Battery Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StatusBattery className="text-command-secondary" size="sm" />
              <span className="text-sm text-command-muted">Battery</span>
            </div>
            <span className="text-sm text-command-text font-medium">
              {metrics.batteryLevel.toFixed(0)}%
            </span>
          </div>

          {/* Last Backup */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DataChart className="text-command-accent" size="sm" />
              <span className="text-sm text-command-muted">Last Backup</span>
            </div>
            <span className="text-sm text-command-text">
              {formatLastBackup(metrics.lastBackup)}
            </span>
          </div>

          {/* Uptime */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SystemCpu className="text-command-primary" size="sm" />
              <span className="text-sm text-command-muted">Uptime</span>
            </div>
            <span className="text-sm text-command-text">
              {formatUptime(metrics.uptime)}
            </span>
          </div>

          {/* Performance Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 p-3 bg-command-primary/10 border border-command-primary/20 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-command-text">Performance Score</span>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-command-primary">
                  {(100 - (metrics.memoryUsage + metrics.cpuUsage) / 2).toFixed(0)}
                </div>
                <span className="text-sm text-command-muted">/100</span>
              </div>
            </div>
            <div className="text-xs text-command-muted mt-1">
              Excellent system performance
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}