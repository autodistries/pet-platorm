import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Order } from "@/lib/orders"

interface Customer {
  id: string
  name: string
  email: string
  [key: string]: unknown
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

    const ordersCollection = await getCollection<Order>("orders")
    const customersCollection = await getCollection<Customer>("customers")

    // Get all orders sorted by date (most recent first)
    const orders = await ordersCollection.find({}).sort({ created_at: -1 }).toArray()

    // Enrich orders with customer information
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const customer = await customersCollection.findOne({ id: order.user_id })
        return {
          ...order,
          customer_name: customer?.name || "Utilisateur inconnu",
          customer_email: customer?.email || "N/A",
        }
      })
    )

    return NextResponse.json(enrichedOrders)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
