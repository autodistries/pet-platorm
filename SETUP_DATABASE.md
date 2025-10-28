# 📊 Guide d'implémentation de la base de données

## ✅ Ce qui a été fait

### 1. Configuration Docker (PostgreSQL)
- ✅ **docker-compose.yml** : Configuration complète de PostgreSQL 16
- ✅ Port : 5432 (accessible localement)
- ✅ Auto-initialisation au démarrage
- ✅ Volumes persistants pour conserver les données

### 2. Scripts de base de données
- ✅ **scripts/init-db.sql** : Script d'initialisation complet
  - Création de toutes les tables
  - Ajout du champ `role` pour les admins
  - Données de test (produits, catégories, utilisateurs)
  
### 3. Configuration environnement
- ✅ **.env.local** : Variables d'environnement avec connexion DB
- ✅ **.env.example** : Template pour nouveaux développeurs

### 4. Sécurité
- ✅ **Mots de passe hashés** avec bcrypt (10 rounds)
- ✅ **Script de génération** de hash : `scripts/generate-hashes.js`
- ✅ **.gitignore** configuré (protection des secrets)

### 5. Authentification améliorée
- ✅ Support du rôle admin dans `lib/auth.ts`
- ✅ **Middleware** de protection des routes (`middleware.ts`)
- ✅ Redirection automatique si non autorisé

### 6. Scripts npm pratiques
```json
"db:start"    → Démarre PostgreSQL
"db:stop"     → Arrête PostgreSQL
"db:restart"  → Redémarre PostgreSQL
"db:reset"    → Réinitialise complètement la DB
"db:logs"     → Affiche les logs en temps réel
```

## 🎯 Étapes pour démarrer

### 1️⃣ Installer Docker Desktop
👉 https://www.docker.com/products/docker-desktop/

### 2️⃣ Lancer la base de données
```powershell
pnpm run db:start
```
ou
```powershell
docker-compose up -d
```

### 3️⃣ Vérifier que tout fonctionne
```powershell
docker ps
```
Vous devriez voir `pet-platform-db` en cours d'exécution.

### 4️⃣ Lancer l'application
```powershell
pnpm run dev
```

### 5️⃣ Tester la connexion
Allez sur http://localhost:3000/auth/login

**Compte Admin :**
- Email : `admin@petshop.com`
- Mot de passe : `Admin123!`

**Compte Client :**
- Email : `marie.dubois@email.com`
- Mot de passe : `Marie123!`

## 🗂️ Structure de la base de données

### Tables principales

| Table | Description | Rôle |
|-------|-------------|------|
| `customers` | Utilisateurs (clients + admins) | Authentification, profils |
| `customer_addresses` | Adresses de livraison/facturation | Checkout, commandes |
| `categories` | Catégories de produits | Organisation catalogue |
| `products` | Catalogue produits | E-commerce |
| `carts` / `cart_items` | Paniers d'achat | Processus d'achat |
| `orders` / `order_items` | Commandes | Historique achats |
| `payments` | Paiements | Gestion financière |
| `shipments` | Expéditions | Suivi livraisons |
| `support_tickets` | Tickets support | SAV |

### Champ `role` ajouté
```sql
role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin'))
```

## 🔐 Gestion des mots de passe

### Pour créer un nouveau compte
1. Générez un hash sécurisé :
```powershell
pnpm run generate:hashes
```

2. Ou directement en Node.js :
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('MonMotDePasse123!', 10);
console.log(hash);
```

3. Insérez dans la base :
```sql
INSERT INTO customers (name, email, password_hash, role) 
VALUES ('Nom', 'email@example.com', '$2b$10$...', 'customer');
```

## 🛡️ Protection des routes

Le fichier `middleware.ts` protège automatiquement :

- ✅ `/admin/*` → Réservé aux administrateurs
- ✅ `/account/*` → Utilisateurs connectés uniquement
- ✅ `/orders/*` → Utilisateurs connectés uniquement
- ✅ `/checkout/*` → Utilisateurs connectés uniquement

## 🔧 Dépannage

### La connexion échoue (ECONNREFUSED)
```powershell
# Vérifier que Docker tourne
docker ps

# Relancer la base de données
pnpm run db:restart

# Voir les logs
pnpm run db:logs
```

### Réinitialiser complètement la base
```powershell
pnpm run db:reset
```
⚠️ **Attention** : Supprime toutes les données !

### Se connecter directement à PostgreSQL
```powershell
docker exec -it pet-platform-db psql -U petadmin -d pet_accessories_db
```

Commandes SQL utiles :
```sql
-- Lister toutes les tables
\dt

-- Voir les utilisateurs
SELECT name, email, role FROM customers;

-- Voir les produits
SELECT name, price, stock_quantity FROM products;

-- Quitter
\q
```

## 📝 Prochaines étapes suggérées

1. **Tester la connexion** avec les comptes fournis
2. **Vérifier l'accès admin** sur `/admin`
3. **Tester le panier** avec un compte client
4. **Implémenter les API** pour les produits/catégories
5. **Ajouter la gestion des images** de produits
6. **Configurer le système de paiement**

## 🤝 Alternatives à Docker

Si Docker ne fonctionne pas, vous pouvez installer PostgreSQL directement :

### Windows
1. Télécharger : https://www.postgresql.org/download/windows/
2. Installer avec pgAdmin
3. Créer la base `pet_accessories_db`
4. Exécuter `scripts/init-db.sql`
5. Modifier `.env.local` avec vos identifiants

### Avec Supabase (gratuit, cloud)
1. Créer un compte sur https://supabase.com
2. Créer un nouveau projet
3. Copier l'URL de connexion PostgreSQL
4. Remplacer `DATABASE_URL` dans `.env.local`
5. Exécuter le script SQL depuis l'éditeur Supabase

---

**Mot de passe de Marie :** `Marie123!`  
**Mot de passe Admin :** `Admin123!`
