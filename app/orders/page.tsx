"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Order } from "@/lib/orders"
import Link from "next/link"

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement de vos commandes...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Aucune commande trouvée</h2>
          <p className="text-muted-foreground mb-6">Vous n'avez pas encore passé de commande.</p>
          <Button asChild>
            <Link href="/products">Découvrir nos produits</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Commande #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Passée le {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Adresse de livraison</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.shipping_address.street}
                        <br />
                        {order.shipping_address.postal_code} {order.shipping_address.city}
                        <br />
                        {order.shipping_address.country}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Articles ({order.items.length})</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <img
                              src={item.product_image || "/placeholder.svg"}
                              alt={item.product_name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium">{item.total_price.toFixed(2)} €</p>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-muted-foreground">+{order.items.length - 2} autre(s) article(s)</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <p className="text-lg font-bold">Total: {order.total_amount.toFixed(2)} €</p>
                    </div>
                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <Button asChild>
                          <Link href={`/payment/${order.id}`}>Continuer le paiement</Link>
                        </Button>
                      )}
                      <Button asChild variant="outline">
                        <Link href={`/orders/${order.id}`}>Voir les détails</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
