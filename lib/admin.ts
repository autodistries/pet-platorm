import { getCollection } from "@/lib/db"

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

export interface ProductDocument {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  category_id?: string
  is_active: boolean
  image_url: string
  created_at: string
  updated_at?: string
  sku?: string
}

export interface AdminProduct {
  id: string
  name: string
  price: number
  stock_quantity: number
  category: string
  status: string
  created_at: string
  description?: string
  category_id?: string
  image_url?: string
}

interface CategoryDocument {
  id: string
  name: string
}

interface OrderDocument {
  id: string
  user_id: string
  status: string
  total_amount: number
  created_at: string
  payment_method: string
  items: Array<{
    product_id: string
    product_name: string
    product_image: string
    quantity: number
    total_price: number
  }>
}

interface CustomerDocument {
  id: string
  name?: string
  email?: string
}

async function productsCollection() {
  return getCollection<ProductDocument>("products")
}

async function categoriesCollection() {
  return getCollection<CategoryDocument>("categories")
}

async function ordersCollection() {
  return getCollection<OrderDocument>("orders")
}

async function customersCollection() {
  return getCollection<CustomerDocument>("customers")
}

export async function getAdminStats(): Promise<AdminStats> {
  const [ordersCol, productsCol, customersCol] = await Promise.all([
    ordersCollection(),
    productsCollection(),
    customersCollection(),
  ])

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const startOfDayIso = startOfDay.toISOString()

  const [
    totalOrders,
    ordersToday,
    pendingOrders,
    totalCustomers,
    totalProducts,
    lowStockProducts,
    totalRevenueAgg,
    revenueTodayAgg,
  ] = await Promise.all([
    ordersCol.countDocuments(),
    ordersCol.countDocuments({ created_at: { $gte: startOfDayIso } }),
    ordersCol.countDocuments({ status: "pending" }),
    customersCol.countDocuments(),
    productsCol.countDocuments(),
    productsCol.countDocuments({ stock_quantity: { $lte: 5 }, is_active: true }),
    ordersCol
      .aggregate<{ total: number }>([
        { $group: { _id: null, total: { $sum: "$total_amount" } } },
      ])
      .next(),
    ordersCol
      .aggregate<{ total: number }>([
        { $match: { created_at: { $gte: startOfDayIso } } },
        { $group: { _id: null, total: { $sum: "$total_amount" } } },
      ])
      .next(),
  ])

  return {
    total_orders: totalOrders,
    total_revenue: totalRevenueAgg?.total ?? 0,
    total_customers: totalCustomers,
    total_products: totalProducts,
    orders_today: ordersToday,
    revenue_today: revenueTodayAgg?.total ?? 0,
    pending_orders: pendingOrders,
    low_stock_products: lowStockProducts,
  }
}

export async function getSalesData(days = 30): Promise<SalesData[]> {
  const ordersCol = await ordersCollection()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - (days - 1))
  cutoff.setHours(0, 0, 0, 0)

  const results = await ordersCol
    .aggregate<{
      _id: string
      revenue: number
      orders: number
    }>([
      { $match: { created_at: { $gte: cutoff.toISOString() } } },
      {
        $addFields: {
          createdDate: { $dateFromString: { dateString: "$created_at" } },
        },
      },
      {
        $group: {
          _id: { $dateToString: { date: "$createdDate", format: "%Y-%m-%d" } },
          revenue: { $sum: "$total_amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray()

  return results.map((item: { _id: string; revenue: number; orders: number }) => ({
    date: item._id,
    revenue: item.revenue,
    orders: item.orders,
  }))
}

export async function getTopProducts(limit = 4): Promise<TopProduct[]> {
  const ordersCol = await ordersCollection()

  const results = await ordersCol
    .aggregate<{ _id: string; name: string; image: string; sales: number; revenue: number }>([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_id",
          name: { $first: "$items.product_name" },
          image: { $first: "$items.product_image" },
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.total_price" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: limit },
    ])
    .toArray()

  return results.map((item: { _id: string; name: string; image: string; sales: number; revenue: number }) => ({
    id: item._id,
    name: item.name,
    image: item.image || "/placeholder.svg",
    sales: item.sales,
    revenue: item.revenue,
  }))
}

export async function getAllOrders(): Promise<any[]> {
  const [ordersCol, customersCol] = await Promise.all([ordersCollection(), customersCollection()])

  const customers = await customersCol
    .find({}, { projection: { id: 1, name: 1, email: 1 } })
    .toArray()
  const customerMap = new Map<string, CustomerDocument>(
    customers.map((customer: CustomerDocument) => [customer.id, customer])
  )

  const orders = await ordersCol
    .find()
    .sort({ created_at: -1 })
    .limit(50)
    .toArray()

  return orders.map((order: OrderDocument) => {
    const customer = customerMap.get(order.user_id)
    return {
      id: order.id,
      customer_name: customer?.name ?? "Utilisateur inconnu",
      customer_email: customer?.email ?? "N/A",
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      items_count: order.items.length,
    }
  })
}

export async function getAllProducts(): Promise<AdminProduct[]> {
  const [productsCol, categoriesCol] = await Promise.all([productsCollection(), categoriesCollection()])

  const categories = await categoriesCol
    .find({}, { projection: { id: 1, name: 1 } })
    .toArray()
  const categoryMap = new Map<string, string>(
    categories.map((category: CategoryDocument) => [category.id, category.name])
  )

  const products = await productsCol
    .find()
    .sort({ created_at: -1 })
    .toArray()

  return products.map((product: ProductDocument) => {
    const categoryName = product.category_id ? categoryMap.get(product.category_id) : undefined
    const status = product.stock_quantity === 0 ? "out_of_stock" : product.is_active ? "active" : "inactive"

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock_quantity: product.stock_quantity,
      category: categoryName ?? "Sans catégorie",
      category_id: product.category_id,
      description: product.description,
      image_url: product.image_url,
      status,
      created_at: product.created_at,
    }
  })
}
