import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Message, 
  Project, 
  ProjectFile, 
  AIModel, 
  DeploymentStatus,
  ProjectTemplate 
} from '@/types';

interface AppState {
  // Chat State
  messages: Message[];
  isLoading: boolean;
  selectedModel: AIModel;
  
  // Project State
  currentProject: Project | null;
  projects: Project[];
  activeFile: ProjectFile | null;
  openFiles: ProjectFile[];
  isGenerating: boolean;
  selectedTemplate: ProjectTemplate;
  
  // Deployment State
  deployments: DeploymentStatus[];
  currentDeployment: DeploymentStatus | null;
  isDeploying: boolean;
  
  // UI State
  activeTab: 'chat' | 'editor' | 'preview' | 'deploy';
  previewMode: 'desktop' | 'mobile' | 'tablet';
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  
  // Chat Actions
  addMessage: (message: Message) => void;
  updateMessage: (id: string, content: string) => void;
  setMessages: (messages: Message[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedModel: (model: AIModel) => void;
  clearMessages: () => void;
  
  // Project Actions
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  setActiveFile: (file: ProjectFile | null) => void;
  openFile: (file: ProjectFile) => void;
  closeFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  setGenerating: (generating: boolean) => void;
  setSelectedTemplate: (template: ProjectTemplate) => void;
  
  // Deployment Actions
  addDeployment: (deployment: DeploymentStatus) => void;
  updateDeployment: (id: string, update: Partial<DeploymentStatus>) => void;
  setDeploying: (deploying: boolean) => void;
  
  // UI Actions
  setActiveTab: (tab: 'chat' | 'editor' | 'preview' | 'deploy') => void;
  setPreviewMode: (mode: 'desktop' | 'mobile' | 'tablet') => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial Chat State
      messages: [],
      isLoading: false,
      selectedModel: 'zai',
      
      // Initial Project State
      currentProject: null,
      projects: [],
      activeFile: null,
      openFiles: [],
      isGenerating: false,
      selectedTemplate: 'nextjs-dashboard',
      
      // Initial Deployment State
      deployments: [],
      currentDeployment: null,
      isDeploying: false,
      
      // Initial UI State
      activeTab: 'chat',
      previewMode: 'desktop',
      sidebarOpen: true,
      theme: 'dark',
      
      // Chat Actions
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      
      updateMessage: (id, content) => set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, content, isStreaming: false } : msg
        )
      })),
      
      setMessages: (messages) => set({ messages }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setSelectedModel: (model) => set({ selectedModel: model }),
      
      clearMessages: () => set({ messages: [] }),
      
      // Project Actions
      setCurrentProject: (project) => set({ currentProject: project }),
      
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
      })),
      
      setActiveFile: (file) => set({ activeFile: file }),
      
      openFile: (file) => set((state) => {
        const isOpen = state.openFiles.find(f => f.id === file.id);
        if (isOpen) {
          return { activeFile: file };
        }
        return {
          openFiles: [...state.openFiles, file],
          activeFile: file
        };
      }),
      
      closeFile: (fileId) => set((state) => {
        const newOpenFiles = state.openFiles.filter(f => f.id !== fileId);
        const newActiveFile = state.activeFile?.id === fileId
          ? newOpenFiles[newOpenFiles.length - 1] || null
          : state.activeFile;
        return { openFiles: newOpenFiles, activeFile: newActiveFile };
      }),
      
      updateFileContent: (fileId, content) => set((state) => {
        const updateContent = (files: ProjectFile[]): ProjectFile[] => {
          return files.map(file => {
            if (file.id === fileId) {
              return { ...file, content };
            }
            if (file.children) {
              return { ...file, children: updateContent(file.children) };
            }
            return file;
          });
        };
        
        return {
          openFiles: state.openFiles.map(f => 
            f.id === fileId ? { ...f, content } : f
          ),
          activeFile: state.activeFile?.id === fileId
            ? { ...state.activeFile, content }
            : state.activeFile,
          currentProject: state.currentProject ? {
            ...state.currentProject,
            files: updateContent(state.currentProject.files)
          } : null
        };
      }),
      
      setGenerating: (generating) => set({ isGenerating: generating }),
      
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      
      // Deployment Actions
      addDeployment: (deployment) => set((state) => ({
        deployments: [...state.deployments, deployment]
      })),
      
      updateDeployment: (id, update) => set((state) => ({
        deployments: state.deployments.map(d =>
          d.id === id ? { ...d, ...update } : d
        ),
        currentDeployment: state.currentDeployment?.id === id
          ? { ...state.currentDeployment, ...update }
          : state.currentDeployment
      })),
      
      setDeploying: (deploying) => set({ isDeploying: deploying }),
      
      // UI Actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setPreviewMode: (mode) => set({ previewMode: mode }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'ai-code-creator-storage',
      partialize: (state) => ({
        messages: state.messages,
        projects: state.projects,
        selectedModel: state.selectedModel,
        theme: state.theme
      })
    }
  )
);
