"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role?: "customer" | "admin"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("=== AUTH CONTEXT CHECK ===")
        console.log("User data:", data)
        console.log("User role:", data.user?.role)
        setUser(data.user)
      } else {
        console.log("Auth check failed with status:", response.status)
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = (userData: User) => {
    console.log("=== AUTH CONTEXT LOGIN ===")
    console.log("Setting user:", userData)
    setUser(userData)
    setIsLoading(false)
  }

  const logout = () => {
    console.log("=== AUTH CONTEXT LOGOUT ===")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
