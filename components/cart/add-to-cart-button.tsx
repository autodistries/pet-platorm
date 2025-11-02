"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/products"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "secondary"
  className?: string
  showText?: boolean
}

export function AddToCartButton({
  product,
  quantity = 1,
  size = "default",
  variant = "default",
  className = "",
  showText = true,
}: AddToCartButtonProps) {
  const { addItem, getItemQuantity } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const currentQuantity = getItemQuantity(product.id)
  const isOutOfStock = product.stock_quantity === 0
  const wouldExceedStock = currentQuantity + quantity > product.stock_quantity

  const handleAddToCart = async () => {
    if (isOutOfStock || wouldExceedStock) return

    setIsAdding(true)

    try {
      await addItem(product, quantity)
      setJustAdded(true)

      // Reset the "just added" state after 2 seconds
      setTimeout(() => {
        setJustAdded(false)
      }, 2000)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const getButtonText = () => {
    if (isOutOfStock) return "Rupture de stock"
    if (wouldExceedStock) return "Stock insuffisant"
    if (justAdded) return "Ajouté !"
    if (isAdding) return "Ajout..."
    return "Ajouter au panier"
  }

  const getButtonIcon = () => {
    if (justAdded) return <Check className="h-4 w-4" />
    return <ShoppingCart className="h-4 w-4" />
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isOutOfStock || wouldExceedStock || isAdding}
      size={size}
      variant={justAdded ? "secondary" : variant}
      className={className}
    >
      {getButtonIcon()}
      {showText && <span className="ml-2">{getButtonText()}</span>}
    </Button>
  )
}
