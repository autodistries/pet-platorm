"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { AdminProduct as Product } from "@/lib/admin"

const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  category_id: z.string().min(1, "La catégorie est requise"),
  price: z.number().min(0, "Le prix doit être positif"),
  stock_quantity: z.number().min(0, "Le stock doit être positif"),
  image_url: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormDialogProps {
  product?: Product | null
  onSuccess: () => void
  trigger?: React.ReactNode
}

export function ProductFormDialog({ product, onSuccess, trigger }: ProductFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | undefined>(product?.image_url)
  const { toast } = useToast()

  const isEditing = !!product

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      category_id: product?.category_id || "",
      price: product?.price || 0,
      stock_quantity: product?.stock_quantity || 0,
      image_url: product?.image_url || "",
    },
  })

  useEffect(() => {
    if (open) {
      fetchCategories()
      if (isEditing && product) {
        fetchProductDetails()
      }
    }
  }, [open])

  const fetchProductDetails = async () => {
    if (!product?.id) return
    try {
      const response = await fetch(`/api/admin/products/${product.id}`)
      if (response.ok) {
        const fullProduct = await response.json()
        form.reset({
          name: fullProduct.name || "",
          description: fullProduct.description || "",
          category_id: fullProduct.category_id || "",
          price: fullProduct.price || 0,
          stock_quantity: fullProduct.stock_quantity || 0,
          image_url: fullProduct.image_url || "",
        })
        setOriginalImageUrl(fullProduct.image_url)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des détails du produit:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        form.setValue("image_url", url)
        toast({
          title: "Image téléchargée",
          description: "L'image a été téléchargée avec succès",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de l'image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      const method = isEditing ? "PATCH" : "POST"
      const url = isEditing ? `/api/admin/products/${product.id}` : "/api/admin/products"

      // If editing and no new image was uploaded, keep the original
      const imageUrl = data.image_url || (isEditing ? originalImageUrl : "/placeholder.svg")

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          category_id: data.category_id,
          price: data.price,
          stock_quantity: data.stock_quantity,
          image_url: imageUrl,
          is_active: true,
        }),
      })

      if (response.ok) {
        toast({
          title: isEditing ? "Produit modifié" : "Produit ajouté",
          description: isEditing ? "Le produit a été modifié avec succès" : "Le produit a été ajouté avec succès",
        })
        form.reset()
        setOpen(false)
        onSuccess()
      } else {
        throw new Error("Erreur lors de l'opération")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de ${isEditing ? "la modification" : "l'ajout"} du produit`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!isEditing) return


    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Produit supprimé",
          description: "Le produit a été supprimé avec succès",
        })
        setOpen(false)
        onSuccess()
      } else {
        throw new Error("Erreur lors de la suppression")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du produit",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier le produit" : "Ajouter un nouveau produit"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du produit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Description du produit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Prix"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Quantité en stock"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image {!isEditing && "(optionnel)"}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </FormControl>
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Preview"
                      className="mt-2 h-20 w-20 object-cover rounded"
                    />
                  )}
                  {!field.value && isEditing && originalImageUrl && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Image actuelle:</p>
                      <img
                        src={originalImageUrl}
                        alt="Current"
                        className="h-20 w-20 object-cover rounded"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-between pt-4">
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleting ? "Suppression..." : "Supprimer"}
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false)
                    form.reset()
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {isEditing ? "Enregistrer" : "Ajouter le produit"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
