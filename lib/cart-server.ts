// Server-side cart operations - DO NOT import in client components
import { getCollection } from "@/lib/db"

interface CartItemDocument {
  product_id: string
  quantity: number
  unit_price: number
  added_at: string
}

interface CartDocument {
  _id: string
  customer_id: string
  items: CartItemDocument[]
  updated_at: string
}

async function cartsCollection() {
  return getCollection<CartDocument>("carts")
}

export async function addItemsToCart(
  userId: string,
  items: { product_id: string; quantity: number }[]
): Promise<void> {
  const cartsCol = await cartsCollection()
  const timestamp = new Date().toISOString()

  const cart = await cartsCol.findOne({ customer_id: userId })

  if (!cart) {
    // Créer un nouveau panier
    const newCartItems: CartItemDocument[] = items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: 0, // Le prix sera mis à jour par le client
      added_at: timestamp,
    }))

    await cartsCol.insertOne({
      _id: userId,
      customer_id: userId,
      items: newCartItems,
      updated_at: timestamp,
    })
  } else {
    // Mettre à jour le panier existant
    const updatedItems = [...cart.items]

    for (const newItem of items) {
      const existingIndex = updatedItems.findIndex(
        (item) => item.product_id === newItem.product_id
      )

      if (existingIndex >= 0) {
        updatedItems[existingIndex].quantity += newItem.quantity
      } else {
        updatedItems.push({
          product_id: newItem.product_id,
          quantity: newItem.quantity,
          unit_price: 0,
          added_at: timestamp,
        })
      }
    }

    await cartsCol.updateOne(
      { customer_id: userId },
      { $set: { items: updatedItems, updated_at: timestamp } }
    )
  }
}
