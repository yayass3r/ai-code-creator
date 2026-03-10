'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { X, Code2, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Simple code viewer/editor without Monaco (to avoid build issues)
export function CodeEditor() {
  const { 
    currentProject, 
    activeFile, 
    openFiles, 
    closeFile, 
    updateFileContent,
    setActiveFile
  } = useAppStore();
  
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  
  // Get the current content for the active file
  const getDisplayContent = () => {
    if (!activeFile) return '';
    // If user has edited this file, show edited content
    if (activeFile.id in editedContent) {
      return editedContent[activeFile.id];
    }
    // Otherwise show original content
    return activeFile.content;
  };
  
  const hasChanges = activeFile ? activeFile.id in editedContent : false;
  
  const handleContentChange = (newContent: string) => {
    if (!activeFile) return;
    setEditedContent(prev => ({
      ...prev,
      [activeFile.id]: newContent
    }));
  };
  
  const handleSave = () => {
    if (activeFile && activeFile.id in editedContent) {
      updateFileContent(activeFile.id, editedContent[activeFile.id]);
      // Clear the edited content after save
      setEditedContent(prev => {
        const newEdited = { ...prev };
        delete newEdited[activeFile.id];
        return newEdited;
      });
    }
  };
  
  const handleDownload = () => {
    if (activeFile) {
      const content = getDisplayContent();
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeFile.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  
  const displayContent = getDisplayContent();
  
  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Code2 className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Project Open</h3>
        <p className="text-sm text-muted-foreground">
          Generate a project to start editing code
        </p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      {openFiles.length > 0 && (
        <div className="flex items-center border-b bg-muted/30">
          <ScrollArea className="flex-1">
            <div className="flex">
              {openFiles.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 border-r cursor-pointer text-sm',
                    activeFile?.id === file.id
                      ? 'bg-background'
                      : 'bg-muted/50 hover:bg-muted'
                  )}
                  onClick={() => setActiveFile(file)}
                >
                  <span className="truncate max-w-[100px]">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFile(file.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {/* Editor Area */}
      {activeFile ? (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {activeFile.path}
              </span>
              {hasChanges && (
                <span className="text-xs text-amber-500">● Unsaved</span>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges}
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
          
          {/* Code Area */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 flex">
              {/* Line numbers */}
              <div className="w-12 bg-muted/30 text-right pr-3 py-4 text-xs text-muted-foreground font-mono select-none overflow-hidden">
                {displayContent.split('\n').map((_, i) => (
                  <div key={i} className="leading-6">{i + 1}</div>
                ))}
              </div>
              
              {/* Editor */}
              <textarea
                value={displayContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="flex-1 p-4 bg-background font-mono text-sm resize-none focus:outline-none leading-6"
                spellCheck={false}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Select a file to view its content</p>
        </div>
      )}
    </div>
  );
}
