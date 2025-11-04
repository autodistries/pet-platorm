import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  const { stock_quantity } = await request.json()
  const { id: productId } = (await params) as { id: string }

    if (stock_quantity === undefined || stock_quantity < 0) {
      return NextResponse.json(
        { error: "Quantité de stock invalide" },
        { status: 400 }
      )
    }

    // Mettre à jour le stock
    const result = await db.query(
      `UPDATE products 
       SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, name, stock_quantity`,
      [stock_quantity, productId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Stock mis à jour avec succès",
      product: result.rows[0],
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stock:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du stock" },
      { status: 500 }
    )
  }
}
