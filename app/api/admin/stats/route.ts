import { type NextRequest, NextResponse } from "next/server"
import { getAdminStats } from "@/lib/admin"
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

    // In a real app, check if user has admin role
    // if (payload.role !== 'admin') {
    //   return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    // }

    const stats = await getAdminStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
