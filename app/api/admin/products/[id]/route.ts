import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getCollection } from "@/lib/db"
import type { ProductDocument } from "@/lib/admin"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const productsCol = await getCollection<ProductDocument>("products")
    const product = await productsCol.findOne({ id: params.id })

    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error)
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête" },
      { status: 500 }
    )
  }
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
    const { name, description, category_id, price, stock_quantity, image_url } = payload

    const productsCol = await getCollection<ProductDocument>("products")

    // Check if product exists
    const existingProduct = await productsCol.findOne({ id: params.id })
    if (!existingProduct) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (category_id !== undefined) updateData.category_id = category_id
    if (price !== undefined) {
      const priceValue = Number(price)
      if (!Number.isFinite(priceValue) || priceValue < 0) {
        return NextResponse.json(
          { error: "Le prix doit être un nombre positif" },
          { status: 400 }
        )
      }
      updateData.price = priceValue
    }
    if (stock_quantity !== undefined) {
      const stockValue = Number(stock_quantity)
      if (!Number.isInteger(stockValue) || stockValue < 0) {
        return NextResponse.json(
          { error: "La quantité en stock doit être un nombre positif" },
          { status: 400 }
        )
      }
      updateData.stock_quantity = stockValue
    }
    // Only update image_url if a new one was provided
    if (image_url !== undefined && image_url !== "") {
      updateData.image_url = image_url
    }

    const updateResult = await productsCol.updateOne(
      { id: params.id },
      { $set: updateData }
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
    console.error("Erreur lors de la mise à jour du produit:", error)
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