import { query } from "./db"

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

export async function getProducts(filters: ProductFilters = {}) {
  try {
    let queryStr = `
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    const queryParams: any[] = [];
    let paramCount = 1;

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      queryStr += ` AND p.category_id = $${paramCount}`;
      queryParams.push(filters.category);
      paramCount++;
    }

    // Apply search filter
    if (filters.search) {
      queryStr += ` AND (LOWER(p.name) LIKE $${paramCount} OR LOWER(p.description) LIKE $${paramCount})`;
      queryParams.push(`%${filters.search.toLowerCase()}%`);
      paramCount++;
    }

    // Apply price filters
    if (filters.minPrice !== undefined) {
      queryStr += ` AND p.price >= $${paramCount}`;
      queryParams.push(filters.minPrice);
      paramCount++;
    }
    if (filters.maxPrice !== undefined) {
      queryStr += ` AND p.price <= $${paramCount}`;
      queryParams.push(filters.maxPrice);
      paramCount++;
    }

    // Count total before pagination
    const countResult = await query(`SELECT COUNT(*) FROM (${queryStr}) as filtered_products`, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Apply sorting
    if (filters.sortBy) {
      const direction = filters.sortOrder === "desc" ? "DESC" : "ASC";
      queryStr += ` ORDER BY p.${filters.sortBy} ${direction}`;
    } else {
      queryStr += " ORDER BY p.created_at DESC";
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const offset = (page - 1) * limit;
    queryStr += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    const result = await query(queryStr, queryParams);

    // Transform the results to include category information
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      category_id: row.category_id,
      stock_quantity: row.stock_quantity,
      sku: row.sku,
      image_url: row.image_url,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category_id ? {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description,
        created_at: row.created_at
      } : undefined
    }));

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const result = await query(`
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 AND p.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      category_id: row.category_id,
      stock_quantity: row.stock_quantity,
      sku: row.sku,
      image_url: row.image_url,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category_id ? {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description,
        created_at: row.created_at
      } : undefined
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  try {
    const result = await query(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return undefined;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Failed to fetch category");
  }
}
