# 🚀 DÉMARRAGE RAPIDE

## 1. Préparer l'environnement

```bash
# Copier le fichier d'exemple et le personnaliser
cp .env.example .env.local
```

Modifiez ensuite `.env.local` pour y placer votre `MONGODB_URI`, le nom de base (`MONGODB_DB_NAME`) et un `JWT_SECRET`.

## 2. Installer les dépendances

```bash
pnpm install
```

## 3. (Optionnel) Pré-remplir la base

```bash
pnpm run seed:mongodb
```

Le script importe les catégories, produits et comptes de test pour gagner du temps.

## 4. Lancer l'application

```bash
pnpm run dev
```

Le front-office est accessible sur **http://localhost:8080**.

---

## 🔐 Comptes de démonstration

- **Admin** : `admin@petshop.com` • `Admin123!` → accès `/admin`
- **Client** : `marie.dubois@email.com` • `Marie123!`

> Si vous partez d'une base MongoDB vide, créez vos propres comptes via `/auth/register` ou en insérant des documents dans la collection `customers`.

---

## ⚡ Commandes essentielles

| Commande | Action |
|----------|--------|
| `pnpm run dev` | Lancer le serveur Next.js en mode dev |
| `pnpm run build` | Construire la version production |
| `pnpm run start` | Servir la version production |
| `pnpm run lint` | Vérifier la qualité du code |
| `pnpm run seed:mongodb` | Synchroniser les données de démonstration |

---

## 🐛 Dépannage rapide

### Erreur de connexion MongoDB
- Vérifiez la valeur de `MONGODB_URI`
- Assurez-vous que votre IP est autorisée (MongoDB Atlas)
- Confirmez que `MONGODB_DB_NAME` correspond à une base existante

### Page blanche / données manquantes
- Créez des catégories et des produits via `/admin`
- Réimportez vos données seed dans MongoDB

---

## 📖 Aller plus loin

- `SETUP_DATABASE.md` : configuration détaillée de MongoDB et organisation des collections
- `README.md` : documentation complète du projet
