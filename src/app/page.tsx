'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { FileTree } from '@/components/editor/FileTree';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Preview } from '@/components/preview/Preview';
import { DeployPanel } from '@/components/deploy/DeployPanel';
import { templates } from '@/lib/templates';
import { 
  MessageSquare, 
  Code2, 
  Play, 
  Rocket, 
  Menu, 
  X,
  Sparkles,
  Moon,
  Sun,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ProjectTemplate } from '@/types';

export default function Home() {
  const { 
    activeTab, 
    setActiveTab, 
    sidebarOpen, 
    toggleSidebar,
    theme,
    setTheme,
    selectedTemplate,
    setSelectedTemplate,
    currentProject,
    isGenerating
  } = useAppStore();
  
  const [showTemplates, setShowTemplates] = useState(false);
  
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'editor', label: 'Code', icon: Code2 },
    { id: 'preview', label: 'Preview', icon: Play },
    { id: 'deploy', label: 'Deploy', icon: Rocket }
  ] as const;
  
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">AI Code Creator</span>
          </div>
          
          {currentProject && (
            <Badge variant="secondary" className="ml-2">
              {currentProject.name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <a 
            href="https://aicodecer.online" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Zap className="w-4 h-4 mr-1" />
              Live Demo
            </Button>
          </a>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Templates & File Tree */}
        <aside 
          className={cn(
            'border-r flex flex-col bg-muted/30 transition-all duration-300',
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          )}
        >
          {/* Template Selector */}
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Templates</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                {showTemplates ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {showTemplates && (
              <ScrollArea className="h-[200px]">
                <div className="space-y-1">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={cn(
                        'w-full text-left p-2 rounded-lg text-sm transition-colors',
                        selectedTemplate === template.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      <div className="font-medium">{template.nameAr}</div>
                      <div className="text-xs opacity-70 truncate">{template.descriptionAr}</div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          
          {/* File Tree */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between p-2 border-b">
              <div className="flex items-center gap-1">
                <FolderTree className="w-4 h-4" />
                <span className="text-sm font-medium">Files</span>
              </div>
              {currentProject && (
                <Badge variant="outline" className="text-xs">
                  {currentProject.files.length} files
                </Badge>
              )}
            </div>
            <FileTree />
          </div>
        </aside>
        
        {/* Collapsible Sidebar Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background border rounded-r-md shadow-sm"
          onClick={toggleSidebar}
          style={{ left: sidebarOpen ? '256px' : '0' }}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
        
        {/* Main Panel */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList className="h-10">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="data-[state=active]:bg-background"
                  >
                    <tab.icon className="w-4 h-4 mr-1" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="chat" className="h-full m-0">
                <ChatPanel />
              </TabsContent>
              
              <TabsContent value="editor" className="h-full m-0">
                <CodeEditor />
              </TabsContent>
              
              <TabsContent value="preview" className="h-full m-0">
                <Preview />
              </TabsContent>
              
              <TabsContent value="deploy" className="h-full m-0">
                <DeployPanel />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
      
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-lg font-medium">Generating your project...</p>
            <p className="text-sm text-muted-foreground">This may take a few seconds</p>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="h-8 border-t flex items-center justify-center text-xs text-muted-foreground">
        <span>AI Code Creator • Powered by Z.ai • Northflank • GitHub</span>
      </footer>
    </div>
  );
}
