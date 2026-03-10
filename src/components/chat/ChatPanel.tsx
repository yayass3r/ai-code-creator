'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Message } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { 
  Send, 
  Paperclip, 
  Sparkles,
  Loader2,
  Bot,
  User,
  Copy,
  Check,
  Code,
  Rocket,
  Trash2,
  Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { templates } from '@/lib/templates';

export function ChatPanel() {
  const { 
    messages, 
    addMessage, 
    updateMessage, 
    isLoading, 
    setLoading,
    selectedModel,
    setSelectedModel,
    currentProject,
    setCurrentProject,
    setGenerating,
    selectedTemplate,
    setActiveTab,
    clearMessages
  } = useAppStore();
  
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    setInput('');
    setLoading(true);
    
    // Create assistant message placeholder
    const assistantId = uuidv4();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };
    addMessage(assistantMessage);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          provider: selectedModel
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        updateMessage(assistantId, data.content);
        
        // Check if user wants to generate a project
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('create') || 
            lowerInput.includes('generate') ||
            lowerInput.includes('build') ||
            lowerInput.includes('أنشئ') ||
            lowerInput.includes('ابنِ') ||
            lowerInput.includes('اصنع')) {
          await generateProject(input);
        }
      } else {
        updateMessage(assistantId, `Error: ${data.error || 'Failed to get response'}`);
      }
    } catch (error) {
      updateMessage(assistantId, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const generateProject = async (prompt: string) => {
    setGenerating(true);
    
    try {
      // Extract project name from prompt
      const projectNameMatch = prompt.match(/(?:called|named|اسمه|باسم)\s+["']?(\w+)["']?/i);
      const projectName = projectNameMatch ? projectNameMatch[1] : 'my-project';
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          template: selectedTemplate,
          projectName,
          provider: selectedModel
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.project) {
        setCurrentProject(data.project);
        // Add success message
        const successMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: `✅ Project "${data.project.name}" generated successfully!\n\n📁 ${data.project.files.length} files created.\n\n🔄 Go to the **Code** tab to view and edit the files.\n🚀 Go to the **Deploy** tab to deploy your project.`,
          timestamp: new Date()
        };
        addMessage(successMessage);
      }
    } catch (error) {
      console.error('Project generation error:', error);
    } finally {
      setGenerating(false);
    }
  };
  
  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const models = [
    { id: 'zai', name: 'Z.ai', color: 'bg-blue-500', desc: 'Fast & Smart' },
    { id: 'grok', name: 'Grok', color: 'bg-orange-500', desc: 'Creative' },
    { id: 'openrouter', name: 'OpenRouter', color: 'bg-purple-500', desc: 'Multi-model' }
  ] as const;
  
  const suggestions = [
    { en: 'Create a dashboard with charts', ar: 'أنشئ لوحة تحكم مع رسوم بيانية', icon: '📊' },
    { en: 'Build a landing page', ar: 'ابنِ صفحة هبوط', icon: '🚀' },
    { en: 'Generate an e-commerce store', ar: 'اصنع متجر إلكتروني', icon: '🛒' },
    { en: 'Make a blog website', ar: 'أنشئ موقع مدونة', icon: '📝' },
    { en: 'Create a SaaS application', ar: 'أنشئ تطبيق SaaS', icon: '☁️' },
    { en: 'Build a portfolio site', ar: 'ابنِ موقع معرض أعمال', icon: '💼' }
  ];
  
  return (
    <div className="flex flex-col h-full">
      {/* Model Selector */}
      <div className="flex items-center justify-between gap-2 p-4 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">AI Model:</span>
          <div className="flex gap-1">
            {models.map((model) => (
              <Badge
                key={model.id}
                variant={selectedModel === model.id ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-all',
                  selectedModel === model.id && model.color
                )}
                onClick={() => setSelectedModel(model.id)}
              >
                {model.name}
              </Badge>
            ))}
          </div>
        </div>
        
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="text-muted-foreground"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
              <Wand2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">AI Code Creator</h3>
            <p className="text-lg text-muted-foreground mb-2">منشئ التطبيقات بالذكاء الصناعي</p>
            <p className="text-muted-foreground mb-6 max-w-md">
              Describe your project and I'll generate a complete Next.js application with all the files you need.
            </p>
            
            {/* Template Selection */}
            <div className="w-full max-w-lg mb-6">
              <p className="text-sm font-medium mb-2 text-muted-foreground">Select a template:</p>
              <div className="grid grid-cols-2 gap-2">
                {templates.slice(0, 6).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => useAppStore.getState().setSelectedTemplate(template.id)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all hover:border-primary',
                      selectedTemplate === template.id && 'border-primary bg-primary/5'
                    )}
                  >
                    <div className="font-medium text-sm">{template.nameAr}</div>
                    <div className="text-xs text-muted-foreground">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion) => (
                <Badge
                  key={suggestion.en}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 py-2 px-3"
                  onClick={() => setInput(suggestion.en)}
                >
                  <span className="mr-1">{suggestion.icon}</span>
                  {suggestion.en}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-xl p-4',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content || (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    )}
                  </div>
                  {message.role === 'assistant' && message.content && (
                    <div className="flex gap-2 mt-2 pt-2 border-t border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => copyToClipboard(message.content, message.id)}
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                      {currentProject && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => setActiveTab('editor')}
                          >
                            <Code className="w-3 h-3 mr-1" />
                            View Code
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => setActiveTab('deploy')}
                          >
                            <Rocket className="w-3 h-3 mr-1" />
                            Deploy
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Describe your project... (e.g., 'Create a dashboard with user analytics')"
              className="min-h-[60px] resize-none pr-12"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="h-[60px] w-[60px] shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
