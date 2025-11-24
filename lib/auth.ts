import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { randomUUID } from "crypto"
import { getCollection } from "./db"

const secretKey = process.env.JWT_SECRET || "your-secret-key"
const key = new TextEncoder().encode(secretKey)

export interface User {
  id: string
  name: string
  email: string
  role?: "customer" | "admin"
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })
  return payload
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    // For demo purposes, we'll decode a simple token structure
    // In a real app, this would use proper JWT verification
    const decoded = JSON.parse(atob(token.split(".")[1] || ""))

    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null // Token expired
    }

    return {
      userId: decoded.userId || decoded.user?.id || "user_123",
      email: decoded.email || decoded.user?.email || "user@example.com",
    }
  } catch (error) {
    // If token is invalid, return mock data for demo
    return {
      userId: "user_123",
      email: "user@example.com",
    }
  }
}

export async function login(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = await getUserByEmail(normalizedEmail)

  console.log("=== LOGIN DEBUG ===")
  console.log("Email:", email)
  console.log("User from DB:", user)
  console.log("User role:", user?.role)

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error("Invalid credentials")
  }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "customer",
    },
    expires,
  })

  console.log("Session created with role:", user.role || "customer")

  const cookieStore = await cookies()
  cookieStore.set("session", session, { 
    expires, 
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production"
  })

  return { user: { id: user.id, name: user.name, email: user.email, role: user.role || "customer" } }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set("session", "", { expires: new Date(0) })
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  if (!session) return null

  try {
    return await decrypt(session)
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  console.log("=== GET CURRENT USER DEBUG ===")
  console.log("Session:", session)
  console.log("User from session:", session?.user)
  console.log("User role:", session?.user?.role)
  return session?.user || null
}

// Mock database functions - replace with actual database queries
interface UserDocument {
  _id: string
  id: string
  name: string
  email: string
  password_hash: string
  role: "customer" | "admin"
  created_at: string
  updated_at: string
}

async function usersCollection() {
  return getCollection<UserDocument>("customers")
}

async function getUserByEmail(email: string): Promise<UserDocument | null> {
  try {
    const collection = await usersCollection()
    const normalizedEmail = email.trim().toLowerCase()
    const user = await collection.findOne({ email: normalizedEmail })
    return user
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

export async function createUser(name: string, email: string, password: string) {
  const passwordHash = await hashPassword(password)
  const collection = await usersCollection()
  const normalizedEmail = email.trim().toLowerCase()

  const existing = await collection.findOne({ email: normalizedEmail })
  if (existing) {
    throw new Error("duplicate key")
  }

  const id = randomUUID()
  const now = new Date().toISOString()

  const user: UserDocument = {
    _id: id,
    id,
    name,
    email: normalizedEmail,
    password_hash: passwordHash,
    role: "customer",
    created_at: now,
    updated_at: now,
  }

  try {
    await collection.insertOne(user)
    console.log("User created in database:", { id: user.id, email: user.email })
    return { id: user.id, name: user.name, email: user.email, role: user.role }
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}
