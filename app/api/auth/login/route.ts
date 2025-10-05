import { type NextRequest, NextResponse } from "next/server"
import { login } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    const result = await login(email, password)

    return NextResponse.json({
      message: "Connexion réussie",
      user: result.user,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
  }
}
