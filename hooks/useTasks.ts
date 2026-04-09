import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, TaskFilter, TaskStats } from '@/types/tasks';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils';

interface UseTasksReturn {
  tasks: Task[];
  stats: TaskStats;
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  filterTasks: (filter: TaskFilter) => Task[];
  getTodayTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getUpcomingTasks: (days?: number) => Task[];
}

const STORAGE_KEY = 'lifeos-tasks';

// Mock tasks for development
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review OAuth calendar integration',
    description: 'Complete the Google Calendar OAuth setup and test the integration',
    status: 'active',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '10:00',
    estimatedTime: 60,
    projectId: 'lifeos-dashboard',
    tags: ['development', 'oauth'],
    category: 'task',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    energy: 'high',
    context: 'laptop'
  },
  {
    id: '2',
    title: 'Design kanban board component',
    description: 'Create a responsive kanban board for PARA project organization',
    status: 'active',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '14:00',
    estimatedTime: 90,
    projectId: 'lifeos-dashboard',
    tags: ['design', 'react'],
    category: 'task',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    energy: 'high',
    context: 'laptop'
  },
  {
    id: '3',
    title: 'Update portfolio site',
    description: 'Add new projects and update design',
    status: 'active',
    priority: 'medium',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedTime: 120,
    projectId: 'portfolio-site',
    tags: ['design', 'portfolio'],
    category: 'task',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    energy: 'medium',
    context: 'laptop'
  },
  {
    id: '4',
    title: 'Daily standup',
    description: 'Review yesterday\'s progress and plan today',
    status: 'active',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '09:00',
    estimatedTime: 15,
    tags: ['routine', 'planning'],
    category: 'habit',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    recurringPattern: {
      type: 'daily',
      interval: 1,
    },
    energy: 'low',
    context: 'anywhere'
  },
  {
    id: '5',
    title: 'Call mom',
    status: 'active',
    priority: 'medium',
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday (overdue)
    estimatedTime: 20,
    tags: ['personal', 'family'],
    category: 'reminder',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    energy: 'low',
    context: 'phone'
  }
];

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Tracks whether initial load is done so we don't overwrite localStorage before reading it
  const initialLoadDone = useRef(false);

  // Load tasks on mount
  useEffect(() => {
    try {
      const savedTasks = loadFromLocalStorage(STORAGE_KEY, mockTasks);
      setTasks(savedTasks);
    } catch (err) {
      setError('Failed to load tasks');
      setTasks(mockTasks);
    } finally {
      initialLoadDone.current = true;
      setLoading(false);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change (skip the initial load)
  useEffect(() => {
    if (initialLoadDone.current) {
      saveToLocalStorage(STORAGE_KEY, tasks);
    }
  }, [tasks]);

  const addTask = useCallback((newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks(prev => [task, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const completeTask = useCallback((id: string) => {
    const now = new Date().toISOString();
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: 'completed' as const,
            completedAt: now,
            updatedAt: now
          }
        : task
    ));
  }, []);

  const filterTasks = useCallback((filter: TaskFilter): Task[] => {
    return tasks.filter(task => {
      if (filter.status && !filter.status.includes(task.status)) return false;
      if (filter.priority && !filter.priority.includes(task.priority)) return false;
      if (filter.projectId && task.projectId !== filter.projectId) return false;
      if (filter.areaId && task.areaId !== filter.areaId) return false;
      if (filter.category && !filter.category.includes(task.category)) return false;
      
      if (filter.dueDate) {
        if (filter.dueDate.start && (!task.dueDate || task.dueDate < filter.dueDate.start)) return false;
        if (filter.dueDate.end && (!task.dueDate || task.dueDate > filter.dueDate.end)) return false;
      }
      
      if (filter.tags && filter.tags.length > 0) {
        const hasTag = filter.tags.some(tag => task.tags.includes(tag));
        if (!hasTag) return false;
      }
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description?.toLowerCase().includes(searchLower);
        const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
      }
      
      return true;
    });
  }, [tasks]);

  const getTodayTasks = useCallback((): Task[] => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === today && task.status !== 'completed');
  }, [tasks]);

  const getOverdueTasks = useCallback((): Task[] => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => 
      task.dueDate && 
      task.dueDate < today && 
      task.status !== 'completed'
    );
  }, [tasks]);

  const getUpcomingTasks = useCallback((days = 7): Task[] => {
    const today = new Date();
    const endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    const todayStr = today.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    return tasks.filter(task => 
      task.dueDate && 
      task.dueDate > todayStr && 
      task.dueDate <= endDateStr && 
      task.status !== 'completed'
    );
  }, [tasks]);

  const stats: TaskStats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    todayTasks: getTodayTasks().length,
    overdueTasks: getOverdueTasks().length,
    highPriorityTasks: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
    completionRate: tasks.length > 0 
      ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)
      : 0,
  };

  return {
    tasks,
    stats,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    filterTasks,
    getTodayTasks,
    getOverdueTasks,
    getUpcomingTasks,
  };
}