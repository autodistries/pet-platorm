# UI Wireframes — Online Pet Accessories

> Wireframes textuels (ASCII) pour visualiser rapidement les pages principales.

---

## 🧭 Sitemap (aperçu)

```mermaid
flowchart LR
  Home --> Catalog
  Catalog --> Product
  Product --> Cart
  Cart --> Checkout
  Checkout --> Confirmation
  Home --> Login
  Login --> Profile
  Profile --> Orders
  Home --> Support
  Home --> Admin
```

---

## 🏠 1) Home (Accueil)

```
┌──────────────────────────────────────────────────────────────────┐
│ LOGO            [Search ⎇_____________________]   (♥) (🛒 2) (👤) │
├──────────────────────────────────────────────────────────────────┤
│ [Hero Banner: "Tout pour vos animaux"]                           │
│ [CTA: Découvrir ➜ Catalog]                                       │
├──────────────┬──────────────┬──────────────┬──────────────┬──────┤
│ Cat. Chiens  │ Cat. Chats   │ Petits Nacs  │ Promotions    │ FAQ  │
├──────────────┴──────────────┴──────────────┴──────────────┴──────┤
│ ⭐ Meilleures ventes                                              │
│ [Card] Img  Titre     ★★★★☆  19,90€   [Ajouter]                  │
│ [Card] Img  Titre     ★★★★☆  12,50€   [Ajouter]                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ 2) Catalog (Liste produits)

```
┌──────────────────────────────────────────────────────────────────┐
│ LOGO  [Search] (♥) (🛒) (👤)                                      │
├──────────────────────────────────────────────────────────────────┤
│ Filtres: Catégorie ▾  Prix ▾  Marque ▾  Tri: Populaires ▾        │
├──────────────┬──────────────┬──────────────┬──────────────┬──────┤
│ [Card] IMG   │ [Card] IMG   │ [Card] IMG   │ [Card] IMG   │ ...  │
│  Nom         │  Nom         │  Nom         │  Nom         │      │
│  ★★★★☆ 19€   │  ★★★☆☆ 12€   │  ★★★★★ 29€   │  ★★★★☆ 9€    │      │
│  [Ajouter]   │  [Ajouter]   │  [Ajouter]   │  [Ajouter]   │      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📦 3) Product (Détail produit)

```
┌──────────────────────────────────────────────────────────────────┐
│ LOGO  [Search] (♥) (🛒) (👤)                                      │
├──────────────────────────────────────────────────────────────────┤
│ [IMG grande]     Titre du produit                                │
│                   ★★★★☆ (128 avis)   19,90€                      │
│                   Couleur ▾  Taille ▾  Qté [-] 1 [+]             │
│                   [Ajouter au panier]  [♥ Favori]                │
│                                                                  │
│ ─ Description ────────────────────────────────────────────────── │
│  Matières, dimensions, entretien…                                 │
│ ─ Spécifications ─────────────────────────────────────────────── │
│  SKU #DOG-123   Stock: ✔ En stock                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛒 4) Cart (Panier)

```
┌──────────────────────────────────────────────────────────────────┐
│ PANIER (2 articles)                                              │
├──────────────────────────────────────────────────────────────────┤
│ [IMG] Titre x Qty  Prix    [−] 1 [+]  [Supprimer]                │
│ [IMG] Titre x Qty  Prix    [−] 1 [+]  [Supprimer]                │
├──────────────────────────────────────────────────────────────────┤
│ Code promo ⎇__________ [Appliquer]                               │
│ Sous-total: 32,40€   Livraison: 4,90€   Total: 37,30€            │
│ [Continuer mes achats]                [Passer au paiement ➜]     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 💳 5) Checkout (Adresse + Paiement)

```
┌──────────────────────────────────────────────────────────────────┐
│ Étapes: 1) Adresse  2) Livraison  3) Paiement  4) Revue           │
├──────────────────────────────────────────────────────────────────┤
│ Adresse de livraison                                             │
│  Nom, Rue, CP, Ville, Pays, Tel                                  │
│ Méthode: (•) Standard 4,90€   ( ) Express 9,90€                  │
├──────────────────────────────────────────────────────────────────┤
│ Paiement                                                         │
│  (•) Carte ▢▢▢▢ ▢▢▢▢ ▢▢▢▢ ▢▢▢▢  MM/AA  CVC                        │
│  ( ) PayPal  ( ) Apple/Google Pay                                │
├──────────────────────────────────────────────────────────────────┤
│ Récapitulatif                                                    │
│  Articles (2)  32,40€   Livraison 4,90€   Total 37,30€           │
│ [Payer maintenant]                                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## ✅ 6) Order Confirmation

```
┌──────────────────────────────────────────────────────────────────┐
│ 🎉 Merci ! Commande #ORD-2025-001 confirmée                      │
├──────────────────────────────────────────────────────────────────┤
│ Récap: Produits, adresse, paiement.                              │
│ Suivi: N° de suivi XYZ…  [Voir ma commande]  [Continuer achats]  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔐 7) Login / Register

```
┌───────────┬──────────────────────────────────────────────────────┐
│ Connexion │  Email ▢▢▢▢▢▢                                       │
│           │  Mot de passe ▢▢▢▢▢▢  [Afficher]                     │
│           │  [Se connecter]   [Mot de passe oublié ?]            │
├───────────┼──────────────────────────────────────────────────────┤
│ Inscription                                                       │
│  Nom ▢▢▢▢  Email ▢▢▢▢  MDP ▢▢▢▢  Conf. ▢▢▢▢  [Créer un compte]   │
└───────────┴──────────────────────────────────────────────────────┘
```

---

## 👤 8) Profile & Orders

```
┌──────────────────────────────────────────────────────────────────┐
│ Mon compte  |  Profil  |  Adresses  |  Paiements  |  Commandes   │
├──────────────────────────────────────────────────────────────────┤
│ Profil: Nom, Email (vérifié ✔), Newsletter [✓]                   │
│ Adresses: [Ajouter] [Modifier]                                   │
│ Paiements: Carte se terminant par •••• 4242  [Supprimer]         │
│ Commandes récentes:                                              │
│  #ORD-2025-001  Livré  Total 37,30€  [Détails] [Facture PDF]     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎧 9) Support (Tickets)

```
┌──────────────────────────────────────────────────────────────────┐
│ Centre d'aide                                                    │
├──────────────────────────────────────────────────────────────────┤
│ Rechercher un sujet…                                             │
│ [Nouveau ticket]  Sujet ▢▢▢▢  Cmd #▢▢▢  Message ▢▢▢  [Envoyer]   │
│ Mes tickets:  #TIC-101  Ouvert   #TIC-099  Résolu [Voir]         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 10) Admin (vue simplifiée)

```
┌──────────────────────────────────────────────────────────────────┐
│ Admin Dashboard                                                  │
├──────────────────────────────────────────────────────────────────┤
│ Stats (jour): CA, Commandes, Taux conv., Ruptures                │
│ Produits  [Lister] [Ajouter] [Importer CSV]                      │
│ Commandes [En cours] [Expédier] [Rembourser]                     │
│ Stock     [Seuils bas] [Ajuster]                                 │
│ Support   [Tickets ouverts]                                      │
└──────────────────────────────────────────────────────────────────┘
```

---
