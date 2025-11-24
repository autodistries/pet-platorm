import { type NextRequest, NextResponse } from "next/server"
import { getAllProducts } from "@/lib/admin"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const data = await request.json()
    const { name, description, category_id, price, stock_quantity, image_url } = data

    // Validation basique
    if (!name || !description || !category_id || price === undefined || stock_quantity === undefined || !image_url) {
      return NextResponse.json(
        { error: "Tous les champs requis doivent être remplis" },
        { status: 400 }
      )
    }

    // Insérer le nouveau produit
    const result = await query(
      `INSERT INTO products (name, description, category_id, price, stock_quantity, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING *`,
      [name, description, category_id, price, stock_quantity, image_url]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error)
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const products = await getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
