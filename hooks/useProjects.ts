import { useState, useEffect } from 'react';
import { ProjectStatus } from '@/lib/paraSystem';

interface ProjectData {
  projects: ProjectStatus[];
  areas: ProjectStatus[];
  loading: boolean;
  error: string | null;
}

interface UseProjectsOptions {
  refreshInterval?: number; // in milliseconds
}

export function useProjects({
  refreshInterval = 10 * 60 * 1000, // 10 minutes default
}: UseProjectsOptions = {}): ProjectData {
  const [data, setData] = useState<ProjectData>({
    projects: [],
    areas: [],
    loading: true,
    error: null,
  });

  const fetchProjectData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setData({
          projects: result.projects || [],
          areas: result.areas || [],
          loading: false,
          error: null,
        });
      } else {
        throw new Error(result.error || 'Failed to fetch project data');
      }
    } catch (error) {
      console.error('Projects fetch error:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  useEffect(() => {
    fetchProjectData();

    // Set up refresh interval if specified
    if (refreshInterval > 0) {
      const interval = setInterval(fetchProjectData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return data;
}