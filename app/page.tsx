'use client';

import { useState } from 'react';
import HabitTracker from '@/components/HabitTracker';
import TodayPanel from '@/components/TodayPanel';
import { mockHabitsData, type Habit } from '@/lib/habitParser';

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>(mockHabitsData.habits);

  const toggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🛰️ LifeOS Command Center
              </h1>
              <p className="text-gray-400 mt-1">
                Personal mission control • v0.1.0-mvp
              </p>
            </div>
            
            {/* Status Indicators */}
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">ONLINE</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-400">SYNC OK</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Habit Tracking */}
          <div className="lg:col-span-2">
            <HabitTracker 
              habits={habits} 
              onToggleHabit={toggleHabit} 
            />
            
            {/* Future: Project Status Panel */}
            <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Active Projects</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                  <div>
                    <div className="text-white font-medium">LifeOS Dashboard MVP</div>
                    <div className="text-sm text-gray-400">Building personal command center</div>
                  </div>
                  <div className="text-green-400 font-bold">75%</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                  <div>
                    <div className="text-white font-medium">Morning Routine</div>
                    <div className="text-sm text-gray-400">Establishing consistent habits</div>
                  </div>
                  <div className="text-yellow-400 font-bold">60%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Today Panel & Quick Actions */}
          <div className="space-y-6">
            <TodayPanel />
            
            {/* Quick Actions */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium transition-colors">
                  📝 Add Quick Note
                </button>
                <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded text-white font-medium transition-colors">
                  🎙️ Voice Memo
                </button>
                <button className="w-full p-3 bg-green-600 hover:bg-green-700 rounded text-white font-medium transition-colors">
                  ✅ Mark All Complete
                </button>
                <button className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded text-white font-medium transition-colors">
                  🧠 Three Brain View
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className="text-green-400">67%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sync Status</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Backup</span>
                  <span className="text-gray-400">2 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 p-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          LifeOS Command Center • Built with ⚡ and ☕ • {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}