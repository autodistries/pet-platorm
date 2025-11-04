import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

// GET - Récupérer le panier de l'utilisateur
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    console.log("=== GET CART ===")
    console.log("User ID:", user.id)

    // Récupérer les items du panier avec les détails des produits
    const result = await query(
      `SELECT 
        ci.id,
        ci.product_id,
        ci.quantity,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.stock_quantity,
        c.name as category
        FROM cart_items ci
        JOIN carts cart ON ci.cart_id = cart.id
        JOIN products p ON ci.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE cart.customer_id = $1
        ORDER BY ci.created_at DESC`,
      [user.id]
    );


    console.log("Cart items found:", result.rows.length)

    return NextResponse.json({ items: result.rows })
  } catch (error) {
    console.error("Get cart error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST - Ajouter un produit au panier
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { product_id, quantity } = await request.json()

    console.log("=== ADD TO CART ===")
    console.log("User ID:", user.id)
    console.log("Product ID:", product_id)
    console.log("Quantity:", quantity)

    if (!product_id || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }

    // Vérifier si le produit existe et a assez de stock
    const productResult = await query(
      "SELECT id, stock_quantity FROM products WHERE id = $1",
      [product_id]
    )

    if (productResult.rows.length === 0) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 })
    }

    const product = productResult.rows[0]

    // Vérifier le stock disponible en tenant compte de ce qui est déjà dans le panier
    const existingCart = await query(
      "SELECT c.id, ci.quantity FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE c.customer_id = $1 AND ci.product_id = $2",
      [user.id, product_id]
    );

    const existingQuantity = existingCart.rows.length > 0 ? existingCart.rows[0].quantity : 0;
    const totalQuantity = existingQuantity + quantity;

    if (totalQuantity > product.stock_quantity) {
      return NextResponse.json({
        error: `Stock insuffisant. Disponible: ${product.stock_quantity}, Déjà dans le panier: ${existingQuantity}`
      }, { status: 400 });
    }

    // Retrieve the user's cart
    const cartQuery = await query(
      "SELECT id FROM carts WHERE customer_id = $1",
      [user.id]
    );

    let cartId;
    if (cartQuery.rows.length > 0) {
      cartId = cartQuery.rows[0].id; // Existing cart
    } else {
      // Create a new cart if none exists
      const newCartQuery = await query(
        "INSERT INTO carts (customer_id) VALUES ($1) RETURNING id",
        [user.id]
      );
      cartId = newCartQuery.rows[0].id; // New cart id
    }

    // Ajouter ou mettre à jour l'item dans le panier
    const result = await query(
      `INSERT INTO cart_items (cart_id, product_id, quantity, created_at)
  VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
  ON CONFLICT (cart_id, product_id) 
  DO UPDATE SET 
    quantity = cart_items.quantity + $3,
    created_at = CURRENT_TIMESTAMP
  RETURNING *`,
      [cartId, product_id, quantity]
    );

    console.log("Cart item added/updated:", result.rows[0])

    return NextResponse.json({
      message: "Produit ajouté au panier",
      item: result.rows[0]
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PUT - Mettre à jour la quantité d'un produit
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { product_id, quantity } = await request.json()

    console.log("=== UPDATE CART ===");
    console.log("User ID:", user.id);
    console.log("Product ID:", product_id);
    console.log("New Quantity:", quantity);

    if (!product_id || quantity < 0) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // Si quantity = 0, supprimer l'item
    if (quantity === 0) {
      // Get cart id for the user
      const cartResult = await query(
        "SELECT id FROM carts WHERE customer_id = $1",
        [user.id]
      );

      if (cartResult.rows.length === 0) {
        return NextResponse.json({ error: "No cart found for this user" }, { status: 404 });
      }

      const cartId = cartResult.rows[0].id;

      await query(
        "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
        [cartId, product_id]
      );

      return NextResponse.json({ message: "Produit retiré du panier" });
    }

    // Vérifier le stock
    const productResult = await query(
      "SELECT stock_quantity FROM products WHERE id = $1",
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    if (quantity > productResult.rows[0].stock_quantity) {
      return NextResponse.json({
        error: `Stock insuffisant. Disponible: ${productResult.rows[0].stock_quantity}`
      }, { status: 400 });
    }

    // Get the user's cart id again for the update
    const cartIdResult = await query(
      "SELECT id FROM carts WHERE customer_id = $1",
      [user.id]
    );

    if (cartIdResult.rows.length === 0) {
      return NextResponse.json({ error: "No cart found for this user" }, { status: 404 });
    }

    const cartId = cartIdResult.rows[0].id;

    // Mettre à jour la quantité
    const result = await query(
      `UPDATE cart_items 
  SET quantity = $1, created_at = CURRENT_TIMESTAMP
  WHERE cart_id = $2 AND product_id = $3
  RETURNING *`,
      [quantity, cartId, product_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Item non trouvé dans le panier" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Quantité mise à jour",
      item: result.rows[0]
    });

  } catch (error) {
    console.error("Update cart error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE - Vider le panier
export async function DELETE() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    console.log("=== CLEAR CART ===");
    console.log("User ID:", user.id);

    // Get the cart id for the user
    const cartResult = await query(
      "SELECT id FROM carts WHERE customer_id = $1",
      [user.id]
    );

    if (cartResult.rows.length === 0) {
      return NextResponse.json({ error: "No cart found for this user" }, { status: 404 });
    }

    const cartId = cartResult.rows[0].id;

    // Delete all items from the cart
    await query(
      "DELETE FROM cart_items WHERE cart_id = $1",
      [cartId]
    );

    return NextResponse.json({ message: "Panier vidé" })
  } catch (error) {
    console.error("Clear cart error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
