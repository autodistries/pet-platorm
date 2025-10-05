"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/orders"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
}

export default function OrderDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const isSuccess = searchParams.get("success") === "true"

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string)
    }
  }, [params.id])

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la commande:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement de la commande...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Commande non trouvée</h1>
          <Button asChild>
            <Link href="/orders">Retour aux commandes</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isSuccess && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Commande confirmée !</h3>
                <p className="text-green-700">
                  Votre commande a été passée avec succès. Vous recevrez un email de confirmation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Commande #{order.id}</h1>
          <p className="text-muted-foreground">
            Passée le {new Date(order.created_at).toLocaleDateString("fr-FR")} à{" "}
            {new Date(order.created_at).toLocaleTimeString("fr-FR")}
          </p>
        </div>
        <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Articles commandés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.product_image || "/placeholder.svg"}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.unit_price.toFixed(2)} € × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{item.total_price.toFixed(2)} €</p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{order.total_amount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>Gratuite</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{order.total_amount.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adresse de livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {order.shipping_address.street}
                <br />
                {order.shipping_address.postal_code} {order.shipping_address.city}
                <br />
                {order.shipping_address.country}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adresse de facturation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {order.billing_address.street}
                <br />
                {order.billing_address.postal_code} {order.billing_address.city}
                <br />
                {order.billing_address.country}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mode de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="capitalize">{order.payment_method === "card" ? "Carte bancaire" : order.payment_method}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Button asChild variant="outline">
          <Link href="/orders">Retour aux commandes</Link>
        </Button>
        <Button asChild>
          <Link href="/products">Continuer vos achats</Link>
        </Button>
      </div>
    </div>
  )
}
