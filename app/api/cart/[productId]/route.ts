import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

// DELETE - Supprimer un item spécifique du panier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const productId = params.productId

    console.log("=== REMOVE FROM CART ===")
    console.log("User ID:", user.id)
    console.log("Product ID:", productId)

    const result = await query(
      "DELETE FROM cart_items WHERE customer_id = $1 AND product_id = $2 RETURNING *",
      [user.id, productId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Item non trouvé dans le panier" }, { status: 404 })
    }

    return NextResponse.json({ message: "Produit retiré du panier" })
  } catch (error) {
    console.error("Remove from cart error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
