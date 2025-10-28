# 🚀 DÉMARRAGE RAPIDE

## Première utilisation

```powershell
# 1. Installer Docker Desktop
# https://www.docker.com/products/docker-desktop/

# 2. Lancer tout automatiquement
.\start.ps1
```

## Utilisation quotidienne

```powershell
.\start.ps1
```

C'est tout ! 🎉

---

## 🔐 Connexion

### Admin
- **URL**: http://localhost:3000/auth/login
- **Email**: `admin@petshop.com`
- **Password**: `Admin123!`
- **Accès**: `/admin` (tableau de bord)

### Client
- **Email**: `marie.dubois@email.com`
- **Password**: `Marie123!`

---

## ⚡ Commandes essentielles

| Commande | Action |
|----------|--------|
| `.\start.ps1` | Démarre tout (DB + serveur) |
| `pnpm run dev` | Serveur uniquement |
| `pnpm run db:start` | Base de données uniquement |
| `pnpm run db:stop` | Arrêter la DB |
| `pnpm run db:reset` | Tout réinitialiser ⚠️ |

---

## 🐛 Problèmes courants

### "Docker n'est pas reconnu"
➡️ Installez Docker Desktop et redémarrez

### "ECONNREFUSED" dans le navigateur
```powershell
pnpm run db:restart
```

### Tout réinitialiser
```powershell
pnpm run db:reset
pnpm run dev
```

---

## 📖 Documentation complète

- `SETUP_DATABASE.md` - Guide complet de la base de données
- `README.md` - Documentation du projet
