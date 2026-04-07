import { NextResponse } from 'next/server';
import { remindersSystemService } from '@/lib/remindersSystem';

export async function GET() {
  try {
    console.log('Reminders API called');
    const reminders = await remindersSystemService.getReminders();
    console.log('Reminders fetched successfully:', { remindersCount: reminders.length });

    return NextResponse.json({
      reminders,
      success: true,
    });
  } catch (error) {
    console.error('Reminders API error:', error);
    
    // Return 200 with empty array to prevent dashboard blocking
    return NextResponse.json(
      { 
        error: 'Failed to fetch reminders data',
        success: false,
        reminders: [],
      },
      { status: 200 }
    );
  }
}