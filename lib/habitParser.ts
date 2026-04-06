// Parse habits_tracker.md into structured data
export interface Habit {
  id: string;
  name: string;
  target: string;
  completed: boolean;
  category: 'morning' | 'evening' | 'daily';
  description?: string;
}

export interface HabitData {
  date: string;
  habits: Habit[];
  notes?: string;
}

export function parseHabitsFromMarkdown(content: string): Habit[] {
  const habits: Habit[] = [];
  
  // Extract morning routine habits
  const morningSection = content.match(/### Morning Routine.*?\n([\s\S]*?)(?=###|$)/);
  
  if (morningSection) {
    const lines = morningSection[1].split('\n');
    
    lines.forEach(line => {
      const habitMatch = line.match(/^- \[([ x])\] \*\*(.*?)\*\* - Target: (.+?)(?:\n|$)/);
      if (habitMatch) {
        const [, completed, name, target] = habitMatch;
        habits.push({
          id: name.toLowerCase().replace(/\s+/g, '_'),
          name,
          target,
          completed: completed === 'x',
          category: 'morning'
        });
      }
    });
  }
  
  return habits;
}

// Mock data for initial demo
export const mockHabitsData: HabitData = {
  date: new Date().toISOString().split('T')[0],
  habits: [
    {
      id: 'hair_treatment',
      name: 'Hair treatment',
      target: 'Daily (after shower)',
      completed: false,
      category: 'morning',
      description: 'Daily hair care routine'
    },
    {
      id: 'vitamins',
      name: 'Vitamins',
      target: 'Daily AM',
      completed: false,
      category: 'morning',
      description: 'Multivitamin, zinc, biotin, omega-3'
    },
    {
      id: 'morning_movement',
      name: 'Morning movement',
      target: 'Daily (20-30 min)',
      completed: false,
      category: 'morning',
      description: 'Stretch/yoga + activation exercises'
    }
  ],
  notes: 'Starting new routine establishment'
};