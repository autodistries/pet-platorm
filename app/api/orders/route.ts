import { type NextRequest, NextResponse } from "next/server"
import { createOrder, getUserOrders } from "@/lib/orders"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 })
    }

    const orders = await getUserOrders(payload.userId)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    
    console.log("=== DEBUT POST /api/orders ===")
    console.log("Token présent:", !!token)

    const orderData = await request.json()
    console.log("Données de commande reçues:", orderData)
    
    // Validation des données
    if (!orderData.items || orderData.items.length === 0) {
      console.log("ERREUR: Panier vide")
      return NextResponse.json({ error: "Le panier est vide" }, { status: 400 })
    }

    if (!orderData.shipping_address || !orderData.shipping_address.street) {
      console.log("ERREUR: Adresse invalide")
      return NextResponse.json({ error: "Adresse de livraison invalide" }, { status: 400 })
    }

    let userId: string

    // Si pas de token, créer une commande invité
    if (!token) {
      console.log("Pas de token - création d'une commande invité")
      // Utiliser l'email comme identifiant temporaire ou créer un guest user
      userId = "guest-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
      
      // Créer un utilisateur invité temporaire
      const client = await import("@/lib/db").then(m => m.default)
      const guestUserResult = await client.query(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5, 'customer')
         RETURNING id`,
        [userId, orderData.guest_email || 'guest@temp.com', '', 'Invité', 'Invité']
      )
      userId = guestUserResult.rows[0].id
    } else {
      const payload = verifyToken(token)
      console.log("Payload du token:", payload)
      
      if (!payload) {
        console.log("Token invalide - création d'une commande invité")
        userId = "guest-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
        
        const client = await import("@/lib/db").then(m => m.default)
        const guestUserResult = await client.query(
          `INSERT INTO users (id, email, password_hash, first_name, last_name, role)
           VALUES ($1, $2, $3, $4, $5, 'customer')
           RETURNING id`,
          [userId, orderData.guest_email || 'guest@temp.com', '', 'Invité', 'Invité']
        )
        userId = guestUserResult.rows[0].id
      } else {
        userId = payload.userId
      }
    }

    console.log("Création de la commande pour userId:", userId)
    const order = await createOrder(userId, orderData)
    console.log("Commande créée avec succès:", order.id)

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error("ERREUR lors de la création de la commande:", error)
    console.error("Stack:", error.stack)
    
    // Messages d'erreur plus spécifiques
    if (error.message && error.message.includes("Stock insuffisant")) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    if (error.message && error.message.includes("violates foreign key constraint")) {
      return NextResponse.json({ error: "Utilisateur non trouvé", details: error.message }, { status: 404 })
    }
    
    return NextResponse.json({ 
      error: "Erreur lors de la création de la commande", 
      details: error.message 
    }, { status: 500 })
  }
}
