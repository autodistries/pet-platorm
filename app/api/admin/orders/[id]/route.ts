import { type NextRequest, NextResponse } from "next/server"
import { getOrderById } from "@/lib/orders"
import { getCurrentUser } from "@/lib/auth"
import db from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser()
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    if (session.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

    const { id } = (await params) as { id: string }
    const order = await getOrderById(id)

    if (!order) return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })

    // Enrichir avec les informations client pour l'admin
    const customerResult = await db.query(
      `SELECT name, email FROM customers WHERE id = $1`,
      [order.user_id]
    )

    const enrichedOrder = {
      ...order,
      customer_name: customerResult.rows[0]?.name || 'Utilisateur inconnu',
      customer_email: customerResult.rows[0]?.email || 'N/A',
    }

    return NextResponse.json(enrichedOrder)
  } catch (error) {
    console.error("Erreur admin get order:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
