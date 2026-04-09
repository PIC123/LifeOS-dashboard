import fs from 'fs/promises';
import path from 'path';

export interface Reminder {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'health' | 'work' | 'personal' | 'project' | 'follow-up';
  createdDate: string;
  dueDate?: string;
  completed: boolean;
  source: 'conversation' | 'memory' | 'manual';
  context?: string;
}

class RemindersSystemService {
  private memoryPath = '/home/openclaw/.openclaw/workspace/phil-brain/memory/daily';
  
  async getReminders(): Promise<Reminder[]> {
    try {
      // Get reminders from multiple sources
      const [conversationReminders, memoryReminders, philReminders] = await Promise.all([
        this.extractConversationReminders(),
        this.extractMemoryReminders(),
        this.getPhilSpecificReminders(),
      ]);
      
      return [
        ...conversationReminders,
        ...memoryReminders,
        ...philReminders,
      ].sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      
    } catch (error) {
      console.error('Error loading reminders:', error);
      return this.getMockReminders();
    }
  }
  
  private async extractConversationReminders(): Promise<Reminder[]> {
    // This would parse recent conversation logs for reminders
    // For now, return structured reminders based on known context
    return [
      {
        id: 'gcal-setup',
        title: 'Set up Google Calendar OAuth',
        description: 'Complete Google Calendar integration when you get home (~15 min setup)',
        priority: 'high',
        category: 'work',
        createdDate: '2026-04-07',
        dueDate: '2026-04-07',
        completed: false,
        source: 'conversation',
        context: 'Dashboard integration - needs OAuth credentials from Google Cloud Console'
      },
      {
        id: 'pi5-order',
        title: 'Check Pi 5 order status',
        description: 'Follow up on Raspberry Pi 5 delivery for cyberdeck infrastructure',
        priority: 'medium',
        category: 'project',
        createdDate: '2026-04-06',
        completed: false,
        source: 'conversation',
        context: 'Part of offline self-hosted setup vision'
      },
    ];
  }
  
  private async extractMemoryReminders(): Promise<Reminder[]> {
    try {
      // Read recent memory files for reminder keywords
      const files = await fs.readdir(this.memoryPath);
      const recentFiles = files
        .filter(f => f.endsWith('.md'))
        .sort()
        .slice(-7); // Last 7 days
      
      const reminders: Reminder[] = [];
      
      for (const file of recentFiles) {
        try {
          const content = await fs.readFile(path.join(this.memoryPath, file), 'utf-8');
          const extracted = this.parseMemoryForReminders(content, file);
          reminders.push(...extracted);
        } catch (error) {
          console.warn(`Could not read memory file ${file}:`, error);
        }
      }
      
      return reminders;
    } catch (error) {
      console.warn('Could not access memory files:', error);
      return [];
    }
  }
  
  private parseMemoryForReminders(content: string, filename: string): Reminder[] {
    const reminders: Reminder[] = [];
    const date = filename.replace('.md', '');
    
    // Look for reminder patterns in memory content
    const reminderPatterns = [
      /remind\s+(?:me\s+)?(?:to\s+)?(.*?)(?:\.|$)/gi,
      /follow[- ]?up\s+(?:on\s+)?(.*?)(?:\.|$)/gi,
      /need\s+to\s+(.*?)(?:\.|$)/gi,
      /should\s+(.*?)(?:\.|$)/gi,
      /todo:?\s+(.*?)(?:\.|$)/gi,
    ];
    
    reminderPatterns.forEach((pattern, index) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const text = match[1].trim();
        if (text.length > 10 && text.length < 200) {
          reminders.push({
            id: `memory-${date}-${index}-${reminders.length}`,
            title: this.extractTitle(text),
            description: text,
            priority: this.inferPriority(text),
            category: this.inferCategory(text),
            createdDate: date,
            completed: false,
            source: 'memory',
            context: `Extracted from memory log: ${date}`
          });
        }
      }
    });
    
    return reminders.slice(0, 3); // Limit to avoid noise
  }
  
  private getPhilSpecificReminders(): Reminder[] {
    // Curated reminders based on Phil's known priorities and context
    return [
      {
        id: 'health-routine',
        title: 'Morning health routine check-in',
        description: 'Hair treatment, vitamins, movement - habit tracking system',
        priority: 'high',
        category: 'health',
        createdDate: '2026-04-05',
        completed: false,
        source: 'conversation',
        context: 'Part of daily optimization goals'
      },
      {
        id: 'meta-networking',
        title: 'Creative tech networking at Meta',
        description: 'Connect with people in creative technology space',
        priority: 'medium',
        category: 'work',
        createdDate: '2026-04-06',
        completed: false,
        source: 'conversation',
        context: 'Career development focus'
      },
      {
        id: 'sassy-salon',
        title: 'Plan next Sassy Salon event',
        description: 'Organize sensual creative gathering - poetry, games, tarot, art films',
        priority: 'medium',
        category: 'personal',
        createdDate: '2026-04-04',
        completed: false,
        source: 'conversation',
        context: 'Community building and creative expression'
      },
      {
        id: 'burning-man-prep',
        title: 'Burning Man art project planning',
        description: 'First burn coming up - work on art projects and community connections',
        priority: 'medium',
        category: 'project',
        createdDate: '2026-04-03',
        completed: false,
        source: 'conversation',
        context: 'Major upcoming experience and creative opportunity'
      },
      {
        id: 'touchdesigner-kinect',
        title: 'Azure Kinect body tracking project',
        description: 'Continue TouchDesigner work with rigged 3D models',
        priority: 'low',
        category: 'project',
        createdDate: '2026-04-02',
        completed: false,
        source: 'conversation',
        context: 'Creative tech project for portfolio'
      },
    ];
  }
  
  private extractTitle(text: string): string {
    // Extract a concise title from reminder text
    const words = text.split(' ');
    if (words.length <= 6) return text;
    
    // Look for action verbs and key nouns
    const actionWords = ['set up', 'check', 'follow up', 'plan', 'organize', 'complete', 'review'];
    for (const action of actionWords) {
      if (text.toLowerCase().includes(action)) {
        const remaining = text.substring(text.toLowerCase().indexOf(action));
        return remaining.split(' ').slice(0, 6).join(' ');
      }
    }
    
    return words.slice(0, 6).join(' ') + '...';
  }
  
  private inferPriority(text: string): 'high' | 'medium' | 'low' {
    const highPriority = ['urgent', 'asap', 'immediately', 'critical', 'important'];
    const lowPriority = ['eventually', 'someday', 'maybe', 'consider', 'explore'];
    
    const lowerText = text.toLowerCase();
    
    if (highPriority.some(word => lowerText.includes(word))) return 'high';
    if (lowPriority.some(word => lowerText.includes(word))) return 'low';
    
    return 'medium';
  }
  
  private inferCategory(text: string): Reminder['category'] {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('health') || lowerText.includes('exercise') || lowerText.includes('doctor')) {
      return 'health';
    }
    if (lowerText.includes('work') || lowerText.includes('meta') || lowerText.includes('job')) {
      return 'work';
    }
    if (lowerText.includes('project') || lowerText.includes('build') || lowerText.includes('code')) {
      return 'project';
    }
    if (lowerText.includes('follow up') || lowerText.includes('check') || lowerText.includes('call')) {
      return 'follow-up';
    }
    
    return 'personal';
  }
  
  private getMockReminders(): Reminder[] {
    return [
      {
        id: 'mock-1',
        title: 'Google Calendar Setup',
        description: 'Complete OAuth setup for calendar integration',
        priority: 'high',
        category: 'work',
        createdDate: '2026-04-07',
        completed: false,
        source: 'conversation',
        context: 'Dashboard integration priority'
      },
      {
        id: 'mock-2',
        title: 'Health routine check',
        description: 'Morning vitamins and movement tracking',
        priority: 'high',
        category: 'health',
        createdDate: '2026-04-07',
        completed: false,
        source: 'conversation',
        context: 'Daily optimization'
      },
    ];
  }
}

export const remindersSystemService = new RemindersSystemService();