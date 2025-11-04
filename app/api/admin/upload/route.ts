import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentUser()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "Aucun fichier n'a été fourni" }, { status: 400 })
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Le fichier doit être une image" }, { status: 400 })
    }

    // Créer un nom de fichier unique
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products")
    const filePath = path.join(uploadDir, fileName)

    // Convertir le File en ArrayBuffer puis en Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sauvegarder le fichier
    await writeFile(filePath, buffer)

    // Retourner l'URL relative pour accéder à l'image
    const url = `/uploads/products/${fileName}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Erreur lors de l'upload:", error)
    return NextResponse.json(
      { error: "Erreur lors du traitement de la requête" },
      { status: 500 }
    )
  }
}