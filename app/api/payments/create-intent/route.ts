import { type NextRequest, NextResponse } from "next/server"
import { createPaymentIntent } from "@/lib/payments"
import { verifyToken } from "@/lib/auth"

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

    const { amount, order_id } = await request.json()

    if (!amount || !order_id) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 })
    }

    const paymentIntent = await createPaymentIntent(amount, order_id)

    return NextResponse.json(paymentIntent)
  } catch (error) {
    console.error("Erreur lors de la création du payment intent:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
