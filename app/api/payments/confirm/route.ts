import { type NextRequest, NextResponse } from "next/server"
import { confirmPayment, processPayPalPayment } from "@/lib/payments"
import { updateOrderStatus } from "@/lib/orders"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { payment_intent_id, payment_method_id, payment_type, amount, order_id } = await request.json()

    let result

    if (payment_type === "paypal") {
      result = await processPayPalPayment(amount, order_id)
    } else {
      result = await confirmPayment(payment_intent_id, payment_method_id)
    }

    if (result.success) {
      // Update order status to confirmed
      await updateOrderStatus(order_id, "confirmed")
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de la confirmation du paiement:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
