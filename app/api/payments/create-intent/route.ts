import { type NextRequest, NextResponse } from "next/server"
import { createPaymentIntent } from "@/lib/payments"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
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
