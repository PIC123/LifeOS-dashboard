'use client';

export default function TodayPanel() {
  const today = new Date();
  const timeString = today.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Mission Control</h2>
      
      {/* Current Time */}
      <div className="mb-6">
        <div className="text-4xl font-mono font-bold text-green-400 mb-1">
          {timeString}
        </div>
        <div className="text-gray-400">
          {dateString}
        </div>
      </div>

      {/* Today's Focus */}
      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-white font-medium">Primary Objective</h3>
          <p className="text-gray-400 text-sm">Complete morning routine & build dashboard MVP</p>
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="text-white font-medium">Secondary Mission</h3>
          <p className="text-gray-400 text-sm">Review progress on LifeOS integration</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">🌅</div>
            <div className="text-xs text-gray-400">Morning Mode</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">⚡</div>
            <div className="text-xs text-gray-400">High Energy</div>
          </div>
        </div>
      </div>

      {/* Weather placeholder */}
      <div className="mt-4 p-3 bg-gray-800 rounded">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">NYC Weather</span>
          <span className="text-gray-400 text-sm">72°F ⛅</span>
        </div>
      </div>
    </div>
  );
}