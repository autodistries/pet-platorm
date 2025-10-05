import { NextResponse } from "next/server"
import { mockCategories } from "@/lib/products"

export async function GET() {
  try {
    return NextResponse.json(mockCategories)
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des catégories" }, { status: 500 })
  }
}
