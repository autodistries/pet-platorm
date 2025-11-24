docker ps
docker ps
docker exec -it pet-platform-db psql -U petadmin -d pet_accessories_db
# 📊 Guide d'implémentation de la base de données

> L'application tourne désormais **exclusivement sur MongoDB**. Les références à PostgreSQL/Docker sont conservées uniquement dans l'historique du dépôt.

## ✅ Configuration actuelle

- Connexion via le driver officiel `mongodb@^6`
- Helpers centralisés dans `lib/db.ts`
- Collections utilisées par les différentes API (`customers`, `products`, `orders`, etc.)
- Transactions Mongo pour la création de commande (`lib/orders.ts`)
- Données sensibles protégées via `JWT_SECRET`

## 🛠️ Mise en place pas à pas

### 1️⃣ Créer (ou réutiliser) un cluster MongoDB

- **MongoDB Atlas** (recommandé) :
  1. https://www.mongodb.com/atlas → Create Cluster
  2. Autoriser votre IP (Network Access)
  3. Créer un utilisateur avec rôle `Atlas Admin` ou accès à la base ciblée
- **MongoDB local** : installez `mongod`, démarrez le service puis exposez un port accessible.

### 2️⃣ Configurer les variables d'environnement

```env
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=pet-platform
JWT_SECRET=change-me-in-production
```

- `MONGODB_URI` : URI complète, y compris identifiants et options
- `MONGODB_DB_NAME` : base logique utilisée par l'application
- `JWT_SECRET` : secret pour signer les sessions utilisateurs

### 3️⃣ Lancer l'application

```bash
pnpm install
pnpm run dev
```

Ouvrez http://localhost:8080 et connectez-vous avec les comptes de démonstration si vous avez importé des données.

### 4️⃣ Importer des données d'exemple (facultatif)

Deux options :

1. **Script intégré** – exécutez `pnpm run seed:mongodb` pour synchroniser les catégories, produits et comptes de démonstration (hashs bcrypt identiques à la version SQL).
2. **Import manuel** – pour des jeux de données personnalisés, convertissez vos sources vers JSON/CSV, puis utilisez `mongoimport` :

```bash
mongoimport --uri "$MONGODB_URI" --db "$MONGODB_DB_NAME" --collection products --file ./data/products.json --jsonArray
```

> Vous pouvez également tout créer via l'interface `/admin` si vous préférez saisir vos propres données.

## 🗂️ Collections utilisées

| Collection | Description | Particularités |
|------------|-------------|----------------|
| `customers` | Utilisateurs finaux (clients/admins) | Email unique (normalisé en minuscule) |
| `products` | Catalogue produits | Champs `stock_quantity`, `is_active`, `category_id` |
| `categories` | Classification du catalogue | Référencée par `products.category_id` |
| `carts` | Panier par utilisateur | Documents embarquant les items du panier |
| `orders` | Commandes + items | Créées en transaction, décrémentent les stocks |
| `payments` | Enregistrements de paiement | Liés à `orders` |
| `contact_messages` | Messages du formulaire de contact | IP et user-agent conservés |
| `newsletter_subscriptions` | Abonnés newsletter | Réactivation possible si `is_active=false` |

### Index conseillés

```javascript
db.customers.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ id: 1 }, { unique: true });
db.orders.createIndex({ user_id: 1, created_at: -1 });
db.carts.createIndex({ customer_id: 1 }, { unique: true });
```

## 🔐 Sécurité & bonnes pratiques

- Conservez `JWT_SECRET` en dehors du code source.
- Limitez les IP autorisées sur MongoDB Atlas.
- Préférez des utilisateurs MongoDB avec des rôles restreints (ex : `readWrite` sur la base).
- Nettoyez les données sensibles avant export/log.

## 🔎 Dépannage

### Erreurs « failed to connect to server »
- Vérifier la connectivité réseau (ports 27017 / 27015+ si cluster sharded)
- Confirmer que l'IP cliente est autorisée (Atlas → Network Access)
- Tester la connexion avec `mongosh "$MONGODB_URI"`

### Login impossible / comptes absents
- Vérifier la collection `customers`
- Créer un utilisateur via `/auth/register`
- S'assurer que les mots de passe sont hashés (`bcrypt`) si insertion manuelle

### Stock non décrémenté
- Les transactions nécessitent un cluster Replica Set (Atlas = OK)
- En local, assurez-vous de lancer `mongod --replSet` ou d'utiliser `mongodb://localhost:27017/?replicaSet=rs0`

## 🗺️ Migration depuis PostgreSQL (référence)

- Les scripts SQL originaux sont conservés dans `scripts/`.
- Les identifiants (`id`) sont restés sous forme de UUID chaîne pour faciliter la migration.
- Les dates sont stockées en ISO string (`new Date().toISOString()`).
- Si vous devez reconvertir des données SQL → Mongo, créez un script Node utilisant `pg` pour lire et `mongodb` pour écrire.

## 📌 Rappels utiles

- Comptes de test : `admin@petshop.com` / `Admin123!`, `marie.dubois@email.com` / `Marie123!`
- Les routes `/admin`, `/account`, `/orders`, `/checkout` sont protégées par `middleware.ts`.
- Pensez à mettre à jour les indexes après un import massif (`db.collection.createIndexes([...])`).
