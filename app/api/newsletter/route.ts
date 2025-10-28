import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validation
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 }
      )
    }

    // Récupérer l'IP et le user agent pour tracking
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Vérifier si l'email existe déjà
    const existingSubscription = await db.query(
      "SELECT id, is_active FROM newsletter_subscriptions WHERE email = $1",
      [email]
    )

    if (existingSubscription.rows.length > 0) {
      const subscription = existingSubscription.rows[0]
      
      // Si l'utilisateur s'était désabonné, le réactiver
      if (!subscription.is_active) {
        await db.query(
          "UPDATE newsletter_subscriptions SET is_active = true, subscribed_at = CURRENT_TIMESTAMP WHERE id = $1",
          [subscription.id]
        )
        return NextResponse.json(
          { message: "Votre abonnement a été réactivé avec succès" },
          { status: 200 }
        )
      }

      return NextResponse.json(
        { error: "Cet email est déjà abonné à notre newsletter" },
        { status: 409 }
      )
    }

    // Insérer le nouvel abonnement
    await db.query(
      `INSERT INTO newsletter_subscriptions (email, ip_address, user_agent) 
       VALUES ($1, $2, $3)`,
      [email, ip, userAgent]
    )

    return NextResponse.json(
      { message: "Inscription réussie à la newsletter" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur lors de l'inscription à la newsletter:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    )
  }
}

// GET pour récupérer toutes les inscriptions (admin uniquement)
export async function GET() {
  try {
    const result = await db.query(
      `SELECT id, email, subscribed_at, is_active 
       FROM newsletter_subscriptions 
       ORDER BY subscribed_at DESC`
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnements:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des abonnements" },
      { status: 500 }
    )
  }
}
