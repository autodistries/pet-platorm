# Test du Système de Panier Multi-utilisateurs

## Changements Implémentés

### 1. Base de Données
- ✅ Table `cart_items` créée avec :
  - `customer_id` (UUID) - Référence au client
  - `product_id` (UUID) - Référence au produit
  - `quantity` (INTEGER) - Quantité du produit
  - Contrainte UNIQUE sur (customer_id, product_id)

### 2. API Routes
- ✅ GET `/api/cart` - Récupère le panier de l'utilisateur connecté
- ✅ POST `/api/cart` - Ajoute un produit au panier
- ✅ PUT `/api/cart` - Met à jour la quantité d'un produit
- ✅ DELETE `/api/cart` - Vide le panier complet
- ✅ DELETE `/api/cart/[productId]` - Supprime un produit spécifique

### 3. Context Refactoring
- ✅ `CartContext` utilise maintenant l'API au lieu de localStorage
- ✅ Toutes les opérations sont asynchrones
- ✅ Le panier se charge automatiquement à la connexion
- ✅ Le panier se vide automatiquement à la déconnexion
- ✅ Validation du stock côté serveur

### 4. Composants UI
- ✅ `cart-sheet.tsx` - Mis à jour pour utiliser item.product_id
- ✅ `add-to-cart-button.tsx` - Ajout de await pour addItem
- ✅ `app/cart/page.tsx` - Utilise les champs directs (item.name, item.price)
- ✅ `app/checkout/page.tsx` - Utilise item.product_id pour créer les commandes
- ✅ `app/products/[id]/page.tsx` - Correction des balises fermantes

## Plan de Test

### Test 1 : Isolation des Paniers
1. Se connecter avec marie@example.com (password: password123)
2. Ajouter 2-3 produits au panier
3. Vérifier que le panier affiche correctement les produits
4. Se déconnecter
5. Se connecter avec pierre@example.com (password: password123)
6. Vérifier que le panier est vide
7. Ajouter différents produits
8. Se déconnecter et reconnecter avec marie@example.com
9. Vérifier que le panier de Marie est toujours intact

### Test 2 : Persistance du Panier
1. Se connecter avec un utilisateur
2. Ajouter des produits au panier
3. Fermer complètement le navigateur
4. Rouvrir et se reconnecter
5. Vérifier que le panier contient toujours les produits

### Test 3 : Validation du Stock
1. Se connecter
2. Trouver un produit avec un stock limité (< 10)
3. Essayer d'ajouter plus que le stock disponible
4. Vérifier qu'une erreur/alerte s'affiche
5. Vérifier que la quantité est limitée au stock

### Test 4 : Synchronisation en Temps Réel
1. Ouvrir deux navigateurs/onglets différents
2. Se connecter avec le même utilisateur sur les deux
3. Ajouter un produit dans le premier onglet
4. Actualiser le second onglet
5. Vérifier que le panier est synchronisé

### Test 5 : Opérations de Panier
1. Se connecter
2. Ajouter un produit (quantité 1)
3. Augmenter la quantité à 3
4. Diminuer la quantité à 2
5. Supprimer le produit
6. Ajouter plusieurs produits
7. Vider le panier complet
8. Vérifier que toutes les opérations fonctionnent

### Test 6 : Checkout
1. Se connecter
2. Ajouter plusieurs produits au panier
3. Aller à la page de checkout
4. Vérifier que les produits s'affichent correctement
5. Remplir les informations de livraison
6. Créer une commande
7. Vérifier que le panier se vide après la commande

## Vérifications Base de Données

```sql
-- Voir tous les paniers
SELECT 
  c.name as customer_name,
  p.name as product_name,
  ci.quantity,
  (ci.quantity * p.price) as subtotal
FROM cart_items ci
JOIN customers c ON ci.customer_id = c.id
JOIN products p ON ci.product_id = p.id
ORDER BY c.name, p.name;

-- Compter les articles par utilisateur
SELECT 
  c.name,
  COUNT(ci.id) as items_count,
  SUM(ci.quantity) as total_quantity,
  SUM(ci.quantity * p.price) as total_amount
FROM customers c
LEFT JOIN cart_items ci ON c.customer_id = ci.customer_id
LEFT JOIN products p ON ci.product_id = p.id
GROUP BY c.id, c.name
ORDER BY c.name;
```

## Résultats Attendus

- ✅ Chaque utilisateur a son propre panier indépendant
- ✅ Le panier persiste entre les sessions
- ✅ Le stock est validé à chaque opération
- ✅ Les paniers ne se mélangent jamais entre utilisateurs
- ✅ Le panier se vide à la déconnexion (côté client)
- ✅ Le panier se recharge à la connexion
- ✅ Toutes les opérations CRUD fonctionnent correctement

## Notes Techniques

### Structure CartItem (nouvelle version)
```typescript
interface CartItem {
  id: string
  product_id: string
  quantity: number
  name: string
  description: string
  price: number
  image_url: string | null
  stock_quantity: number
  category: string | null
}
```

### Ancienne Structure (localStorage)
```typescript
interface CartItem {
  id: string
  product: Product  // Objet complet
  quantity: number
  added_at: string
}
```

### Changements Clés
- `item.product.id` → `item.product_id`
- `item.product.name` → `item.name`
- `item.product.price` → `item.price`
- `item.product.image_url` → `item.image_url`
- `item.product.stock_quantity` → `item.stock_quantity`
