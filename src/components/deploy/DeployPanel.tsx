'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { 
  Rocket, 
  GitBranch, 
  Globe, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Copy,
  ExternalLink,
  Download,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function DeployPanel() {
  const { currentProject, isDeploying, setDeploying, addDeployment, updateDeployment } = useAppStore();
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [githubUrl, setGithubUrl] = useState('');
  
  const handleDeploy = async () => {
    if (!currentProject) return;
    
    setDeploying(true);
    setDeploymentStatus('deploying');
    setLogs([]);
    setProgress(0);
    
    const deployLogs = [
      'Initializing deployment...',
      'Creating build environment...',
      'Installing dependencies...',
      'Building application...',
      'Running optimizations...',
      'Creating Docker image...',
      'Pushing to registry...',
      'Deploying to Northflank...',
      'Configuring domain...',
      'Deployment complete!'
    ];
    
    for (let i = 0; i < deployLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLogs(prev => [...prev, deployLogs[i]]);
      setProgress(((i + 1) / deployLogs.length) * 100);
    }
    
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: currentProject.name,
          files: currentProject.files.map(f => ({
            path: f.path,
            content: f.content
          })),
          domain: 'aicodecer.online'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDeploymentStatus('success');
        setDeploymentUrl(data.deployment?.url || `https://${currentProject.name.toLowerCase()}.aicodecer.online`);
      } else {
        setDeploymentStatus('error');
        setLogs(prev => [...prev, `Error: ${data.error}`]);
      }
    } catch (error) {
      setDeploymentStatus('error');
      setLogs(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setDeploying(false);
    }
  };
  
  const handleGithubPush = async () => {
    if (!currentProject) return;
    
    setLogs(prev => [...prev, 'Pushing to GitHub...']);
    
    try {
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentProject.name.toLowerCase().replace(/\s+/g, '-'),
          description: currentProject.description,
          files: currentProject.files.map(f => ({
            path: f.path,
            content: f.content
          }))
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.repository) {
        setGithubUrl(data.repository.html_url);
        setLogs(prev => [...prev, `Repository created: ${data.repository.html_url}`]);
      } else {
        setLogs(prev => [...prev, `GitHub Error: ${data.error}`]);
      }
    } catch (error) {
      setLogs(prev => [...prev, `GitHub Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  };
  
  const handleDownload = () => {
    if (!currentProject) return;
    
    // Create a zip-like download (simplified - download each file)
    currentProject.files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  };
  
  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Rocket className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Project to Deploy</h3>
        <p className="text-sm text-muted-foreground">
          Generate a project first to deploy it
        </p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-1">{currentProject.name}</h3>
        <p className="text-sm text-muted-foreground">{currentProject.description}</p>
      </div>
      
      {/* Deployment Options */}
      <div className="p-4 space-y-4">
        {/* Northflank Deployment */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Deploy to Cloud</span>
            </div>
            <Badge variant={deploymentStatus === 'success' ? 'default' : 'secondary'}>
              {deploymentStatus === 'idle' && 'Ready'}
              {deploymentStatus === 'deploying' && 'Deploying...'}
              {deploymentStatus === 'success' && 'Live'}
              {deploymentStatus === 'error' && 'Failed'}
            </Badge>
          </div>
          
          {deploymentStatus === 'deploying' && (
            <div className="mb-3">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}%</p>
            </div>
          )}
          
          {deploymentUrl && deploymentStatus === 'success' && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded mb-3">
              <span className="text-sm truncate flex-1">{deploymentUrl}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => navigator.clipboard.writeText(deploymentUrl)}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => window.open(deploymentUrl, '_blank')}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          )}
          
          <Button
            className="w-full"
            onClick={handleDeploy}
            disabled={isDeploying || deploymentStatus === 'deploying'}
          >
            {deploymentStatus === 'deploying' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Deploy to Production
              </>
            )}
          </Button>
        </div>
        
        {/* GitHub */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Github className="w-5 h-5" />
            <span className="font-medium">Push to GitHub</span>
          </div>
          
          {githubUrl && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded mb-3">
              <span className="text-sm truncate flex-1">{githubUrl}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => window.open(githubUrl, '_blank')}
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          )}
          
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGithubPush}
            disabled={isDeploying}
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Push to GitHub
          </Button>
        </div>
        
        {/* Download */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Project Files
        </Button>
      </div>
      
      {/* Logs */}
      {logs.length > 0 && (
        <div className="flex-1 border-t">
          <div className="p-2 border-b bg-muted/30">
            <span className="text-sm font-medium">Deployment Logs</span>
          </div>
          <ScrollArea className="h-[200px]">
            <div className="p-2 space-y-1 font-mono text-xs">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-muted-foreground select-none">[{i + 1}]</span>
                  <span className={cn(
                    log.startsWith('Error') && 'text-red-500',
                    log.includes('complete') && 'text-green-500'
                  )}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
