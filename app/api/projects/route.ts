import { NextResponse } from 'next/server';
import { paraSystemService } from '@/lib/paraSystem';

export async function GET() {
  try {
    const [projects, areas] = await Promise.all([
      paraSystemService.getProjects(),
      paraSystemService.getAreas(),
    ]);

    return NextResponse.json({
      projects,
      areas,
      success: true,
    });
  } catch (error) {
    console.error('Projects API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch project data',
        success: false,
      },
      { status: 500 }
    );
  }
}