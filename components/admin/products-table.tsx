"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Package } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  status: string
  created_at: string
}

interface ProductsTableProps {
  products: Product[]
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  out_of_stock: "bg-red-100 text-red-800",
}

const statusLabels = {
  active: "Actif",
  inactive: "Inactif",
  out_of_stock: "Rupture de stock",
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const [stockDialogOpen, setStockDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newStock, setNewStock] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [localProducts, setLocalProducts] = useState(products)

  const handleStockClick = (product: Product) => {
    setSelectedProduct(product)
    setNewStock(product.stock.toString())
    setStockDialogOpen(true)
  }

  const handleUpdateStock = async () => {
    if (!selectedProduct) return

    const stockValue = parseInt(newStock)
    if (isNaN(stockValue) || stockValue < 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une quantité valide",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/admin/products/${selectedProduct.id}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock_quantity: stockValue }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour")
      }

      // Mettre à jour localement
      setLocalProducts(prev =>
        prev.map(p =>
          p.id === selectedProduct.id ? { ...p, stock: stockValue } : p
        )
      )

      toast({
        title: "Stock mis à jour",
        description: `Le stock de "${selectedProduct.name}" a été mis à jour à ${stockValue} unités`,
      })

      setStockDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le stock",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des produits</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price.toFixed(2)} €</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className={`h-4 w-4 ${product.stock <= 5 ? "text-red-600" : "text-muted-foreground"}`} />
                      <span className={product.stock <= 5 ? "text-red-600 font-medium" : ""}>
                        {product.stock}
                      </span>
                      {product.stock <= 5 && (
                        <Badge variant="destructive" className="ml-2">
                          Stock bas
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[product.status as keyof typeof statusColors]}>
                      {statusLabels[product.status as keyof typeof statusLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStockClick(product)}
                      >
                        Réapprovisionner
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réapprovisionner le stock</DialogTitle>
            <DialogDescription>
              {selectedProduct && `Produit: ${selectedProduct.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-stock">Stock actuel</Label>
              <Input
                id="current-stock"
                value={selectedProduct?.stock || 0}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-stock">Nouveau stock</Label>
              <Input
                id="new-stock"
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                placeholder="Entrez la nouvelle quantité"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStockDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateStock} disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
