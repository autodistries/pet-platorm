import db from "@/lib/db"

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

// Créer une commande avec déduction de stock
export async function createOrder(
  userId: string,
  orderData: { items: { product_id: string; quantity: number; unit_price: number }[]; shipping_address: any; billing_address: any; payment_method: string; total_amount: number },
): Promise<Order> {
  const client = await db.connect()
  
  try {
    await client.query('BEGIN')

    // 0. Vérifier/créer le customer si nécessaire (pour les admins)
    const customerCheck = await client.query(
      'SELECT id FROM customers WHERE id = $1',
      [userId]
    )

    if (customerCheck.rows.length === 0) {
      // Récupérer les infos de l'utilisateur depuis la table users
        try {
          const userResult = await client.query(
            'SELECT email, first_name, last_name FROM users WHERE id = $1',
            [userId]
          )

          if (userResult.rows.length > 0) {
            const user = userResult.rows[0]
            await client.query(
              `INSERT INTO customers (id, email, name, password_hash, phone, role)
               VALUES ($1, $2, $3, $4, $5, 'customer')
               ON CONFLICT (id) DO NOTHING`,
              [userId, user.email, (user.first_name || 'Admin') + ' ' + (user.last_name || 'User'), '', '0000000000']
            )
          } else {
            throw new Error('Utilisateur non trouvé')
          }
        } catch (err: any) {
          // If the users table doesn't exist or another DB error occurs, fail gracefully
          console.warn('Could not sync user from users table:', err.message || err)
          throw new Error('Utilisateur non trouvé')
        }
    }

    // 1. Créer les adresses
    const shippingAddressResult = await client.query(
      `INSERT INTO customer_addresses (customer_id, type, street_address, city, postal_code, country)
       VALUES ($1, 'shipping', $2, $3, $4, $5) RETURNING id`,
      [userId, orderData.shipping_address.street, orderData.shipping_address.city, 
       orderData.shipping_address.postal_code, orderData.shipping_address.country]
    )
    const shippingAddressId = shippingAddressResult.rows[0].id

    const billingAddressResult = await client.query(
      `INSERT INTO customer_addresses (customer_id, type, street_address, city, postal_code, country)
       VALUES ($1, 'billing', $2, $3, $4, $5) RETURNING id`,
      [userId, orderData.billing_address.street, orderData.billing_address.city,
       orderData.billing_address.postal_code, orderData.billing_address.country]
    )
    const billingAddressId = billingAddressResult.rows[0].id

    // 2. Créer la commande
    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, total_amount, status, shipping_address_id, billing_address_id)
       VALUES ($1, $2, 'pending', $3, $4) RETURNING id, created_at, updated_at`,
      [userId, orderData.total_amount, shippingAddressId, billingAddressId]
    )
    const orderId = orderResult.rows[0].id
    const createdAt = orderResult.rows[0].created_at
    const updatedAt = orderResult.rows[0].updated_at

    // 3. Créer les items de commande et déduire le stock
    const items: OrderItem[] = []
    for (const item of orderData.items) {
      // Vérifier et déduire le stock
      const stockResult = await client.query(
        `UPDATE products 
         SET stock_quantity = stock_quantity - $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND stock_quantity >= $3
         RETURNING id, name, image_url, stock_quantity`,
        [item.quantity, item.product_id, item.quantity]
      )

      if (stockResult.rows.length === 0) {
        throw new Error(`Stock insuffisant pour le produit ${item.product_id}`)
      }

      const product = stockResult.rows[0]
      const totalPrice = item.quantity * item.unit_price

      // Insérer l'item de commande
      const orderItemResult = await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [orderId, item.product_id, item.quantity, item.unit_price, totalPrice]
      )

      items.push({
        id: orderItemResult.rows[0].id,
        order_id: orderId,
        product_id: item.product_id,
        product_name: product.name,
        product_image: product.image_url,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: totalPrice,
      })
    }

    // 4. Créer le paiement
    // Normalize payment method coming from the client to match DB CHECK constraint
    let paymentMethod = orderData.payment_method
    if (paymentMethod === "card") paymentMethod = "credit_card"
    // Fallback: if an unexpected value is provided, default to 'credit_card'
    const allowed = ["credit_card", "paypal", "bank_transfer"]
    if (!allowed.includes(paymentMethod)) paymentMethod = "credit_card"

    await client.query(
      `INSERT INTO payments (order_id, payment_method, status, amount)
       VALUES ($1, $2, 'pending', $3)`,
      [orderId, paymentMethod, orderData.total_amount]
    )

    await client.query('COMMIT')

    return {
      id: orderId,
      user_id: userId,
      status: 'pending',
      total_amount: orderData.total_amount,
      shipping_address: orderData.shipping_address,
      billing_address: orderData.billing_address,
      payment_method: orderData.payment_method,
      created_at: createdAt,
      updated_at: updatedAt,
      items,
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Récupérer les commandes d'un utilisateur
export async function getUserOrders(userId: string): Promise<Order[]> {
  const ordersResult = await db.query(
    `SELECT o.id, o.customer_id as user_id, o.total_amount, o.status, o.created_at, o.updated_at,
            sa.street_address as shipping_street, sa.city as shipping_city, 
            sa.postal_code as shipping_postal_code, sa.country as shipping_country,
            ba.street_address as billing_street, ba.city as billing_city,
            ba.postal_code as billing_postal_code, ba.country as billing_country,
            p.payment_method
     FROM orders o
     LEFT JOIN customer_addresses sa ON o.shipping_address_id = sa.id
     LEFT JOIN customer_addresses ba ON o.billing_address_id = ba.id
     LEFT JOIN payments p ON o.id = p.order_id
     WHERE o.customer_id = $1
     ORDER BY o.created_at DESC`,
    [userId]
  )

  const orders: Order[] = []

  for (const row of ordersResult.rows) {
    // Récupérer les items de chaque commande
    const itemsResult = await db.query(
      `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price, oi.total_price,
              p.name as product_name, p.image_url as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [row.id]
    )

    orders.push({
      id: row.id,
      user_id: row.user_id,
      status: row.status,
      total_amount: parseFloat(row.total_amount),
      shipping_address: {
        street: row.shipping_street,
        city: row.shipping_city,
        postal_code: row.shipping_postal_code,
        country: row.shipping_country,
      },
      billing_address: {
        street: row.billing_street,
        city: row.billing_city,
        postal_code: row.billing_postal_code,
        country: row.billing_country,
      },
      payment_method: row.payment_method || 'card',
      created_at: row.created_at,
      updated_at: row.updated_at,
      items: itemsResult.rows.map(item => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price),
        total_price: parseFloat(item.total_price),
      })),
    })
  }

  return orders
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const orderResult = await db.query(
    `SELECT o.id, o.customer_id as user_id, o.total_amount, o.status, o.created_at, o.updated_at,
            sa.street_address as shipping_street, sa.city as shipping_city,
            sa.postal_code as shipping_postal_code, sa.country as shipping_country,
            ba.street_address as billing_street, ba.city as billing_city,
            ba.postal_code as billing_postal_code, ba.country as billing_country,
            p.payment_method
     FROM orders o
     LEFT JOIN customer_addresses sa ON o.shipping_address_id = sa.id
     LEFT JOIN customer_addresses ba ON o.billing_address_id = ba.id
     LEFT JOIN payments p ON o.id = p.order_id
     WHERE o.id = $1`,
    [orderId]
  )

  if (orderResult.rows.length === 0) {
    return null
  }

  const row = orderResult.rows[0]

  const itemsResult = await db.query(
    `SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price, oi.total_price,
            p.name as product_name, p.image_url as product_image
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [orderId]
  )

  return {
    id: row.id,
    user_id: row.user_id,
    status: row.status,
    total_amount: parseFloat(row.total_amount),
    shipping_address: {
      street: row.shipping_street,
      city: row.shipping_city,
      postal_code: row.shipping_postal_code,
      country: row.shipping_country,
    },
    billing_address: {
      street: row.billing_street,
      city: row.billing_city,
      postal_code: row.billing_postal_code,
      country: row.billing_country,
    },
    payment_method: row.payment_method || 'card',
    created_at: row.created_at,
    updated_at: row.updated_at,
    items: itemsResult.rows.map(item => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      quantity: item.quantity,
      unit_price: parseFloat(item.unit_price),
      total_price: parseFloat(item.total_price),
    })),
  }
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order | null> {
  await db.query(
    `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    [status, orderId]
  )
  
  return getOrderById(orderId)
}
