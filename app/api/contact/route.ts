import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { randomUUID } from "crypto"
import { getCollection } from "@/lib/db"

interface ContactMessage {
  _id: string
  id: string
  name: string
  email: string
  subject: string
  message: string
  ip_address: string
  user_agent: string
  created_at: string
  is_read: boolean
}

async function contactCollection() {
  return getCollection<ContactMessage>("contact_messages")
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 }
      )
    }

    // Récupérer l'IP et le user agent pour tracking
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    const collection = await contactCollection()
    const id = randomUUID()
    await collection.insertOne({
      _id: id,
      id,
      name,
      email: email.trim().toLowerCase(),
      subject,
      message,
      ip_address: ip,
      user_agent: userAgent,
      created_at: new Date().toISOString(),
      is_read: false,
    })

    return NextResponse.json(
      { message: "Votre message a été envoyé avec succès" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    )
  }
}

// GET pour récupérer tous les messages (admin uniquement)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unread") === "true"

    const collection = await contactCollection()
    const filter = unreadOnly ? { is_read: false } : {}
    const messages = await collection
      .find(filter, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .toArray()

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    )
  }
}

// PATCH pour marquer un message comme lu
export async function PATCH(request: NextRequest) {
  try {
    const { id, is_read } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "ID du message requis" },
        { status: 400 }
      )
    }

    const collection = await contactCollection()
    await collection.updateOne(
      { id },
      { $set: { is_read: is_read ?? true } }
    )

    return NextResponse.json(
      { message: "Message mis à jour avec succès" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de la mise à jour du message:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du message" },
      { status: 500 }
    )
  }
}
