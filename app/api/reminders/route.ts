import { NextResponse } from 'next/server';
import { remindersSystemService } from '@/lib/remindersSystem';

export async function GET() {
  try {
    const reminders = await remindersSystemService.getReminders();

    return NextResponse.json({
      reminders,
      success: true,
    });
  } catch (error) {
    console.error('Reminders API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch reminders data',
        success: false,
      },
      { status: 500 }
    );
  }
}