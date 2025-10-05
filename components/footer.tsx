import Link from "next/link"
import { Heart, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PetCare</span>
            </Link>
            <p className="text-sm text-muted-foreground text-pretty">
              Votre partenaire de confiance pour le bonheur et le bien-être de vos compagnons à quatre pattes.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liens Rapides</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                Tous les Produits
              </Link>
              <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                Catégories
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                À Propos
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Service Client</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <span className="text-muted-foreground">Centre d'Aide - Bientôt disponible</span>
              <span className="text-muted-foreground">Livraison Gratuite</span>
              <span className="text-muted-foreground">Retours sous 30 jours</span>
              <span className="text-muted-foreground">Garantie 2 ans</span>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Newsletter</h3>
            <p className="text-sm text-muted-foreground">Recevez nos dernières offres et conseils pour vos animaux.</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Votre email" className="flex-1" />
              <Button size="sm">S'abonner</Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 PetCare. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
