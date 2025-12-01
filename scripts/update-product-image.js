const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'pet-platform';

async function updateProductImage() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db(MONGODB_DB_NAME);
    const productsCol = db.collection('products');
    
    // ===== MODIFIEZ CES VALEURS =====
    const PRODUCT_ID = 'prod_001'; // ID ou SKU du produit
    const NEW_IMAGE_URL = 'https://example.com/nouvelle-image.jpg';
    // =================================
    
    // Chercher le produit par ID ou SKU
    const product = await productsCol.findOne({
      $or: [{ id: PRODUCT_ID }, { sku: PRODUCT_ID }]
    });
    
    if (!product) {
      console.log(`❌ Produit "${PRODUCT_ID}" non trouvé`);
      return;
    }
    
    console.log(`📦 Produit trouvé: ${product.name}`);
    console.log(`🖼️  Ancienne image: ${product.image_url}`);
    
    // Mettre à jour l'image
    const result = await productsCol.updateOne(
      { _id: product._id },
      { 
        $set: { 
          image_url: NEW_IMAGE_URL,
          updated_at: new Date().toISOString()
        } 
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✅ Image mise à jour avec succès!`);
      console.log(`🖼️  Nouvelle image: ${NEW_IMAGE_URL}`);
    } else {
      console.log('⚠️  Aucune modification effectuée');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('🔒 Connexion fermée');
  }
}

// Lancer la fonction
updateProductImage();
