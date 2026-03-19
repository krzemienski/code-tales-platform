import { db, stories } from "@/lib/db"
import { eq } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { getFileStream } from "@/lib/storage"

export const maxDuration = 60

function normalizeStoragePath(path: string): string {
  const bucketPrefix = `/replit-objstore-${process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID}`
  if (path.startsWith(bucketPrefix)) {
    path = path.slice(bucketPrefix.length)
  }
  if (path.startsWith("/replit-objstore-")) {
    const match = path.match(/^\/replit-objstore-[^/]+(.*)$/)
    if (match) path = match[1]
  }
  if (path.startsWith("/")) path = path.slice(1)
  return path
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const [story] = await db
      .select({
        title: stories.title,
        audioUrl: stories.audioUrl,
        audioChunks: stories.audioChunks,
      })
      .from(stories)
      .where(eq(stories.id, id))

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    const chunks = (story.audioChunks as string[]) || []
    if (chunks.length === 0 && story.audioUrl) {
      chunks.push(story.audioUrl)
    }

    if (chunks.length === 0) {
      return NextResponse.json({ error: "No audio available" }, { status: 404 })
    }

    console.log(`[download] Downloading ${chunks.length} audio chunks for story ${id}`)

    const audioBuffers: Buffer[] = []
    const failedChunks: string[] = []
    for (const chunkPath of chunks) {
      const storagePath = normalizeStoragePath(chunkPath)
      console.log(`[download] Reading chunk from storage: ${storagePath}`)

      try {
        if (chunkPath.startsWith("http://") || chunkPath.startsWith("https://")) {
          const response = await fetch(chunkPath)
          if (!response.ok) {
            failedChunks.push(chunkPath)
            console.error(`[download] Failed to fetch URL chunk: ${chunkPath} (${response.status})`)
            continue
          }
          const buffer = Buffer.from(await response.arrayBuffer())
          audioBuffers.push(buffer)
        } else {
          const stream = await getFileStream(storagePath)
          if (!stream) {
            failedChunks.push(storagePath)
            console.error(`[download] Failed to read storage chunk: ${storagePath}`)
            continue
          }
          const bufChunks: Buffer[] = []
          for await (const chunk of stream) {
            bufChunks.push(Buffer.from(chunk))
          }
          audioBuffers.push(Buffer.concat(bufChunks))
        }
        console.log(`[download] Chunk size: ${audioBuffers[audioBuffers.length - 1].byteLength}`)
      } catch (chunkError) {
        failedChunks.push(storagePath)
        console.error(`[download] Error reading chunk ${storagePath}:`, chunkError)
      }
    }

    if (failedChunks.length > 0) {
      console.error(`[download] ${failedChunks.length}/${chunks.length} chunks failed: ${failedChunks.join(", ")}`)
    }

    if (audioBuffers.length === 0) {
      return NextResponse.json({ error: "Failed to fetch audio" }, { status: 500 })
    }

    if (audioBuffers.length < chunks.length) {
      console.warn(`[download] Partial download: ${audioBuffers.length}/${chunks.length} chunks succeeded`)
    }

    const combined = Buffer.concat(audioBuffers)
    console.log(`[download] Combined audio size: ${combined.byteLength} bytes`)

    const safeName = (story.title || "story")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50)

    return new NextResponse(combined, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${safeName}.mp3"`,
        "Content-Length": combined.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("[download] Download error:", error)
    return NextResponse.json({ error: "Failed to download audio" }, { status: 500 })
  }
}
