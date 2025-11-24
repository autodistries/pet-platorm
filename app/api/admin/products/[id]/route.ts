import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const data = await request.json()
    const { stock_quantity } = data

    if (typeof stock_quantity !== "number" || stock_quantity < 0) {
      return NextResponse.json(
        { error: "La quantité en stock doit être un nombre positif" },
        { status: 400 }
      )
    }

    const result = await query(
      `UPDATE products 
       SET stock_quantity = $1,
           status = CASE 
             WHEN $1 > 0 THEN 'active' 
             ELSE 'out_of_stock' 
           END
       WHERE id = $2
       RETURNING *`,
      [stock_quantity, params.id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stock:", error)
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const result = await query(
      `DELETE FROM products WHERE id = $1 RETURNING *`,
      [params.id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ message: "Produit supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error)
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête" },
      { status: 500 }
    )
  }
}