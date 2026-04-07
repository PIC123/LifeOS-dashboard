'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { DataChart, AchievementStreak, EffectSparkles } from '@/components/ui/Icons';
import { Habit } from '@/lib/habitParser';

interface HabitAnalyticsProps {
  habits: Habit[];
  className?: string;
}

// Generate mock analytics data for demonstration
function generateAnalyticsData() {
  const today = new Date();
  const data = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const completion = Math.random() * 100;
    const streakBonus = Math.max(0, completion - 60) * 0.5;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completion: Math.round(completion),
      streak: Math.round(streakBonus),
      habits: Math.floor(Math.random() * 3) + 2,
      focus: Math.round(Math.random() * 40 + 60)
    });
  }
  
  return data;
}

function generateHabitBreakdown(habits: Habit[]) {
  return habits.map((habit, index) => ({
    name: habit.name,
    completed: habit.completed ? 1 : 0,
    progress: Math.random() * 100,
    color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'][index % 4]
  }));
}

// Custom tooltip component outside render function
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-command-surface border border-command-border rounded-lg p-3 shadow-lg">
        <p className="text-command-text font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function HabitAnalytics({ habits, className }: HabitAnalyticsProps) {
  const analyticsData = useMemo(() => generateAnalyticsData(), []);
  const habitBreakdown = useMemo(() => generateHabitBreakdown(habits), [habits]);
  
  const completionRate = habits.length > 0 
    ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100)
    : 0;
  
  const currentStreak = 7; // Mock current streak
  const bestStreak = 21; // Mock best streak
  const weeklyAverage = 85; // Mock weekly average

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-command-surface/80 backdrop-blur-sm border border-command-border rounded-xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DataChart className="text-command-primary animate-glow" size="lg" />
          <h2 className="text-xl font-semibold text-command-text">Analytics Dashboard</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs text-command-muted hover:text-command-text transition-colors"
        >
          View Details →
        </motion.button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-command-background/50 rounded-lg p-4 border border-command-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <EffectSparkles className="text-command-primary" size="sm" />
            <span className="text-xs text-command-muted">Today</span>
          </div>
          <div className="text-2xl font-bold text-command-primary">{completionRate}%</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-command-background/50 rounded-lg p-4 border border-command-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <AchievementStreak className="text-command-secondary" size="sm" />
            <span className="text-xs text-command-muted">Streak</span>
          </div>
          <div className="text-2xl font-bold text-command-secondary">{currentStreak}</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-command-background/50 rounded-lg p-4 border border-command-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <DataChart className="text-command-accent" size="sm" />
            <span className="text-xs text-command-muted">Best</span>
          </div>
          <div className="text-2xl font-bold text-command-accent">{bestStreak}</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-command-background/50 rounded-lg p-4 border border-command-border/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <EffectSparkles className="text-command-muted" size="sm" />
            <span className="text-xs text-command-muted">Weekly</span>
          </div>
          <div className="text-2xl font-bold text-command-text">{weeklyAverage}%</div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-command-background/30 rounded-lg p-4 border border-command-border/30"
        >
          <h3 className="text-sm font-medium text-command-text mb-4">30-Day Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="completion"
                stroke="#6366f1"
                fill="url(#completionGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Habit Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-command-background/30 rounded-lg p-4 border border-command-border/30"
        >
          <h3 className="text-sm font-medium text-command-text mb-4">Habit Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={habitBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="progress"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-command-primary/5 border border-command-primary/20 rounded-lg"
      >
        <h4 className="text-sm font-medium text-command-text mb-2 flex items-center gap-2">
          <EffectSparkles className="text-command-primary" size="sm" />
          AI Insights
        </h4>
        <div className="text-xs text-command-muted space-y-1">
          <p>• Your completion rate is 12% higher than last week 🚀</p>
          <p>• Morning habits show the strongest consistency pattern</p>
          <p>• Consider adding a reward milestone at day 30!</p>
        </div>
      </motion.div>
    </motion.div>
  );
}