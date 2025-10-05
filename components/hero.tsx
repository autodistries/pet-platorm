import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      <div className="container mx-auto px-4 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Accessoires
                <span className="block text-primary">Premium</span>
                pour vos Compagnons
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-md">
                Découvrez notre collection soigneusement sélectionnée d'accessoires haut de gamme pour le bonheur et le
                confort de vos animaux de compagnie.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/products">Découvrir la Collection</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base bg-transparent">
                <Link href="/categories">Parcourir par Catégorie</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Produits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Clients Satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground">Note Moyenne</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/20 p-8">
              <img
                src="/happy-dog-with-premium-accessories-collar-and-toys.jpg"
                alt="Chien heureux avec accessoires premium"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-card rounded-2xl p-4 shadow-lg border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Livraison Gratuite</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-lg border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">Qualité Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
