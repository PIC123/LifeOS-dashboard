'use client';

import { Menu, Brain, FolderOpen, MessageSquare, CheckSquare } from 'lucide-react';

export type DashboardView = 'projects' | 'knowledge' | 'memory' | 'tasks';

interface DashboardHeaderProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onSidebarToggle: () => void;
  sidebarCollapsed: boolean;
}

const viewConfig = {
  projects: {
    title: 'Projects Command Center',
    subtitle: 'Your active projects and areas',
    icon: FolderOpen,
    color: 'text-cyan-400',
  },
  knowledge: {
    title: 'Knowledge System',
    subtitle: 'Zettelkasten and atomic notes',
    icon: Brain,
    color: 'text-cyan-400',
  },
  memory: {
    title: 'Conversation Memory',
    subtitle: 'Our shared insights and history',
    icon: MessageSquare,
    color: 'text-cyan-400',
  },
  tasks: {
    title: 'Task Management',
    subtitle: 'Actions and commitments',
    icon: CheckSquare,
    color: 'text-cyan-400',
  },
};

const navigationItems = [
  { id: 'projects', label: 'Projects', icon: FolderOpen, shortcut: '1' },
  { id: 'knowledge', label: 'Knowledge', icon: Brain, shortcut: '2' },
  { id: 'memory', label: 'Memory', icon: MessageSquare, shortcut: '3' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, shortcut: '4' },
] as const;

export default function DashboardHeader({
  currentView,
  onViewChange,
  onSidebarToggle,
  sidebarCollapsed,
}: DashboardHeaderProps) {
  const currentConfig = viewConfig[currentView];
  const Icon = currentConfig.icon;

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Current View */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="text-zinc-400 hover:text-white transition-colors p-2 rounded-md hover:bg-zinc-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <Icon className={`h-8 w-8 ${currentConfig.color}`} />
            <div>
              <h1 className="text-xl font-bold text-white">{currentConfig.title}</h1>
              <p className="text-sm text-zinc-400">{currentConfig.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Center: Navigation Pills */}
        <nav className="hidden md:flex space-x-2">
          {navigationItems.map((item) => {
            const ItemIcon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as DashboardView)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-400 text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
                title={`Switch to ${item.label} (Alt+${item.shortcut})`}
              >
                <ItemIcon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: System Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-zinc-400">Command Center Online</span>
          </div>
          
          <div className="text-xs text-zinc-500 font-mono">
            {new Date().toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-4">
        <nav className="flex space-x-1 overflow-x-auto">
          {navigationItems.map((item) => {
            const ItemIcon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as DashboardView)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-400 text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <ItemIcon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}