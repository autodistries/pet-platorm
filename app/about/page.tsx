import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Truck, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">À propos de PetCare</h1>
            <p className="text-xl text-muted-foreground">
              Votre partenaire de confiance pour le bien-être de vos animaux de compagnie
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
              <p className="text-muted-foreground mb-4">
                Chez PetCare, nous croyons que chaque animal mérite le meilleur. Notre mission est de fournir des
                accessoires de qualité supérieure qui améliorent la vie de vos compagnons à quatre pattes tout en
                renforçant le lien unique que vous partagez avec eux.
              </p>
              <p className="text-muted-foreground">
                Depuis notre création, nous nous engageons à sélectionner uniquement les produits les plus sûrs,
                durables et innovants pour répondre aux besoins spécifiques de chaque animal.
              </p>
            </div>
            <div>
              <img
                src="/cat_page-0001.jpg"
                alt="Chat adorable avec accessoires"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <Heart className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Passion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Notre amour pour les animaux guide chacune de nos décisions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Qualité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Produits testés et approuvés par des vétérinaires
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Truck className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Livraison rapide et gratuite partout en France
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Award className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Plus de 10 000 clients satisfaits nous font confiance
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Notre Engagement</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nous nous engageons à offrir une expérience d'achat exceptionnelle, des produits de qualité supérieure et
              un service client irréprochable. Votre satisfaction et le bien-être de votre animal sont notre priorité
              absolue.
            </p>
          </div>
        </div>
      </div>
  )
}
