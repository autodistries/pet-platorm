import { type NextRequest, NextResponse } from "next/server"
import { createUser, login } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    console.log("=== REGISTER REQUEST ===")
    console.log("Name:", name)
    console.log("Email:", email)

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 })
    }

    try {
      // Create user in database
      const newUser = await createUser(name, email, password)

      console.log("=== USER CREATED ===")
      console.log("User ID:", newUser.id)
      console.log("User email:", newUser.email)

      // Automatically log in the user after registration
      await login(email, password)

      return NextResponse.json({
        message: "Compte créé avec succès",
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: "customer" },
      })
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      
      // Check for duplicate email error
      if (dbError.message && dbError.message.includes("duplicate key")) {
        return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 })
      }
      
      throw dbError
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Erreur lors de la création du compte" }, { status: 500 })
  }
}
