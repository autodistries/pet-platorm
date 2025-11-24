import { getCollection } from "./db"
import type { Document, Filter, SortDirection } from "mongodb"

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

interface ProductDocument extends Omit<Product, "category" | "category_id"> {
  _id: string
  category_id?: string
}

interface CategoryDocument extends Category {
  _id: string
}

function normalizeSort(sortBy?: ProductFilters["sortBy"], sortOrder?: ProductFilters["sortOrder"]): Record<string, SortDirection> {
  const direction: SortDirection = sortOrder === "asc" ? 1 : -1
  switch (sortBy) {
    case "name":
      return { name: direction }
    case "price":
      return { price: direction }
    case "created_at":
    default:
      return { created_at: direction }
  }
}

function mapProduct(doc: ProductDocument & { category?: CategoryDocument | null }): Product {
  const categoryDoc = doc.category
    ? {
        id: doc.category.id,
        name: doc.category.name,
        description: doc.category.description,
        parent_id: doc.category.parent_id,
        created_at: doc.category.created_at,
      }
    : undefined

  return {
    id: doc.id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    category_id: doc.category_id ?? "",
    stock_quantity: doc.stock_quantity,
    sku: doc.sku,
    image_url: doc.image_url,
    is_active: doc.is_active,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
    category: categoryDoc,
  }
}

export async function getProducts(filters: ProductFilters = {}) {
  try {
    const collection = await getCollection<ProductDocument>("products")
    const matchConditions: Document[] = [{ is_active: true }]

    if (filters.category && filters.category !== "all") {
      matchConditions.push({ category_id: filters.category })
    }

    if (filters.search) {
      const regex = new RegExp(filters.search.trim(), "i")
      matchConditions.push({ $or: [{ name: regex }, { description: regex }] })
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceFilter: Document = {}
      if (filters.minPrice !== undefined) {
        priceFilter.$gte = filters.minPrice
      }
      if (filters.maxPrice !== undefined) {
        priceFilter.$lte = filters.maxPrice
      }
      matchConditions.push({ price: priceFilter })
    }

    const matchFilter = matchConditions.length > 1 ? { $and: matchConditions } : matchConditions[0]

    const page = filters.page && filters.page > 0 ? filters.page : 1
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 12
    const skip = (page - 1) * limit

    const total = await collection.countDocuments(matchFilter as Filter<ProductDocument>)

    const pipeline: Document[] = [
      { $match: matchFilter },
      { $sort: normalizeSort(filters.sortBy, filters.sortOrder) },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "id",
          as: "category_doc",
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ["$category_doc", 0] },
        },
      },
      {
        $project: {
          _id: 0,
          category_doc: 0,
        },
      },
    ]

    const docs = await collection.aggregate<(ProductDocument & { category?: CategoryDocument })>(pipeline).toArray()
    const products = docs.map((doc) => mapProduct(doc))

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to fetch products")
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const collection = await getCollection<ProductDocument>("products")
    const pipeline: Document[] = [
      { $match: { id, is_active: true } },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "id",
          as: "category_doc",
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ["$category_doc", 0] },
        },
      },
      {
        $project: {
          _id: 0,
          category_doc: 0,
        },
      },
    ]

    const doc = await collection.aggregate<(ProductDocument & { category?: CategoryDocument })>(pipeline).next()

    if (!doc) {
      return undefined
    }

    return mapProduct(doc)
  } catch (error) {
    console.error("Error fetching product:", error)
    throw new Error("Failed to fetch product")
  }
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  try {
    const collection = await getCollection<CategoryDocument>("categories")
    const category = await collection.findOne({ id })

    if (!category) {
      return undefined
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      parent_id: category.parent_id,
      created_at: category.created_at,
    }
  } catch (error) {
    console.error("Error fetching category:", error)
    throw new Error("Failed to fetch category")
  }
}

export async function getCategories(): Promise<Category[]> {
  const collection = await getCollection<CategoryDocument>("categories")
  const docs = await collection.find().sort({ name: 1 }).toArray()

  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    description: doc.description,
    parent_id: doc.parent_id,
    created_at: doc.created_at,
  }))
}
