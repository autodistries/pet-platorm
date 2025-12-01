import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getCollection } from "@/lib/db"

interface PaymentMethod {
  id: string
  user_id: string
  card_last4: string
  card_brand: string
  card_exp_month: string
  card_exp_year: string
  cardholder_name: string
  is_default: boolean
  created_at: string
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const collection = await getCollection<PaymentMethod>("payment_methods")
    
    const result = await collection.deleteOne({
      id: params.id,
      user_id: currentUser.id,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 })
    }

    return NextResponse.json({ message: "Carte supprimée avec succès" })
  } catch (error) {
    console.error("Delete payment method error:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const collection = await getCollection<PaymentMethod>("payment_methods")

    // Unset all default cards
    await collection.updateMany(
      { user_id: currentUser.id },
      { $set: { is_default: false } }
    )

    // Set this card as default
    const result = await collection.updateOne(
      { id: params.id, user_id: currentUser.id },
      { $set: { is_default: true } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 })
    }

    return NextResponse.json({ message: "Carte définie comme méthode par défaut" })
  } catch (error) {
    console.error("Update payment method error:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}
