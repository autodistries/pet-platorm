# ✅ Setup PostgreSQL - TERMINÉ !

## 🐳 Avec Docker (Recommandé)

```powershell
# Démarrage rapide
.\start.ps1

# Ou manuellement
pnpm run db:start
pnpm run dev
```

## 🔐 Comptes disponibles

**Admin:**
- Email: `admin@petshop.com`
- Password: `Admin123!`

**Client:**
- Email: `marie.dubois@email.com`
- Password: `Marie123!`

## 📚 Documentation

- Voir `SETUP_DATABASE.md` pour le guide complet
- Voir `README.md` pour les instructions d'installation

## 🛠️ Commandes utiles

```powershell
pnpm run db:start    # Démarre PostgreSQL
pnpm run db:stop     # Arrête PostgreSQL
pnpm run db:reset    # Réinitialise la DB
pnpm run db:logs     # Voir les logs
```