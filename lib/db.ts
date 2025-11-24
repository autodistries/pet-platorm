import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("MONGODB_URI is not defined. Please set it in your environment.")
}

const dbName = process.env.MONGODB_DB_NAME || "pet-platform"

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient>

if (global._mongoClientPromise) {
  clientPromise = global._mongoClientPromise
} else {
  const client = new MongoClient(uri)
  clientPromise = client.connect()
  if (process.env.NODE_ENV !== "production") {
    global._mongoClientPromise = clientPromise
  }
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient()
  return client.db(dbName)
}

export async function getCollection<T>(name: string) {
  const db = await getDb()
  return db.collection<T>(name)
}

export default getDb
