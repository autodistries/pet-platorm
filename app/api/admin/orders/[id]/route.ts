import { type NextRequest, NextResponse } from "next/server"
import { getOrderById } from "@/lib/orders"
import { getCurrentUser } from "@/lib/auth"
import { getCollection } from "@/lib/db"

interface Customer {
  id: string
  name: string
  email: string
  [key: string]: unknown
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser()
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    if (session.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

    const { id } = (await params) as { id: string }
    const order = await getOrderById(id)

    if (!order) return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })

    // Enrich with customer information for admin
    const customersCollection = await getCollection<Customer>("customers")
    const customer = await customersCollection.findOne({ id: order.user_id })

    const enrichedOrder = {
      ...order,
      customer_name: customer?.name || "Utilisateur inconnu",
      customer_email: customer?.email || "N/A",
    }

    return NextResponse.json(enrichedOrder)
  } catch (error) {
    console.error("Erreur admin get order:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
