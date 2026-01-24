"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronDown, ChevronRight, File, Folder, FolderOpen, ChevronsUpDown, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TreeItem {
  path: string
  type: "file" | "tree"
  name: string
}

interface TreeNode {
  name: string
  path: string
  type: "file" | "tree"
  children: TreeNode[]
}

interface RepoTreePreviewProps {
  owner?: string
  repo?: string
  url?: string
  className?: string
}

const IMPORTANT_PATTERNS = [
  /^readme/i,
  /^package\.json$/,
  /^cargo\.toml$/,
  /^pyproject\.toml$/,
  /^requirements\.txt$/,
  /^go\.mod$/,
  /^src\//,
  /^lib\//,
  /^app\//,
  /^components\//,
  /^pages\//,
  /^api\//,
  /^server\//,
  /^client\//,
  /^core\//,
  /^cmd\//,
  /^pkg\//,
  /^internal\//,
]

function isImportantPath(path: string): boolean {
  return IMPORTANT_PATTERNS.some((pattern) => pattern.test(path))
}

function buildTree(items: TreeItem[]): TreeNode[] {
  const root: TreeNode[] = []
  const nodeMap = new Map<string, TreeNode>()

  const sortedItems = [...items].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "tree" ? -1 : 1
    }
    return a.path.localeCompare(b.path)
  })

  for (const item of sortedItems) {
    const parts = item.path.split("/")
    let currentLevel = root
    let currentPath = ""

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      currentPath = currentPath ? `${currentPath}/${part}` : part
      const isLast = i === parts.length - 1

      let existingNode = nodeMap.get(currentPath)

      if (!existingNode) {
        existingNode = {
          name: part,
          path: currentPath,
          type: isLast ? item.type : "tree",
          children: [],
        }
        nodeMap.set(currentPath, existingNode)
        currentLevel.push(existingNode)
        currentLevel.sort((a, b) => {
          if (a.type !== b.type) return a.type === "tree" ? -1 : 1
          return a.name.localeCompare(b.name)
        })
      }

      currentLevel = existingNode.children
    }
  }

  return root
}

function TreeNodeComponent({
  node,
  expandedPaths,
  onToggle,
  depth = 0,
}: {
  node: TreeNode
  expandedPaths: Set<string>
  onToggle: (path: string) => void
  depth?: number
}) {
  const isExpanded = expandedPaths.has(node.path)
  const isFolder = node.type === "tree"

  return (
    <div>
      <button
        onClick={() => isFolder && onToggle(node.path)}
        className={cn(
          "flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm transition-colors hover:bg-muted",
          depth === 0 && "font-medium"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-primary" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            <File className="h-4 w-4 shrink-0 text-muted-foreground" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder && isExpanded && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              expandedPaths={expandedPaths}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("animate-pulse rounded bg-muted", className)} style={style} />
}

export function RepoTreePreview({ owner: propOwner, repo: propRepo, url, className }: RepoTreePreviewProps) {
  const [items, setItems] = useState<TreeItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)

  const parseGitHubUrl = (githubUrl: string): { owner: string; repo: string } | null => {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/)?$/)
    if (match) {
      return {
        owner: match[1],
        repo: match[2],
      }
    }
    return null
  }

  const getOwnerAndRepo = (): { owner: string | undefined; repo: string | undefined } => {
    if (url) {
      const parsed = parseGitHubUrl(url)
      if (parsed) {
        return parsed
      }
    }
    return {
      owner: propOwner,
      repo: propRepo,
    }
  }

  const { owner, repo } = getOwnerAndRepo()

  useEffect(() => {
    async function fetchTree() {
      if (!owner || !repo) {
        setError("Invalid owner or repo parameters")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(
          `/api/repositories/tree?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`
        )
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to fetch repository tree")
        }
        
        const data = await response.json()
        setItems(data.tree)
        
        const initialExpanded = new Set<string>()
        data.tree.forEach((item: TreeItem) => {
          if (item.type === "tree" && isImportantPath(item.path + "/")) {
            initialExpanded.add(item.path)
          }
        })
        setExpandedPaths(initialExpanded)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch repository tree")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTree()
  }, [owner, repo])

  const filteredItems = useMemo(() => {
    if (showAll) return items
    return items.filter((item) => isImportantPath(item.path))
  }, [items, showAll])

  const tree = useMemo(() => buildTree(filteredItems), [filteredItems])

  const handleToggle = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const handleExpandAll = () => {
    const allFolders = new Set<string>()
    filteredItems.forEach((item) => {
      if (item.type === "tree") {
        allFolders.add(item.path)
      }
      const parts = item.path.split("/")
      for (let i = 1; i < parts.length; i++) {
        allFolders.add(parts.slice(0, i).join("/"))
      }
    })
    setExpandedPaths(allFolders)
  }

  const handleCollapseAll = () => {
    setExpandedPaths(new Set())
  }

  if (isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Repository Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6" style={{ width: `${60 + Math.random() * 30}%` }} />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Repository Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Repository Files</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="h-7 text-xs"
            >
              {showAll ? "Show Important" : "Show All"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={expandedPaths.size > 0 ? handleCollapseAll : handleExpandAll}
              className="h-7 text-xs"
            >
              <ChevronsUpDown className="mr-1 h-3 w-3" />
              {expandedPaths.size > 0 ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-64 overflow-y-auto">
        {tree.length > 0 ? (
          <div className="-mx-2">
            {tree.map((node) => (
              <TreeNodeComponent
                key={node.path}
                node={node}
                expandedPaths={expandedPaths}
                onToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No files found</p>
        )}
      </CardContent>
    </Card>
  )
}
