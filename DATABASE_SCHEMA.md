# 🗄️ Architecture de la Base de Données

## 📊 Diagramme des Relations

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SCHÉMA DE LA BASE DE DONNÉES                     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│    CUSTOMERS     │ ◄─────┐
├──────────────────┤       │
│ id (PK)          │       │
│ name             │       │ 
│ email (UNIQUE)   │       │
│ password_hash    │       │
│ phone            │       │
│ role             │◄─── Nouveau! (customer/admin)
│ created_at       │       │
│ updated_at       │       │
└────────┬─────────┘       │
         │                 │
         │                 │
         ├─────────────────┼──────┐
         │                 │      │
         ▼                 ▼      ▼
┌──────────────────┐  ┌─────────────┐  ┌──────────────┐
│CUSTOMER_ADDRESSES│  │    CARTS    │  │   ORDERS     │
├──────────────────┤  ├─────────────┤  ├──────────────┤
│ id (PK)          │  │ id (PK)     │  │ id (PK)      │
│ customer_id (FK) │  │ customer_id │  │ customer_id  │
│ type             │  │ created_at  │  │ total_amount │
│ street_address   │  │ updated_at  │  │ status       │
│ city             │  └──────┬──────┘  │ shipping_id  │
│ postal_code      │         │         │ billing_id   │
│ country          │         │         │ created_at   │
│ is_default       │         ▼         └──────┬───────┘
└──────────────────┘  ┌─────────────┐         │
                      │ CART_ITEMS  │         │
                      ├─────────────┤         │
                      │ id (PK)     │         ▼
                      │ cart_id (FK)│  ┌──────────────┐
                      │ product_id  │  │ ORDER_ITEMS  │
                      │ quantity    │  ├──────────────┤
                      └──────┬──────┘  │ id (PK)      │
                             │         │ order_id (FK)│
                             │         │ product_id   │
                             │         │ quantity     │
                             │         │ unit_price   │
                             │         │ total_price  │
                             │         └──────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
┌──────────────────┐                     ┌────────────────┐
│   CATEGORIES     │                     │   PRODUCTS     │
├──────────────────┤                     ├────────────────┤
│ id (PK)          │◄────────────────────│ id (PK)        │
│ name             │                     │ name           │
│ description      │                     │ description    │
│ parent_id        │                     │ price          │
│ created_at       │                     │ category_id(FK)│
└──────────────────┘                     │ stock_quantity │
                                         │ sku (UNIQUE)   │
                                         │ image_url      │
                                         │ is_active      │
                                         │ created_at     │
                                         └────────────────┘

┌──────────────────┐        ┌──────────────────┐
│    PAYMENTS      │        │    SHIPMENTS     │
├──────────────────┤        ├──────────────────┤
│ id (PK)          │        │ id (PK)          │
│ order_id (FK) ───┼────┐   │ order_id (FK) ───┼───┐
│ payment_method   │    │   │ tracking_number  │   │
│ status           │    │   │ carrier          │   │
│ amount           │    │   │ status           │   │
│ transaction_id   │    │   │ shipped_at       │   │
│ created_at       │    │   │ delivered_at     │   │
└──────────────────┘    │   └──────────────────┘   │
                        │                           │
                        └────────┬──────────────────┘
                                 │
                         ┌───────▼────────┐
                         │     ORDERS     │
                         └────────────────┘

┌──────────────────┐
│SUPPORT_TICKETS   │
├──────────────────┤
│ id (PK)          │
│ customer_id (FK) │◄───── Lien vers CUSTOMERS
│ subject          │
│ status           │
│ priority         │
│ created_at       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│SUPPORT_MESSAGES  │
├──────────────────┤
│ id (PK)          │
│ ticket_id (FK)   │
│ sender_type      │
│ message          │
│ created_at       │
└──────────────────┘
```

---

## 🔑 Relations principales

### 1️⃣ CUSTOMERS (Centre du système)
```
CUSTOMERS (1) ──── (N) CUSTOMER_ADDRESSES
          (1) ──── (N) CARTS
          (1) ──── (N) ORDERS
          (1) ──── (N) SUPPORT_TICKETS
```

### 2️⃣ PRODUCTS & CATEGORIES
```
CATEGORIES (1) ──── (N) PRODUCTS
           (1) ──── (N) CATEGORIES (sous-catégories)

PRODUCTS (1) ──── (N) CART_ITEMS
         (1) ──── (N) ORDER_ITEMS
```

### 3️⃣ SHOPPING FLOW
```
1. CARTS ──► CART_ITEMS ──► PRODUCTS
2. ORDERS ──► ORDER_ITEMS ──► PRODUCTS
3. ORDERS ──► PAYMENTS
4. ORDERS ──► SHIPMENTS
```

---

## 📋 Détails des tables

### 👤 CUSTOMERS (Utilisateurs)
**Rôle** : Gestion des comptes utilisateurs

| Champ | Type | Description |
|-------|------|-------------|
| `role` | VARCHAR(20) | **NOUVEAU** : 'customer' ou 'admin' |
| `email` | VARCHAR(255) | UNIQUE - Utilisé pour la connexion |
| `password_hash` | VARCHAR(255) | Hash bcrypt (jamais en clair!) |

**Indexes** :
- `idx_customers_email` (recherche rapide par email)
- `idx_customers_role` (filtrage admin/client)

---

### 🛒 CARTS & CART_ITEMS (Panier)
**Rôle** : Gestion du panier avant achat

**Logique** :
```
1 Customer → 1 Cart actif
1 Cart → Plusieurs Cart_Items
1 Cart_Item → 1 Product + Quantité
```

**Contrainte** :
- Un même produit ne peut apparaître qu'une fois par panier (UNIQUE)

---

### 📦 ORDERS & ORDER_ITEMS (Commandes)
**Rôle** : Commandes validées

**États possibles** (`status`) :
- `pending` → Créée mais pas payée
- `confirmed` → Paiement validé
- `processing` → En préparation
- `shipped` → Expédiée
- `delivered` → Livrée
- `cancelled` → Annulée

**Différence avec CART_ITEMS** :
- Les ORDER_ITEMS stockent le `unit_price` au moment de l'achat
- Permet de conserver l'historique même si le prix change

---

### 💳 PAYMENTS (Paiements)
**Rôle** : Suivi des transactions

**Méthodes** :
- `credit_card` → Carte bancaire
- `paypal` → PayPal
- `bank_transfer` → Virement

**États** :
- `pending` → En attente
- `completed` → Validé
- `failed` → Échoué
- `refunded` → Remboursé

---

### 📦 SHIPMENTS (Expéditions)
**Rôle** : Suivi des livraisons

**Workflow** :
```
preparing → shipped → in_transit → delivered
```

**Tracking** :
- `tracking_number` : Numéro de suivi
- `carrier` : Transporteur (ex: Colissimo, Chronopost)
- `shipped_at` : Date d'expédition
- `delivered_at` : Date de livraison

---

### 🏷️ CATEGORIES (Catégories)
**Rôle** : Organisation hiérarchique

**Exemple** :
```
Accessoires (parent_id = NULL)
├── Colliers (parent_id = Accessoires)
├── Laisses (parent_id = Accessoires)
└── Jouets (parent_id = Accessoires)
    ├── Balles (parent_id = Jouets)
    └── Cordes (parent_id = Jouets)
```

---

### 🎁 PRODUCTS (Produits)
**Rôle** : Catalogue

**Champs importants** :
- `sku` : Référence unique (Stock Keeping Unit)
- `stock_quantity` : Quantité en stock (≥ 0)
- `is_active` : Visible sur le site ou non
- `price` : DECIMAL(10,2) → Max 99 999 999.99 €

**Indexes** :
- `idx_products_category` (filtrage par catégorie)
- `idx_products_active` (produits visibles uniquement)

---

### 🎫 SUPPORT_TICKETS (Support)
**Rôle** : SAV et questions clients

**Priorités** :
- `low` → Basse
- `medium` → Moyenne (défaut)
- `high` → Haute
- `urgent` → Urgente

**États** :
- `open` → Nouveau
- `in_progress` → En cours de traitement
- `resolved` → Résolu
- `closed` → Fermé

---

## 🔒 Contraintes de sécurité

### CHECK Constraints
```sql
-- Pas de prix négatifs
CHECK (price >= 0)

-- Pas de stock négatif
CHECK (stock_quantity >= 0)

-- Rôles valides uniquement
CHECK (role IN ('customer', 'admin'))

-- États de commande valides
CHECK (status IN ('pending', 'confirmed', ...))
```

### Foreign Keys
Toutes les relations utilisent `ON DELETE CASCADE` :
```
Si un client est supprimé → Ses adresses, paniers, commandes sont supprimés
Si un panier est supprimé → Ses items sont supprimés
Si une commande est supprimée → Ses items, paiements, expéditions sont supprimés
```

---

## 💡 Exemples de requêtes utiles

### Voir tous les produits d'une catégorie
```sql
SELECT p.name, p.price, p.stock_quantity
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.name = 'Jouets' AND p.is_active = true;
```

### Commandes en attente d'un client
```sql
SELECT o.id, o.total_amount, o.status, o.created_at
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.email = 'marie.dubois@email.com'
  AND o.status = 'pending'
ORDER BY o.created_at DESC;
```

### Produits en rupture de stock
```sql
SELECT name, sku, stock_quantity
FROM products
WHERE stock_quantity = 0 AND is_active = true;
```

### Total des ventes par produit
```sql
SELECT 
  p.name,
  COUNT(oi.id) as total_ventes,
  SUM(oi.total_price) as revenu_total
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY revenu_total DESC;
```

---

## 📈 Optimisations appliquées

### Indexes stratégiques
- Emails (recherche de compte)
- Catégories de produits (filtrage)
- Statut des commandes (dashboard admin)
- Produits actifs (affichage catalogue)

### Timestamps automatiques
- `created_at` : DEFAULT CURRENT_TIMESTAMP
- `updated_at` : DEFAULT CURRENT_TIMESTAMP

### UUIDs
Utilisation de UUID v4 pour tous les IDs :
- Plus sécurisé que des entiers séquentiels
- Évite l'énumération des ressources
- Compatible avec la réplication

---

## 🚀 Évolutions futures possibles

- [ ] Table `REVIEWS` (avis clients sur produits)
- [ ] Table `WISHLISTS` (listes de souhaits)
- [ ] Table `PROMOTIONS` (codes promo)
- [ ] Table `INVENTORY_LOGS` (historique des stocks)
- [ ] Table `CUSTOMER_SESSIONS` (sessions web)
- [ ] Partitionnement de `ORDERS` par date
- [ ] Full-text search sur `PRODUCTS`
