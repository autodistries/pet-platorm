import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
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

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { name, email, phone, address } = await request.json()

    const collection = await getCollection<UserDocument>("customers")

    // Update user information
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (name) updateData.name = name
    if (email) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (address) updateData.address = address

    const result = await collection.updateOne({ id: currentUser.id }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Fetch updated user
    const updatedUser = await collection.findOne({ id: currentUser.id })

    return NextResponse.json({
      message: "Informations mises à jour avec succès",
      user: {
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        phone: updatedUser?.phone,
        address: updatedUser?.address,
        role: updatedUser?.role,
      },
    })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}
