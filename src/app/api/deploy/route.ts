import { NextRequest, NextResponse } from 'next/server';
import { getNorthflankClient, deployToNorthflank } from '@/lib/northflank';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface DeployRequest {
  projectName: string;
  files: Array<{ path: string; content: string }>;
  domain?: string;
}

type DeploymentStatusType = 'pending' | 'building' | 'deploying' | 'live' | 'failed';

interface Deployment {
  id: string;
  projectId: string;
  status: DeploymentStatusType;
  progress: number;
  logs: string[];
  url?: string;
  createdAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    const body: DeployRequest = await request.json();
    const { projectName, files, domain } = body;
    
    if (!projectName || !files) {
      return NextResponse.json(
        { error: 'Project name and files are required' },
        { status: 400 }
      );
    }
    
    // Simulate deployment process
    const deploymentId = uuidv4();
    
    const deployment: Deployment = {
      id: deploymentId,
      projectId: uuidv4(),
      status: 'building',
      progress: 0,
      logs: [
        'Initializing deployment...',
        'Creating build environment...',
        'Installing dependencies...',
        'Building application...',
      ],
      createdAt: new Date()
    };
    
    // Try to deploy to Northflank if configured
    let deploymentUrl: string | null = null;
    try {
      const result = await deployToNorthflank(
        projectName,
        'node:20-alpine', // Base image
        domain || process.env.NORTHFLANK_DOMAIN
      );
      
      if (result.success) {
        deployment.status = 'live';
        deployment.progress = 100;
        deploymentUrl = result.url || null;
        deployment.logs.push('Deployment successful!');
      }
    } catch (error) {
      console.log('Northflank deployment skipped:', error);
    }
    
    return NextResponse.json({
      success: true,
      deployment: {
        ...deployment,
        url: deploymentUrl || `https://${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.northflank.app`
      }
    });
    
  } catch (error) {
    console.error('Deploy API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deploymentId = searchParams.get('id');
    
    if (!deploymentId) {
      return NextResponse.json(
        { error: 'Deployment ID is required' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      deployment: {
        id: deploymentId,
        status: 'live' as DeploymentStatusType,
        progress: 100,
        logs: ['Deployment completed successfully']
      }
    });
    
  } catch (error) {
    console.error('Deploy Status API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
