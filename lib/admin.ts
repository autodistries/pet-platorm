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
  // Mock orders data for admin view
  return [
    {
      id: "ord_001",
      customer_name: "Marie Dubois",
      customer_email: "marie@example.com",
      status: "pending",
      total_amount: 89.97,
      created_at: "2024-01-20T10:30:00Z",
      items_count: 3,
    },
    {
      id: "ord_002",
      customer_name: "Pierre Martin",
      customer_email: "pierre@example.com",
      status: "confirmed",
      total_amount: 156.5,
      created_at: "2024-01-20T09:15:00Z",
      items_count: 2,
    },
    {
      id: "ord_003",
      customer_name: "Sophie Laurent",
      customer_email: "sophie@example.com",
      status: "shipped",
      total_amount: 234.99,
      created_at: "2024-01-19T16:45:00Z",
      items_count: 4,
    },
  ]
}

export async function getAllProducts(): Promise<any[]> {
  // Mock products data for admin view
  return [
    {
      id: "prod_1",
      name: "Collier en Cuir Premium",
      price: 29.99,
      stock: 45,
      category: "Colliers",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: "prod_2",
      name: "Jouet Interactif pour Chat",
      price: 19.99,
      stock: 2,
      category: "Jouets",
      status: "active",
      created_at: "2024-01-02T00:00:00Z",
    },
    {
      id: "prod_3",
      name: "Lit Orthopédique pour Chien",
      price: 89.99,
      stock: 0,
      category: "Couchage",
      status: "out_of_stock",
      created_at: "2024-01-03T00:00:00Z",
    },
  ]
}
