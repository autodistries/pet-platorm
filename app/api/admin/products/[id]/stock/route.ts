import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
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
    const session = await getCurrentUser()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const payload = await request.json()
    const stock_quantity = Number(payload?.stock_quantity)
    const { id: productId } = params

    if (!Number.isInteger(stock_quantity) || stock_quantity < 0) {
      return NextResponse.json(
        { error: "Quantité de stock invalide" },
        { status: 400 }
      )
    }

    // Mettre à jour le stock
    const productsCol = await getCollection<ProductDocument>("products")
    const updateResult = await productsCol.updateOne(
      { id: productId },
      { $set: { stock_quantity, updated_at: new Date().toISOString() } }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      )
    }

    const updatedProduct = await productsCol.findOne({ id: productId })
    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Stock mis à jour avec succès",
      product: updatedProduct,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stock:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du stock" },
      { status: 500 }
    )
  }
}
