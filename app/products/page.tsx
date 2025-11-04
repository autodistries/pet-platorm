"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { Product, Category } from "@/lib/products"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    // Initialize filters from URL parameters or defaults
    const urlParams = {
      category: searchParams.get("category") || "all",
      search: searchParams.get("search") || "",
      maxPrice: searchParams.get("maxPrice") || "100",
      minPrice: searchParams.get("minPrice") || "0",
      sortBy: searchParams.get("sortBy") || "created_at",
      sortOrder: searchParams.get("sortOrder") || "desc",
    };
    
    // Remove undefined/empty values
    return Object.fromEntries(
      Object.entries(urlParams).filter(([_, value]) => value !== null && value !== "")
    );
  });

  // Combined initial fetch of both categories and products
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      try {
        // Use initial filters for the first products fetch
        const params = new URLSearchParams({
          ...filters,
          page: "1",
          limit: "12"
        });

        const [categoriesRes, productsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products?" + params)
        ]);

        if (categoriesRes.ok && productsRes.ok) {
          const [categoriesData, productsData] = await Promise.all([
            categoriesRes.json(),
            productsRes.json()
          ]);

          setCategories(categoriesData);
          setProducts(productsData.products);
          setPagination({
            page: productsData.page,
            totalPages: productsData.totalPages,
            total: productsData.total,
          });
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Only fetch products when filters actually change
  useEffect(() => {
    // Skip the initial render since we already fetched products
    if (Object.keys(filters).length === 0) return;

    fetchProducts(true)
  }, [filters])

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

  const fetchProducts = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value && value.toString().trim() !== ""),
      )

      const params = new URLSearchParams({
        ...cleanFilters,
        page: reset ? "1" : (pagination.page + 1).toString(),
        limit: "12",
      })

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()

        if (reset) {
          setProducts(data.products)
        } else {
          setProducts((prev) => [...prev, ...data.products])
        }

        setPagination({
          page: data.page,
          totalPages: data.totalPages,
          total: data.total,
        })
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleFiltersChange = useCallback((newFilters: Record<string, string>) => {
    setFilters(newFilters)
  }, [])

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchProducts(false)
    }
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Nos Produits</h1>
          <p className="text-muted-foreground">Découvrez notre sélection d'accessoires premium pour vos compagnons</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters categories={categories} onFiltersChange={handleFiltersChange} initialFilters={filters} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {pagination.total} produit{pagination.total > 1 ? "s" : ""} trouvé{pagination.total > 1 ? "s" : ""}
                  </p>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Aucun produit trouvé</p>
                  </div>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {pagination.page < pagination.totalPages && (
                      <div className="mt-8 text-center">
                        <Button onClick={loadMore} disabled={loadingMore} variant="outline" size="lg">
                          {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Charger plus de produits
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
    </div>
  )
}
