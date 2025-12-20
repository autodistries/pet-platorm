import { type NextRequest, NextResponse } from "next/server"
import { createOrder, getUserOrders } from "@/lib/orders"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const result = await getUserOrders(session.id, page, limit)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
  console.log("=== DEBUT POST /api/orders ===")
  console.log("Request Cookie header:", request.headers.get('cookie'))

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

      // Require authenticated user — guest/anonymous orders are no longer allowed
    const session = await getCurrentUser()
    console.log("Session from getCurrentUser():", session)
      if (!session) {
        console.log("Rejet de la commande: authentification requise (no session)")
        return NextResponse.json({ error: "Authentification requise. Veuillez vous connecter ou créer un compte." }, { status: 401 })
      }

      const userId = session.id

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
    
    if (error.message && error.message.includes("Utilisateur non trouvé")) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ 
      error: "Erreur lors de la création de la commande", 
      details: error.message 
    }, { status: 500 })
  }
}
