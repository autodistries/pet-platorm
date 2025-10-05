import { type NextRequest, NextResponse } from "next/server"
import { getProductById, getCategoryById } from "@/lib/products"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = getProductById(params.id)

    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Add category information
    const category = getCategoryById(product.category_id)
    const productWithCategory = {
      ...product,
      category,
    }

    return NextResponse.json(productWithCategory)
  } catch (error) {
    console.error("Product API error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération du produit" }, { status: 500 })
  }
}
