'use client';

import { useState } from 'react';
import { Habit } from '@/lib/habitParser';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
}

export default function HabitTracker({ habits, onToggleHabit }: HabitTrackerProps) {
  const completedCount = habits.filter(h => h.completed).length;
  const completionPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Morning Routine</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">
            {completedCount}/{habits.length}
          </div>
          <div className="text-sm text-gray-400">
            {completionPercentage.toFixed(0)}% Complete
          </div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#374151"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#10b981"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${completionPercentage * 2.827} 282.7`}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-green-400">
              {completionPercentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Habit List */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer"
            onClick={() => onToggleHabit(habit.id)}
          >
            {/* Checkbox */}
            <div className={`
              w-6 h-6 rounded border-2 flex items-center justify-center transition-all
              ${habit.completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-400 hover:border-green-400'
              }
            `}>
              {habit.completed && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
            </div>

            {/* Habit Details */}
            <div className="flex-1">
              <div className={`
                font-medium text-lg
                ${habit.completed ? 'text-green-400 line-through' : 'text-white'}
              `}>
                {habit.name}
              </div>
              <div className="text-sm text-gray-400">
                Target: {habit.target}
              </div>
              {habit.description && (
                <div className="text-xs text-gray-500 mt-1">
                  {habit.description}
                </div>
              )}
            </div>

            {/* Status Indicator */}
            <div className={`
              w-3 h-3 rounded-full
              ${habit.completed ? 'bg-green-500' : 'bg-gray-500'}
            `} />
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-400">7</div>
            <div className="text-xs text-gray-400">Day Streak</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-400">21</div>
            <div className="text-xs text-gray-400">Best Streak</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">85%</div>
            <div className="text-xs text-gray-400">Weekly Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}