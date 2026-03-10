import { NextRequest, NextResponse } from 'next/server';
import { createAICompletion, streamAICompletion, AIProvider } from '@/lib/ai-providers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, provider = 'zai', stream = false } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }
    
    // Validate provider
    const validProviders: AIProvider[] = ['grok', 'openrouter', 'zai'];
    const selectedProvider = validProviders.includes(provider) ? provider : 'zai';
    
    if (stream) {
      // For streaming, we'll use a TransformStream
      const encoder = new TextEncoder();
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();
      
      // Start streaming in background
      (async () => {
        try {
          await streamAICompletion(
            selectedProvider as AIProvider,
            messages,
            async (chunk) => {
              await writer.write(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
            }
          );
        } catch (error) {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`));
        } finally {
          await writer.close();
        }
      })();
      
      return new Response(stream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    }
    
    // Non-streaming response
    const result = await createAICompletion(
      selectedProvider as AIProvider,
      messages
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      content: result.content,
      usage: result.usage
    });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
