import { type NextRequest, NextResponse } from "next/server"
import { getOrderById, updateOrderStatus } from "@/lib/orders"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = (await params) as { id: string }

    const order = await getOrderById(id)

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    // Vérifier que l'utilisateur peut accéder à cette commande
    if (order.user_id !== session.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

      const body = await request.json()
      const { status, payment_method } = body

      // Await params (Next.js requires awaiting params before accessing properties)
      const { id } = (await params) as { id: string }

      // Optional: only allow the owner (or admin) to update
      const existing = await getOrderById(id)
      if (!existing) return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
      if (existing.user_id !== session.id) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

      // Mettre à jour le payment_method dans la table payments si fourni
      if (payment_method) {
        const { query } = await import("@/lib/db")
        await query(
          `UPDATE payments SET payment_method = $1, updated_at = CURRENT_TIMESTAMP 
           WHERE order_id = $2`,
          [payment_method, id]
        )
      }

      const order = await updateOrderStatus(id, status)

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
