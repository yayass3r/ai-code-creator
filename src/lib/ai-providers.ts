import ZAI from 'z-ai-web-dev-sdk';

export type AIProvider = 'grok' | 'openrouter' | 'zai';

interface AIProviderConfig {
  name: string;
  model: string;
  baseUrl?: string;
}

const providerConfigs: Record<AIProvider, AIProviderConfig> = {
  grok: {
    name: 'Grok (X.AI)',
    model: 'grok-beta',
    baseUrl: 'https://api.x.ai/v1'
  },
  openrouter: {
    name: 'OpenRouter',
    model: 'anthropic/claude-3.5-sonnet',
    baseUrl: 'https://openrouter.ai/api/v1'
  },
  zai: {
    name: 'Z.ai',
    model: 'glm-4-plus',
  }
};

export async function createAICompletion(
  provider: AIProvider,
  messages: Array<{ role: string; content: string }>,
  options?: {
    stream?: boolean;
    temperature?: number;
    maxTokens?: number;
  }
) {
  const config = providerConfigs[provider];
  
  // Use Z.ai SDK for all providers
  const zai = await ZAI.create();
  
  const systemPrompt = getSystemPrompt();
  
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];
  
  try {
    const completion = await zai.chat.completions.create({
      messages: fullMessages.map(m => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content
      })),
      temperature: options?.temperature ?? 0.7,
    });
    
    return {
      success: true,
      content: completion.choices[0]?.message?.content || '',
      usage: completion.usage
    };
  } catch (error) {
    console.error('AI Completion Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function streamAICompletion(
  provider: AIProvider,
  messages: Array<{ role: string; content: string }>,
  onChunk: (chunk: string) => void,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
) {
  const zai = await ZAI.create();
  
  const systemPrompt = getSystemPrompt();
  
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];
  
  try {
    // For now, use non-streaming as fallback
    const completion = await zai.chat.completions.create({
      messages: fullMessages.map(m => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content
      })),
      temperature: options?.temperature ?? 0.7,
    });
    
    const content = completion.choices[0]?.message?.content || '';
    onChunk(content);
    
    return {
      success: true,
      content
    };
  } catch (error) {
    console.error('AI Streaming Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function getSystemPrompt(): string {
  return `You are an expert full-stack developer AI assistant specialized in generating production-ready Next.js applications. 

Your capabilities include:
- Creating complete Next.js 15 applications with App Router
- Writing clean, maintainable TypeScript code
- Building responsive UIs with Tailwind CSS and shadcn/ui
- Implementing backend APIs and database integrations
- Docker containerization
- Best practices for security and performance

When generating code:
1. Provide complete, working code - no placeholders
2. Include all necessary imports
3. Follow Next.js 15 conventions
4. Use TypeScript strict mode
5. Implement proper error handling
6. Include comments for complex logic

Project Structure Guidelines:
- src/app/ - App Router pages and API routes
- src/components/ - Reusable React components
- src/lib/ - Utility functions and shared logic
- src/hooks/ - Custom React hooks
- src/types/ - TypeScript type definitions

Always respond in a helpful, professional manner. If asked to generate a project, provide the file structure and code for each file.`;
}

export function getProviderInfo(provider: AIProvider): AIProviderConfig {
  return providerConfigs[provider];
}
