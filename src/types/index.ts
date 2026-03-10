// Types for AI Code Creator Platform

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  isStreaming?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'code';
  url?: string;
  content?: string;
  base64?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  type: 'file' | 'directory';
  children?: ProjectFile[];
  isOpen?: boolean;
  language?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  template: ProjectTemplate;
  status: 'draft' | 'generating' | 'ready' | 'deployed' | 'error';
  deploymentUrl?: string;
  githubUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectTemplate = 
  | 'nextjs-dashboard'
  | 'nextjs-landing'
  | 'nextjs-ecommerce'
  | 'nextjs-blog'
  | 'nextjs-saas'
  | 'nextjs-portfolio'
  | 'custom';

export interface Template {
  id: ProjectTemplate;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  features: string[];
  featuresAr: string[];
  defaultFiles: Partial<ProjectFile>[];
}

export type AIModel = 'grok' | 'openrouter' | 'zai';

export interface AIModelConfig {
  id: AIModel;
  name: string;
  provider: string;
  model: string;
  description: string;
}

export interface DeploymentStatus {
  id: string;
  projectId: string;
  status: 'pending' | 'building' | 'deploying' | 'live' | 'failed';
  url?: string;
  logs?: string[];
  progress?: number;
  createdAt: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedModel: AIModel;
}

export interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  activeFile: ProjectFile | null;
  openFiles: ProjectFile[];
  isGenerating: boolean;
}

export interface DeploymentState {
  deployments: DeploymentStatus[];
  currentDeployment: DeploymentStatus | null;
  isDeploying: boolean;
}

export interface GeneratorRequest {
  prompt: string;
  template: ProjectTemplate;
  model: AIModel;
  projectName?: string;
  attachments?: Attachment[];
}

export interface GeneratorResponse {
  success: boolean;
  project?: Project;
  message?: string;
  error?: string;
}
