"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth/use-auth"
import { Loader2 } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "signin" | "signup"
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, isLoading } = useAuth()

  const handleSignIn = () => {
    login()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Welcome to Code Tales</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Sign in with your Replit account to create audio stories from code repositories
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-6">
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Sign in with Replit"
            )}
          </Button>

          <p className="text-center text-sm text-zinc-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
