"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StatsCards from "@/components/admin/stats-cards"
import SalesChart from "@/components/admin/sales-chart"
import OrdersTable from "@/components/admin/orders-table"
import type { AdminStats, SalesData, TopProduct } from "@/lib/admin"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, salesRes, ordersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/sales"),
        fetch("/api/admin/orders"),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (salesRes.ok) {
        const salesData = await salesRes.json()
        setSalesData(salesData)
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }

      // Mock top products data
      setTopProducts([
        {
          id: "prod_1",
          name: "Collier en Cuir Premium",
          image: "/premium-leather-dog-collar.jpg",
          sales: 156,
          revenue: 4674.44,
        },
        {
          id: "prod_2",
          name: "Jouet Interactif pour Chat",
          image: "/interactive-cat-toy.png",
          sales: 134,
          revenue: 2678.66,
        },
        {
          id: "prod_3",
          name: "Lit Orthopédique pour Chien",
          image: "/orthopedic-dog-bed.png",
          sales: 89,
          revenue: 3560.0,
        },
      ])
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement du tableau de bord...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
      </div>

      <div className="space-y-8">
        {stats && <StatsCards stats={stats} />}

        <div className="grid lg:grid-cols-2 gap-6">
          <SalesChart data={salesData} />

          <Card>
            <CardHeader>
              <CardTitle>Produits les plus vendus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "revenue" ? `${value.toFixed(2)} €` : value,
                        name === "revenue" ? "Chiffre d'affaires" : "Ventes",
                      ]}
                    />
                    <Bar dataKey="sales" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <OrdersTable orders={orders} />
      </div>
    </div>
  )
}
