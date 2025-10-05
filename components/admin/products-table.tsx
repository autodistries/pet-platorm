import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  return (
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
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price.toFixed(2)} €</TableCell>
                <TableCell>
                  <span className={product.stock <= 5 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[product.status as keyof typeof statusColors]}>
                    {statusLabels[product.status as keyof typeof statusLabels]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm">
                      Stock
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
