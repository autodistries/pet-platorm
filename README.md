# 🐾 Pet Platform - Plateforme e-commerce d'accessoires pour animaux

## 🌍 Compatibilité

✅ **Windows** (PowerShell)  
✅ **Linux** (Bash) - [Guide Linux](./LINUX.md)  
✅ **macOS** (Bash/Zsh)

## 📋 Prérequis

- **Node.js** v18 (ou supérieur)
- **pnpm** pour gérer les dépendances
- **Instance MongoDB** (Atlas ou auto-hébergée)

> ℹ️ L'application n'utilise plus Docker ni PostgreSQL. Assurez-vous simplement d'avoir une URI MongoDB valide.

## 🚀 Installation

### 1. Installer les dépendances

```bash
pnpm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env.local` (ou copiez `.env.example`) avec votre connexion MongoDB :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=pet-platform
JWT_SECRET=change-me-in-production
```

- `MONGODB_URI` : URI complète vers votre cluster MongoDB
- `MONGODB_DB_NAME` : nom de la base à utiliser dans le cluster
- `JWT_SECRET` : secret utilisé pour signer les tokens d'authentification

### 3. (Optionnel) Pré-remplir la base de données

```bash
pnpm run seed:mongodb
```

Le script importe les catégories, produits et comptes de démonstration historiques en s'appuyant sur `MONGODB_URI` / `MONGODB_DB_NAME`.

### 4. Lancer le serveur de développement

```bash
pnpm run dev
```

L'application est accessible sur **http://localhost:8080** (port configuré dans `package.json`).

## 👤 Comptes de test

### Administrateur
- Email : `admin@petshop.com`
- Mot de passe : `Admin123!`
- Accès : `/admin`

### Client
- Email : `marie.dubois@email.com`
- Mot de passe : `Marie123!`
- Accès : `/account`

> 💡 Si votre base MongoDB est vide, vous pouvez créer des comptes directement via l'interface d'inscription ou en insérant vos propres documents.

## 📦 Commandes utiles

```bash
# Lancer le serveur Next.js en développement
pnpm run dev

# Construire pour la production
pnpm run build

# Démarrer en mode production
pnpm run start

# Linter le projet
pnpm run lint

# Synchroniser les jeux de données de démonstration
pnpm run seed:mongodb
```

## 🗂️ Collections MongoDB principales

- `customers` : comptes utilisateurs (clients et administrateurs)
- `products` : catalogue des produits
- `categories` : catégories du catalogue
- `carts` : paniers des utilisateurs avec leurs articles
- `orders` : commandes et détails des articles commandés
- `payments` : informations de paiement associées aux commandes
- `contact_messages` : messages envoyés via le formulaire de contact
- `newsletter_subscriptions` : abonnements à la newsletter

## 🛠️ Développement

```bash
# Vérifier la base de code
pnpm run lint

# Construire la version production
pnpm run build
```

## 📄 Notes diverses

- Les anciens scripts Docker/PostgreSQL ont été retirés.
- Les scripts SQL dans `scripts/` sont conservés à titre historique ; ils ne sont plus utilisés par l'application.
- Consultez `SETUP_DATABASE.md` pour un guide détaillé de configuration MongoDB.

Pour prévisualiser un document `.md`, rendez-vous sur https://codimd.go.tulsacounty.org/new et collez le contenu.

qsdjfhkjdpjqkdrjlwdlWLxlvsqio

Salut Guillaume !
