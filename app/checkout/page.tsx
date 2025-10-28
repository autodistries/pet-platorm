"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import type { CheckoutData } from "@/lib/orders"

export default function CheckoutPage() {
  const { items, total_amount, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sameAsShipping, setSameAsShipping] = useState(true)

  const [formData, setFormData] = useState<CheckoutData>({
    shipping_address: {
      street: "",
      city: "",
      postal_code: "",
      country: "France",
    },
    billing_address: {
      street: "",
      city: "",
      postal_code: "",
      country: "France",
    },
    payment_method: "card",
    same_as_shipping: true,
  })

  const handleInputChange = (section: "shipping_address" | "billing_address", field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        status: "pending" as const,
        shipping_address: formData.shipping_address,
        billing_address: sameAsShipping ? formData.shipping_address : formData.billing_address,
        payment_method: formData.payment_method,
        items: items.map((item) => ({
          id: Math.random().toString(36).substr(2, 9),
          order_id: "",
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.image,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity,
        })),
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        clearCart()
        router.push(`/payment/${order.id}`)
      } else {
        throw new Error("Erreur lors de la création de la commande")
      }
    } catch (error) {
      console.error("Erreur checkout:", error)
      alert("Erreur lors de la commande. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
          <Button onClick={() => router.push("/products")}>Continuer vos achats</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adresse de livraison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shipping-street">Adresse</Label>
                  <Input
                    id="shipping-street"
                    value={formData.shipping_address.street}
                    onChange={(e) => handleInputChange("shipping_address", "street", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping-city">Ville</Label>
                    <Input
                      id="shipping-city"
                      value={formData.shipping_address.city}
                      onChange={(e) => handleInputChange("shipping_address", "city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-postal">Code postal</Label>
                    <Input
                      id="shipping-postal"
                      value={formData.shipping_address.postal_code}
                      onChange={(e) => handleInputChange("shipping_address", "postal_code", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adresse de facturation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="same-address"
                    checked={sameAsShipping}
                    onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                  />
                  <Label htmlFor="same-address">Identique à l'adresse de livraison</Label>
                </div>

                {!sameAsShipping && (
                  <>
                    <div>
                      <Label htmlFor="billing-street">Adresse</Label>
                      <Input
                        id="billing-street"
                        value={formData.billing_address.street}
                        onChange={(e) => handleInputChange("billing_address", "street", e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billing-city">Ville</Label>
                        <Input
                          id="billing-city"
                          value={formData.billing_address.city}
                          onChange={(e) => handleInputChange("billing_address", "city", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-postal">Code postal</Label>
                        <Input
                          id="billing-postal"
                          value={formData.billing_address.postal_code}
                          onChange={(e) => handleInputChange("billing_address", "postal_code", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mode de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, payment_method: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Carte bancaire</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">{(item.product.price * item.quantity).toFixed(2)} €</p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{total_amount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>Gratuite</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{total_amount.toFixed(2)} €</span>
                  </div>
                </div>

                <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
                  {loading ? "Traitement..." : "Confirmer la commande"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
