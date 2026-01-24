import { NextResponse } from "next/server"

interface TreeItem {
  path: string
  type: "file" | "tree"
  name: string
}

interface GitHubTreeItem {
  path: string
  mode: string
  type: "blob" | "tree"
  sha: string
  size?: number
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const owner = searchParams.get("owner")
    const repo = searchParams.get("repo")

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Missing owner or repo parameter" },
        { status: 400 }
      )
    }

    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "CodeTales-App",
        },
      }
    )

    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        return NextResponse.json(
          { error: "Repository not found or private" },
          { status: 404 }
        )
      }
      if (repoResponse.status === 403) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        )
      }
      throw new Error("Failed to fetch repository info")
    }

    const repoData = await repoResponse.json()
    const defaultBranch = repoData.default_branch

    const treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "CodeTales-App",
        },
      }
    )

    if (!treeResponse.ok) {
      if (treeResponse.status === 403) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        )
      }
      throw new Error("Failed to fetch repository tree")
    }

    const treeData = await treeResponse.json()
    
    const items: TreeItem[] = (treeData.tree as GitHubTreeItem[])
      .slice(0, 200)
      .map((item) => ({
        path: item.path,
        type: item.type === "blob" ? "file" : "tree",
        name: item.path.split("/").pop() || item.path,
      }))

    return NextResponse.json({
      tree: items,
      truncated: treeData.truncated || treeData.tree.length > 200,
    })
  } catch (error) {
    console.error("Error fetching repository tree:", error)
    return NextResponse.json(
      { error: "Failed to fetch repository tree" },
      { status: 500 }
    )
  }
}
