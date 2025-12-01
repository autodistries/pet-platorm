"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import type { CheckoutData } from "@/lib/orders"

export default function CheckoutPage() {
  const { items, total_amount, clearCart } = useCart()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(false)
  const [addressPreFilled, setAddressPreFilled] = useState(false)

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
    payment_method: "pending", // Sera défini sur la page de paiement
    same_as_shipping: true,
  })

  // Autofill address from user profile
  useEffect(() => {
    if (user?.address && user.address.street && user.address.city) {
      setFormData((prev) => ({
        ...prev,
        shipping_address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          postal_code: user.address?.postal_code || "",
          country: user.address?.country || "France",
        },
      }))
      setAddressPreFilled(true)
    }
  }, [user])

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
      // Si l'utilisateur veut sauvegarder l'adresse dans son profil
      if (saveAddressToProfile && !addressPreFilled) {
        await fetch("/api/auth/update", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            address: formData.shipping_address,
          }),
        })
      }

      const orderData = {
        total_amount: total_amount,
        shipping_address: formData.shipping_address,
        billing_address: sameAsShipping ? formData.shipping_address : formData.billing_address,
        payment_method: formData.payment_method,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      }

      console.log("Envoi de la commande:", orderData)

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
        credentials: 'include', // Important pour envoyer les cookies
      })

      const data = await response.json()
      console.log("Réponse serveur:", response.status, data)

      if (!response.ok) {
        throw new Error(data.error || data.details || "Erreur lors de la création de la commande")
      }

      clearCart()
      router.push(`/payment/${data.id}`)
    } catch (error: any) {
      console.error("Erreur checkout:", error)
      alert(error.message || "Erreur lors de la commande. Veuillez réessayer.")
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

  // Block checkout for unauthenticated users
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vérification de l'authentification...</h1>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
          <p className="mb-4">Vous devez être connecté pour passer une commande. Veuillez vous connecter ou créer un compte.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push('/auth/login')}>Se connecter</Button>
            <Button variant="outline" onClick={() => router.push('/auth/register')}>S'inscrire</Button>
          </div>
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
                    placeholder="123 Rue de la Paix"
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
                      placeholder="Paris"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping-postal">Code postal</Label>
                    <Input
                      id="shipping-postal"
                      value={formData.shipping_address.postal_code}
                      onChange={(e) => handleInputChange("shipping_address", "postal_code", e.target.value)}
                      required
                      placeholder="75001"
                    />
                  </div>
                </div>
                
                {!addressPreFilled && (
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="save-address"
                      checked={saveAddressToProfile}
                      onCheckedChange={(checked) => setSaveAddressToProfile(checked as boolean)}
                    />
                    <Label htmlFor="save-address" className="text-sm cursor-pointer">
                      Enregistrer cette adresse dans mon profil
                    </Label>
                  </div>
                )}
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
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
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
