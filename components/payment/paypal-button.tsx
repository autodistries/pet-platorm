"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PayPalButtonProps {
  amount: number
  orderId: string
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
}

export default function PayPalButton({ amount, orderId, onSuccess, onError }: PayPalButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayPalPayment = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_type: "paypal",
          amount,
          order_id: orderId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess(result.payment_intent_id)
      } else {
        onError(result.error || "Erreur lors du paiement PayPal")
      }
    } catch (error) {
      onError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PayPal</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Payez en toute sécurité avec votre compte PayPal</p>
        <Button
          onClick={handlePayPalPayment}
          disabled={loading}
          className="w-full bg-[#0070ba] hover:bg-[#005ea6]"
          size="lg"
        >
          {loading ? "Redirection..." : `Payer ${amount.toFixed(2)} € avec PayPal`}
        </Button>
      </CardContent>
    </Card>
  )
}
