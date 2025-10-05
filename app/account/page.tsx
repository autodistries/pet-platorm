"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AccountUser {
  id: string
  name: string
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    postal_code: string
    country: string
  }
}

export default function AccountPage() {
  const [user, setUser] = useState<AccountUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSaving(false)
    alert("Informations mises à jour avec succès !")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon compte</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            {/* User icon and label */}
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            {/* Package icon and label */}
            <span>Commandes</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center space-x-2">
            {/* CreditCard icon and label */}
            <span>Paiement</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            {/* Settings icon and label */}
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={user.name}
                      onChange={(e) => setUser((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={user.phone || ""}
                    onChange={(e) => setUser((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={user.address?.street || ""}
                    onChange={(e) =>
                      setUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              address: {
                                ...(prev.address || { city: "", postal_code: "", country: "France" }),
                                street: e.target.value,
                              },
                            }
                          : null,
                      )
                    }
                    placeholder="123 Rue de la Paix"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={user.address?.city || ""}
                      onChange={(e) =>
                        setUser((prev) =>
                          prev
                            ? {
                                ...prev,
                                address: {
                                  ...(prev.address || { street: "", postal_code: "", country: "France" }),
                                  city: e.target.value,
                                },
                              }
                            : null,
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal">Code postal</Label>
                    <Input
                      id="postal"
                      value={user.address?.postal_code || ""}
                      onChange={(e) =>
                        setUser((prev) =>
                          prev
                            ? {
                                ...prev,
                                address: {
                                  ...(prev.address || { street: "", city: "", country: "France" }),
                                  postal_code: e.target.value,
                                },
                              }
                            : null,
                        )
                      }
                    />
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Mes commandes récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Vous pouvez consulter toutes vos commandes dans la section{" "}
                <a href="/orders" className="text-primary hover:underline">
                  Mes commandes
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Moyens de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gérez vos cartes bancaires et moyens de paiement enregistrés.
              </p>
              <Button variant="outline">Ajouter une carte</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Notifications</h4>
                <p className="text-sm text-muted-foreground">Gérez vos préférences de notification par email.</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Confidentialité</h4>
                <p className="text-sm text-muted-foreground">
                  Contrôlez la visibilité de vos informations personnelles.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Supprimer le compte</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Cette action est irréversible et supprimera définitivement votre compte.
                </p>
                <Button variant="destructive" size="sm">
                  Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
