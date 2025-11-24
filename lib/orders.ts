import { randomUUID } from "crypto"
import { getCollection, getMongoClient } from "@/lib/db"
import type { ClientSession } from "mongodb"

export interface Order {
  id: string
  user_id: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  total_amount: number
  shipping_address: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  billing_address: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  payment_method: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface CheckoutData {
  shipping_address: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  billing_address: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  payment_method: string
  same_as_shipping: boolean
}

interface ProductDocument {
  id: string
  name: string
  image_url: string
  stock_quantity: number
  price: number
  updated_at: string
}

interface OrderItemDocument extends OrderItem {}

interface OrderDocument {
  _id: string
  id: string
  user_id: string
  status: Order["status"]
  total_amount: number
  shipping_address: Order["shipping_address"]
  billing_address: Order["billing_address"]
  payment_method: string
  created_at: string
  updated_at: string
  items: OrderItemDocument[]
}

interface CustomerDocument {
  id: string
}

function normalizePaymentMethod(method: string): string {
  if (method === "card") return "credit_card"
  const allowed = ["credit_card", "paypal", "bank_transfer"]
  return allowed.includes(method) ? method : "credit_card"
}

function mapOrder(doc: OrderDocument): Order {
  return {
    id: doc.id,
    user_id: doc.user_id,
    status: doc.status,
    total_amount: doc.total_amount,
    shipping_address: doc.shipping_address,
    billing_address: doc.billing_address,
    payment_method: doc.payment_method,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
    items: doc.items,
  }
}

async function productsCollection() {
  return getCollection<ProductDocument>("products")
}

async function ordersCollection() {
  return getCollection<OrderDocument>("orders")
}

async function customersCollection() {
  return getCollection<CustomerDocument>("customers")
}

function mapOrderItem(product: ProductDocument, orderId: string, quantity: number, unitPrice: number): OrderItem {
  const totalPrice = quantity * unitPrice
  return {
    id: randomUUID(),
    order_id: orderId,
    product_id: product.id,
    product_name: product.name,
    product_image: product.image_url,
    quantity,
    unit_price: unitPrice,
    total_price: totalPrice,
  }
}

async function ensureCustomerExists(userId: string, session: ClientSession) {
  const customers = await customersCollection()
  const existing = await customers.findOne({ id: userId }, { session })
  if (!existing) {
    throw new Error("Utilisateur non trouvé")
  }
}

export async function createOrder(
  userId: string,
  orderData: {
    items: { product_id: string; quantity: number; unit_price: number }[]
    shipping_address: Order["shipping_address"]
    billing_address: Order["billing_address"]
    payment_method: string
    total_amount: number
  }
): Promise<Order> {
  const client = await getMongoClient()
  const session = client.startSession()

  const orderId = randomUUID()
  const timestamp = new Date().toISOString()
  const paymentMethod = normalizePaymentMethod(orderData.payment_method)

  let createdOrder: OrderDocument | null = null

  try {
    await session.withTransaction(async () => {
      await ensureCustomerExists(userId, session)

      const productsCol = await productsCollection()
      const ordersCol = await ordersCollection()

      const items: OrderItemDocument[] = []

      for (const item of orderData.items) {
          const quantityRequested = Number(item.quantity)
          if (!Number.isFinite(quantityRequested) || quantityRequested <= 0) {
            throw new Error("Quantité invalide pour l'article de la commande")
          }

          const productSnapshot = await productsCol.findOne({ id: item.product_id }, { session })
          if (!productSnapshot) {
            throw new Error(`Produit introuvable (${item.product_id})`)
          }

          if (productSnapshot.stock_quantity < quantityRequested) {
            throw new Error(`Stock insuffisant pour ${productSnapshot.name} (disponible: ${productSnapshot.stock_quantity})`)
          }

          const updatedProduct = await productsCol.findOneAndUpdate(
            { id: item.product_id, stock_quantity: { $gte: quantityRequested } },
            {
              $inc: { stock_quantity: -quantityRequested },
              $set: { updated_at: timestamp },
            },
            { session, returnDocument: "after" }
          )

          if (!updatedProduct) {
            const latest = await productsCol.findOne({ id: item.product_id }, { session })
            const available = latest?.stock_quantity ?? 0
            throw new Error(`Stock insuffisant pour ${productSnapshot.name} (disponible: ${available})`)
          }

          const parsedUnitPrice = Number(item.unit_price)
          const unitPrice = Number.isFinite(parsedUnitPrice) ? parsedUnitPrice : productSnapshot.price
          items.push(mapOrderItem(updatedProduct, orderId, quantityRequested, unitPrice))
      }

      const orderDoc: OrderDocument = {
        _id: orderId,
        id: orderId,
        user_id: userId,
        status: "pending",
        total_amount: orderData.total_amount,
        shipping_address: orderData.shipping_address,
        billing_address: orderData.billing_address,
        payment_method: paymentMethod,
        created_at: timestamp,
        updated_at: timestamp,
        items,
      }

      await ordersCol.insertOne(orderDoc, { session })
      createdOrder = orderDoc
    })
  } finally {
    await session.endSession()
  }

  if (!createdOrder) {
    throw new Error("Failed to create order")
  }

  return mapOrder(createdOrder)
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const ordersCol = await ordersCollection()
  const docs = await ordersCol
    .find({ user_id: userId })
    .sort({ created_at: -1 })
    .toArray()

  return docs.map(mapOrder)
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const ordersCol = await ordersCollection()
  const doc = await ordersCol.findOne({ id: orderId })
  return doc ? mapOrder(doc) : null
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order | null> {
  const ordersCol = await ordersCollection()
  const timestamp = new Date().toISOString()

  const updated = await ordersCol.findOneAndUpdate(
    { id: orderId },
    { $set: { status, updated_at: timestamp } },
    { returnDocument: "after" }
  )

  return updated ? mapOrder(updated) : null
}
