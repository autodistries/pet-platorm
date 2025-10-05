import { type NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 })
    }

    // Check if user already exists (mock implementation)
    // In a real app, you'd query your database here

    const hashedPassword = await hashPassword(password)

    // Create user in database (mock implementation)
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password_hash: hashedPassword,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({
      message: "Compte créé avec succès",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Erreur lors de la création du compte" }, { status: 500 })
  }
}
