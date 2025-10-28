import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { headers } from "next/headers"

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

    // Insérer le message de contact
    await db.query(
      `INSERT INTO contact_messages (name, email, subject, message, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, subject, message, ip, userAgent]
    )

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

    let query = `
      SELECT id, name, email, subject, message, created_at, is_read 
      FROM contact_messages
    `

    if (unreadOnly) {
      query += " WHERE is_read = false"
    }

    query += " ORDER BY created_at DESC"

    const result = await db.query(query)

    return NextResponse.json(result.rows)
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

    await db.query(
      "UPDATE contact_messages SET is_read = $1 WHERE id = $2",
      [is_read ?? true, id]
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
