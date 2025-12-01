import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getCollection } from "@/lib/db"
import { randomUUID } from "crypto"

interface PaymentMethod {
  id: string
  user_id: string
  card_last4: string
  card_brand: string
  card_exp_month: string
  card_exp_year: string
  cardholder_name: string
  is_default: boolean
  created_at: string
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const collection = await getCollection<PaymentMethod>("payment_methods")
    const methods = await collection.find({ user_id: currentUser.id }).toArray()

    return NextResponse.json(methods)
  } catch (error) {
    console.error("Get payment methods error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { cardNumber, expiryMonth, expiryYear, cardholderName, isDefault } = await request.json()

    if (!cardNumber || !expiryMonth || !expiryYear || !cardholderName) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    // Extract last 4 digits
    const last4 = cardNumber.replace(/\s/g, "").slice(-4)
    
    // Determine card brand
    const cardBrand = getCardBrand(cardNumber)

    const collection = await getCollection<PaymentMethod>("payment_methods")

    // If this is default, unset other default cards
    if (isDefault) {
      await collection.updateMany(
        { user_id: currentUser.id },
        { $set: { is_default: false } }
      )
    }

    const newMethod: PaymentMethod = {
      id: randomUUID(),
      user_id: currentUser.id,
      card_last4: last4,
      card_brand: cardBrand,
      card_exp_month: expiryMonth,
      card_exp_year: expiryYear,
      cardholder_name: cardholderName,
      is_default: isDefault || false,
      created_at: new Date().toISOString(),
    }

    await collection.insertOne(newMethod as any)

    return NextResponse.json({
      message: "Carte ajoutée avec succès",
      method: newMethod,
    })
  } catch (error) {
    console.error("Add payment method error:", error)
    return NextResponse.json({ error: "Erreur lors de l'ajout de la carte" }, { status: 500 })
  }
}

function getCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "")
  
  if (digits.startsWith("4")) return "Visa"
  if (digits.startsWith("5") || digits.startsWith("2")) return "Mastercard"
  if (digits.startsWith("3")) return "American Express"
  
  return "Autre"
}
