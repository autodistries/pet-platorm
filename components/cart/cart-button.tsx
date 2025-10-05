"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { CartSheet } from "./cart-sheet"

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { total_items, isLoading } = useCart()

  return (
    <>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)} disabled={isLoading}>
        <ShoppingCart className="h-4 w-4" />
        {total_items > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {total_items > 99 ? "99+" : total_items}
          </Badge>
        )}
        <span className="sr-only">Panier ({total_items} articles)</span>
      </Button>

      <CartSheet open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}
