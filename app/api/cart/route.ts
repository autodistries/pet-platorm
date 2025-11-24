import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getCollection } from "@/lib/db"

interface CartItemDocument {
  product_id: string
  quantity: number
  added_at: string
}

interface CartDocument {
  _id: string
  customer_id: string
  items: CartItemDocument[]
  updated_at: string
  created_at: string
}

interface ProductDocument {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  stock_quantity: number
  category_id?: string
}

interface CategoryDocument {
  id: string
  name: string
}

async function cartsCollection() {
  return getCollection<CartDocument>("carts")
}

async function productsCollection() {
  return getCollection<ProductDocument>("products")
}

async function categoriesCollection() {
  return getCollection<CategoryDocument>("categories")
}

function mapCartItems(
  items: CartItemDocument[],
  products: ProductDocument[],
  categoryNames: Map<string, string>
) {
  const productMap = new Map(products.map((product) => [product.id, product]))

  const enriched: Array<{
    id: string
    product_id: string
    quantity: number
    name: string
    description: string
    price: number
    image_url: string
    stock_quantity: number
    category: string
  }> = []

  for (const item of items) {
    const product = productMap.get(item.product_id)
    if (!product) continue

    enriched.push({
      id: item.product_id,
      product_id: item.product_id,
      quantity: item.quantity,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      category: product.category_id ? categoryNames.get(product.category_id) ?? "" : "",
    })
  }

  return enriched
}

// GET - Récupérer le panier de l'utilisateur
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const [cartsCol, productsCol] = await Promise.all([cartsCollection(), productsCollection()])
    const cart = await cartsCol.findOne({ customer_id: user.id })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ items: [] })
    }

    const productIds = cart.items.map((item) => item.product_id)
    const products = await productsCol
      .find({ id: { $in: productIds } })
      .toArray()

    const categoryIds = Array.from(
      new Set(products.map((product) => product.category_id).filter((id): id is string => Boolean(id)))
    )

    let categoryNames = new Map<string, string>()
    if (categoryIds.length > 0) {
      const categoriesCol = await categoriesCollection()
      const categories = await categoriesCol
        .find({ id: { $in: categoryIds } }, { projection: { id: 1, name: 1 } })
        .toArray()
      categoryNames = new Map(categories.map((category) => [category.id, category.name]))
    }

    const items = mapCartItems(cart.items, products, categoryNames)
    return NextResponse.json({ items })
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST - Ajouter un produit au panier
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { product_id, quantity } = await request.json()

    if (!product_id || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }

    const [productsCol, cartsCol] = await Promise.all([productsCollection(), cartsCollection()])
    const product = await productsCol.findOne({ id: product_id, is_active: true })

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 })
    }

    const cart = await cartsCol.findOne({ customer_id: user.id })
    const existingQuantity = cart?.items.find((item) => item.product_id === product_id)?.quantity ?? 0
    const totalQuantity = existingQuantity + quantity

    if (totalQuantity > product.stock_quantity) {
      return NextResponse.json({
        error: `Stock insuffisant. Disponible: ${product.stock_quantity}, Déjà dans le panier: ${existingQuantity}`,
      }, { status: 400 })
    }

    const timestamp = new Date().toISOString()
    const newItems = cart ? [...cart.items] : []
    const itemIndex = newItems.findIndex((item) => item.product_id === product_id)

    if (itemIndex >= 0) {
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        quantity: newItems[itemIndex].quantity + quantity,
        added_at: timestamp,
      }
    } else {
      newItems.push({ product_id, quantity, added_at: timestamp })
    }

    await cartsCol.updateOne(
      { customer_id: user.id },
      {
        $set: {
          customer_id: user.id,
          items: newItems,
          updated_at: timestamp,
        },
        $setOnInsert: {
          _id: user.id,
          created_at: timestamp,
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      message: "Produit ajouté au panier",
      item: { product_id, quantity: totalQuantity },
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PUT - Mettre à jour la quantité d'un produit
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { product_id, quantity } = await request.json()

    if (!product_id || quantity < 0) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const [productsCol, cartsCol] = await Promise.all([productsCollection(), cartsCollection()])
    const product = await productsCol.findOne({ id: product_id })

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    const cart = await cartsCol.findOne({ customer_id: user.id })
    if (!cart) {
      return NextResponse.json({ error: "No cart found for this user" }, { status: 404 });
    }

    const existingIndex = cart.items.findIndex((item) => item.product_id === product_id)
    if (existingIndex === -1) {
      return NextResponse.json({ error: "Item non trouvé dans le panier" }, { status: 404 });
    }

    if (quantity === 0) {
      const updatedItems = cart.items.filter((item) => item.product_id !== product_id)

      if (updatedItems.length === 0) {
        await cartsCol.deleteOne({ customer_id: user.id })
      } else {
        await cartsCol.updateOne(
          { customer_id: user.id },
          {
            $set: {
              items: updatedItems,
              updated_at: new Date().toISOString(),
            },
          }
        )
      }

      return NextResponse.json({ message: "Produit retiré du panier" })
    }

    if (quantity > product.stock_quantity) {
      return NextResponse.json({
        error: `Stock insuffisant. Disponible: ${product.stock_quantity}`
      }, { status: 400 });
    }

    const updatedItems = [...cart.items]
    updatedItems[existingIndex] = {
      ...updatedItems[existingIndex],
      quantity,
      added_at: new Date().toISOString(),
    }

    await cartsCol.updateOne(
      { customer_id: user.id },
      {
        $set: {
          items: updatedItems,
          updated_at: new Date().toISOString(),
        },
      }
    )

    return NextResponse.json({
      message: "Quantité mise à jour",
      item: { product_id, quantity },
    })

  } catch (error) {
    console.error("Update cart error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE - Vider le panier
export async function DELETE() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const cartsCol = await cartsCollection()

    await cartsCol.deleteOne({ customer_id: user.id })

    return NextResponse.json({ message: "Panier vidé" })
  } catch (error) {
    console.error("Clear cart error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
