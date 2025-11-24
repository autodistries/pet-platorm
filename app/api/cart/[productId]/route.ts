import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getCollection } from "@/lib/db"

interface CartItemDocument {
  product_id: string
  quantity: number
  added_at: string
}

interface CartDocument {
  _id: string
  customer_id: string
  items: CartItemDocument[]
}

async function cartsCollection() {
  return getCollection<CartDocument>("carts")
}

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

    const cartsCol = await cartsCollection()
    const cart = await cartsCol.findOne({ customer_id: user.id })

    if (!cart) {
      return NextResponse.json({ error: "Pas de panier trouvé" }, { status: 404 })
    }

    const updatedItems = cart.items.filter((item) => item.product_id !== productId)

    if (updatedItems.length === cart.items.length) {
      return NextResponse.json({ error: "Item non trouvé dans le panier" }, { status: 404 })
    }

    if (updatedItems.length === 0) {
      await cartsCol.deleteOne({ customer_id: user.id })
    } else {
      await cartsCol.updateOne(
        { customer_id: user.id },
        {
          $set: {
            items: updatedItems,
            updated_at: new Date().toISOString(),
          },
        }
      )
    }

    return NextResponse.json({ message: "Produit retiré du panier" })


  } catch (error) {
    console.error("Remove from cart error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
