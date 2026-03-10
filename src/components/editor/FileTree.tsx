'use client';

import { useAppStore } from '@/store';
import { ProjectFile } from '@/types';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  FileCode,
  FileJson,
  FileText,
  FileCog,
  Plus,
  Trash2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileTreeItemProps {
  file: ProjectFile;
  depth: number;
  onSelect: (file: ProjectFile) => void;
  selectedId?: string;
}

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return <FileCode className="w-4 h-4 text-blue-500" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-yellow-500" />;
    case 'css':
      return <File className="w-4 h-4 text-pink-500" />;
    case 'md':
      return <FileText className="w-4 h-4 text-gray-500" />;
    case 'dockerfile':
      return <FileCog className="w-4 h-4 text-cyan-500" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
}

function FileTreeItem({ file, depth, onSelect, selectedId }: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDirectory = file.type === 'directory';
  const isSelected = file.id === selectedId;
  
  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-accent rounded text-sm',
          isSelected && 'bg-accent'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          if (isDirectory) {
            setIsOpen(!isOpen);
          } else {
            onSelect(file);
          }
        }}
      >
        {isDirectory ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 text-amber-500" />
            ) : (
              <Folder className="w-4 h-4 text-amber-500" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            {getFileIcon(file.name)}
          </>
        )}
        <span className="truncate">{file.name}</span>
      </div>
      
      {isDirectory && isOpen && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeItem
              key={child.id}
              file={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';

export function FileTree() {
  const { currentProject, activeFile, openFile } = useAppStore();
  
  if (!currentProject || !currentProject.files.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Folder className="w-12 h-12 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          No files yet
        </p>
        <p className="text-xs text-muted-foreground">
          Generate a project to see files
        </p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b">
        <span className="text-sm font-medium truncate">{currentProject.name}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="py-1">
          {currentProject.files.map((file) => (
            <FileTreeItem
              key={file.id}
              file={file}
              depth={0}
              onSelect={openFile}
              selectedId={activeFile?.id}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
