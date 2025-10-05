import { type NextRequest, NextResponse } from "next/server"
import { getSalesData } from "@/lib/admin"
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

    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const salesData = await getSalesData(days)
    return NextResponse.json(salesData)
  } catch (error) {
    console.error("Erreur lors de la récupération des données de vente:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
