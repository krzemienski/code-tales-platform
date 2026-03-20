import { db, processingLogs } from "@/lib/db"
import { eq, asc } from "drizzle-orm"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID_RE.test(id)) return Response.json({ error: "Invalid story ID" }, { status: 400 })

  const logs = await db
    .select()
    .from(processingLogs)
    .where(eq(processingLogs.storyId, id))
    .orderBy(asc(processingLogs.timestamp))

  const formattedLogs = logs.map((log) => ({
    id: log.id,
    story_id: log.storyId,
    timestamp: log.timestamp?.toISOString(),
    agent_name: log.agentName,
    action: log.action,
    details: log.details,
    level: log.level,
  }))

  return Response.json(formattedLogs)
}
