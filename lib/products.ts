export interface Product {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  stock_quantity: number
  sku: string
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  description: string
  parent_id?: string
  created_at: string
}

export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: "name" | "price" | "created_at"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

// Mock data - in a real app, this would come from your database
export const mockProducts: Product[] = [
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    name: "Collier en Cuir Premium",
    description:
      "Collier en cuir véritable avec boucle en métal, disponible en plusieurs tailles. Confortable et durable pour un usage quotidien.",
    price: 29.99,
    category_id: "550e8400-e29b-41d4-a716-446655440001",
    stock_quantity: 50,
    sku: "COL-CUIR-001",
    image_url: "/premium-leather-dog-collar.jpg",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    name: "Laisse Rétractable 5m",
    description:
      "Laisse rétractable robuste avec système de freinage automatique. Parfaite pour les promenades en toute sécurité.",
    price: 24.99,
    category_id: "550e8400-e29b-41d4-a716-446655440001",
    stock_quantity: 30,
    sku: "LAI-RET-001",
    image_url: "/retractable-dog-leash.jpg",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440003",
    name: "Balle Interactive LED",
    description:
      "Balle lumineuse interactive qui s'active au mouvement. Stimule l'activité physique et mentale de votre animal.",
    price: 19.99,
    category_id: "550e8400-e29b-41d4-a716-446655440002",
    stock_quantity: 75,
    sku: "JOU-BAL-001",
    image_url: "/led-interactive-pet-ball-toy.jpg",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440004",
    name: "Corde à Noeuds",
    description:
      "Corde de jeu résistante avec noeuds, parfaite pour le tir à la corde. Aide à maintenir une bonne hygiène dentaire.",
    price: 12.99,
    category_id: "550e8400-e29b-41d4-a716-446655440002",
    stock_quantity: 100,
    sku: "JOU-COR-001",
    image_url: "/rope-toy-with-knots-for-dogs.jpg",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440005",
    name: "Gamelle Anti-Glouton",
    description:
      "Gamelle avec obstacles pour ralentir l'alimentation. Améliore la digestion et prévient les ballonnements.",
    price: 16.99,
    category_id: "550e8400-e29b-41d4-a716-446655440003",
    stock_quantity: 40,
    sku: "GAM-ANT-001",
    image_url: "/slow-feeder-dog-bowl.jpg",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440006",
    name: "Distributeur d'Eau Automatique",
    description:
      "Fontaine à eau avec filtre pour chiens et chats. Encourage l'hydratation avec de l'eau fraîche en permanence.",
    price: 45.99,
    category_id: "550e8400-e29b-41d4-a716-446655440003",
    stock_quantity: 25,
    sku: "DIS-EAU-001",
    image_url: "/automatic-pet-water-fountain.jpg",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440007",
    name: "Panier Orthopédique",
    description:
      "Panier avec mousse à mémoire de forme pour le confort articulaire. Idéal pour les animaux âgés ou souffrant d'arthrite.",
    price: 89.99,
    category_id: "550e8400-e29b-41d4-a716-446655440004",
    stock_quantity: 20,
    sku: "PAN-ORT-001",
    image_url: "/orthopedic-pet-bed-memory-foam.jpg",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440008",
    name: "Coussin Chauffant",
    description:
      "Coussin chauffant électrique avec thermostat réglable. Procure chaleur et confort, particulièrement en hiver.",
    price: 34.99,
    category_id: "550e8400-e29b-41d4-a716-446655440004",
    stock_quantity: 35,
    sku: "COU-CHA-001",
    image_url: "/heated-pet-cushion-pad.jpg",
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
]

export const mockCategories: Category[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Colliers et Laisses",
    description: "Colliers, laisses et harnais pour chiens et chats",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Jouets",
    description: "Jouets interactifs et d'exercice pour animaux",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Alimentation",
    description: "Gamelles, distributeurs et accessoires d'alimentation",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "Couchage",
    description: "Paniers, coussins et accessoires de repos",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Hygiène",
    description: "Produits et accessoires d'hygiène et de toilettage",
    created_at: "2024-01-15T10:00:00Z",
  },
]

export function getProducts(filters: ProductFilters = {}) {
  let filteredProducts = [...mockProducts]

  // Apply category filter
  if (filters.category) {
    filteredProducts = filteredProducts.filter((p) => p.category_id === filters.category)
  }

  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (p) => p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm),
    )
  }

  // Apply price filters
  if (filters.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter((p) => p.price >= filters.minPrice!)
  }
  if (filters.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter((p) => p.price <= filters.maxPrice!)
  }

  // Apply sorting
  if (filters.sortBy) {
    filteredProducts.sort((a, b) => {
      const aValue = a[filters.sortBy!]
      const bValue = b[filters.sortBy!]
      const order = filters.sortOrder === "desc" ? -1 : 1

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * order
      }
      return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * order
    })
  }

  // Apply pagination
  const page = filters.page || 1
  const limit = filters.limit || 12
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    products: filteredProducts.slice(startIndex, endIndex),
    total: filteredProducts.length,
    page,
    limit,
    totalPages: Math.ceil(filteredProducts.length / limit),
  }
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id)
}

export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find((c) => c.id === id)
}
