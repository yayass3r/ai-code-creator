import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Store preview sessions in memory (in production, use Redis or similar)
const previewSessions = new Map<string, {
  files: { path: string; content: string }[]
  createdAt: number
}>()

// Clean up old sessions every 10 minutes
setInterval(() => {
  const now = Date.now()
  const maxAge = 30 * 60 * 1000 // 30 minutes
  for (const [id, session] of previewSessions.entries()) {
    if (now - session.createdAt > maxAge) {
      previewSessions.delete(id)
    }
  }
}, 10 * 60 * 1000)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, sessionId, files } = body

    switch (action) {
      case 'create': {
        if (!files || !Array.isArray(files)) {
          return NextResponse.json({ error: 'Files are required' }, { status: 400 })
        }

        // Generate a unique session ID
        const id = crypto.randomUUID()
        
        previewSessions.set(id, {
          files,
          createdAt: Date.now()
        })

        return NextResponse.json({
          success: true,
          sessionId: id,
          previewUrl: `/api/preview?session=${id}`
        })
      }

      case 'update': {
        if (!sessionId || !files) {
          return NextResponse.json({ error: 'sessionId and files are required' }, { status: 400 })
        }

        const session = previewSessions.get(sessionId)
        if (!session) {
          return NextResponse.json({ error: 'Session not found' }, { status: 404 })
        }

        session.files = files
        session.createdAt = Date.now()

        return NextResponse.json({ success: true })
      }

      case 'delete': {
        if (!sessionId) {
          return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
        }

        previewSessions.delete(sessionId)
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Preview API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Preview operation failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const session = previewSessions.get(sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 })
    }

    // Find the main page file
    const pageFile = session.files.find(f => 
      f.path === 'src/app/page.tsx' || 
      f.path === 'src/pages/index.tsx' ||
      f.path === 'pages/index.tsx' ||
      f.path === 'index.html'
    )

    if (!pageFile) {
      return NextResponse.json({ error: 'No page file found' }, { status: 404 })
    }

    // Return the files for the preview
    return NextResponse.json({
      sessionId,
      files: session.files,
      mainPage: pageFile
    })
  } catch (error) {
    console.error('Preview API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get preview' },
      { status: 500 }
    )
  }
}
