export interface Order {
  id: string
  user_id: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  total_amount: number
  shipping_address: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  billing_address: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  payment_method: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface CheckoutData {
  shipping_address: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  billing_address: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  payment_method: string
  same_as_shipping: boolean
}

// Mock database functions (replace with actual database calls)
export async function createOrder(
  userId: string,
  orderData: Omit<Order, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<Order> {
  const order: Order = {
    id: Math.random().toString(36).substr(2, 9),
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...orderData,
  }

  // In a real app, save to database
  return order
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  // Mock data - replace with actual database query
  return [
    {
      id: "ord_123",
      user_id: userId,
      status: "delivered",
      total_amount: 89.97,
      shipping_address: {
        street: "123 Pet Street",
        city: "Pet City",
        postal_code: "12345",
        country: "France",
      },
      billing_address: {
        street: "123 Pet Street",
        city: "Pet City",
        postal_code: "12345",
        country: "France",
      },
      payment_method: "card",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-20T14:20:00Z",
      items: [
        {
          id: "item_1",
          order_id: "ord_123",
          product_id: "prod_1",
          product_name: "Collier en Cuir Premium",
          product_image: "/premium-leather-dog-collar.jpg",
          quantity: 1,
          unit_price: 29.99,
          total_price: 29.99,
        },
        {
          id: "item_2",
          order_id: "ord_123",
          product_id: "prod_2",
          product_name: "Jouet Interactif pour Chat",
          product_image: "/interactive-cat-toy.png",
          quantity: 2,
          unit_price: 19.99,
          total_price: 39.98,
        },
      ],
    },
  ]
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  // Mock data - replace with actual database query
  const orders = await getUserOrders("user_123")
  return orders.find((order) => order.id === orderId) || null
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order | null> {
  // Mock implementation - replace with actual database update
  const order = await getOrderById(orderId)
  if (order) {
    order.status = status
    order.updated_at = new Date().toISOString()
  }
  return order
}
