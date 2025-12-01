import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {product.stock_quantity < 10 && product.stock_quantity > 0 && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            Stock limité
          </Badge>
        )}

        {product.stock_quantity === 0 && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Rupture de stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-sm text-balance leading-tight hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.category && <p className="text-xs text-muted-foreground">{product.category.name}</p>}

          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
          {product.stock_quantity > 0 && (
            <span className="text-xs text-muted-foreground">{product.stock_quantity} en stock</span>
          )}
        </div>

        <AddToCartButton product={product} size="sm" showText={false} />
      </CardFooter>
    </Card>
  )
}
