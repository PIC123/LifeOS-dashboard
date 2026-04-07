import { NextResponse } from 'next/server';
import { paraSystemService } from '@/lib/paraSystem';

export async function GET() {
  try {
    console.log('Projects API called');
    const [projects, areas] = await Promise.all([
      paraSystemService.getProjects(),
      paraSystemService.getAreas(),
    ]);
    console.log('Projects fetched successfully:', { projectsCount: projects.length, areasCount: areas.length });

    return NextResponse.json({
      projects,
      areas,
      success: true,
    });
  } catch (error) {
    console.error('Projects API error:', error);
    
    // Return 200 with empty arrays to prevent dashboard blocking
    return NextResponse.json(
      { 
        error: 'Failed to fetch project data',
        success: false,
        projects: [],
        areas: [],
      },
      { status: 200 }
    );
  }
}