"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import type { Product } from "@/lib/products"

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  name: string
  description: string
  price: number
  image_url: string
  stock_quantity: number
  category: string
}

interface CartState {
  items: CartItem[]
  total_items: number
  total_amount: number
  isLoading: boolean
}

type CartAction =
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_CART" }

const initialState: CartState = {
  items: [],
  total_items: 0,
  total_amount: 0,
  isLoading: true,
}

function calculateCartTotals(items: CartItem[]) {
  const total_items = items.reduce((sum, item) => sum + item.quantity, 0)
  const total_amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { total_items, total_amount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART": {
      const items = action.payload
      const { total_items, total_amount } = calculateCartTotals(items)
      return {
        ...state,
        items,
        total_items,
        total_amount,
        isLoading: false,
      }
    }

    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      }
    }

    case "CLEAR_CART": {
      return {
        ...state,
        items: [],
        total_items: 0,
        total_amount: 0,
      }
    }

    default:
      return state
  }
}

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  getItemQuantity: (productId: string) => number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { user, isLoading: authLoading } = useAuth()

  // Load cart from server when user changes
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        refreshCart()
      } else {
        // User logged out - clear cart
        dispatch({ type: "CLEAR_CART" })
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }
  }, [user, authLoading])

  const refreshCart = async () => {
    if (!user) {
      dispatch({ type: "LOAD_CART", payload: [] })
      return
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await fetch("/api/cart", {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: "LOAD_CART", payload: data.items || [] })
      } else {
        console.error("Failed to load cart")
        dispatch({ type: "LOAD_CART", payload: [] })
      }
    } catch (error) {
      console.error("Error loading cart:", error)
      dispatch({ type: "LOAD_CART", payload: [] })
    }
  }

  const addItem = async (product: Product, quantity = 1) => {
    if (!user) {
      alert("Vous devez être connecté pour ajouter des produits au panier")
      return
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      })

      if (response.ok) {
        await refreshCart()
      } else {
        const data = await response.json()
        alert(data.error || "Erreur lors de l'ajout au panier")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Erreur lors de l'ajout au panier")
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: productId,
          quantity,
        }),
      })

      if (response.ok) {
        await refreshCart()
      } else {
        const data = await response.json()
        alert(data.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Error updating cart:", error)
      alert("Erreur lors de la mise à jour")
    }
  }

  const removeItem = async (productId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
        credentials: 'include',
      })

      if (response.ok) {
        await refreshCart()
      } else {
        const data = await response.json()
        alert(data.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      alert("Erreur lors de la suppression")
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        credentials: 'include',
      })

      if (response.ok) {
        dispatch({ type: "CLEAR_CART" })
      } else {
        alert("Erreur lors du vidage du panier")
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
      alert("Erreur lors du vidage du panier")
    }
  }

  const getItemQuantity = (productId: string) => {
    const item = state.items.find((item) => item.product_id === productId)
    return item ? item.quantity : 0
  }

  const value: CartContextType = {
    ...state,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
    refreshCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
