"use client"

import { useState, useEffect, useRef } from "react"
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

interface NormalizedFilters {
  search: string
  category: string
  minPrice: number
  maxPrice: number
  sortBy: string
  sortOrder: string
}

function normalizeFilters(initial: any = {}): NormalizedFilters {
  return {
    search: initial.search || "",
    category: initial.category || "all",
    minPrice: Number.isFinite(parseFloat(initial.minPrice)) ? parseFloat(initial.minPrice) : 0,
    maxPrice: Number.isFinite(parseFloat(initial.maxPrice)) ? parseFloat(initial.maxPrice) : 100,
    sortBy: initial.sortBy || "created_at",
    sortOrder: initial.sortOrder || "desc",
  }
}

function areFiltersEqual(a: NormalizedFilters, b: NormalizedFilters): boolean {
  return (
    a.search === b.search &&
    a.category === b.category &&
    a.minPrice === b.minPrice &&
    a.maxPrice === b.maxPrice &&
    a.sortBy === b.sortBy &&
    a.sortOrder === b.sortOrder
  )
}

export function ProductFilters({ categories, onFiltersChange, initialFilters = {} }: ProductFiltersProps) {
  const normalizedInitial = normalizeFilters(initialFilters)
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState(() => ({
    search: normalizedInitial.search,
    category: normalizedInitial.category,
    minPrice: normalizedInitial.minPrice,
    maxPrice: normalizedInitial.maxPrice,
    sortBy: normalizedInitial.sortBy,
    sortOrder: normalizedInitial.sortOrder,
  }))

  const [priceRange, setPriceRange] = useState<[number, number]>(() => [
    normalizedInitial.minPrice,
    normalizedInitial.maxPrice,
  ])

  const skipNextEffect = useRef(false)
  const isFirstRun = useRef(true)
  const lastAppliedFilters = useRef<NormalizedFilters>(normalizedInitial)

  // Sync local state when parent updates initial filters (e.g. reset)
  useEffect(() => {
    const nextNormalized = normalizeFilters(initialFilters)

    if (!areFiltersEqual(nextNormalized, lastAppliedFilters.current)) {
      skipNextEffect.current = true
      lastAppliedFilters.current = nextNormalized

      setFilters({
        search: nextNormalized.search,
        category: nextNormalized.category,
        minPrice: nextNormalized.minPrice,
        maxPrice: nextNormalized.maxPrice,
        sortBy: nextNormalized.sortBy,
        sortOrder: nextNormalized.sortOrder,
      })
      setPriceRange([nextNormalized.minPrice, nextNormalized.maxPrice])
    }
  }, [
    initialFilters?.search,
    initialFilters?.category,
    initialFilters?.minPrice,
    initialFilters?.maxPrice,
    initialFilters?.sortBy,
    initialFilters?.sortOrder,
  ])

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    if (skipNextEffect.current) {
      skipNextEffect.current = false
      return
    }

    const currentNormalized: NormalizedFilters = {
      search: filters.search,
      category: filters.category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }

    if (areFiltersEqual(currentNormalized, lastAppliedFilters.current)) {
      return
    }

    const timer = setTimeout(() => {
      lastAppliedFilters.current = currentNormalized
      onFiltersChange({
        ...filters,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [filters, priceRange, onFiltersChange])

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
    filters.search != "" || filters.category !== "all" || filters.minPrice > 0 || filters.maxPrice < 100

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
                  onValueChange={(value) => setPriceRange([value[0] ?? 0, value[1] ?? 100])}
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
