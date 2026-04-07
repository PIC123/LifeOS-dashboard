export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string; // ISO date string
  dueTime?: string; // HH:mm format
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  projectId?: string; // PARA project reference
  areaId?: string; // PARA area reference
  tags: string[];
  category: 'task' | 'reminder' | 'event' | 'habit';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  recurringPattern?: RecurringPattern;
  context?: string; // where/when to do this task
  energy: 'high' | 'medium' | 'low'; // energy required
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number; // every N days/weeks/months
  daysOfWeek?: number[]; // 0-6, Sunday=0
  endDate?: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  todayTasks: number;
  overdueTasks: number;
  highPriorityTasks: number;
  completionRate: number;
}

export interface QuickTask {
  id: string;
  title: string;
  estimatedTime: number;
  energy: 'high' | 'medium' | 'low';
  context?: string;
}

export interface TaskFilter {
  status?: Task['status'][];
  priority?: Task['priority'][];
  projectId?: string;
  areaId?: string;
  category?: Task['category'][];
  dueDate?: {
    start?: string;
    end?: string;
  };
  tags?: string[];
  search?: string;
}