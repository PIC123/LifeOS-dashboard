'use client';

import { FolderOpen, CheckSquare, Brain, MessageSquare } from 'lucide-react';
import type { ProjectStatus } from '@/lib/paraSystem';
import type { Task } from '@/types/tasks';

interface KnowledgeData {
  stats?: {
    totalNotes?: number;
    totalMaps?: number;
  };
}

interface MemoryData {
  stats?: {
    totalDays?: number;
    totalInsights?: number;
  };
}

interface DashboardStatsProps {
  projects?: ProjectStatus[];
  tasks?: Task[];
  knowledge?: KnowledgeData;
  memory?: MemoryData;
}

export default function DashboardStats({ projects, tasks, knowledge, memory }: DashboardStatsProps) {
  // Calculate project stats
  const activeProjects = projects?.filter(p => p.status === 'ACTIVE').length || 0;
  const totalProjects = projects?.length || 0;

  // Task stats
  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const totalTasks = tasks?.length || 0;
  
  // Knowledge stats
  const totalNotes = knowledge?.stats?.totalNotes || 0;
  const knowledgeMaps = knowledge?.stats?.totalMaps || 0;
  
  // Memory stats
  const memoryDays = memory?.stats?.totalDays || 0;
  const totalInsights = memory?.stats?.totalInsights || 0;

  const statItems = [
    {
      label: 'Active Projects',
      value: activeProjects,
      total: totalProjects,
      icon: FolderOpen,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-400/20',
    },
    {
      label: 'Pending Tasks',
      value: totalTasks - completedTasks,
      total: totalTasks,
      icon: CheckSquare,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/20',
    },
    {
      label: 'Knowledge Notes',
      value: totalNotes,
      total: knowledgeMaps,
      icon: Brain,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20',
      suffix: knowledgeMaps > 0 ? `+${knowledgeMaps} maps` : undefined,
    },
    {
      label: 'Memory Days',
      value: memoryDays,
      total: totalInsights,
      icon: MessageSquare,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      suffix: totalInsights > 0 ? `${totalInsights} insights` : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-lg border ${stat.borderColor} p-4 transition-all hover:shadow-lg hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-3">
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <div className="text-right">
                <div className={`text-2xl font-bold text-white`}>
                  {stat.value}
                </div>
                {stat.total !== undefined && stat.total !== stat.value && (
                  <div className="text-xs text-zinc-400">
                    of {stat.total}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className={`font-semibold ${stat.color}`}>{stat.label}</p>
              {stat.suffix && (
                <p className="text-xs text-zinc-400">{stat.suffix}</p>
              )}
            </div>

            {/* Progress bar for some stats */}
            {stat.total !== undefined && stat.total > 0 && (
              <div className="mt-3">
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${stat.color.replace('text-', 'bg-')}`}
                    style={{
                      width: `${Math.min((stat.value / stat.total) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}