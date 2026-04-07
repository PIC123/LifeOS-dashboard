/**
 * Zettelkasten System Integration
 * Interfaces with Phil's atomic notes, maps, and knowledge connections
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ZETTELKASTEN_PATH = '/home/openclaw/.openclaw/workspace/zettelkasten';

export interface AtomicNote {
  id: string;
  title: string;
  content: string;
  created: Date;
  tags: string[];
  connections: string[];
  frontmatter: Record<string, any>;
}

export interface KnowledgeMap {
  id: string;
  title: string;
  content: string;
  connectedNotes: string[];
  lastUpdated: Date;
}

class ZettelkastenService {
  
  // Get all atomic notes with metadata
  async getAtomicNotes(limit?: number): Promise<AtomicNote[]> {
    try {
      const notesDir = path.join(ZETTELKASTEN_PATH, 'atomic-notes');
      
      if (!fs.existsSync(notesDir)) {
        console.warn('Atomic notes directory not found');
        return [];
      }

      const files = fs.readdirSync(notesDir)
        .filter(file => file.endsWith('.md'))
        .sort()
        .reverse(); // Most recent first

      const limitedFiles = limit ? files.slice(0, limit) : files;

      const notes = limitedFiles.map(file => {
        const filePath = path.join(notesDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(content);
        
        // Extract timestamp from filename (format: YYYYMMDD-HHMM-title.md)
        const timestamp = file.substring(0, 13); // YYYYMMDD-HHMM
        const created = this.parseTimestamp(timestamp);
        
        // Extract title from filename
        const title = file.replace(/^\d{8}-\d{4}-/, '').replace('.md', '').replace(/-/g, ' ');
        
        // Extract connections from content (basic [[link]] detection)
        const connections = this.extractConnections(parsed.content);
        
        // Extract tags from frontmatter or content
        const tags = parsed.data.tags || this.extractTags(parsed.content);

        return {
          id: timestamp,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          content: parsed.content,
          created,
          tags,
          connections,
          frontmatter: parsed.data,
        };
      });

      return notes;
    } catch (error) {
      console.error('Error reading atomic notes:', error);
      return [];
    }
  }

  // Get knowledge maps
  async getKnowledgeMaps(): Promise<KnowledgeMap[]> {
    try {
      const mapsDir = path.join(ZETTELKASTEN_PATH, 'maps');
      
      if (!fs.existsSync(mapsDir)) {
        console.warn('Maps directory not found');
        return [];
      }

      const files = fs.readdirSync(mapsDir)
        .filter(file => file.endsWith('.md'));

      const maps = files.map(file => {
        const filePath = path.join(mapsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(content);
        const stats = fs.statSync(filePath);
        
        const title = file.replace('.md', '').replace(/-/g, ' ');
        const connectedNotes = this.extractConnections(parsed.content);

        return {
          id: file.replace('.md', ''),
          title: title.charAt(0).toUpperCase() + title.slice(1),
          content: parsed.content,
          connectedNotes,
          lastUpdated: stats.mtime,
        };
      });

      return maps;
    } catch (error) {
      console.error('Error reading knowledge maps:', error);
      return [];
    }
  }

  // Get inbox items (unprocessed captures)
  async getInboxItems(): Promise<{title: string, content: string, created: Date}[]> {
    try {
      const inboxDir = path.join(ZETTELKASTEN_PATH, 'inbox');
      
      if (!fs.existsSync(inboxDir)) {
        return [];
      }

      const files = fs.readdirSync(inboxDir)
        .filter(file => file.endsWith('.md'));

      const items = files.map(file => {
        const filePath = path.join(inboxDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const stats = fs.statSync(filePath);
        
        return {
          title: file.replace('.md', '').replace(/-/g, ' '),
          content,
          created: stats.birthtime,
        };
      });

      return items.sort((a, b) => b.created.getTime() - a.created.getTime());
    } catch (error) {
      console.error('Error reading inbox:', error);
      return [];
    }
  }

  // Search notes by content or title
  async searchNotes(query: string): Promise<AtomicNote[]> {
    const allNotes = await this.getAtomicNotes();
    const lowercaseQuery = query.toLowerCase();
    
    return allNotes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get recent activity (recently created or modified notes)
  async getRecentActivity(days: number = 7): Promise<AtomicNote[]> {
    const allNotes = await this.getAtomicNotes();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return allNotes.filter(note => note.created > cutoff);
  }

  // Helper methods
  private parseTimestamp(timestamp: string): Date {
    // Format: YYYYMMDD-HHMM
    const year = parseInt(timestamp.substring(0, 4));
    const month = parseInt(timestamp.substring(4, 6)) - 1; // JS months are 0-indexed
    const day = parseInt(timestamp.substring(6, 8));
    const hour = parseInt(timestamp.substring(9, 11));
    const minute = parseInt(timestamp.substring(11, 13));
    
    return new Date(year, month, day, hour, minute);
  }

  private extractConnections(content: string): string[] {
    // Extract [[note-id]] style connections
    const regex = /\[\[([^\]]+)\]\]/g;
    const connections: string[] = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      connections.push(match[1]);
    }
    
    return [...new Set(connections)]; // Remove duplicates
  }

  private extractTags(content: string): string[] {
    // Extract #tag style tags
    const regex = /#([a-zA-Z0-9-_]+)/g;
    const tags: string[] = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      tags.push(match[1]);
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }
}

export const zettelkastenService = new ZettelkastenService();