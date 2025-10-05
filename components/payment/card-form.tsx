"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateCardNumber, getCardBrand } from "@/lib/payments"
import { CreditCard, Lock } from "lucide-react"

interface CardFormProps {
  onSubmit: (cardData: CardData) => void
  loading: boolean
}

export interface CardData {
  number: string
  expiry: string
  cvc: string
  name: string
}

export default function CardForm({ onSubmit, loading }: CardFormProps) {
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })
  const [errors, setErrors] = useState<Partial<CardData>>({})

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "")
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ")
    return formatted.slice(0, 19) // Max 16 digits + 3 spaces
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
    }
    return digits
  }

  const handleInputChange = (field: keyof CardData, value: string) => {
    let formattedValue = value

    if (field === "number") {
      formattedValue = formatCardNumber(value)
    } else if (field === "expiry") {
      formattedValue = formatExpiry(value)
    } else if (field === "cvc") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setCardData((prev) => ({ ...prev, [field]: formattedValue }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CardData> = {}

    if (!cardData.name.trim()) {
      newErrors.name = "Le nom est requis"
    }

    const cardNumber = cardData.number.replace(/\s/g, "")
    if (!cardNumber) {
      newErrors.number = "Le numéro de carte est requis"
    } else if (!validateCardNumber(cardNumber)) {
      newErrors.number = "Numéro de carte invalide"
    }

    if (!cardData.expiry) {
      newErrors.expiry = "La date d'expiration est requise"
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = "Format invalide (MM/AA)"
    } else {
      const [month, year] = cardData.expiry.split("/").map(Number)
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1

      if (month < 1 || month > 12) {
        newErrors.expiry = "Mois invalide"
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiry = "Carte expirée"
      }
    }

    if (!cardData.cvc) {
      newErrors.cvc = "Le CVC est requis"
    } else if (cardData.cvc.length < 3) {
      newErrors.cvc = "CVC invalide"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(cardData)
    }
  }

  const cardBrand = getCardBrand(cardData.number)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Informations de carte</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="card-name">Nom sur la carte</Label>
            <Input
              id="card-name"
              value={cardData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Jean Dupont"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="card-number">Numéro de carte</Label>
            <div className="relative">
              <Input
                id="card-number"
                value={cardData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                placeholder="1234 5678 9012 3456"
                className={errors.number ? "border-red-500" : ""}
              />
              {cardBrand !== "unknown" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs font-medium uppercase text-muted-foreground">{cardBrand}</span>
                </div>
              )}
            </div>
            {errors.number && <p className="text-sm text-red-500 mt-1">{errors.number}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="card-expiry">Expiration</Label>
              <Input
                id="card-expiry"
                value={cardData.expiry}
                onChange={(e) => handleInputChange("expiry", e.target.value)}
                placeholder="MM/AA"
                className={errors.expiry ? "border-red-500" : ""}
              />
              {errors.expiry && <p className="text-sm text-red-500 mt-1">{errors.expiry}</p>}
            </div>
            <div>
              <Label htmlFor="card-cvc">CVC</Label>
              <Input
                id="card-cvc"
                value={cardData.cvc}
                onChange={(e) => handleInputChange("cvc", e.target.value)}
                placeholder="123"
                className={errors.cvc ? "border-red-500" : ""}
              />
              {errors.cvc && <p className="text-sm text-red-500 mt-1">{errors.cvc}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Vos informations sont sécurisées et cryptées</span>
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "Traitement en cours..." : "Confirmer le paiement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
