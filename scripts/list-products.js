const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'pet-platform';

async function listProducts() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB\n');
    
    const db = client.db(MONGODB_DB_NAME);
    const productsCol = db.collection('products');
    
    const products = await productsCol.find({}).toArray();
    
    console.log(`📦 ${products.length} produits trouvés:\n`);
    console.log('═'.repeat(80));
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Image: ${product.image_url}`);
      console.log(`   Prix: ${product.price}€`);
      console.log(`   Stock: ${product.stock_quantity}`);
    });
    
    console.log('\n' + '═'.repeat(80));
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
  }
}

listProducts();
