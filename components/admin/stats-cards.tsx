import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AdminStats } from "@/lib/admin"
import { Euro, Package, ShoppingCart, Users, TrendingUp, AlertTriangle } from "lucide-react"

interface StatsCardsProps {
  stats: AdminStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Chiffre d'affaires total",
      value: `${stats.total_revenue.toFixed(2)} €`,
      icon: Euro,
      color: "text-green-600",
    },
    {
      title: "Commandes totales",
      value: stats.total_orders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Clients",
      value: stats.total_customers.toString(),
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Produits",
      value: stats.total_products.toString(),
      icon: Package,
      color: "text-orange-600",
    },
    {
      title: "Ventes aujourd'hui",
      value: `${stats.revenue_today.toFixed(2)} €`,
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    {
      title: "Commandes en attente",
      value: stats.pending_orders.toString(),
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
