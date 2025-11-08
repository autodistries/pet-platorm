"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/lib/products"

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])

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
    }
  }

  const categoryImages = {
    "Colliers et Laisses": "/dog-collar-and-leash.jpg",
    Jouets: "/pet-toys-balls-rope.jpg",
    Alimentation: "/pet-food-bowls-feeding.jpg",
    Couchage: "/pet-bed-cushion-sleeping.jpg",
    Hygiène: "/pet-grooming-hygiene-brush.jpg",
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-balance mb-4">Nos Catégories</h2>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
            Explorez notre gamme complète d'accessoires organisés par catégorie pour trouver exactement ce dont votre
            compagnon a besoin.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={
                      categoryImages[category.name as keyof typeof categoryImages] ||
                      "/placeholder.svg?height=200&width=300"
                    }
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-sm text-balance mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground text-pretty">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
