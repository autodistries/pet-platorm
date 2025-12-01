import type { Product } from "./products"

export interface CartItem {
  id: string
  product: Product
  quantity: number
  added_at: string
}

export interface Cart {
  id: string
  items: CartItem[]
  total_items: number
  total_amount: number
  updated_at: string
}

// Cart utilities for client-side state management
export function calculateCartTotals(items: CartItem[]) {
  const total_items = items.reduce((sum, item) => sum + item.quantity, 0)
  const total_amount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return { total_items, total_amount }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

// Local storage helpers
export function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("petcare_cart")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading cart from storage:", error)
    return []
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("petcare_cart", JSON.stringify(items))
  } catch (error) {
    console.error("Error saving cart to storage:", error)
  }
}

export function clearCartStorage(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("petcare_cart")
  } catch (error) {
    console.error("Error clearing cart storage:", error)
  }
}

