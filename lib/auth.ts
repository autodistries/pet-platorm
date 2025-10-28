import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { query } from "./db"

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
  // This would typically query your database
  // For now, we'll simulate a database lookup
  const user = await getUserByEmail(email)

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

  const cookieStore = await cookies()
  cookieStore.set("session", session, { expires, httpOnly: true })

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
  return session?.user || null
}

// Mock database functions - replace with actual database queries
async function getUserByEmail(email: string) {
  try {
    const result = await query("SELECT id, name, email, password_hash, role FROM customers WHERE email = $1", [email])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

export async function createUser(name: string, email: string, password: string) {
  const passwordHash = await hashPassword(password)

  try {
    const result = await query(
      "INSERT INTO customers (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, passwordHash],
    )

    return result.rows[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}
