import { NextRequest, NextResponse } from 'next/server';
import { googleCalendarOAuthService } from '@/lib/googleCalendarOAuth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/calendar-setup?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/calendar-setup?error=no_code', request.url));
  }

  try {
    const tokens = await googleCalendarOAuthService.getTokens(code);
    
    // In a real app, you'd save these tokens to a database or secure storage
    // For now, we'll show them to the user to add to .env.local
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };

    return NextResponse.redirect(
      new URL(`/calendar-setup?success=true&tokens=${encodeURIComponent(JSON.stringify(tokenData))}`, request.url)
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/calendar-setup?error=token_exchange_failed', request.url));
  }
}