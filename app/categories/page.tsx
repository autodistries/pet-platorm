import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const categories = [
  {
    id: "colliers",
    name: "Colliers & Laisses",
    description: "Colliers élégants et laisses résistantes pour tous types de chiens",
    image: "/premium-leather-dog-collar.jpg",
    productCount: 45,
  },
  {
    id: "jouets",
    name: "Jouets",
    description: "Jouets interactifs et éducatifs pour chiens et chats",
    image: "/interactive-cat-toy.png",
    productCount: 67,
  },
  {
    id: "couchage",
    name: "Couchage",
    description: "Lits confortables et coussins orthopédiques",
    image: "/orthopedic-dog-bed.png",
    productCount: 32,
  },
  {
    id: "alimentation",
    name: "Alimentation",
    description: "Gamelles, distributeurs et accessoires de repas",
    image: "/slow-feeder-dog-bowl.jpg",
    productCount: 28,
  },
  {
    id: "hygiene",
    name: "Hygiène & Soins",
    description: "Produits de toilettage et accessoires de soins",
    image: "/pet-grooming-supplies.jpg",
    productCount: 41,
  },
  {
    id: "transport",
    name: "Transport",
    description: "Sacs de transport, cages et accessoires de voyage",
    image: "/pet-carrier-bag.jpg",
    productCount: 23,
  },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos Catégories</h1>
          <p className="text-xl text-muted-foreground">
            Découvrez notre large gamme d'accessoires pour vos animaux de compagnie
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {category.name}
                    <span className="text-sm font-normal text-muted-foreground">{category.productCount} produits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-muted rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
            <p className="text-muted-foreground mb-6">
              Notre équipe est là pour vous aider à trouver l'accessoire parfait pour votre animal.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>
    )
  }
