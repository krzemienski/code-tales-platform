"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileEdit, Calendar, Trash2, ArrowRight, Loader2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DraftCardProps {
  draft: {
    id: string
    repositoryName: string | null
    repositoryOwner: string | null
    repositoryLanguage: string | null
    styleConfig: Record<string, unknown> | null
    scheduledAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }
}

function formatDate(date: Date | null): string {
  if (!date) return "Unknown"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatScheduledDate(date: Date | null): string {
  if (!date) return ""
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function DraftCard({ draft }: DraftCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/drafts/${draft.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting draft:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const styleConfig = draft.styleConfig as Record<string, unknown> || {}

  return (
    <div className="group rounded-xl border border-dashed border-border bg-card/20 p-4 transition-all hover:border-primary/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <FileEdit className="h-4 w-4 text-muted-foreground" />
            <h3 className="truncate font-medium text-foreground">
              {draft.repositoryOwner && draft.repositoryName
                ? `${draft.repositoryOwner}/${draft.repositoryName}`
                : "Untitled Draft"}
            </h3>
            <span className="rounded-full px-2 py-1 text-xs font-medium bg-orange-500/10 text-orange-500">
              Draft
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {draft.repositoryLanguage && <span>{String(draft.repositoryLanguage)}</span>}
            {styleConfig.narrativeStyle && (
              <span className="capitalize">{String(styleConfig.narrativeStyle)}</span>
            )}
            {draft.scheduledAt && (
              <span className="flex items-center gap-1 text-primary">
                <Calendar className="h-3 w-3" />
                Scheduled for {formatScheduledDate(draft.scheduledAt)}
              </span>
            )}
            <span>Updated {formatDate(draft.updatedAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/new?draft=${draft.id}`}>
              Continue
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/new?draft=${draft.id}`}>Continue Editing</Link>
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive">
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this draft? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
