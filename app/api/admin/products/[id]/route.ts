import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getCollection } from "@/lib/db"

interface ProductDocument {
  id: string
  stock_quantity: number
  is_active: boolean
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

    const data = await request.json()
    const { stock_quantity } = data

    if (typeof stock_quantity !== "number" || stock_quantity < 0) {
      return NextResponse.json(
        { error: "La quantité en stock doit être un nombre positif" },
        { status: 400 }
      )
    }

    const productsCol = await getCollection<ProductDocument>("products")
    const updateResult = await productsCol.updateOne(
      { id: params.id },
      {
        $set: {
          stock_quantity,
          updated_at: new Date().toISOString(),
        },
      }
    )

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    const updatedProduct = await productsCol.findOne({ id: params.id })
    if (!updatedProduct) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stock:", error)
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const productsCol = await getCollection<ProductDocument>("products")
    const deleted = await productsCol.deleteOne({ id: params.id })

    if (deleted.deletedCount === 0) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ message: "Produit supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error)
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête" },
      { status: 500 }
    )
  }
}