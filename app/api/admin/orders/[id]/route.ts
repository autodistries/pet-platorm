import { type NextRequest, NextResponse } from "next/server"
import { getOrderById } from "@/lib/orders"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentUser()
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    if (session.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

    const { id } = (await params) as { id: string }
    const order = await getOrderById(id)

    if (!order) return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Erreur admin get order:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
