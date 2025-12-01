"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProductsTable from "@/components/admin/products-table"
import { ProductFormDialog } from "@/components/admin/product-form-dialog"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement des produits...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </Button>
      </Link>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des produits</h1>
        <ProductFormDialog onSuccess={fetchProducts} />
      </div>
      <ProductsTable products={products} onProductsChanged={fetchProducts} />
    </div>
  )
}
