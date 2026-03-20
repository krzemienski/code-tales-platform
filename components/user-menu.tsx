"use client"

import { useAuth } from "@/lib/auth/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, LayoutDashboard, Settings, Headphones } from "lucide-react"
import Link from "next/link"

export function UserMenu() {
  const { user, isLoading, login, logout } = useAuth()

  const handleSignOut = async () => {
    await logout()
  }

  const handleSignIn = () => {
    login()
  }

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleSignIn} className="text-zinc-400 hover:text-white">
          Sign In
        </Button>
        <Button size="sm" onClick={handleSignIn}>
          Sign Up
        </Button>
      </div>
    )
  }

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.firstName || user.email?.split("@")[0] || "User"

  const initials = (user.firstName?.[0] || "") + (user.lastName?.[0] || "") || user.email?.[0].toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.profileImageUrl || "/placeholder.svg"}
              alt={displayName}
            />
            <AvatarFallback className="bg-emerald-600 text-white">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-white">{displayName}</p>
            <p className="text-xs text-zinc-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem asChild className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer">
          <Link href="/dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer">
          <Link href="/dashboard">
            <Headphones className="w-4 h-4 mr-2" />
            My Stories
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer">
          <Link href="/dashboard/settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-400 focus:text-red-300 focus:bg-zinc-800 cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
