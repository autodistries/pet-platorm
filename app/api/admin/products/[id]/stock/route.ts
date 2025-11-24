import { NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"

interface ProductDocument {
  id: string
  name: string
  stock_quantity: number
  updated_at: string
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { stock_quantity } = await request.json()
    const { id: productId } = params

    if (stock_quantity === undefined || stock_quantity < 0) {
      return NextResponse.json(
        { error: "Quantité de stock invalide" },
        { status: 400 }
      )
    }

    // Mettre à jour le stock
    const productsCol = await getCollection<ProductDocument>("products")
    const updated = await productsCol.findOneAndUpdate(
      { id: productId },
      { $set: { stock_quantity, updated_at: new Date().toISOString() } },
      { returnDocument: "after" }
    )

    if (!updated) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Stock mis à jour avec succès",
      product: updated,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stock:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du stock" },
      { status: 500 }
    )
  }
}
