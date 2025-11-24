# ✨ Récapitulatif de la Stack MongoDB

## ✅ Objectifs atteints

- Migration complète des accès PostgreSQL → MongoDB (`mongodb` driver v6).
- Harmonisation des API / libs (`lib/auth`, `lib/products`, `lib/orders`, `lib/admin`, routes API) autour de `getCollection` et des transactions Mongo.
- Suppression des scripts Docker/PostgreSQL et nettoyage des dépendances `pg`.
- Documentation mise à jour (`README`, `QUICK_START`, `SETUP_DATABASE`, `LINUX`, `MACOS`, `INDEX`).
- Ajout du script de population `scripts/seed-mongodb.js`.

## 📁 Fichiers & scripts clés
| Fichier | Rôle | Commande associée |
|---------|------|-------------------|
| `lib/db.ts` | Connexion MongoDB & helpers | — |
| `scripts/seed-mongodb.js` | Peuplage catégories/produits/comptes | `pnpm run seed:mongodb` |
| `.env.example` | Variables de base (`MONGODB_URI`, `MONGODB_DB_NAME`, `JWT_SECRET`) | — |
| `README.md` | Installation et commandes principales | — |
| `SETUP_DATABASE.md` | Guide complet MongoDB + dépannage | — |

> Les scripts SQL historiques restent dans `scripts/*.sql` à titre d'archive (aucun usage runtime).

## 🗂️ Collections principales
| Collection | Contenu | Notes |
|------------|---------|-------|
| `customers` | Utilisateurs (admin + client) | Email unique, hash bcrypt conservé |
| `categories` | Catégories produits | Clé `id` UUID, `updated_at` maintenu |
| `products` | Catalogue | `is_active`, `stock_quantity`, `category_id` |
| `carts` | Panier client | Items embarqués (`product_id`, `quantity`) |
| `orders` | Commandes + items | Transactions Mongo (sessions) |
| `payments` | Paiements | Liés à `orders.id` |
| `contact_messages` | Formulaire de contact | Trace IP & user-agent |
| `newsletter_subscriptions` | Inscription newsletter | Réactivation possible via PATCH |

Indexes appliqués automatiquement par le seed script :
- `categories`: `{ id: 1 }`
- `products`: `{ id: 1 }`, `{ sku: 1 }`, `{ category_id: 1 }`
- `customers`: `{ id: 1 }`, `{ email: 1 }`

## 🛠️ Commandes utiles
```bash
pnpm install              # Installer les dépendances
pnpm run seed:mongodb     # Synchroniser les données de démonstration
pnpm run dev              # Lancer l'application (http://localhost:8080)
pnpm run lint             # Vérifier la qualité du code
pnpm run build            # Build production
pnpm run start            # Servir la build
```

### Vérifications rapides
```bash
mongosh "$MONGODB_URI" --eval 'db.runCommand({ ping: 1 })'   # Tester l'accès
pnpm run seed:mongodb                                         # Re-synchroniser les données
```

## 🔐 Comptes de test (identiques à la version SQL)
- Admin · `admin@petshop.com` · `Admin123!`
- Client · `marie.dubois@email.com` · `Marie123!`

## 🚧 Sujets potentiels / prochaines étapes
1. ✉️ Ajouter un script d'import JSON pour d'autres datasets (categories/products supplémentaires).
2. 💾 Migrer les scripts d'adresses (`customer_addresses`) en sous-document sur `customers` si besoin futur.
3. 🔍 Mettre en place des rapports d'agrégation additionnels (ex : ventes par catégorie) côté admin.
4. 📦 Documenter un flux de déploiement (Atlas + Vercel) incluant variables secrets.
5. ✅ Mettre en place des tests automatisés (unitaires / e2e) pour les routes principales.
