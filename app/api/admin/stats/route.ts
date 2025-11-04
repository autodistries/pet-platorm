import { type NextRequest, NextResponse } from "next/server"
import { getAdminStats } from "@/lib/admin"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const stats = await getAdminStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
