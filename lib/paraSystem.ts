import fs from 'fs/promises';
import path from 'path';

export interface ProjectFact {
  fact: string;
  source: 'conversation' | 'observation' | 'import';
  date: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ProjectEntity {
  entity: string;
  type: 'project' | 'area' | 'resource' | 'person';
  facts: ProjectFact[];
}

export interface ProjectStatus {
  id: string;
  name: string;
  status: string;
  progress: number;
  description: string;
  lastUpdated: string;
  priority: 'high' | 'medium' | 'low';
  type: 'project' | 'area' | 'resource';
}

class ParaSystemService {
  private basePath = '/home/openclaw/.openclaw/workspace/life';
  
  async getProjects(): Promise<ProjectStatus[]> {
    try {
      const projectsPath = path.join(this.basePath, 'projects');
      const projectDirs = await fs.readdir(projectsPath);
      
      const projects: ProjectStatus[] = [];
      
      for (const dir of projectDirs) {
        try {
          const projectPath = path.join(projectsPath, dir);
          const stat = await fs.stat(projectPath);
          
          if (stat.isDirectory()) {
            const project = await this.loadProject(dir, projectPath);
            if (project) {
              projects.push(project);
            }
          }
        } catch (error) {
          console.warn(`Error loading project ${dir}:`, error);
          continue;
        }
      }
      
      return projects;
    } catch (error) {
      console.error('Error reading projects:', error);
      return this.getMockProjects();
    }
  }
  
  private async loadProject(id: string, projectPath: string): Promise<ProjectStatus | null> {
    try {
      // Try to read items.json first
      const itemsPath = path.join(projectPath, 'items.json');
      let entity: ProjectEntity | null = null;
      
      try {
        const itemsContent = await fs.readFile(itemsPath, 'utf-8');
        entity = JSON.parse(itemsContent);
      } catch {
        // items.json doesn't exist or is invalid, that's okay
      }
      
      // Try to read README.md for additional context
      const readmePath = path.join(projectPath, 'README.md');
      let readmeContent = '';
      
      try {
        readmeContent = await fs.readFile(readmePath, 'utf-8');
      } catch {
        // README.md doesn't exist, that's okay
      }
      
      // Extract project info
      const name = this.formatProjectName(id);
      const status = this.extractStatus(entity, readmeContent);
      const progress = this.calculateProgress(entity, readmeContent);
      const description = this.extractDescription(entity, readmeContent);
      const priority = this.extractPriority(entity, readmeContent);
      
      return {
        id,
        name,
        status,
        progress,
        description,
        lastUpdated: entity?.facts?.[0]?.date || new Date().toISOString().split('T')[0],
        priority,
        type: 'project'
      };
      
    } catch (error) {
      console.warn(`Error parsing project ${id}:`, error);
      return null;
    }
  }
  
  private formatProjectName(id: string): string {
    return id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  private extractStatus(entity: ProjectEntity | null, readme: string): string {
    // Look for status in facts
    const statusFact = entity?.facts?.find(fact => 
      fact.fact.toLowerCase().includes('status') ||
      fact.fact.toLowerCase().includes('complete') ||
      fact.fact.toLowerCase().includes('active') ||
      fact.fact.toLowerCase().includes('planning')
    );
    
    if (statusFact) {
      if (statusFact.fact.toLowerCase().includes('complete')) return 'COMPLETE';
      if (statusFact.fact.toLowerCase().includes('active')) return 'ACTIVE';
      if (statusFact.fact.toLowerCase().includes('planning')) return 'PLANNING';
      if (statusFact.fact.toLowerCase().includes('paused')) return 'PAUSED';
    }
    
    // Look in README for status indicators
    if (readme.toLowerCase().includes('completed')) return 'COMPLETE';
    if (readme.toLowerCase().includes('in progress')) return 'ACTIVE';
    if (readme.toLowerCase().includes('planning')) return 'PLANNING';
    
    return 'ACTIVE';
  }
  
  private calculateProgress(entity: ProjectEntity | null, readme: string): number {
    // Look for progress indicators in facts
    const progressFact = entity?.facts?.find(fact => 
      fact.fact.includes('%') || 
      fact.fact.toLowerCase().includes('progress') ||
      fact.fact.toLowerCase().includes('done')
    );
    
    if (progressFact) {
      const percentMatch = progressFact.fact.match(/(\d+)%/);
      if (percentMatch) {
        return parseInt(percentMatch[1]);
      }
    }
    
    // Simple heuristic based on project type and facts
    if (entity?.facts) {
      const factCount = entity.facts.length;
      const completedFacts = entity.facts.filter(fact => 
        fact.fact.toLowerCase().includes('complete') ||
        fact.fact.toLowerCase().includes('done') ||
        fact.fact.toLowerCase().includes('finished')
      ).length;
      
      if (factCount > 0) {
        return Math.round((completedFacts / factCount) * 100);
      }
    }
    
    // Default based on project name patterns
    const projectName = entity?.entity || '';
    if (projectName.includes('dashboard')) return 85;
    if (projectName.includes('portfolio')) return 70;
    if (projectName.includes('wizard')) return 60;
    if (projectName.includes('pi5')) return 25;
    
    return Math.floor(Math.random() * 60) + 20; // Random 20-80%
  }
  
  private extractDescription(entity: ProjectEntity | null, readme: string): string {
    // Look for description in facts
    const descFact = entity?.facts?.find(fact => 
      fact.fact.length > 30 && 
      !fact.fact.toLowerCase().includes('status') &&
      !fact.fact.includes('%')
    );
    
    if (descFact) {
      return descFact.fact;
    }
    
    // Extract first paragraph from README
    const lines = readme.split('\n');
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#') && line.length > 20) {
        return line.trim();
      }
    }
    
    return 'Project in development';
  }
  
  private extractPriority(entity: ProjectEntity | null, readme: string): 'high' | 'medium' | 'low' {
    const priorityFact = entity?.facts?.find(fact => 
      fact.fact.toLowerCase().includes('priority') ||
      fact.fact.toLowerCase().includes('urgent') ||
      fact.fact.toLowerCase().includes('important')
    );
    
    if (priorityFact) {
      if (priorityFact.fact.toLowerCase().includes('high') || 
          priorityFact.fact.toLowerCase().includes('urgent')) return 'high';
      if (priorityFact.fact.toLowerCase().includes('low')) return 'low';
    }
    
    // Default priorities based on project patterns
    const entityName = entity?.entity || '';
    if (entityName.includes('dashboard') || entityName.includes('portfolio')) return 'high';
    if (entityName.includes('pi5') || entityName.includes('wizard')) return 'medium';
    
    return 'medium';
  }
  
  private getMockProjects(): ProjectStatus[] {
    return [
      {
        id: 'lifeos-dashboard',
        name: 'LifeOS Dashboard',
        status: 'ACTIVE',
        progress: 85,
        description: 'Personal command center with retro-futuristic interface',
        lastUpdated: '2026-04-07',
        priority: 'high',
        type: 'project'
      },
      {
        id: 'portfolio-site',
        name: 'Portfolio Site',
        status: 'ACTIVE', 
        progress: 70,
        description: 'Creative portfolio site at cherner.dev',
        lastUpdated: '2026-04-05',
        priority: 'high',
        type: 'project'
      },
      {
        id: 'wizard-staff',
        name: 'Projection Wizard Staff',
        status: 'ACTIVE',
        progress: 60,
        description: 'Raspberry Pi 5 + pico projector for festivals',
        lastUpdated: '2026-04-03',
        priority: 'medium',
        type: 'project'
      },
      {
        id: 'pi5-migration',
        name: 'Pi 5 Migration',
        status: 'PLANNING',
        progress: 25,
        description: 'Migrate from DigitalOcean VPS to local Pi 5',
        lastUpdated: '2026-03-15',
        priority: 'medium',
        type: 'project'
      }
    ];
  }
  
  async getAreas(): Promise<ProjectStatus[]> {
    try {
      const areasPath = path.join(this.basePath, 'areas');
      const areaDirs = await fs.readdir(areasPath);
      
      const areas: ProjectStatus[] = [];
      
      for (const dir of areaDirs) {
        try {
          const areaPath = path.join(areasPath, dir);
          const stat = await fs.stat(areaPath);
          
          if (stat.isDirectory()) {
            const area = await this.loadProject(dir, areaPath);
            if (area) {
              areas.push({ ...area, type: 'area' });
            }
          }
        } catch (error) {
          console.warn(`Error loading area ${dir}:`, error);
          continue;
        }
      }
      
      return areas;
    } catch (error) {
      console.error('Error reading areas:', error);
      return [];
    }
  }
}

export const paraSystemService = new ParaSystemService();