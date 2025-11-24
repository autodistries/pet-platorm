"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/orders"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Chargement de vos commandes...</div>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h2 className="text-xl font-semibold mb-4">Aucune commande trouvée</h2>
          <p className="text-muted-foreground mb-6">Vous n'avez pas encore passé de commande.</p>
          <Button asChild>
            <Link href="/products">Découvrir nos produits</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Commande #{order.id}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Passée le {new Date(order.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Adresse de livraison</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_address.street}
                    <br />
                    {order.shipping_address.postal_code} {order.shipping_address.city}
                    <br />
                    {order.shipping_address.country}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Articles ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.product_image || "/placeholder.svg"}
                          alt={item.product_name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">{item.total_price.toFixed(2)} €</p>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-muted-foreground">+{order.items.length - 2} autre(s) article(s)</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-lg font-bold">Total: {order.total_amount.toFixed(2)} €</p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/orders/${order.id}`}>Voir les détails</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<AccountUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

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

    try {
      const response = await fetch("/api/auth/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: user?.name,
          phone: user?.phone,
          address: user?.address,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        alert("Informations mises à jour avec succès !")
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Erreur lors de la mise à jour. Veuillez réessayer.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch("/api/auth/delete", {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        alert("Votre compte a été supprimé avec succès.")
        router.push("/")
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Erreur lors de la suppression du compte")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Erreur lors de la suppression. Veuillez réessayer.")
    } finally {
      setIsDeleting(false)
    }
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
          <OrdersTab />
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteConfirmation("")}>
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Votre compte et toutes vos données seront définitivement
                        supprimés de nos serveurs.
                        <div className="mt-4">
                          <Label htmlFor="confirm-delete" className="text-sm font-medium">
                            Tapez <span className="font-bold text-destructive">supprimer</span> pour confirmer :
                          </Label>
                          <Input
                            id="confirm-delete"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="supprimer"
                            className="mt-2"
                          />
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={deleteConfirmation !== "supprimer" || isDeleting}
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Suppression..." : "Supprimer définitivement"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
