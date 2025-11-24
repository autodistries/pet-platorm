import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { randomUUID } from "crypto"
import { getCollection } from "@/lib/db"

interface NewsletterSubscription {
  _id: string
  id: string
  email: string
  is_active: boolean
  subscribed_at: string
  ip_address: string
  user_agent: string
}

async function subscriptionsCollection() {
  return getCollection<NewsletterSubscription>("newsletter_subscriptions")
}

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

    const collection = await subscriptionsCollection()
    const normalizedEmail = email.trim().toLowerCase()
    const existing = await collection.findOne({ email: normalizedEmail })

    if (existing) {
      if (!existing.is_active) {
        await collection.updateOne(
          { id: existing.id },
          {
            $set: {
              is_active: true,
              subscribed_at: new Date().toISOString(),
              ip_address: ip,
              user_agent: userAgent,
            },
          }
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

    const subscriptionId = randomUUID()
    const subscription: NewsletterSubscription = {
      _id: subscriptionId,
      id: subscriptionId,
      email: normalizedEmail,
      is_active: true,
      subscribed_at: new Date().toISOString(),
      ip_address: ip,
      user_agent: userAgent,
    }

    await collection.insertOne(subscription)

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
    const collection = await subscriptionsCollection()
    const subscriptions = await collection
      .find({}, { projection: { _id: 0 } })
      .sort({ subscribed_at: -1 })
      .toArray()

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnements:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des abonnements" },
      { status: 500 }
    )
  }
}
