"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminOrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.id) fetchOrder(params.id as string)
  }, [params?.id])

  const fetchOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { credentials: "include" })
      if (res.ok) setOrder(await res.json())
      else console.error("Failed to load admin order", await res.text())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Chargement...</div>
  if (!order) return <div className="container mx-auto px-4 py-8">Commande introuvable</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin/orders">
        <Button variant="ghost" className="mb-4">Retour</Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Commande #{order.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Statut: {order.status}</p>
            <p>Montant: {parseFloat(order.total_amount).toFixed(2)} €</p>
            <p>Client: {order.customer_name} ({order.customer_email})</p>

            <div>
              <h4 className="font-medium">Articles</h4>
              <ul className="list-disc pl-6">
                {order.items?.map((it: any) => (
                  <li key={it.id}>{it.product_name} x{it.quantity} — {parseFloat(it.total_price).toFixed(2)} €</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
