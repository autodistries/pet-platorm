import { type NextRequest, NextResponse } from "next/server"
import { getOrderById, updateOrderStatus } from "@/lib/orders"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 })
    }

    const order = await getOrderById(params.id)

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    // Vérifier que l'utilisateur peut accéder à cette commande
    if (order.user_id !== payload.userId) {
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
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 })
    }

    const { status } = await request.json()
    const order = await updateOrderStatus(params.id, status)

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
