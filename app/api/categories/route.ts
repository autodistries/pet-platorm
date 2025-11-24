import { NextResponse } from "next/server"
import { getCategories } from "@/lib/products"

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des catégories" }, { status: 500 })
  }
}
