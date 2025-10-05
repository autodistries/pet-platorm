import { type NextRequest, NextResponse } from "next/server"
import { createOrder, getUserOrders } from "@/lib/orders"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 })
    }

    const orders = await getUserOrders(payload.userId)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 })
    }

    const orderData = await request.json()
    const order = await createOrder(payload.userId, orderData)

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
