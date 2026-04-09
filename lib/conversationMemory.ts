/**
 * Conversation Memory Integration
 * Interfaces with Phil's daily memory files and extracted insights
 */

import fs from 'fs';
import path from 'path';

const MEMORY_PATH = '/home/openclaw/.openclaw/workspace/phil-brain/memory/daily';
const MEMORY_FILE = '/home/openclaw/.openclaw/workspace/phil-brain/memory/MEMORY.md';

export interface DailyMemory {
  date: string;
  content: string;
  insights: string[];
  actionItems: string[];
  people: string[];
  projects: string[];
}

export interface ConversationInsight {
  type: 'action' | 'idea' | 'decision' | 'person' | 'project';
  content: string;
  date: string;
  context: string;
}

export interface MemoryStats {
  totalDays: number;
  totalInsights: number;
  recentActivity: number;
  topTopics: string[];
}

class ConversationMemoryService {

  // Get recent daily memory files
  async getDailyMemories(days: number = 30): Promise<DailyMemory[]> {
    try {
      if (!fs.existsSync(MEMORY_PATH)) {
        console.warn('Memory directory not found');
        return [];
      }

      const files = fs.readdirSync(MEMORY_PATH)
        .filter(file => /^\d{4}-\d{2}-\d{2}\.md$/.test(file))
        .sort()
        .reverse()
        .slice(0, days);

      const memories = files.map(file => {
        const filePath = path.join(MEMORY_PATH, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const date = file.replace('.md', '');
        
        // Extract structured information from memory content
        const insights = this.extractInsights(content);
        const actionItems = this.extractActionItems(content);
        const people = this.extractPeople(content);
        const projects = this.extractProjects(content);

        return {
          date,
          content,
          insights,
          actionItems,
          people,
          projects,
        };
      });

      return memories;
    } catch (error) {
      console.error('Error reading daily memories:', error);
      return [];
    }
  }

  // Get long-term memory insights
  async getLongTermMemory(): Promise<string | null> {
    try {
      if (!fs.existsSync(MEMORY_FILE)) {
        console.warn('MEMORY.md not found');
        return null;
      }

      const content = fs.readFileSync(MEMORY_FILE, 'utf8');
      return content;
    } catch (error) {
      console.error('Error reading MEMORY.md:', error);
      return null;
    }
  }

  // Extract conversation insights from recent memories
  async getConversationInsights(days: number = 7): Promise<ConversationInsight[]> {
    const memories = await this.getDailyMemories(days);
    const insights: ConversationInsight[] = [];

    memories.forEach(memory => {
      // Extract action items
      memory.actionItems.forEach(action => {
        insights.push({
          type: 'action',
          content: action,
          date: memory.date,
          context: this.extractContext(memory.content, action),
        });
      });

      // Extract project mentions
      memory.projects.forEach(project => {
        insights.push({
          type: 'project',
          content: project,
          date: memory.date,
          context: this.extractContext(memory.content, project),
        });
      });

      // Extract people mentions
      memory.people.forEach(person => {
        insights.push({
          type: 'person',
          content: person,
          date: memory.date,
          context: this.extractContext(memory.content, person),
        });
      });
    });

    return insights.sort((a, b) => b.date.localeCompare(a.date));
  }

  // Search through conversation history
  async searchConversations(query: string, days: number = 90): Promise<{date: string, excerpt: string}[]> {
    const memories = await this.getDailyMemories(days);
    const lowercaseQuery = query.toLowerCase();
    const results: {date: string, excerpt: string}[] = [];

    memories.forEach(memory => {
      const lines = memory.content.split('\n');
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(lowercaseQuery)) {
          // Get context around the match
          const start = Math.max(0, index - 2);
          const end = Math.min(lines.length, index + 3);
          const excerpt = lines.slice(start, end).join('\n');
          
          results.push({
            date: memory.date,
            excerpt,
          });
        }
      });
    });

    return results.slice(0, 20); // Limit results
  }

  // Get memory statistics
  async getMemoryStats(): Promise<MemoryStats> {
    const memories = await this.getDailyMemories(365); // Full year
    const recentMemories = await this.getDailyMemories(7);
    
    const allTopics: string[] = [];
    let totalInsights = 0;

    memories.forEach(memory => {
      totalInsights += memory.insights.length;
      allTopics.push(...memory.projects, ...memory.people);
    });

    // Count topic frequency
    const topicCounts: Record<string, number> = {};
    allTopics.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    const topTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic]) => topic);

    return {
      totalDays: memories.length,
      totalInsights,
      recentActivity: recentMemories.length,
      topTopics,
    };
  }

  // Helper methods
  private extractInsights(content: string): string[] {
    const insights: string[] = [];
    const lines = content.split('\n');
    
    // Look for insights marked with bullets, dashes, or "learned" keywords
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^[-*•]\s+/) || 
          trimmed.toLowerCase().includes('learned') ||
          trimmed.toLowerCase().includes('insight') ||
          trimmed.toLowerCase().includes('realized')) {
        insights.push(trimmed.replace(/^[-*•]\s+/, ''));
      }
    });
    
    return insights;
  }

  private extractActionItems(content: string): string[] {
    const actions: string[] = [];
    const lines = content.split('\n');
    
    // Look for action-oriented language
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('need to') ||
          trimmed.toLowerCase().includes('should') ||
          trimmed.toLowerCase().includes('will') ||
          trimmed.toLowerCase().includes('todo') ||
          trimmed.toLowerCase().includes('action')) {
        actions.push(trimmed);
      }
    });
    
    return actions;
  }

  private extractPeople(content: string): string[] {
    // Extract names mentioned in the content
    // This is a simplified extraction - could be enhanced with NLP
    const names: string[] = [];
    const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
    let match;
    
    while ((match = namePattern.exec(content)) !== null) {
      const name = match[1];
      // Filter out common non-name words
      if (!['Phil', 'I', 'You', 'The', 'This', 'That', 'Today', 'Yesterday'].includes(name)) {
        names.push(name);
      }
    }
    
    return [...new Set(names)];
  }

  private extractProjects(content: string): string[] {
    const projects: string[] = [];
    
    // Look for project-like patterns
    const projectPatterns = [
      /project[:\s]+([^.!?]+)/gi,
      /working on ([^.!?]+)/gi,
      /building ([^.!?]+)/gi,
    ];
    
    projectPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        projects.push(match[1].trim());
      }
    });
    
    return [...new Set(projects)];
  }

  private extractContext(content: string, searchTerm: string): string {
    const lines = content.split('\n');
    const termLower = searchTerm.toLowerCase();
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(termLower)) {
        // Return surrounding context
        const start = Math.max(0, i - 1);
        const end = Math.min(lines.length, i + 2);
        return lines.slice(start, end).join('\n');
      }
    }
    
    return '';
  }
}

export const conversationMemoryService = new ConversationMemoryService();