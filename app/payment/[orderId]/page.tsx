"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
// Header/Footer are provided by RootLayout — don't render them here to avoid duplication
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Order } from "@/lib/orders"
import { AlertCircle, CheckCircle, CreditCard, Loader2 } from "lucide-react"
import Link from "next/link"

interface SavedCard {
  id: string
  card_last4: string
  card_brand: string
  card_exp_month: string
  card_exp_year: string
  cardholder_name: string
  is_default: boolean
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [selectedCard, setSelectedCard] = useState<string>("")
  const [cancellingPayment, setCancellingPayment] = useState(false)
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  useEffect(() => {
    if (params.orderId) {
      fetchOrder(params.orderId as string)
    }
    fetchSavedCards()
  }, [params.orderId])

  const fetchSavedCards = async () => {
    try {
      const response = await fetch("/api/payment-methods", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setSavedCards(data)
        // Auto-select default card
        const defaultCard = data.find((card: SavedCard) => card.is_default)
        if (defaultCard) {
          setSelectedCard(defaultCard.id)
          handleCardSelect(defaultCard)
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des cartes:", error)
    }
  }

  const handleCardSelect = (card: SavedCard) => {
    setCardData({
      number: `•••• •••• •••• ${card.card_last4}`,
      expiry: `${card.card_exp_month}/${card.card_exp_year}`,
      cvc: "•••",
      name: card.cardholder_name,
    })
  }

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
        // Si un mode de paiement est déjà défini, l'utiliser
        if (data.payment_method && data.payment_method !== "pending") {
          setPaymentMethod(data.payment_method)
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la commande:", error)
    }
  }

  const handlePayment = async () => {
    if (!order) return

    setLoading(true)
    setError("")

    try {
      // Step 1: Create payment intent
      const intentResponse = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: order.total_amount,
          order_id: order.id,
        }),
      })

      if (!intentResponse.ok) {
        const errorData = await intentResponse.json()
        throw new Error(errorData.error || "Erreur lors de la création du paiement")
      }

      const paymentIntent = await intentResponse.json()

      // Step 2: Confirm payment
      const confirmResponse = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          payment_intent_id: paymentIntent.id,
          payment_method_id: "pm_card_visa", // Mock payment method
          payment_type: paymentMethod === "paypal" ? "paypal" : "card",
          amount: order.total_amount,
          order_id: order.id,
        }),
      })

      if (!confirmResponse.ok) {
        const errorData = await confirmResponse.json()
        throw new Error(errorData.error || "Erreur lors de la confirmation du paiement")
      }

      const result = await confirmResponse.json()

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/orders/${order.id}?success=true`)
        }, 2000)
      } else {
        setError(result.error || "Paiement refusé. Veuillez vérifier vos informations de paiement.")
      }
    } catch (error) {
      console.error("Payment error:", error)
      setError(error instanceof Error ? error.message : "Erreur lors du traitement du paiement. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const handleCardInputChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancelPayment = async () => {
    if (!order) return
    
    const confirmed = confirm(
      "Voulez-vous annuler ce paiement ? Les produits seront remis dans votre panier."
    )
    
    if (!confirmed) return
    
    setCancellingPayment(true)
    
    try {
      const response = await fetch(`/api/orders/${order.id}/cancel-payment`, {
        method: "POST",
        credentials: "include",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de l'annulation")
      }
      
      router.push("/cart?restored=true")
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error)
      alert(error instanceof Error ? error.message : "Erreur lors de l'annulation")
    } finally {
      setCancellingPayment(false)
    }
  }

  const isFormValid = () => {
    if (paymentMethod === "credit_card") {
      return (
        cardData.number.length >= 16 &&
        cardData.expiry.length >= 5 &&
        cardData.cvc.length >= 3 &&
        cardData.name.length > 0
      )
    }
    return true // PayPal doesn't need form validation
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de votre commande...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h2 className="text-2xl font-bold text-green-800">Paiement réussi !</h2>
              <p className="text-green-700">
                Votre paiement a été traité avec succès. Vous allez être redirigé vers votre commande...
              </p>
              <div className="pt-4">
                <Link href={`/orders/${order.id}`}>
                  <Button className="w-full">Voir ma commande</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Paiement</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Mode de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit_card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Carte bancaire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {paymentMethod === "credit_card" && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations de carte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedCards.length > 0 && (
                    <div>
                      <Label htmlFor="saved-card">Cartes enregistrées</Label>
                      <select
                        id="saved-card"
                        value={selectedCard}
                        onChange={(e) => {
                          const cardId = e.target.value
                          setSelectedCard(cardId)
                          if (cardId === "new") {
                            setCardData({ number: "", expiry: "", cvc: "", name: "" })
                          } else {
                            const card = savedCards.find((c) => c.id === cardId)
                            if (card) handleCardSelect(card)
                          }
                        }}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="new">Nouvelle carte</option>
                        {savedCards.map((card) => (
                          <option key={card.id} value={card.id}>
                            {card.card_brand} •••• {card.card_last4} - {card.cardholder_name}
                            {card.is_default ? " (Par défaut)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="card-number">Numéro de carte</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => handleCardInputChange("number", e.target.value)}
                      maxLength={19}
                      disabled={selectedCard !== "" && selectedCard !== "new"}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Date d'expiration</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => handleCardInputChange("expiry", e.target.value)}
                        maxLength={5}
                        disabled={selectedCard !== "" && selectedCard !== "new"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cardData.cvc}
                        onChange={(e) => handleCardInputChange("cvc", e.target.value)}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="card-name">Nom sur la carte</Label>
                    <Input
                      id="card-name"
                      placeholder="Jean Dupont"
                      value={cardData.name}
                      onChange={(e) => handleCardInputChange("name", e.target.value)}
                      disabled={selectedCard !== "" && selectedCard !== "new"}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentMethod === "paypal" && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800">Vous serez redirigé vers PayPal pour finaliser votre paiement.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button onClick={handlePayment} disabled={loading || !isFormValid()} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                `Payer ${order.total_amount.toFixed(2)} €`
              )}
            </Button>

            <Button
              onClick={handleCancelPayment}
              disabled={cancellingPayment}
              variant="outline"
              className="w-full"
            >
              {cancellingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Annulation...
                </>
              ) : (
                "Annuler et remettre dans le panier"
              )}
            </Button>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product_image || "/placeholder.svg"}
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">{item.total_price.toFixed(2)} €</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{order.total_amount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>Gratuite</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{order.total_amount.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={`/orders/${order.id}`}>Retour à la commande</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
