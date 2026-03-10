'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  RefreshCw, 
  ExternalLink,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function Preview() {
  const { currentProject, previewMode, setPreviewMode } = useAppStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  // Generate preview HTML using useMemo to avoid setState in effect
  const previewHtml = useMemo(() => {
    if (!currentProject) return '';
    
    // Generate a simple HTML preview based on the project
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentProject.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --background: #ffffff;
      --foreground: #171717;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --background: #0a0a0a;
        --foreground: #ededed;
      }
    }
    body {
      background: var(--background);
      color: var(--foreground);
    }
  </style>
</head>
<body class="min-h-screen">
  <div class="min-h-screen flex items-center justify-center p-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">${currentProject.name}</h1>
      <p class="text-lg opacity-70 mb-8">${currentProject.description}</p>
      <div class="flex gap-4 justify-center">
        <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Get Started
        </button>
        <button class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          Learn More
        </button>
      </div>
      <div class="mt-12 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
        ${['Feature 1', 'Feature 2', 'Feature 3'].map(f => `
          <div class="p-6 border rounded-lg">
            <h3 class="font-semibold mb-2">${f}</h3>
            <p class="text-sm opacity-70">Description for ${f}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }, [currentProject]);
  
  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      default:
        return 'w-full';
    }
  };
  
  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Play className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Preview Available</h3>
        <p className="text-sm text-muted-foreground">
          Generate a project to see a preview
        </p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as 'desktop' | 'mobile' | 'tablet')}>
          <TabsList className="h-8">
            <TabsTrigger value="desktop" className="h-6 px-2">
              <Monitor className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="tablet" className="h-6 px-2">
              <Tablet className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="mobile" className="h-6 px-2">
              <Smartphone className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </Button>
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Preview Area */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 overflow-auto">
        <div className={cn(
          'mx-auto h-full bg-white dark:bg-gray-950 rounded-lg shadow-lg overflow-hidden transition-all duration-300',
          getPreviewWidth()
        )}>
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
