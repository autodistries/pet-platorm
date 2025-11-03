import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT * FROM categories ORDER BY name")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des catégories" }, { status: 500 })
  }
}
