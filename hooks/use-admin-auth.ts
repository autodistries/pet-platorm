"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function useAdminAuth() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      console.log("=== ADMIN AUTH CHECK (from context) ===")
      console.log("User from context:", user)
      console.log("User role:", user?.role)

      if (!user) {
        console.log("Not authenticated, redirecting to login")
        router.push("/auth/login")
        return
      }

      if (user.role !== "admin") {
        console.log("Access denied - user is not admin")
        router.push("/")
        return
      }

      console.log("Access granted - user is admin")
      setIsAuthorized(true)
    }
  }, [user, isLoading, router])

  return { isAuthorized, loading: isLoading }
}
