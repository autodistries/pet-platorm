import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, logout } from "@/lib/auth"
import { getCollection } from "@/lib/db"

interface UserDocument {
  _id: string
  id: string
  name: string
  email: string
  password_hash: string
  role: "customer" | "admin"
  phone?: string
  address?: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  created_at: string
  updated_at: string
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Prevent admin deletion via this endpoint
    if (currentUser.role === "admin") {
      return NextResponse.json({ error: "Les comptes administrateurs ne peuvent pas être supprimés via cette méthode" }, { status: 403 })
    }

    const collection = await getCollection<UserDocument>("customers")

    // Delete the user account
    const result = await collection.deleteOne({ id: currentUser.id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Also clean up related data (optional)
    // Delete user's orders
    const ordersCollection = await getCollection("orders")
    await ordersCollection.deleteMany({ customer_id: currentUser.id })

    // Delete user's cart
    const cartsCollection = await getCollection("carts")
    await cartsCollection.deleteMany({ user_id: currentUser.id })

    // Logout the user
    await logout()

    return NextResponse.json({
      message: "Compte supprimé avec succès",
    })
  } catch (error) {
    console.error("Delete account error:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du compte" }, { status: 500 })
  }
}
