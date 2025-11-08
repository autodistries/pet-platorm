"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { Category } from "@/lib/products"

const categoryImages: Record<string, string> = {
  "Colliers et Laisses": "/premium-leather-dog-collar.jpg",
  "Jouets": "/interactive-cat-toy.png",
  "Couchage": "/orthopedic-dog-bed.png",
  "Alimentation": "/slow-feeder-dog-bowl.jpg",
  "Hygiène": "/pet-grooming-supplies.jpg",
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos Catégories</h1>
          <p className="text-xl text-muted-foreground">
            Découvrez notre large gamme d'accessoires pour vos animaux de compagnie
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={categoryImages[category.name] || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-muted rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
            <p className="text-muted-foreground mb-6">
              Notre équipe est là pour vous aider à trouver l'accessoire parfait pour votre animal.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>
    )
  }
