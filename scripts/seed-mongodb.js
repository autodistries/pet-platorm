#!/usr/bin/env node

/**
 * Populate the MongoDB database with sample data.
 * Mirrors the historical PostgreSQL seed data using MongoDB collections.
 */

const { MongoClient } = require("mongodb")
const fs = require("fs")
const path = require("path")

function loadEnvFromFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const raw = fs.readFileSync(filePath, "utf8")
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue
    const idx = line.indexOf("=")
    if (idx === -1) continue

    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()

    if (key && !(key in process.env)) {
      process.env[key] = value
    }
  }
}

function bootstrapEnv() {
  const candidates = [".env.local", ".env"]
  const cwd = process.cwd()

  for (const candidate of candidates) {
    const fullPath = path.resolve(cwd, candidate)
    loadEnvFromFile(fullPath)
    console.log("loading file", fullPath)
  }
}

async function ensureIndexes(db) {
  const categories = db.collection("categories")
  const products = db.collection("products")
  const customers = db.collection("customers")
  const customerAddresses = db.collection("customer_addresses")

  await Promise.all([
    categories.createIndex({ id: 1 }, { unique: true }),
    products.createIndex({ id: 1 }, { unique: true }),
    products.createIndex({ sku: 1 }, { unique: true }),
    products.createIndex({ category_id: 1 }),
    customers.createIndex({ id: 1 }, { unique: true }),
    customers.createIndex({ email: 1 }, { unique: true }),
    customerAddresses.createIndex({ id: 1 }, { unique: true }),
    customerAddresses.createIndex({ customer_id: 1, type: 1 }, { unique: true }),
  ])
}

function buildOperations(data, mapSet, mapInsert) {
  return data.map((item) => ({
    updateOne: {
      filter: { id: item.id },
      update: {
        $set: mapSet(item),
        $setOnInsert: mapInsert(item),
      },
      upsert: true,
    },
  }))
}

async function seedDatabase(db) {
  const now = new Date().toISOString()

  const categoriesData = [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Colliers et Laisses",
      description: "Colliers, laisses et harnais pour chiens et chats",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "Jouets",
      description: "Jouets interactifs et d'exercice pour animaux",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "Alimentation",
      description: "Gamelles, distributeurs et accessoires d'alimentation",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      name: "Couchage",
      description: "Paniers, coussins et accessoires de repos",
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      name: "Hygiène",
      description: "Produits et accessoires d'hygiène et de toilettage",
    },
  ]

  const productsData = [
    {
      id: "660e8400-e29b-41d4-a716-446655440001",
      name: "Collier en Cuir Premium",
      description: "Collier en cuir véritable avec boucle en métal, disponible en plusieurs tailles",
      price: 29.99,
      category_id: "550e8400-e29b-41d4-a716-446655440001",
      stock_quantity: 50,
      sku: "COL-CUIR-001",
      image_url: "/premium-leather-dog-collar.jpg",
    },
    {
      id: "660e8400-e29b-41d4-a716-446655440002",
      name: "Laisse Rétractable 5m",
      description: "Laisse rétractable robuste avec système de freinage automatique",
      price: 24.99,
      category_id: "550e8400-e29b-41d4-a716-446655440001",
      stock_quantity: 30,
      sku: "LAI-RET-001",
      image_url: "/retractable-dog-leash.jpg",
    },
    {
      id: "660e8400-e29b-41d4-a716-446655440003",
      name: "Balle Interactive LED",
      description: "Balle lumineuse interactive qui s'active au mouvement",
      price: 19.99,
      category_id: "550e8400-e29b-41d4-a716-446655440002",
      stock_quantity: 75,
      sku: "JOU-BAL-001",
      image_url: "/led-interactive-pet-ball-toy.jpg",
    },
    {
      id: "660e8400-e29b-41d4-a716-446655440004",
      name: "Corde à Noeuds",
      description: "Corde de jeu résistante avec noeuds, parfaite pour le tir à la corde",
      price: 12.99,
      category_id: "550e8400-e29b-41d4-a716-446655440002",
      stock_quantity: 100,
      sku: "JOU-COR-001",
      image_url: "/rope-toy-with-knots-for-dogs.jpg",
    },
    {
      id: "660e8400-e29b-41d4-a716-446655440005",
      name: "Gamelle Anti-Glouton",
      description: "Gamelle avec obstacles pour ralentir l'alimentation",
      price: 16.99,
      category_id: "550e8400-e29b-41d4-a716-446655440003",
      stock_quantity: 40,
      sku: "GAM-ANT-001",
      image_url: "/slow-feeder-dog-bowl.jpg",
    },
    {
      id: "660e8400-e29b-41d4-a716-446655440006",
      name: "Distributeur d'Eau Automatique",
      description: "Fontaine à eau avec filtre pour chiens et chats",
      price: 45.99,
      category_id: "550e8400-e29b-41d4-a716-446655440003",
      stock_quantity: 25,
      sku: "DIS-EAU-001",
      image_url: "/automatic-pet-water-fountain.jpg",
    },
    {
      id: "660e8400-e29b-41d4-a716-446655440007",
      name: "Panier Orthopédique",
      description: "Panier avec mousse à mémoire de forme pour le confort articulaire",
      price: 89.99,
      category_id: "550e8400-e29b-41d4-a716-446655440004",
      stock_quantity: 20,
      sku: "PAN-ORT-001",
      image_url: "/orthopedic-pet-bed-memory-foam.jpg",
    },
    {
      id: "660e8400-e29b-41d4-a716-446655440008",
      name: "Coussin Chauffant",
      description: "Coussin chauffant électrique avec thermostat réglable",
      price: 34.99,
      category_id: "550e8400-e29b-41d4-a716-446655440004",
      stock_quantity: 35,
      sku: "COU-CHA-001",
      image_url: "/heated-pet-cushion-pad.jpg",
    },
    {
      id: "660e8400-e29b-41d4-a716-446655440009",
      name: "Brosse Auto-Nettoyante",
      description: "Brosse de toilettage avec système de nettoyage automatique",
      price: 22.99,
      category_id: "550e8400-e29b-41d4-a716-446655440005",
      stock_quantity: 60,
      sku: "BRO-AUT-001",
      image_url: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "660e8400-e29b-41d4-a716-446655440010",
      name: "Shampoing Naturel",
      description: "Shampoing hypoallergénique aux extraits naturels",
      price: 13.99,
      category_id: "550e8400-e29b-41d4-a716-446655440005",
      stock_quantity: 80,
      sku: "SHA-NAT-001",
      image_url: "/placeholder.svg?height=300&width=300",
    },
  ]

  const customersData = [
    {
      id: "770e8400-e29b-41d4-a716-446655440000",
      name: "Administrateur",
      email: "admin@petshop.com",
      password_hash: "$2b$10$RZMrpooXsoYVrWcNaS.gx.r2gPxepBS8x8EPjmHH8H/Mz.ASJ.UJi",
      phone: "+33100000000",
      role: "admin",
    },
    {
      id: "770e8400-e29b-41d4-a716-446655440001",
      name: "Marie Dubois",
      email: "marie.dubois@email.com",
      password_hash: "$2b$10$bQgI/TpI7NtX.aZltgZPru138s.UnxvNWQy7LlC7sVSAsBz6MmpHa",
      phone: "+33123456789",
      role: "customer",
    },
  ]

  const customerAddressesData = [
    {
      id: "880e8400-e29b-41d4-a716-446655440001",
      customer_id: "770e8400-e29b-41d4-a716-446655440001",
      type: "shipping",
      street_address: "123 Rue de la Paix",
      city: "Paris",
      state: null,
      postal_code: "75001",
      country: "France",
      is_default: true,
    },
    {
      id: "880e8400-e29b-41d4-a716-446655440002",
      customer_id: "770e8400-e29b-41d4-a716-446655440001",
      type: "billing",
      street_address: "123 Rue de la Paix",
      city: "Paris",
      state: null,
      postal_code: "75001",
      country: "France",
      is_default: true,
    },
  ]

  const categoriesOps = buildOperations(
    categoriesData,
    (item) => ({
      name: item.name,
      description: item.description,
      parent_id: item.parent_id ?? null,
      updated_at: now,
    }),
    (item) => ({
      id: item.id,
      created_at: now,
    })
  )

  const productsOps = buildOperations(
    productsData,
    (item) => ({
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      stock_quantity: item.stock_quantity,
      sku: item.sku,
      image_url: item.image_url,
      is_active: true,
      updated_at: now,
    }),
    (item) => ({
      id: item.id,
      created_at: now,
    })
  )

  const customersOps = buildOperations(
    customersData,
    (item) => ({
      name: item.name,
      email: item.email.toLowerCase(),
      password_hash: item.password_hash,
      phone: item.phone ?? null,
      role: item.role,
      updated_at: now,
    }),
    (item) => ({
      id: item.id,
      created_at: now,
    })
  )

  const customerAddressesOps = buildOperations(
    customerAddressesData,
    (item) => ({
      customer_id: item.customer_id,
      type: item.type,
      street_address: item.street_address,
      city: item.city,
      state: item.state ?? null,
      postal_code: item.postal_code,
      country: item.country,
      is_default: Boolean(item.is_default),
    }),
    (item) => ({
      id: item.id,
      created_at: now,
    })
  )

  const categoriesCol = db.collection("categories")
  const productsCol = db.collection("products")
  const customersCol = db.collection("customers")
  const customerAddressesCol = db.collection("customer_addresses")

  const [categoriesResult, productsResult, customersResult, customerAddressesResult] = await Promise.all([
    categoriesOps.length ? categoriesCol.bulkWrite(categoriesOps, { ordered: false }) : Promise.resolve(null),
    productsOps.length ? productsCol.bulkWrite(productsOps, { ordered: false }) : Promise.resolve(null),
    customersOps.length ? customersCol.bulkWrite(customersOps, { ordered: false }) : Promise.resolve(null),
    customerAddressesOps.length
      ? customerAddressesCol.bulkWrite(customerAddressesOps, { ordered: false })
      : Promise.resolve(null),
  ])

  return {
    categories: categoriesResult
      ? categoriesResult.upsertedCount + categoriesResult.modifiedCount
      : 0,
    products: productsResult
      ? productsResult.upsertedCount + productsResult.modifiedCount
      : 0,
    customers: customersResult
      ? customersResult.upsertedCount + customersResult.modifiedCount
      : 0,
    customer_addresses: customerAddressesResult
      ? customerAddressesResult.upsertedCount + customerAddressesResult.modifiedCount
      : 0,
  }
}

async function main() {
  bootstrapEnv()

  const uri = process.env.MONGODB_URI
  console.log("mdb uri", uri)
  const dbName = process.env.MONGODB_DB_NAME || "pet-platform"

  if (!uri) {
    console.error("❌ MONGODB_URI est manquant. Ajoutez-le dans .env.local ou exportez la variable d'environnement avant d'exécuter ce script.")
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(dbName)

    await ensureIndexes(db)
    const result = await seedDatabase(db)

    console.log("✅ Données MongoDB synchronisées avec succès :")
    console.table(result)
    console.log("➡️  Vous pouvez maintenant lancer l'application avec 'pnpm run dev'.")
  } catch (error) {
    console.error("❌ Erreur lors du peuplement de la base MongoDB :", error)
    process.exitCode = 1
  } finally {
    await client.close()
  }
}

main()