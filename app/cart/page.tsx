"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { formatPrice } from "@/lib/cart"
import Link from "next/link"

export default function CartPage() {
  const { items, total_items, total_amount, updateQuantity, removeItem, clearCart, isLoading } = useCart()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuer mes achats
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Mon Panier</h1>
            {items.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vider le panier
              </Button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">Découvrez notre sélection de produits pour vos compagnons</p>
            <Button asChild size="lg">
              <Link href="/products">Découvrir nos produits</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div>
                          <Link
                            href={`/products/${item.product_id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          {item.category && (
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{formatPrice(item.price)}</span>

                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-3 text-sm font-medium min-w-[3rem] text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock_quantity}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.product_id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {item.quantity >= item.stock_quantity && (
                          <p className="text-sm text-amber-600">
                            Stock maximum atteint ({item.stock_quantity} disponibles)
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Résumé de la commande</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Sous-total ({total_items} article{total_items > 1 ? "s" : ""})
                      </span>
                      <span>{formatPrice(total_amount)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Livraison</span>
                      <span className="text-green-600">Gratuite</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total_amount)}</span>
                  </div>

                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Passer la commande</Link>
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Livraison gratuite dès 50€ d'achat</p>
                    <p>Retour gratuit sous 30 jours</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    )
  }
