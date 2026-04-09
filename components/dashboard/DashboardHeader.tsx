'use client';

import { Menu, Brain, FolderOpen, MessageSquare, CheckSquare } from 'lucide-react';

export type DashboardView = 'projects' | 'knowledge' | 'memory' | 'tasks';

interface DashboardHeaderProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onSidebarToggle: () => void;
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
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
  onMobileMenuToggle,
  sidebarCollapsed,
  mobileMenuOpen,
}: DashboardHeaderProps) {
  const currentConfig = viewConfig[currentView];
  const Icon = currentConfig.icon;

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Current View */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Desktop Sidebar Toggle */}
          <button
            onClick={onSidebarToggle}
            className="hidden md:block text-zinc-400 hover:text-white transition-colors p-2 rounded-md hover:bg-zinc-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden text-zinc-400 hover:text-white transition-colors p-2 rounded-md hover:bg-zinc-800 touch-manipulation"
            aria-label="Toggle menu"
          >
            <div className="relative">
              <Menu className={`h-6 w-6 transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`} />
            </div>
          </button>
          
          <div className="flex items-center space-x-2 md:space-x-3">
            <Icon className={`h-6 w-6 md:h-8 md:w-8 ${currentConfig.color}`} />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white leading-tight">{currentConfig.title}</h1>
              <p className="text-xs md:text-sm text-zinc-400 hidden sm:block">{currentConfig.subtitle}</p>
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
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2 text-xs md:text-sm">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-zinc-400 hidden sm:block">Command Center Online</span>
            <span className="text-zinc-400 sm:hidden">Online</span>
          </div>
          
          <div className="text-xs text-zinc-500 font-mono hidden md:block">
            {new Date().toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-3">
        <nav className="flex space-x-1 overflow-x-auto pb-1 scrollbar-hide">
          {navigationItems.map((item) => {
            const ItemIcon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as DashboardView)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all touch-manipulation min-h-[44px] ${
                  isActive
                    ? 'bg-cyan-400 text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800 active:bg-zinc-700'
                }`}
              >
                <ItemIcon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}