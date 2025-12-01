import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getOrderById, cancelOrderAndRestoreStock } from "@/lib/orders"
import { addItemsToCart } from "@/lib/cart-server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const orderId = params.id

    // Vérifier que la commande existe et appartient à l'utilisateur
    const order = await getOrderById(orderId)
    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 })
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    // Seules les commandes "pending" peuvent être annulées
    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Seules les commandes en attente peuvent être annulées" },
        { status: 400 }
      )
    }

    // Annuler la commande et restaurer le stock
    await cancelOrderAndRestoreStock(orderId)

    // Remettre les produits dans le panier
    const cartItems = order.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }))

    await addItemsToCart(user.id, cartItems)

    return NextResponse.json({
      success: true,
      message: "Commande annulée et produits remis dans le panier",
    })
  } catch (error: any) {
    console.error("Erreur lors de l'annulation du paiement:", error)
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    )
  }
}
