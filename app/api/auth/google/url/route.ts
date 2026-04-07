import { NextResponse } from 'next/server';
import { googleCalendarOAuthService } from '@/lib/googleCalendarOAuth';

export async function GET() {
  try {
    const authUrl = googleCalendarOAuthService.getAuthUrl();
    
    return NextResponse.json({
      authUrl,
      success: true,
    });
  } catch (error) {
    console.error('OAuth URL generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate OAuth URL',
        success: false,
      },
      { status: 500 }
    );
  }
}