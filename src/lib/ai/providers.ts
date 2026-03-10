import ZAI from 'z-ai-web-dev-sdk'

// Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface StreamChunk {
  content: string
  done: boolean
}

// Grok API Client
export async function* streamGrok(
  messages: ChatMessage[],
  model: string = 'grok-beta'
): AsyncGenerator<StreamChunk> {
  const apiKey = process.env.GROK_API_KEY
  
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true
    })
  })

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.statusText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') {
          yield { content: '', done: true }
          return
        }
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content || ''
          if (content) {
            yield { content, done: false }
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
  
  yield { content: '', done: true }
}

// OpenRouter API Client
export async function* streamOpenRouter(
  messages: ChatMessage[],
  model: string = 'anthropic/claude-3.5-sonnet'
): AsyncGenerator<StreamChunk> {
  const apiKey = process.env.OPENROUTER_API_KEY
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://aicodecer.online',
      'X-Title': 'AI Code Creator'
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true
    })
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') {
          yield { content: '', done: true }
          return
        }
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content || ''
          if (content) {
            yield { content, done: false }
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
  
  yield { content: '', done: true }
}

// Z.ai API Client (using the SDK)
export async function* streamZAI(
  messages: ChatMessage[]
): AsyncGenerator<StreamChunk> {
  try {
    const zai = await ZAI.create()
    
    // Z.ai SDK doesn't support streaming directly in the same way
    // We'll use the non-streaming approach and yield the complete response
    const completion = await zai.chat.completions.create({
      messages,
    })

    const content = completion.choices?.[0]?.message?.content || ''
    yield { content, done: false }
    yield { content: '', done: true }
  } catch (error) {
    console.error('Z.ai API error:', error)
    throw error
  }
}

// Main stream function that routes to the correct provider
export async function* streamChat(
  messages: ChatMessage[],
  provider: 'grok' | 'openrouter' | 'zai',
  model: string
): AsyncGenerator<StreamChunk> {
  switch (provider) {
    case 'grok':
      yield* streamGrok(messages, model)
      break
    case 'openrouter':
      yield* streamOpenRouter(messages, model)
      break
    case 'zai':
      yield* streamZAI(messages)
      break
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

// Non-streaming chat for simple completions
export async function chatCompletion(
  messages: ChatMessage[],
  provider: 'grok' | 'openrouter' | 'zai',
  model: string
): Promise<string> {
  let fullContent = ''
  for await (const chunk of streamChat(messages, provider, model)) {
    fullContent += chunk.content
  }
  return fullContent
}
