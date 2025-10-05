"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { X, Filter } from "lucide-react"
import type { Category } from "@/lib/products"

interface ProductFiltersProps {
  categories: Category[]
  onFiltersChange: (filters: any) => void
  initialFilters?: any
}

export function ProductFilters({ categories, onFiltersChange, initialFilters = {} }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    category: initialFilters.category || "all",
    minPrice: initialFilters.minPrice || 0,
    maxPrice: initialFilters.maxPrice || 100,
    sortBy: initialFilters.sortBy || "created_at",
    sortOrder: initialFilters.sortOrder || "desc",
  })

  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice])

  const debouncedFiltersChange = useCallback(
    (newFilters: any) => {
      const debounceTimer = setTimeout(() => {
        onFiltersChange(newFilters)
      }, 300)

      return () => clearTimeout(debounceTimer)
    },
    [onFiltersChange],
  )

  useEffect(() => {
    const cleanup = debouncedFiltersChange({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    })

    return cleanup
  }, [filters, priceRange, debouncedFiltersChange])

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      category: "all",
      minPrice: 0,
      maxPrice: 100,
      sortBy: "created_at",
      sortOrder: "desc",
    }
    setFilters(clearedFilters)
    setPriceRange([0, 100])
  }

  const hasActiveFilters =
    filters.search || filters.category !== "all" || filters.minPrice > 0 || filters.maxPrice < 100

  return (
    <div className="space-y-4">
      {/* Mobile filter toggle */}
      <div className="md:hidden">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full justify-between">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </span>
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Actifs</span>
          )}
        </Button>
      </div>

      {/* Filters content */}
      <div className={`space-y-4 ${isOpen ? "block" : "hidden md:block"}`}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Filtres</CardTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Effacer
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <Input
                id="search"
                placeholder="Nom du produit..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label>Prix (€)</Label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{priceRange[0]}€</span>
                <span>{priceRange[1]}€</span>
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <Label>Trier par</Label>
              <div className="flex gap-2">
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nom</SelectItem>
                    <SelectItem value="price">Prix</SelectItem>
                    <SelectItem value="created_at">Date</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange("sortOrder", value)}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">↑</SelectItem>
                    <SelectItem value="desc">↓</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
