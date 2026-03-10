import { NextRequest, NextResponse } from 'next/server';
import { getGitHubClient, createProjectRepository } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const client = getGitHubClient();
    const user = await client.getUser();
    const repos = await client.getRepositories();
    
    return NextResponse.json({
      success: true,
      user,
      repositories: repos.slice(0, 10) // Limit to 10 repos
    });
    
  } catch (error) {
    console.error('GitHub GET API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

interface CreateRepoRequest {
  name: string;
  description?: string;
  files: Array<{ path: string; content: string }>;
  private?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRepoRequest = await request.json();
    const { name, description, files } = body;
    
    if (!name || !files) {
      return NextResponse.json(
        { error: 'Repository name and files are required' },
        { status: 400 }
      );
    }
    
    const result = await createProjectRepository(name, files, description);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      repository: result.repository
    });
    
  } catch (error) {
    console.error('GitHub POST API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
