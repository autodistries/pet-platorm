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

    console.log("=== REMOVE FROM CART ===");
    console.log("User ID:", user.id);
    console.log("Product ID:", productId);

    // First, get the cart ID for the user
    const cartResult = await query(
      "SELECT id FROM carts WHERE customer_id = $1",
      [user.id]
    );

    if (cartResult.rows.length === 0) {
      // No cart found for this user
      return NextResponse.json({ error: "Pas de panier trouvé" }, { status: 404 });
    }

    const cartId = cartResult.rows[0].id;

    // Now delete the item from the cart_items table using cart_id
    const deleteResult = await query(
      "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *",
      [cartId, productId]
    );

    if (deleteResult.rowCount === 0) {
      // The item was not found in the cart
      return NextResponse.json({ error: "Item non trouvé dans le panier" }, { status: 404 });
    }

    return NextResponse.json({ message: "Produit retiré du panier", item: deleteResult.rows[0] });


  } catch (error) {
    console.error("Remove from cart error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
