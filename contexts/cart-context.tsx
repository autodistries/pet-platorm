"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { type CartItem, calculateCartTotals, getCartFromStorage, saveCartToStorage } from "@/lib/cart"
import type { Product } from "@/lib/products"

interface CartState {
  items: CartItem[]
  total_items: number
  total_amount: number
  isLoading: boolean
}

type CartAction =
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }

const initialState: CartState = {
  items: [],
  total_items: 0,
  total_amount: 0,
  isLoading: true,
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

    case "ADD_ITEM": {
      const { product, quantity } = action.payload
      const existingItemIndex = state.items.findIndex((item) => item.product.id === product.id)

      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock_quantity) }
            : item,
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          id: crypto.randomUUID(),
          product,
          quantity: Math.min(quantity, product.stock_quantity),
          added_at: new Date().toISOString(),
        }
        newItems = [...state.items, newItem]
      }

      const { total_items, total_amount } = calculateCartTotals(newItems)
      saveCartToStorage(newItems)

      return {
        ...state,
        items: newItems,
        total_items,
        total_amount,
      }
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const newItems = state.items.filter((item) => item.product.id !== productId)
        const { total_items, total_amount } = calculateCartTotals(newItems)
        saveCartToStorage(newItems)

        return {
          ...state,
          items: newItems,
          total_items,
          total_amount,
        }
      }

      const newItems = state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.min(quantity, item.product.stock_quantity) } : item,
      )

      const { total_items, total_amount } = calculateCartTotals(newItems)
      saveCartToStorage(newItems)

      return {
        ...state,
        items: newItems,
        total_items,
        total_amount,
      }
    }

    case "REMOVE_ITEM": {
      const { productId } = action.payload
      const newItems = state.items.filter((item) => item.product.id !== productId)
      const { total_items, total_amount } = calculateCartTotals(newItems)
      saveCartToStorage(newItems)

      return {
        ...state,
        items: newItems,
        total_items,
        total_amount,
      }
    }

    case "CLEAR_CART": {
      saveCartToStorage([])
      return {
        ...state,
        items: [],
        total_items: 0,
        total_amount: 0,
      }
    }

    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      }
    }

    default:
      return state
  }
}

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getItemQuantity: (productId: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = getCartFromStorage()
    dispatch({ type: "LOAD_CART", payload: savedCart })
  }, [])

  const addItem = (product: Product, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getItemQuantity = (productId: string) => {
    const item = state.items.find((item) => item.product.id === productId)
    return item ? item.quantity : 0
  }

  const value: CartContextType = {
    ...state,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
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
