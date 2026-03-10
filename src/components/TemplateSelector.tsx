'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { PROJECT_TEMPLATES, getTemplateById, getFileLanguage } from '@/lib/templates'
import { useAppStore } from '@/store'
import { 
  FileCode, 
  LayoutDashboard, 
  Rocket, 
  ShoppingCart, 
  FileText,
  Plus
} from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  FileCode: <FileCode className="w-6 h-6" />,
  LayoutDashboard: <LayoutDashboard className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
  ShoppingCart: <ShoppingCart className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
}

interface TemplateSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TemplateSelector({ open, onOpenChange }: TemplateSelectorProps) {
  const { setCurrentProject, addMessage, selectedModel } = useAppStore()

  const handleSelectTemplate = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (!template) return

    const project = {
      id: crypto.randomUUID(),
      name: template.name,
      description: template.description,
      template: templateId,
      files: template.files.map(f => ({
        path: f.path,
        content: f.content,
        language: f.language,
        isModified: false
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setCurrentProject(project)
    addMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `✨ **${template.name}** template loaded!\n\nI've created a project based on the "${template.name}" template. You can:\n\n• Edit files in the **Editor** panel\n• Preview changes in the **Preview** panel\n• Deploy your project using the **Deploy** panel\n\nFeel free to customize it or ask me to make changes!`,
      timestamp: new Date()
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Start with a pre-built template or create a blank project
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {PROJECT_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className="flex flex-col items-start p-4 rounded-lg border hover:border-primary hover:bg-accent transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                {iconMap[template.icon] || <FileCode className="w-6 h-6" />}
              </div>
              <h3 className="font-semibold">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{template.nameAr}</p>
              <p className="text-xs text-muted-foreground mt-2">{template.description}</p>
            </button>
          ))}
          
          {/* Custom Project Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="flex flex-col items-start p-4 rounded-lg border border-dashed hover:border-primary hover:bg-accent transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">Custom Project</h3>
            <p className="text-sm text-muted-foreground mt-1">مشروع مخصص</p>
            <p className="text-xs text-muted-foreground mt-2">Describe your project in the chat</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
