import { randomUUID } from "crypto"
import { type NextRequest, NextResponse } from "next/server"
import { getAllProducts, type ProductDocument } from "@/lib/admin"
import { getCurrentUser } from "@/lib/auth"
import { getCollection } from "@/lib/db"

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
    const priceValue = Number(price)
    const stockValue = Number(stock_quantity)

    // Validation basique
    if (
      !name ||
      !description ||
      !category_id ||
      price === undefined ||
      stock_quantity === undefined
    ) {
      return NextResponse.json(
        { error: "Tous les champs requis doivent être remplis" },
        { status: 400 }
      )
    }

    if (!Number.isFinite(priceValue) || priceValue < 0) {
      return NextResponse.json(
        { error: "Le prix doit être un nombre positif" },
        { status: 400 }
      )
    }

    if (!Number.isInteger(stockValue) || stockValue < 0) {
      return NextResponse.json(
        { error: "La quantité en stock doit être un entier positif" },
        { status: 400 }
      )
    }

    const productsCol = await getCollection<ProductDocument>("products")

    const now = new Date().toISOString()
    const productId = randomUUID()
    const sanitizedName = name.trim()
    const sanitizedDescription = description.trim()
    const baseSku = sanitizedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    const sku = baseSku ? `${baseSku}-${Math.random().toString(36).slice(-6)}` : randomUUID()

    const document: ProductDocument = {
      id: productId,
      name: sanitizedName,
      description: sanitizedDescription,
      category_id,
      price: priceValue,
      stock_quantity: stockValue,
      image_url: image_url || "/placeholder.svg",
      is_active: true,
      sku,
      created_at: now,
      updated_at: now,
    }

    await productsCol.insertOne(document)

    return NextResponse.json(document, { status: 201 })
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const result = await getAllProducts(page, limit)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
