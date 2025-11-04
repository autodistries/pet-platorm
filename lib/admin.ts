import db from "@/lib/db"

export interface AdminStats {
  total_orders: number
  total_revenue: number
  total_customers: number
  total_products: number
  orders_today: number
  revenue_today: number
  pending_orders: number
  low_stock_products: number
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: string
  name: string
  image: string
  sales: number
  revenue: number
}

// Mock admin functions (replace with actual database calls)
export async function getAdminStats(): Promise<AdminStats> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    total_orders: 1247,
    total_revenue: 45678.9,
    total_customers: 892,
    total_products: 156,
    orders_today: 23,
    revenue_today: 1234.56,
    pending_orders: 8,
    low_stock_products: 5,
  }
}

export async function getSalesData(days = 30): Promise<SalesData[]> {
  // Generate mock sales data for the last N days
  const data: SalesData[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      revenue: Math.random() * 2000 + 500,
      orders: Math.floor(Math.random() * 50) + 10,
    })
  }

  return data
}

export async function getTopProducts(): Promise<TopProduct[]> {
  return [
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
    {
      id: "prod_4",
      name: "Gamelle Anti-Glouton",
      image: "/slow-feeder-dog-bowl.jpg",
      sales: 78,
      revenue: 1560.0,
    },
  ]
}

export async function getAllOrders(): Promise<any[]> {
  const result = await db.query(
    `SELECT o.id, o.total_amount, o.status, o.created_at,
            c.name as customer_name,
            c.email as customer_email,
            COUNT(oi.id) as items_count
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     LEFT JOIN order_items oi ON o.id = oi.order_id
     GROUP BY o.id, c.name, c.email
     ORDER BY o.created_at DESC
     LIMIT 50`
  )

  return result.rows.map((row: any) => ({
    id: row.id,
    customer_name: row.customer_name || 'Utilisateur inconnu',
    customer_email: row.customer_email || 'N/A',
    status: row.status,
    total_amount: parseFloat(row.total_amount),
    created_at: row.created_at,
    items_count: parseInt(row.items_count) || 0,
  }))
}

export async function getAllProducts(): Promise<any[]> {
  const result = await db.query(
    `SELECT p.id, p.name, p.price, p.stock_quantity as stock, 
            c.name as category, p.is_active, p.created_at
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     ORDER BY p.created_at DESC`
  )

  return result.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    price: parseFloat(row.price),
    stock: row.stock,
    category: row.category || "Sans catégorie",
    status: row.stock === 0 ? "out_of_stock" : (row.is_active ? "active" : "inactive"),
    created_at: row.created_at,
  }))
}
